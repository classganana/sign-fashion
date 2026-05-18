"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { BodyProfileStub } from "@/services/size-recommendation-stub";
import { recommendSizeFromProfile } from "@/services/size-recommendation-stub";

type Props = {
  productSlug: string;
  availableSizes: readonly string[];
};

/**
 * Interaction shell for forthcoming fit tooling — persists nothing yet.
 * Recommendation engine returns null until IMS + profile models land.
 */
export function PdpFindFitSheet({ availableSizes, productSlug }: Props) {
  void productSlug;
  const stubProfile: BodyProfileStub = {};

  function hint(): string | null {
    const r = recommendSizeFromProfile(stubProfile, availableSizes);
    if (!r) return null;
    return `${r.size} · ${r.rationale}`;
  }

  const hintCopy = hint();

  return (
    <Sheet>
      <SheetTrigger
        render={<Button variant="ghost" size="sm" type="button" className="-my-3 h-auto px-0 text-[0.65rem] tracking-[0.28em] uppercase text-muted-foreground underline-offset-[6px] hover:text-foreground hover:underline hover:no-underline" />}
      >
        Find your fit
      </SheetTrigger>
      <SheetContent side="bottom" className='max-h-[min(88vh,720px)] gap-8 rounded-t-[1.75rem]' showCloseButton>
        <SheetHeader className='text-start'>
          <SheetTitle className="font-display text-xl">Find your fit</SheetTitle>
          <SheetDescription className='text-muted-foreground text-[0.9rem] leading-relaxed'>
            Sign records body preferences locally (when we enable persistence) — then overlays inventory rules and
            return behaviour. Measurement capture is intentionally lightweight here until the quiz ships.
          </SheetDescription>
        </SheetHeader>
        <section className="space-y-3 text-[0.9rem] leading-relaxed">
          <div className="border-border rounded-2xl border border-dashed px-5 py-4">
            <p className='text-muted-foreground text-[0.65rem] tracking-[0.28em] uppercase'>
              Recommendation stub
            </p>
            <p className="mt-4">
              Sizes on file:&nbsp;
              <span className="font-medium">{availableSizes.join(" · ") || "—"}</span>
            </p>
            {hintCopy ?
              <p className='text-muted-foreground mt-2 text-sm'>{hintCopy}</p>
            : <p className='text-muted-foreground mt-2 text-sm'>
                No automated match yet — when fit data syncs from your profile layer, ranked sizes render here via
                <code className='bg-muted mx-1 px-2 py-0.5 rounded'>
                  recommendSizeFromProfile
                </code>
                .
              </p>}
          </div>
          <div className="border-border rounded-2xl border bg-muted/20 px-5 py-4 text-sm">
            <p className="font-medium tracking-tight">Future inputs</p>
            <ul className="mt-4 list-disc space-y-3 pl-[1.1rem] text-muted-foreground">
              <li>Guided ruler / tape prompts with photo assists</li>
              <li>Preference weights (closer, true-to-size, roomy)</li>
              <li>Cross-SKU elasticity tables from IMS</li>
            </ul>
          </div>
        </section>
      </SheetContent>
    </Sheet>
  );
}
