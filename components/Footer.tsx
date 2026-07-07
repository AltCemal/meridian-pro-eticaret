export default function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-graphite sm:flex-row">
        <p>© {new Date().getFullYear()} Meridian Studio</p>
        <p className="font-mono uppercase tracking-wide2">SS26 Koleksiyonu</p>
      </div>
    </footer>
  );
}
