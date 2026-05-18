import { FadeIn } from "@/components/motion/fade-in";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

import { NewsletterForm } from "./newsletter-form";
import type { NewsletterSectionConfig } from "@/types/homepage";

type NewsletterSectionProps = {
  section: NewsletterSectionConfig;
};

export function NewsletterSection({ section }: NewsletterSectionProps) {
  return (
    <Section spacing="md" tone="muted" className="border-border border-t">
      <Container size="narrow">
        <FadeIn className="flex flex-col items-center gap-10 text-center">
          <div className="flex max-w-lg flex-col gap-3">
            <Heading level="title">{section.headline}</Heading>
            {section.subline ?
              <p className="text-muted-foreground text-[0.9375rem] leading-relaxed">
                {section.subline}
              </p>
            : null}
          </div>
          <NewsletterForm />
        </FadeIn>
      </Container>
    </Section>
  );
}
