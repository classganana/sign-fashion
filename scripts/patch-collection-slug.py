from pathlib import Path
ROOT = Path("/Users/ayushdixit/Documents/Freelance Workspace/sign-fashion")
p = ROOT / "src/app/collections/[slug]/page.tsx"
t = p.read_text()
t = t.replace(
    'import { collections } from "@/config/collections";',
    'import { getUnifiedCollections } from "@/services/collections-catalog";',
)
t = t.replace(
    'import { getStaticCatalog } from "@/services/products";',
    'import { mergeCatalogNow } from "@/services/products";',
)
t = t.replace(
    "export async function generateStaticParams() {\n  return collections.map((entry) => ({ slug: entry.slug }));\n}",
    """export async function generateStaticParams() {
  const rows = await getUnifiedCollections();
  return rows.map((entry) => ({ slug: entry.slug }));
}""",
)
t = t.replace(
    "  const capsule = collections.find((x) => x.slug === slug);",
    "  const capsuleRows = await getUnifiedCollections();\n  const capsule = capsuleRows.find((x) => x.slug === slug);",
    1,
)
# second occurrence in CollectionDetailPage
t = t.replace(
    "  const capsule = collections.find((x) => x.slug === slug);",
    "  const capsule = capsuleRows.find((x) => x.slug === slug);",
)
# Above replacement might duplicate variable - fix manually reading file after

if "mergeCatalogNow()" not in t:
    idx = t.find("export default async function CollectionDetailPage")
    snippet = '''export default async function CollectionDetailPage(props: Props) {
  const { slug } = await props.params;
  const capsuleRows = await getUnifiedCollections();
  const capsule = capsuleRows.find((x) => x.slug === slug);
'''
    if idx == -1:
        raise SystemExit("detail fn")
    inner = t.find("export default async function CollectionDetailPage(props: Props) {")
    if inner >= 0:
        # brute: replace start of detail page block
        start = inner
        end = t.find("  if (!capsule)", start)
        if end == -1:
            raise SystemExit("capsule marker")
        t = (
            t[:start]
            + '''export default async function CollectionDetailPage(props: Props) {
  const { slug } = await props.params;
  const capsuleRows = await getUnifiedCollections();
  const capsule = capsuleRows.find((x) => x.slug === slug);
'''
            + t[end:]
        )

# replace catalogue line + related
old = '''  const catalogue = getStaticCatalog();
  const products: MockProduct[] = capsule.productSlugs
    .map((s) => catalogue.find((p) => p.slug === s))
    .filter((p): p is MockProduct => Boolean(p));

  const related = getRelatedCollections(capsule.slug, 2);
'''
new = '''  const catalogue = await mergeCatalogNow();
  const products: MockProduct[] = capsule.productSlugs
    .map((s) => catalogue.find((p) => p.slug === s))
    .filter((p): p is MockProduct => Boolean(p));

  const related = getRelatedCollections(capsule.slug, capsuleRows, 2);
'''
if old in t:
    t = t.replace(old, new)
else:
    raise SystemExit('collection detail catalogue block mismatch')

p.write_text(t)
print('collections slug patched (verify duplicates manually)')
