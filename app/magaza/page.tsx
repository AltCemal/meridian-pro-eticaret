import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Rule from "@/components/ui/Rule";
import { createClient } from "@/lib/supabase/server";
import type { ProductWithCategory } from "@/types/database";

export const metadata: Metadata = {
  title: "Mağaza",
  description: "Meridian'ın tüm sınırlı seri parçalarını inceleyin.",
};

export default async function MagazaPage({
  searchParams,
}: {
  searchParams: { kategori?: string };
}) {
  const supabase = createClient();

  const { data: categories } = await supabase.from("categories").select("*").order("name");

  let query = supabase
    .from("products")
    .select("*, categories(name, slug)")
    .order("created_at", { ascending: false });

  if (searchParams.kategori) {
    const category = categories?.find((c) => c.slug === searchParams.kategori);
    if (category) query = query.eq("category_id", category.id);
  }

  const { data: products } = await query;

  return (
    <main className="min-h-screen bg-paper">
      <Header />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-center font-mono text-xs uppercase tracking-wide3 text-signal">
          Koleksiyon
        </p>
        <h1 className="mt-4 text-center font-display text-5xl italic text-ink">
          Tüm Parçalar
        </h1>

        <Rule className="mt-12" />

        {categories && categories.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <FilterLink label="Tümü" active={!searchParams.kategori} href="/magaza" />
            {categories.map((c) => (
              <FilterLink
                key={c.id}
                label={c.name}
                active={searchParams.kategori === c.slug}
                href={`/magaza?kategori=${c.slug}`}
              />
            ))}
          </div>
        )}

        {products && products.length > 0 ? (
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {(products as ProductWithCategory[]).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        ) : (
          <p className="mt-12 text-center font-mono text-sm text-graphite">
            Bu kategoride henüz ürün yok.
          </p>
        )}
      </section>

      <Footer />
    </main>
  );
}

function FilterLink({ label, active, href }: { label: string; active: boolean; href: string }) {
  return (
    <a
      href={href}
      className={`font-mono text-xs uppercase tracking-wide2 transition-colors ${
        active ? "text-signal underline underline-offset-4" : "text-graphite hover:text-ink"
      }`}
    >
      {label}
    </a>
  );
}
