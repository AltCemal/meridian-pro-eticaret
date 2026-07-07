import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "İmza eksik." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    return NextResponse.json({ error: `Webhook doğrulanamadı: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      const supabase = createAdminClient();

      // RLS'i bypass eder — sadece bu sunucu tarafı webhook rotası
      // service role anahtarını kullanır, istemciye asla ulaşmaz.
      await (supabase.from("orders") as any).update({ status: "odendi" }).eq("id", orderId);

      const { data: items } = await supabase
        .from("order_items")
        .select("product_id, quantity")
        .eq("order_id", orderId);

      const orderItems = (items ?? []) as { product_id: string | null; quantity: number }[];

      for (const item of orderItems) {
        if (item.product_id) {
          await (supabase as any).rpc("decrement_stock", {
            p_product_id: item.product_id,
            p_quantity: item.quantity,
          });
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
