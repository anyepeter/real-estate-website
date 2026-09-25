import { listings, areas } from "./fixtures";
import { COMMERCIAL_TYPES } from "./types";
import type { Area, ListingFull, ListingFilters, Paginated } from "./types";


/**
 * ───────────────────────────────────────────────────────────────────────────
 *  The data layer. Every page reads through here and nothing else.
 * ───────────────────────────────────────────────────────────────────────────
 *
 *  Currently backed by fixtures. When Neon is connected each function body
 *  becomes a `payload.find()` call — the signatures, return shapes and
 *  filter semantics are already the ones Payload will produce, so no page
 *  changes.
 *
 *  The one rule: no component imports ./fixtures.
 */

const DEFAULT_LIMIT = 12;

/**
 * A listing is publicly visible only while its permit is valid.
 *
 * The nightly sweep already unpublishes lapsed listings, so in principle a
 * `_status: published` filter would do. This is deliberate belt and braces:
 * the sweep runs once a day and a permit can lapse at any hour in between.
 * Checking at read time closes that window, and the cost is one date
 * comparison.
 */
function isVisible(l: ListingFull): boolean {
  if (l._status !== "published") return false;
  if (!l.permit?.expiresAt) return false;
  return new Date(l.permit.expiresAt).getTime() > Date.now();
}

/** Matches an area or anything beneath it, so /buy/dubai returns everything
 *  and /buy/dubai/business-bay narrows to that community and its towers. */
function inArea(l: ListingFull, slug: string): boolean {
  if (l.area.slugEn === slug) return true;
  if (slug === "dubai") return true; // emirate root — everything sits under it
  const parent = typeof l.area.parent === "object" ? l.area.parent : null;
  return parent?.slugEn === slug;
}

export async function getListings(
  filters: ListingFilters = {}
): Promise<Paginated<ListingFull>> {
  const {
    intent, category, propertyType, bedrooms, areaSlug, minPrice, maxPrice, furnished,
    sort = "newest", page = 1, limit = DEFAULT_LIMIT,
  } = filters;

  let rows = listings.filter(isVisible);

  if (intent) rows = rows.filter((l) => l.intent === intent);
  if (category) {
    const isCommercial = (l: ListingFull) =>
      (COMMERCIAL_TYPES as readonly string[]).includes(l.propertyType);
    rows = rows.filter((l) => (category === "commercial" ? isCommercial(l) : !isCommercial(l)));
  }
  if (propertyType) rows = rows.filter((l) => l.propertyType === propertyType);
  if (bedrooms !== undefined) rows = rows.filter((l) => l.bedrooms === bedrooms);
  if (areaSlug) rows = rows.filter((l) => inArea(l, areaSlug));
  if (minPrice !== undefined) rows = rows.filter((l) => l.price >= minPrice);
  if (maxPrice !== undefined) rows = rows.filter((l) => l.price <= maxPrice);
  if (furnished) rows = rows.filter((l) => l.furnished === furnished);

  rows = [...rows].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const totalDocs = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalDocs / limit));
  const current = Math.min(Math.max(1, page), totalPages);

  return {
    docs: rows.slice((current - 1) * limit, current * limit),
    totalDocs,
    page: current,
    totalPages,
    hasNextPage: current < totalPages,
    hasPrevPage: current > 1,
  };
}

export async function getListing(id: number): Promise<ListingFull | null> {
  const found = listings.find((l) => l.id === id);
  return found && isVisible(found) ? found : null;
}

export async function getAreas(): Promise<Area[]> {
  return areas;
}

export async function getArea(slug: string): Promise<Area | null> {
  return areas.find((a) => a.slugEn === slug) ?? null;
}

/**
 * Listing counts per area for a given intent — what the thin-content gate
 * will read to decide whether a landing page is allowed to exist at all.
 */
export async function getAreaCounts(
  intent?: ListingFilters["intent"]
): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const l of listings.filter(isVisible)) {
    if (intent && l.intent !== intent) continue;
    counts[l.area.slugEn] = (counts[l.area.slugEn] ?? 0) + 1;
  }
  return counts;
}
