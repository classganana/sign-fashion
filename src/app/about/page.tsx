import type { Metadata } from "next";

export const metadata: Metadata = { title: "Our story" };

export default function AboutPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-1 flex-col gap-6 px-6 py-20">
      <h1 className="text-[2.125rem] font-medium tracking-tight">Sign Fashion narrative</h1>
      <p className="text-muted-foreground leading-relaxed">
        Replace with founder-led storytelling — sourcing, craftsmanship, tempo of drops — think editorial, not brochure.
      </p>
    </div>
  );
}
