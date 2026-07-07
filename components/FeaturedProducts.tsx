import { createClient } from "@/lib/supabase/server";
import ProductCard from "./ProductCard";
import Rule from "./ui/Rule";
import Button from "./ui/Button";
import type { ProductWithCategory } from "@/types/database";

export default async function FeaturedProducts() {
  const supabase = createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <Rule label="Yeni Parçalar" />

      {products && products.length > 0 ? (
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {(products as ProductWithCategory[]).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center font-mono text-sm text-graphite">
          Henüz ürün eklenmedi. Supabase Table Editor&apos;dan products tablosuna
          ekleyin, ya da supabase/seed.sql dosyasını çalıştırın.
        </p>
      )}

      <div className="mt-14 text-center">
        <Button href="/magaza" variant="ghost">
          Tüm Koleksiyon
        </Button>
      </div>
    </section>
  );
}
