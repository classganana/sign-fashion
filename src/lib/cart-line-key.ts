/** Stable cart merge key — keep separate from Mongo `_id` until checkout unifies variants */
export function cartLineMergeKey(slug: string, selectedSize?: string): string {
  const sizeNorm = selectedSize?.trim() || "__";
  return `${slug}::${sizeNorm}`;
}
