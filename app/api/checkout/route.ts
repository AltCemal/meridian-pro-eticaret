import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import type { Product } from "@/types/database";

type CheckoutRequest = {
  items: { productId: string; quantity: number }[];
  shippingAddress: string;
};

export async function POST(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const body: CheckoutRequest = await request.json();

  if (!body.items?.length || !body.shippingAddress?.trim()) {
    return NextResponse.json({ error: "Sepet veya adres eksik." }, { status: 400 });
  }

  // Fiyat ve stok istemciden ASLA güvenilmez — veritabanından yeniden okunur.
  const productIds = body.items.map((i) => i.productId);
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, price, stock")
    .in("id", productIds);

  if (productsError || !products || products.length !== productIds.length) {
    return NextResponse.json({ error: "Ürünler doğrulanamadı." }, { status: 400 });
  }

  const typedProducts = (products ?? []) as Pick<Product, "id" | "name" | "price" | "stock">[];

  const lineItems = body.items.map((requested) => {
    const product = typedProducts.find((p) => p.id === requested.productId)!;
    return { product, quantity: Math.max(1, requested.quantity) };
  });

  const outOfStock = lineItems.find((li) => li.product.stock < li.quantity);
  if (outOfStock) {
    return NextResponse.json(
      { error: `"${outOfStock.product.name}" için yeterli stok yok.` },
      { status: 400 }
    );
  }

  const totalAmount = lineItems.reduce((sum, li) => sum + li.product.price * li.quantity, 0);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total_amount: totalAmount,
      currency: "try",
      shipping_address: body.shippingAddress,
      status: "beklemede",
    } as any)
    .select("id")
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: orderError?.message ?? "Sipariş oluşturulamadı." }, { status: 500 });
  }

  const createdOrder = order as { id: string };

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(
      lineItems.map((li) => ({
        order_id: createdOrder.id,
        product_id: li.product.id,
        product_name: li.product.name,
        unit_price: li.product.price,
        quantity: li.quantity,
      })) as any
    );

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email,
    line_items: lineItems.map((li) => ({
      price_data: {
        currency: "try",
        product_data: { name: li.product.name },
        unit_amount: Math.round(li.product.price * 100),
      },
      quantity: li.quantity,
    })),
    metadata: { orderId: createdOrder.id },
    success_url: `${origin}/odeme/basarili?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/odeme/basarisiz`,
  });

  const adminSupabase = createAdminClient();
  await (adminSupabase.from("orders") as any)
    .update({ stripe_checkout_session_id: session.id })
    .eq("id", createdOrder.id);

  return NextResponse.json({ url: session.url });
}
