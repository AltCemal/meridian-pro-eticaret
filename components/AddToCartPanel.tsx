"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/cart";
import ButtonAction from "./ui/ButtonAction";

type Props = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  stock: number;
};

export default function AddToCartPanel({ productId, slug, name, price, stock }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center border border-ink">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-4 py-2.5 font-mono hover:text-signal"
          aria-label="Azalt"
        >
          −
        </button>
        <span className="min-w-[2.5rem] border-x border-ink px-3 py-2.5 text-center font-mono text-sm">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
          className="px-4 py-2.5 font-mono hover:text-signal"
          aria-label="Artır"
        >
          +
        </button>
      </div>

      <ButtonAction
        disabled={stock <= 0}
        onClick={() => {
          addItem({ productId, name, price, slug }, quantity);
          setAdded(true);
          setTimeout(() => setAdded(false), 1800);
        }}
        className="flex-1"
      >
        {stock <= 0 ? "Tükendi" : added ? "Sepete Eklendi" : "Sepete Ekle"}
      </ButtonAction>
    </div>
  );
}
