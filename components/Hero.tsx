import Button from "./ui/Button";
import Rule from "./ui/Rule";

export default function Hero() {
  return (
    <section className="border-b border-hairline">
      <div className="mx-auto max-w-6xl px-6 py-24 text-center md:py-36">
        <p className="font-mono text-xs uppercase tracking-wide3 text-signal">
          SS26 — Sınırlı Koleksiyon
        </p>

        <h1 className="mx-auto mt-8 max-w-3xl font-display text-6xl italic leading-[1.05] text-ink md:text-7xl">
          Mevsimsiz parçalar,
          <span className="block not-italic">ölçülü siluetler.</span>
        </h1>

        <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-graphite">
          Her parça küçük atölyelerde, sınırlı sayıda üretilir. Stok
          tükendiğinde yeniden üretilmez.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
          <Button href="/magaza">Koleksiyonu Gör</Button>
          <Button href="/magaza?kategori=elbise" variant="text">
            Elbiseler
          </Button>
        </div>
      </div>
      <Rule />
    </section>
  );
}
