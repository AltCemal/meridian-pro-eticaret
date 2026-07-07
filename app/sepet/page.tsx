"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import ButtonAction from "@/components/ui/ButtonAction";
import Rule from "@/components/ui/Rule";
import { useCartStore } from "@/lib/store/cart";
import { createClient } from "@/lib/supabase/client";

export default function SepetPage() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalPrice = useCartStore((s) => s.totalPrice());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState("");

  async function handleCheckout() {
    setError(null);

    if (!address.trim()) {
      setError("Lütfen teslimat adresinizi girin.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/hesap/giris?redirectTo=/sepet";
      return;
    }

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: address,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Ödeme başlatılamadı.");
      setLoading(false);
      return;
    }

    window.location.href = data.url;
  }

  return (
    <main className="min-h-screen bg-paper">
      <Header />

      <section className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-center font-mono text-xs uppercase tracking-wide3 text-signal">Sepet</p>
        <h1 className="mt-4 text-center font-display text-5xl italic text-ink">Sepetin</h1>

        <Rule className="mt-12" />

        {items.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="font-mono text-sm text-graphite">Sepetin şu an boş.</p>
            <Button href="/magaza" className="mt-6">
              Mağazaya Dön
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-12 divide-y divide-hairline">
              {items.map((item) => (
                <div key={item.productId} className="flex flex-wrap items-center justify-between gap-4 py-5">
                  <div>
                    <p className="font-display text-lg italic text-ink">{item.name}</p>
                    <p className="mt-1 font-mono text-xs text-graphite">
                      Birim: ₺{item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center border border-ink">
                      <button
                        type="button"
                        onClick={() => setQuantity(item.productId, item.quantity - 1)}
                        className="px-3 py-1.5 font-mono hover:text-signal"
                        aria-label="Azalt"
                      >
                        −
                      </button>
                      <span className="min-w-[2rem] border-x border-ink px-2 py-1.5 text-center font-mono text-sm">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.productId, item.quantity + 1)}
                        className="px-3 py-1.5 font-mono hover:text-signal"
                        aria-label="Artır"
                      >
                        +
                      </button>
                    </div>

                    <p className="w-24 text-right font-mono text-sm">
                      ₺{(item.price * item.quantity).toFixed(2)}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="font-mono text-xs uppercase text-signal hover:underline"
                    >
                      Kaldır
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <label className="block">
                <span className="font-mono text-xs uppercase tracking-wide2 text-graphite">
                  Teslimat Adresi
                </span>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="mt-2 w-full border border-ink bg-paper px-4 py-3 text-sm text-ink focus:border-signal"
                  placeholder="Mahalle, sokak, no, ilçe/il"
                />
              </label>
            </div>

            {error && (
              <p className="mt-6 border border-signal px-4 py-3 font-mono text-xs text-signal">
                {error}
              </p>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-ink pt-6">
              <p className="font-mono text-lg">Toplam: ₺{totalPrice.toFixed(2)}</p>
              <ButtonAction onClick={handleCheckout} disabled={loading}>
                {loading ? "Yönlendiriliyor…" : "Ödemeye Geç"}
              </ButtonAction>
            </div>
          </>
        )}
      </section>

      <Footer />
    </main>
  );
}
