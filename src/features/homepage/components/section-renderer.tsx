import { BrandStorySection } from "./brand-story-section";
import { CategoryShowcaseSection } from "./category-showcase-section";
import { CollectionsFeaturedSection } from "./collections-featured-section";
import { EditorialGridSection } from "./editorial-grid-section";
import { HeroSection } from "./hero-section";
import { NewsletterSection } from "./newsletter-section";
import { ProductGridSection } from "./product-grid-section";
import { ProductRailSection } from "./product-rail-section";
import { ProductSliderSection } from "./product-slider-section";
import { SocialGallerySection } from "./social-gallery-section";
import { StatementSection } from "./statement-section";
import type { HomepageSectionResolved } from "@/types/homepage";

export function HomepageSectionRenderer({ section }: { section: HomepageSectionResolved }) {
  switch (section.type) {
    case "hero":
      return <HeroSection section={section} />;
    case "editorial-grid":
      return <EditorialGridSection section={section} />;
    case "product-rail":
      return <ProductRailSection section={section} />;
    case "product-grid":
      return <ProductGridSection section={section} />;
    case "collections-featured":
      return <CollectionsFeaturedSection section={section} />;
    case "category-showcase":
      return <CategoryShowcaseSection section={section} />;
    case "product-slider":
      return <ProductSliderSection section={section} />;
    case "brand-story":
      return <BrandStorySection section={section} />;
    case "social-gallery":
      return <SocialGallerySection section={section} />;
    case "statement":
      return <StatementSection section={section} />;
    case "newsletter":
      return <NewsletterSection section={section} />;
    default: {
      const _exhaustiveCheck: never = section;
      return _exhaustiveCheck;
    }
  }
}
