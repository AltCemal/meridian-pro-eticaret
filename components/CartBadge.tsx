"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";

export default function CartBadge() {
  const totalItems = useCartStore((s) => s.totalItems());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Link href="/sepet" className="relative font-mono text-xs uppercase tracking-wide2 text-ink hover:text-signal">
      Sepet {isMounted && totalItems > 0 && `(${totalItems})`}
    </Link>
  );
}
