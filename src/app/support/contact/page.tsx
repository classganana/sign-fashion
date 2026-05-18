import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-1 flex-col gap-6 px-6 py-20">
      <h1 className="text-[2rem] font-medium tracking-tight">Concierge desk</h1>
      <p className="text-muted-foreground leading-relaxed">
        Route this to Helpscout / Intercom / WhatsApp concierge — wired later.
      </p>
      <p className="text-sm uppercase tracking-[0.3em]">hello@signfashion.example</p>
    </div>
  );
}
