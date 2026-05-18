import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
};

export default function TermsPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-1 flex-col gap-4 px-6 py-20">
      <h1 className="text-[2rem] font-medium tracking-tight">Terms</h1>
      <p className="text-muted-foreground text-sm leading-relaxed">
        Boilerplate omitted — populate with refunds, disclaimers, and marketplace policies.
      </p>
    </div>
  );
}
