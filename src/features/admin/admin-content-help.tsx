import type { ReactNode } from "react";

interface AdminContentHelpProps {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  bullets?: string[];
  footnote?: string;
}

/** Plain-language onboarding for editors who shouldn’t rely on schema docs alone. */
export function AdminContentHelp({ eyebrow, title, bullets, children, footnote }: AdminContentHelpProps) {
  return (
    <div className="border-border rounded-xl border border-blue-500/25 bg-blue-950/35 p-4 text-sm text-zinc-200">
      {eyebrow && <p className="mb-1 text-[0.65rem] uppercase tracking-wide text-blue-300/85">{eyebrow}</p>}
      <p className="text-base font-medium text-blue-50/95">{title}</p>
      {bullets?.length ?
        <ul className="text-muted-foreground mt-3 list-inside list-disc space-y-1.5 leading-relaxed">
          {bullets.map((item, idx) => (
            <li key={`${idx}-${item.slice(0, 24)}`}>{item}</li>
          ))}
        </ul>
      : null}
      {children}
      {footnote && <p className="text-muted-foreground mt-3 border-t border-white/5 pt-3 text-xs leading-relaxed">{footnote}</p>}
    </div>
  );
}
