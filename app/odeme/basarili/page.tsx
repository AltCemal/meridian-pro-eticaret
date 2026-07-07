"use client";

import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import { useCartStore } from "@/lib/store/cart";

export default function OdemeBasariliPage() {
  const clear = useCartStore((s) => s.clear);

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <main className="min-h-screen bg-paper">
      <Header />

      <section className="mx-auto max-w-lg px-6 py-32 text-center">
        <p className="font-mono text-xs uppercase tracking-wide3 text-signal">Teşekkürler</p>
        <h1 className="mt-4 font-display text-4xl italic text-ink">Siparişin alındı.</h1>
        <p className="mt-6 text-sm leading-relaxed text-graphite">
          Ödemen onaylandı. Sipariş durumunu ve geçmiş siparişlerini
          hesabından takip edebilirsin.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
          <Button href="/hesap">Siparişlerim</Button>
          <Button href="/magaza" variant="ghost">
            Alışverişe Devam Et
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
