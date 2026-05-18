import type { Metadata } from "next";

export const metadata: Metadata = { title: "Careers" };

export default function CareersPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-1 flex-col gap-6 px-6 py-20">
      <h1 className="text-[2.125rem] font-medium tracking-tight">Careers</h1>
      <p className="text-muted-foreground leading-relaxed">
        Studio, creative, CX, fulfillment — ATS links land here alongside culture notes.
      </p>
    </div>
  );
}
