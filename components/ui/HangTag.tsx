import { ReactNode } from "react";

type HangTagProps = {
  children: ReactNode;
  className?: string;
  index?: string;
};

// Every product panel is framed like a garment hang tag: a sharp thin
// border, a small punched hole with a string in the corner, and an
// optional "look number" the way fashion catalogs number their pieces.
export default function HangTag({ children, className = "", index }: HangTagProps) {
  return (
    <div className={`relative border border-ink/70 ${className}`}>
      <svg
        viewBox="0 0 40 40"
        className="absolute -left-2 -top-2 h-6 w-6 text-ink"
        aria-hidden="true"
      >
        <path d="M20 20 L34 6" stroke="currentColor" strokeWidth="0.75" />
        <circle cx="20" cy="20" r="5" fill="#FAFAF8" stroke="currentColor" strokeWidth="1" />
      </svg>
      {index && (
        <span className="absolute right-3 top-3 font-mono text-[10px] tracking-wide2 text-graphite">
          N°{index}
        </span>
      )}
      {children}
    </div>
  );
}
