import type { MockProduct, ProductDetails, ProductDiscoveryProfile } from "@/types/product";

const d = (
  fit: string,
  fabric: string,
  washCare: string,
  styleNotes: string,
  deliveryNotes: string,
  extra?: Partial<
    Pick<
      ProductDetails,
      | "editorialLead"
      | "packagingStory"
      | "returnsComfort"
      | "secureCheckoutHint"
      | "fabricSignal"
    >
  >,
): MockProduct["details"] => ({
  fit,
  fabric,
  washCare,
  styleNotes,
  deliveryNotes,
  ...(extra ?? {}),
});

const fac = (
  partial: Omit<ProductDiscoveryProfile, "sizes" | "colors" | "fits" | "collections" | "tags"> &
    Partial<Pick<ProductDiscoveryProfile, "sizes" | "colors" | "fits" | "collections" | "tags">>,
): ProductDiscoveryProfile => ({
  categorySlug: partial.categorySlug,
  sizes: [...(partial.sizes ?? [])],
  colors: [...(partial.colors ?? [])],
  fits: [...(partial.fits ?? [])],
  collections: [...(partial.collections ?? [])],
  tags: [...(partial.tags ?? [])],
  featuredRank: partial.featuredRank,
  trendingRank: partial.trendingRank,
  releasedAtMs: partial.releasedAtMs,
});

export const mockProducts: MockProduct[] = [
  {
    id: "p1",
    slug: "sign-merino-crew-ivory",
    name: "Merino crew — ivory",
    description:
      "A supple merino sweater with compact rib trims and an easy shoulder line — warm enough for winter commutes, refined enough for low-light evenings.",
    priceCents: 449900,
    currency: "INR",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446",
    imageAlt: "Ivory merino crew sweater on model, soft studio lighting",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446",
        alt: "Ivory merino crew sweater on model, soft studio lighting",
      },
      {
        url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105",
        alt: "Folded knit texture and rib collar detail, daylight",
      },
      {
        url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
        alt: "Graphite rib knit close-up showing gauge and drape",
      },
    ],
    tag: "new",
    discovery: fac({
      categorySlug: "knitwear",
      sizes: ["S", "M", "L", "XL"],
      colors: ["ivory"],
      fits: ["relaxed"],
      collections: ["monochrome-pulse", "after-hours"],
      tags: ["layering", "premium-basic"],
      featuredRank: 96,
      trendingRank: 78,
      releasedAtMs: 1_735_843_200_000,
    }),
    details: d(
      "Relaxed through the chest; ribbed cuffs sit clean at the wrist. Size down for a closer editorial line.",
      "100% superfine Merino Wool (RWS). 12-gauge jersey body, 1×1 rib hem and cuffs.",
      "Hand wash cold with wool-safe detergent · reshape while damp · dry flat · steam on low wool setting only.",
      "Layer over our longline tees for contrast length; monochrome with charcoal trousers mirrors an elevated Snitch-tailored mood.",
      "Dispatched within 48 hours metro · 4–7 business days rest of India. Express available at checkout when live.",
      {
        editorialLead:
          "Warmth without volume — the ivory merino crew reads quiet luxury from the street to low-light interiors.",
        packagingStory: "Ships in a recycled craft box with tissue and a minimal brand seal.",
        returnsComfort: "7-day try-on window on unworn knitwear with hygiene tags intact.",
        secureCheckoutHint: "256-bit checkout when payments go live — preview shows bag total only.",
        fabricSignal: "RWS merino · mulesing-free sourcing",
      },
    ),
  },
  {
    id: "p2",
    slug: "sign-tailored-trouser-charcoal",
    name: "Tailored trouser — charcoal",
    description:
      "Pressed front crease and a tapered ankle that kisses the shoe — a Bonkers-worthy structural base for oversized tops and heavyweight knits.",
    priceCents: 529900,
    currency: "INR",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae",
    imageAlt: "Charcoal tailored trousers draped cleanly on model",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1509631179647-0177331693ae",
        alt: "Charcoal tailored trousers draped cleanly on model",
      },
      {
        url: "https://images.unsplash.com/photo-1503341504253-dff4815485f1",
        alt: "Trouser waistband and pocket detail, tonal contrast",
      },
      {
        url: "https://images.unsplash.com/photo-1544022613-e87ca75a784a",
        alt: "Neutral outerwear reference for proportion with tailored leg",
      },
    ],
    tag: "bestseller",
    discovery: fac({
      categorySlug: "tailoring",
      sizes: ["28", "30", "32", "34"],
      colors: ["charcoal"],
      fits: ["tailored"],
      collections: ["monochrome-pulse", "soft-structure"],
      tags: ["evening", "structure"],
      featuredRank: 94,
      trendingRank: 91,
      releasedAtMs: 1_702_742_400_000,
    }),
    details: d(
      "Mid-rise, tailored leg that narrows subtly from knee to hem. Intended to stack slightly over chunky sneakers.",
      "Worsted wool blend with mechanical stretch recovery; breathable mesh pocketing.",
      "Dry clean preferred · steam between wears · hang on tailored hangers.",
      "Pair with cropped outerwear or a box tee left untucked — the contrast of precision tailoring + relaxed upper reads premium streetwear.",
      "Metro 2–4 business days · signature required on deliveries above ₹15,000.",
      {
        editorialLead: "A charcoal press line that holds under flash and daylight — anchoring monochrome fits with structure.",
        returnsComfort: "On-body tailoring returns honoured when tags and hem tape untouched.",
        secureCheckoutHint: "No payments in preview · your PIN never leaves this checkout shell when live.",
        fabricSignal: "Stretch worsted weave · breathable pocketing",
        packagingStory: "Trousers arrive folded flat with hanger loop for wardrobes.",
      },
    ),
  },
  {
    id: "p3",
    slug: "sign-oversized-shirt-oat",
    name: "Oversized shirt — oat",
    description:
      "A roomy cotton poplin borrowed from tailoring blocks — softened in oat pigment for quiet contrast against black denim.",
    priceCents: 329900,
    currency: "INR",
    image: "https://images.unsplash.com/photo-1562157873-818bc0726f68",
    imageAlt: "Oat oversized cotton shirt neatly folded flat lay",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1562157873-818bc0726f68",
        alt: "Oat oversized cotton shirt neatly folded flat lay",
      },
      {
        url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
        alt: "Fabric weave and corozo buttons close-up",
      },
      {
        url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
        alt: "Monochrome styling reference layered with tonal tee",
      },
    ],
    tag: "limited",
    discovery: fac({
      categorySlug: "shirts",
      sizes: ["S", "M", "L", "XL"],
      colors: ["oat"],
      fits: ["oversized"],
      collections: ["soft-structure"],
      tags: ["layering", "everyday"],
      featuredRank: 82,
      trendingRank: 74,
      releasedAtMs: 1_729_958_400_000,
    }),
    details: d(
      "Dropped shoulder · extended body length intended for half-tucks or layered under open knits.",
      "Compact cotton poplin treated for a softened hand-feel; natural corozo buttons.",
      "Cold machine wash inside-out · tumble low or hang dry · touch up collar with warm iron.",
      "Wear mono with stone field jacket; roll sleeves twice for Urban Monkey-esque attitude without loud graphics.",
      "Limited units per drop — fulfilment prioritized for paid orders.",
      {
        editorialLead:
          "Oat pigment cooled for Indian daylight — roomy tailoring block without losing shoulder architecture.",
        fabricSignal: "Compact poplin · corozo closures",
      },
    ),
  },
  {
    id: "p4",
    slug: "sign-field-jacket-stone",
    name: "Field jacket — stone",
    description:
      "Utility architecture with tonal hardware and a supple shell — matte enough for night rides, tactile enough up close.",
    priceCents: 689900,
    currency: "INR",
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a",
    imageAlt: "Stone-toned utility field jacket hung on hanger",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1544022613-e87ca75a784a",
        alt: "Stone-toned utility field jacket hung on hanger",
      },
      {
        url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
        alt: "Matte shell texture and pocket flap detail",
      },
      {
        url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446",
        alt: "Layering proportion with lightweight knit under shell",
      },
    ],
    tag: "new",
    discovery: fac({
      categorySlug: "outerwear",
      sizes: ["S", "M", "L", "XL"],
      colors: ["stone"],
      fits: ["structured"],
      collections: ["after-hours", "monochrome-pulse"],
      tags: ["utility", "street-core"],
      featuredRank: 98,
      trendingRank: 86,
      releasedAtMs: 1_735_056_000_000,
    }),
    details: d(
      "Straight body with articulated sleeves; cuffs adjust with concealed snaps. Fits true — size up for exaggerated layering.",
      "Cotton-nylon warp shell bonded to brushed tricot pocketing; taped interior seams.",
      "Spot-clean body · detachable care tag recommends professional outerwear wash annually.",
      "Throw over hoodie + heavyweight tee silhouette; tonal stone reads luxury minimal under city sodium light.",
      "Ships boxed to preserve structure · returns accepted if hygiene seal intact.",
      {
        packagingStory: "Structured shipper prevents shoulder collapse in transit.",
        returnsComfort: "Outerwear returns when collar tape and hang tag remain attached.",
        secureCheckoutHint: "Preview bag — card capture stays tokenized when gateway ships.",
      },
    ),
  },
  {
    id: "p5",
    slug: "sign-knitted-vest-graphite",
    name: "Knitted vest — graphite",
    description:
      "Compact rib jersey with a sculpted armhole curve — layering piece for temperate days or under coats when the mercury drops.",
    priceCents: 399900,
    currency: "INR",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
    imageAlt: "Graphite rib-knit textile close-up texture",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
        alt: "Graphite rib-knit textile close-up texture",
      },
      {
        url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446",
        alt: "Vest layered over long-sleeve knit, studio light",
      },
      {
        url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105",
        alt: "Folded rib knit showing neckline curve",
      },
    ],
    discovery: fac({
      categorySlug: "knitwear",
      sizes: ["S", "M", "L"],
      colors: ["graphite"],
      fits: ["relaxed"],
      collections: ["monochrome-pulse"],
      tags: ["layering"],
      featuredRank: 84,
      trendingRank: 70,
      releasedAtMs: 1_721_836_800_000,
    }),
    details: d(
      "Athletic neckline without restriction; vest length kisses top of trousers for clean proportion.",
      "Merino-viscose blend for drape retention; tubular knit trims.",
      "Flat dry · avoid hangers that stretch neckline · store folded.",
      "Wear over tonal long sleeves for depth; juxtapose with cropped outerwear lengths.",
      "Standard ground shipping PAN-India; tracking emailed at dispatch.",
    ),
  },
  {
    id: "p6",
    slug: "sign-box-tee-void",
    name: "Oversized box tee — void black",
    description:
      "Dense jersey with a blunt shoulder line and zero shrink gimmicks — signature Sign box silhouette for monochrome rotation.",
    priceCents: 189900,
    currency: "INR",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
    imageAlt: "Folded black oversized tee, studio tabletop",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
        alt: "Folded black oversized tee, studio tabletop",
      },
      {
        url: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d",
        alt: "Pigment black jersey surface and folded shoulder edge",
      },
      {
        url: "https://images.unsplash.com/photo-1503341504253-dff4815485f1",
        alt: "Monochrome torso stack showing box silhouette proportion",
      },
    ],
    tag: "new",
    discovery: fac({
      categorySlug: "tees",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["black"],
      fits: ["oversized"],
      collections: [],
      tags: ["street-core", "everyday"],
      featuredRank: 88,
      trendingRank: 95,
      releasedAtMs: 1_735_219_200_000,
    }),
    details: d(
      "Box cut; body length clears belt line on most heights. Sleeve hits mid-bicep.",
      "240gsm brushed cotton fleece-back jersey; pigment-dyed deep black.",
      "Cold wash · wash with like colours · line dry preserves hand-feel best.",
      "Anchor tonal fits; stack silver jewellery for subtle Urban Monkey energy without printed graphics.",
      "Compact packaging to reduce volumetric freight — folds may relax after first steam.",
    ),
  },
  {
    id: "p7",
    slug: "sign-heavy-tee-pebble",
    name: "Heavyweight tee — pebble grey",
    description:
      "Mineral-toned heavyweight cotton with intentional grain — tees that occupy space like light outerwear.",
    priceCents: 219900,
    currency: "INR",
    image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d",
    imageAlt: "Heather grey heavyweight cotton tee draped naturally",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d",
        alt: "Heather grey heavyweight cotton tee draped naturally",
      },
      {
        url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
        alt: "Grain of mineral-dyed heavyweight cotton",
      },
      {
        url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
        alt: "Street layering reference — tee under open shirting mood",
      },
    ],
    tag: "new",
    discovery: fac({
      categorySlug: "tees",
      sizes: ["S", "M", "L", "XL"],
      colors: ["grey"],
      fits: ["relaxed"],
      collections: [],
      tags: ["premium-basic", "everyday"],
      featuredRank: 80,
      trendingRank: 83,
      releasedAtMs: 1_734_652_800_000,
    }),
    details: d(
      "Relaxed but not sloppy — reinforced shoulder seams keep structure after washes.",
      "Open-end cotton dyed in small batches — natural shade variance is intentional.",
      "Machine wash cold · tumble low once to bloom hand-feel; avoid bleach.",
      "Wear under monochrome jacket for contrast ladder; tonal stack reads editorial.",
      "Dispatched from Mumbai hub · regional ETAs communicated at checkout when live.",
    ),
  },
  {
    id: "p8",
    slug: "sign-pocket-tee-ash",
    name: "Relaxed pocket tee — ash",
    description:
      "A washed ash pigment with asymmetric pocket bar-tack stitching — understated utility for daily rotation.",
    priceCents: 209900,
    currency: "INR",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    imageAlt: "Model walking in layered monochrome street outfit, fashion editorial",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
        alt: "Model walking in layered monochrome street outfit, fashion editorial",
      },
      {
        url: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d",
        alt: "Ash pocket tee fold showing pocket bartack stitches",
      },
      {
        url: "https://images.unsplash.com/photo-1509631179647-0177331693ae",
        alt: "Tailored juxtaposition styling reference — tee with pressed trouser",
      },
    ],
    tag: "bestseller",
    discovery: fac({
      categorySlug: "tees",
      sizes: ["S", "M", "L", "XL"],
      colors: ["ash"],
      fits: ["relaxed"],
      collections: [],
      tags: ["everyday"],
      featuredRank: 92,
      trendingRank: 99,
      releasedAtMs: 1_701_244_800_000,
    }),
    details: d(
      "Slight drop sleeve; hem skims hips for half-tuck option.",
      "180gsm ring-spun cotton; enzyme washed for lived-in softness.",
      "Cold wash · wash inside-out to preserve pigment · reshape while damp.",
      "Wear with tailored charcoal trouser split — anchors the Bonkers-tailored juxtaposition cleanly.",
      "High velocity SKU — replenish cadence communicated via newsletter drops.",
    ),
  },
  {
    id: "p9",
    slug: "sign-longline-tee-ink",
    name: "Longline tee — washed ink",
    description:
      "Extended body line in inky pigment — built to layer under open shirting or cropped bombers.",
    priceCents: 199900,
    currency: "INR",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1",
    imageAlt: "Longline black tee silhouette in urban context",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1503341504253-dff4815485f1",
        alt: "Longline black tee silhouette in urban context",
      },
      {
        url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2",
        alt: "Inky sulphur dye seam variation across shoulder",
      },
      {
        url: "https://images.unsplash.com/photo-1544022613-e87ca75a784a",
        alt: "Layer under cropped jacket — length contrast reference",
      },
    ],
    tag: "new",
    discovery: fac({
      categorySlug: "tees",
      sizes: ["S", "M", "L", "XL"],
      colors: ["ink"],
      fits: ["relaxed"],
      collections: [],
      tags: ["layering", "street-core"],
      featuredRank: 78,
      trendingRank: 88,
      releasedAtMs: 1_735_929_600_000,
    }),
    details: d(
      "Body +3cm versus standard tees; narrower shoulder for vertical read.",
      "Single jersey cotton sulphur dyed for depth variation at seams.",
      "Cold wash separately first cycle · tumble low.",
      "Offset lengths when layering tees over trousers — elongated base reads contemporary Indian street silhouette.",
      "Ships folded; steam neck bind if creased.",
    ),
  },
  {
    id: "p10",
    slug: "sign-studio-crew-milk",
    name: "Studio crew — milk white",
    description:
      "Studio-white crew with tonal topstitching — luminous under flash, restrained in daylight pigment.",
    priceCents: 179900,
    currency: "INR",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105",
    imageAlt: "Milk white crew neck tee neatly folded minimalist surface",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105",
        alt: "Milk white crew neck tee neatly folded minimalist surface",
      },
      {
        url: "https://images.unsplash.com/photo-1562157873-818bc0726f68",
        alt: "High crew neckline and twin-needle cuff detail",
      },
      {
        url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446",
        alt: "Winter white layering with textured knit contrast",
      },
    ],
    tag: "limited",
    discovery: fac({
      categorySlug: "tees",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["milk"],
      fits: ["structured"],
      collections: [],
      tags: ["premium-basic"],
      featuredRank: 76,
      trendingRank: 72,
      releasedAtMs: 1_729_958_400_000,
    }),
    details: d(
      "True crew neck sits high without choke; cuffs double-needle finished.",
      "Compact combed cotton; anti-pilling face finish.",
      "Cold wash · avoid fabric softeners to retain brightness · bleach taboo.",
      "Layer under tonal knitwear — winter whites read premium when textiles differ in texture not hue.",
      "Limited dye lot — SKU may retire without restock banner.",
    ),
  },
];
