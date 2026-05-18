import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { FadeIn } from "@/components/motion/fade-in";
import type { StatementSectionConfig } from "@/types/homepage";

type StatementSectionProps = {
  section: StatementSectionConfig;
};

export function StatementSection({ section }: StatementSectionProps) {
  return (
    <Section spacing="md" bleed={false}>
      <Container size="narrow" className="text-center">
        <FadeIn>
          <blockquote className="text-display font-heading text-foreground font-medium italic leading-snug lg:leading-[var(--text-display--line-height)]">
            “{section.quote}”
          </blockquote>
          {section.attribution ?
            <p className="text-muted-foreground mt-8 text-[0.7rem] tracking-[0.28em] uppercase">
              — {section.attribution}
            </p>
          : null}
        </FadeIn>
      </Container>
    </Section>
  );
}
