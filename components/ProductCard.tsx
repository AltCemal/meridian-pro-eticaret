"use client";

import Link from "next/link";
import Image from "next/image";
import HangTag from "./ui/HangTag";
import { useCartStore } from "@/lib/store/cart";
import type { ProductWithCategory } from "@/types/database";

export default function ProductCard({
  product,
  index,
}: {
  product: ProductWithCategory;
  index: number;
}) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="group">
      <HangTag index={String(index + 1).padStart(2, "0")}>
        <Link href={`/magaza/${product.slug}`} className="block">
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface">
            {product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="flex h-full items-center justify-center font-mono text-xs text-graphite">
                GÖRSEL YOK
              </div>
            )}
          </div>
        </Link>

        <div className="p-5">
          {product.categories?.name && (
            <p className="font-mono text-[10px] uppercase tracking-wide2 text-graphite">
              {product.categories.name}
            </p>
          )}
          <Link href={`/magaza/${product.slug}`}>
            <h3 className="mt-1 font-display text-xl italic text-ink">{product.name}</h3>
          </Link>
          <p className="mt-2 font-mono text-sm text-ink">₺{product.price.toFixed(2)}</p>

          <button
            type="button"
            disabled={product.stock <= 0}
            onClick={() =>
              addItem({
                productId: product.id,
                name: product.name,
                price: product.price,
                slug: product.slug,
              })
            }
            className="mt-4 w-full border border-ink py-2.5 font-mono text-[11px] uppercase tracking-wide2 text-ink transition-colors hover:border-signal hover:text-signal disabled:opacity-40"
          >
            {product.stock > 0 ? "Sepete Ekle" : "Tükendi"}
          </button>
        </div>
      </HangTag>
    </div>
  );
}
