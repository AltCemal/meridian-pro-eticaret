export const buttonBase =
  "inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs font-medium uppercase tracking-wide2 transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none";

export const buttonVariants: Record<"primary" | "ghost" | "text", string> = {
  primary: "bg-ink text-paper hover:bg-signal",
  ghost: "border border-ink text-ink hover:border-signal hover:text-signal",
  text: "text-ink underline underline-offset-4 hover:text-signal",
};
