type RuleProps = {
  label?: string;
  className?: string;
};

// Signature element: a thin double rule with a centered small-caps label,
// the way a fashion editorial spread separates sections.
export default function Rule({ label, className = "" }: RuleProps) {
  if (!label) {
    return <div className={`h-px bg-hairline ${className}`} aria-hidden="true" />;
  }

  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden="true">
      <div className="h-px flex-1 bg-hairline" />
      <span className="font-mono text-[11px] uppercase tracking-wide2 text-graphite">
        {label}
      </span>
      <div className="h-px flex-1 bg-hairline" />
    </div>
  );
}
