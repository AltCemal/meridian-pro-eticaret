import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AddToCartPanel from "@/components/AddToCartPanel";
import { createClient } from "@/lib/supabase/server";
import type { ProductWithCategory } from "@/types/database";

type Props = { params: { slug: string } };

async function getProduct(slug: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("slug", slug)
    .single();
  return data as ProductWithCategory | null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: "Ürün bulunamadı" };

  return {
    title: product.name,
    description: product.description.slice(0, 155),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 155),
      images: product.images?.[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images?.[0],
    sku: product.id,
    offers: {
      "@type": "Offer",
      priceCurrency: "TRY",
      price: product.price,
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <main className="min-h-screen bg-paper">
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-14 md:grid-cols-2">
          <div className="relative aspect-[3/4] overflow-hidden bg-surface">
            {product.images?.[0] ? (
              <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center font-mono text-xs text-graphite">
                GÖRSEL YOK
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            {product.categories?.name && (
              <p className="font-mono text-xs uppercase tracking-wide2 text-signal">
                {product.categories.name}
              </p>
            )}
            <h1 className="mt-3 font-display text-4xl italic text-ink">{product.name}</h1>
            <p className="mt-4 font-mono text-xl text-ink">₺{product.price.toFixed(2)}</p>

            <p className="mt-6 max-w-md text-sm leading-relaxed text-graphite">
              {product.description}
            </p>

            <div className="mt-10">
              <AddToCartPanel
                productId={product.id}
                slug={product.slug}
                name={product.name}
                price={product.price}
                stock={product.stock}
              />
            </div>

            <p className="mt-6 font-mono text-[11px] uppercase tracking-wide2 text-graphite">
              {product.stock > 0 ? `${product.stock} adet stokta` : "Stok tükendi"}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
