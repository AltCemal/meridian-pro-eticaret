import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Rule from "@/components/ui/Rule";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";
import type { OrderWithItems } from "@/types/database";

export const metadata = { title: "Hesabım", robots: { index: false, follow: false } };

const statusLabels: Record<string, string> = {
  beklemede: "Ödeme Bekleniyor",
  odendi: "Ödendi",
  kargoda: "Kargoda",
  tamamlandi: "Tamamlandı",
  iptal: "İptal Edildi",
};

export default async function HesapPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-paper">
      <Header />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide3 text-signal">Hesabım</p>
            <h1 className="mt-4 font-display text-4xl italic text-ink">{user?.email}</h1>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="border border-ink px-5 py-2.5 font-mono text-xs uppercase tracking-wide2 text-ink hover:border-signal hover:text-signal"
            >
              Çıkış Yap
            </button>
          </form>
        </div>

        <Rule label="Siparişlerim" className="mt-14" />

        <div className="mt-10 space-y-8">
          {orders && orders.length > 0 ? (
            (orders as OrderWithItems[]).map((order) => (
              <div key={order.id} className="border border-hairline p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs text-graphite">
                      Sipariş #{order.id.slice(0, 8)}
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-graphite">
                      {new Date(order.created_at).toLocaleString("tr-TR")}
                    </p>
                  </div>
                  <span className="border border-ink px-3 py-1 font-mono text-[11px] uppercase tracking-wide2">
                    {statusLabels[order.status] ?? order.status}
                  </span>
                </div>

                <ul className="mt-5 space-y-2 border-t border-hairline pt-5 font-mono text-xs text-ink">
                  {order.order_items.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span>
                        {item.product_name} × {item.quantity}
                      </span>
                      <span>₺{(item.unit_price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-4 border-t border-hairline pt-4 text-right font-mono text-sm">
                  Toplam: ₺{order.total_amount.toFixed(2)}
                </p>
              </div>
            ))
          ) : (
            <p className="font-mono text-sm text-graphite">Henüz siparişin yok.</p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
