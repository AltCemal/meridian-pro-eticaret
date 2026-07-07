import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";

export const metadata = { title: "Ödeme Tamamlanamadı" };

export default function OdemeBasarisizPage() {
  return (
    <main className="min-h-screen bg-paper">
      <Header />

      <section className="mx-auto max-w-lg px-6 py-32 text-center">
        <p className="font-mono text-xs uppercase tracking-wide3 text-signal">Tamamlanamadı</p>
        <h1 className="mt-4 font-display text-4xl italic text-ink">Ödeme gerçekleşmedi.</h1>
        <p className="mt-6 text-sm leading-relaxed text-graphite">
          Ödemen tamamlanmadı ya da iptal edildi. Sepetin hâlâ duruyor,
          tekrar deneyebilirsin.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
          <Button href="/sepet">Sepete Dön</Button>
          <Button href="/magaza" variant="ghost">
            Mağazaya Dön
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
