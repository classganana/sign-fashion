import { revalidatePath } from "next/cache";

/** ISR / RSC refresh after CMS-backed mutations */
export function revalidatePrimaryStorefrontRoutes(): void {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/collections");
}
