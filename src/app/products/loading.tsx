import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

function PulseCard() {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-muted/40 relative aspect-[3/4] w-full animate-pulse rounded-[var(--radius-card)]" />
      <div className="bg-muted/40 mx-auto h-4 w-[70%] max-w-[12rem] animate-pulse rounded-md" />
      <div className="bg-muted/40 mx-auto h-4 w-[40%] max-w-[6rem] animate-pulse rounded-md" />
    </div>
  );
}

export default function ProductsLoadingView() {
  return (
    <Section spacing="md" tone="muted" className='border-border/70 flex-1 border-t pb-28'>
      <Container>
        <div className="mb-14 max-w-xl space-y-6">
          <div className="bg-muted/40 h-4 w-32 animate-pulse rounded-md" />
          <div className="bg-muted/40 max-w-xl space-y-3">
            <div className="h-14 w-[min(480px,100%)] animate-pulse rounded-md" />
            <div className="h-[4rem] animate-pulse rounded-md" />
          </div>
        </div>

        <div className='grid animate-pulse grid-cols-2 gap-x-6 gap-y-16 md:grid-cols-4'>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((slot) => (
            <PulseCard key={`placeholder-${slot}`} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
