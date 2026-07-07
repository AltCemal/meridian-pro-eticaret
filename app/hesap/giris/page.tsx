"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Rule from "@/components/ui/Rule";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { signInWithPassword, signUpWithPassword } from "@/lib/actions/auth";

export default function GirisPage() {
  return (
    <Suspense fallback={<GirisPageFallback />}>
      <GirisPageContent />
    </Suspense>
  );
}

function GirisPageContent() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"giris" | "kayit">("giris");

  const redirectTo = searchParams.get("redirectTo") ?? "/hesap";
  const hata = searchParams.get("hata");

  return (
    <main className="min-h-screen bg-paper">
      <Header />

      <section className="mx-auto max-w-sm px-6 py-24">
        <p className="text-center font-mono text-xs uppercase tracking-wide3 text-signal">
          Hesap
        </p>
        <h1 className="mt-4 text-center font-display text-4xl italic text-ink">
          {mode === "giris" ? "Giriş Yap" : "Hesap Oluştur"}
        </h1>

        <Rule className="mt-10" />

        {hata && (
          <p className="mt-6 border border-signal px-4 py-3 font-mono text-xs text-signal">
            {hata}
          </p>
        )}

        <div className="mt-8">
          <GoogleSignInButton redirectTo={redirectTo} />
        </div>

        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-hairline" />
          <span className="font-mono text-[11px] uppercase tracking-wide2 text-graphite">veya</span>
          <div className="h-px flex-1 bg-hairline" />
        </div>

        {mode === "giris" ? (
          <form action={signInWithPassword} className="space-y-4">
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <Field label="E-posta" name="email" type="email" required />
            <Field label="Şifre" name="password" type="password" required />
            <button
              type="submit"
              className="w-full bg-ink px-6 py-3.5 text-xs font-medium uppercase tracking-wide2 text-paper hover:bg-signal"
            >
              Giriş Yap
            </button>
          </form>
        ) : (
          <form action={signUpWithPassword} className="space-y-4">
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <Field label="Ad Soyad" name="fullName" required />
            <Field label="E-posta" name="email" type="email" required />
            <Field label="Şifre" name="password" type="password" required minLength={6} />
            <button
              type="submit"
              className="w-full bg-ink px-6 py-3.5 text-xs font-medium uppercase tracking-wide2 text-paper hover:bg-signal"
            >
              Hesap Oluştur
            </button>
          </form>
        )}

        <p className="mt-8 text-center font-mono text-xs text-graphite">
          {mode === "giris" ? (
            <>
              Hesabın yok mu?{" "}
              <button onClick={() => setMode("kayit")} className="text-ink underline underline-offset-4">
                Kayıt ol
              </button>
            </>
          ) : (
            <>
              Zaten hesabın var mı?{" "}
              <button onClick={() => setMode("giris")} className="text-ink underline underline-offset-4">
                Giriş yap
              </button>
            </>
          )}
        </p>
      </section>

      <Footer />
    </main>
  );
}

function GirisPageFallback() {
  return (
    <main className="min-h-screen bg-paper">
      <Header />
      <section className="mx-auto max-w-sm px-6 py-24">
        <p className="text-center font-mono text-xs uppercase tracking-wide3 text-signal">Hesap</p>
        <h1 className="mt-4 text-center font-display text-4xl italic text-ink">Yukleniyor...</h1>
      </section>
      <Footer />
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  minLength,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="block">
      <span className="font-mono text-xs uppercase tracking-wide2 text-graphite">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        minLength={minLength}
        className="mt-2 w-full border border-ink bg-paper px-4 py-3 text-sm text-ink focus:border-signal"
      />
    </label>
  );
}
