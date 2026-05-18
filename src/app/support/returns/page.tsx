import type { Metadata } from "next";

export const metadata: Metadata = { title: "Returns" };

export default function ReturnsPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-1 flex-col gap-4 px-6 py-20">
      <h1 className="text-[2rem] font-medium tracking-tight">Returns</h1>
      <p className="text-muted-foreground leading-relaxed">
        14-day hygiene-safe returns policy draft — QC on receipt within 72 hours window.
      </p>
    </div>
  );
}
