import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-1 flex-col gap-4 px-6 py-20">
      <h1 className="text-[2rem] font-medium tracking-tight">Privacy practice</h1>
      <p className="text-muted-foreground text-sm leading-relaxed">
        Boilerplate omitted — tailor this to PDPPL / GDPR wording with counsel before launch.
      </p>
    </div>
  );
}
