/** Format INR from minor units (paise × 100 for rupees encoded as cents pattern). */
export function formatInrFromMinorUnits(amountMinor: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amountMinor / 100);
}
