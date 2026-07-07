"use client";

import { createClient } from "@/lib/supabase/client";
import { buttonBase, buttonVariants } from "./ui/buttonStyles";

export default function GoogleSignInButton({ redirectTo = "/hesap" }: { redirectTo?: string }) {
  async function handleClick() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
      },
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${buttonBase} ${buttonVariants.ghost} w-full`}
    >
      Google ile Devam Et
    </button>
  );
}
