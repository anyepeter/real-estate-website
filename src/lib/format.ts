import type { ListingFull } from "@/lib/data";

/**
 * Money, areas and bed counts.
 *
 * Intl.NumberFormat rather than a hand-rolled separator, because the Arabic
 * locale genuinely formats numbers differently and hardcoding commas would
 * have to be undone the moment /ar carries real traffic.
 */

export function formatPrice(
  price: number,
  intent: ListingFull["intent"],
  locale = "en"
): string {
  const n = new Intl.NumberFormat(locale === "ar" ? "ar-AE" : "en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(price);

  // Rentals are quoted yearly in Dubai. Omitting the period is the kind of
  // ambiguity that costs a viewing.
  return intent === "rent" ? `${n} / year` : n;
}

export function formatArea(sqft: number | null | undefined, locale = "en"): string | null {
  if (!sqft) return null;
  const n = new Intl.NumberFormat(locale === "ar" ? "ar-AE" : "en-AE").format(sqft);
  return `${n} sqft`;
}

/** "Studio" reads better than "0 bedrooms", and commercial units have none. */
export function formatBeds(beds: number | null | undefined): string | null {
  if (beds === null || beds === undefined) return null;
  if (beds === 0) return "Studio";
  return `${beds} bed${beds === 1 ? "" : "s"}`;
}

export function formatBaths(baths: number | null | undefined): string | null {
  if (!baths) return null;
  return `${baths} bath${baths === 1 ? "" : "s"}`;
}

export const propertyTypeLabels: Record<ListingFull["propertyType"], string> = {
  apartment: "Apartment",
  villa: "Villa",
  townhouse: "Townhouse",
  penthouse: "Penthouse",
  studio: "Studio",
  office: "Office",
  retail: "Retail",
  warehouse: "Warehouse",
};
