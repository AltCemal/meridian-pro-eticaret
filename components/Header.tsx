"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CartBadge from "./CartBadge";
import { createClient } from "@/lib/supabase/client";

const links = [{ href: "/magaza", label: "Mağaza" }];

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthenticated(Boolean(user));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session?.user));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-2xl italic tracking-wide text-ink">
          Meridian
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-xs uppercase tracking-wide2 text-graphite hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <Link
            href={isAuthenticated ? "/hesap" : "/hesap/giris"}
            className="hidden font-mono text-xs uppercase tracking-wide2 text-graphite hover:text-ink sm:inline"
          >
            {isAuthenticated ? "Hesabım" : "Giriş Yap"}
          </Link>
          <CartBadge />
        </div>
      </div>
    </header>
  );
}
