import type { ListingFilters, Listing } from "./types";

/**
 * Query string ⇄ ListingFilters.
 *
 * One module so the filter bar, the page that renders results and the
 * canonical/robots decision all agree on what counts as "filtered". They
 * drifting apart is how a site ends up indexing three URLs that show the
 * same twelve properties.
 */

export type SearchParams = Record<string, string | string[] | undefined>;

const PROPERTY_TYPES: Listing["propertyType"][] = [
  "apartment", "villa", "townhouse", "penthouse", "studio", "office", "retail", "warehouse",
];

const FURNISHED = ["unfurnished", "furnished", "partly"] as const;
const SORTS = ["newest", "price-asc", "price-desc"] as const;

function one(v: string | string[] | undefined): string | undefined {
  const s = Array.isArray(v) ? v[0] : v;
  return s && s.trim() ? s.trim() : undefined;
}

function num(v: string | string[] | undefined): number | undefined {
  const s = one(v);
  if (s === undefined) return undefined;
  const n = Number(s);
  // Reject NaN and negatives rather than passing them to the query, where
  // they'd silently return everything or nothing.
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

export function parseFilters(sp: SearchParams): ListingFilters {
  const propertyType = one(sp.type) as Listing["propertyType"] | undefined;
  const furnished = one(sp.furnished) as (typeof FURNISHED)[number] | undefined;
  const sort = one(sp.sort) as (typeof SORTS)[number] | undefined;
  const intent = one(sp.intent) as Listing["intent"] | undefined;

  return {
    intent: intent === "buy" || intent === "rent" ? intent : undefined,
    propertyType: propertyType && PROPERTY_TYPES.includes(propertyType) ? propertyType : undefined,
    bedrooms: num(sp.beds),
    areaSlug: one(sp.area),
    minPrice: num(sp.min),
    maxPrice: num(sp.max),
    furnished: furnished && FURNISHED.includes(furnished) ? furnished : undefined,
    sort: sort && SORTS.includes(sort) ? sort : undefined,
    page: num(sp.page) || 1,
  };
}

/**
 * Whether the visitor narrowed anything.
 *
 * Drives noindex + canonical on the index pages. An unfiltered /buy is the
 * page we want ranking; /buy?beds=2&max=90000 is a view of it, and
 * indexing both is how faceted navigation quietly eats a crawl budget —
 * the trap Property Finder avoids by disallowing ~40 parameters outright.
 *
 * `sort` and `page` count: a sorted or paged view is still a duplicate of
 * the canonical page as far as a crawler is concerned.
 */
export function isFiltered(sp: SearchParams): boolean {
  const keys = ["type", "beds", "area", "min", "max", "furnished", "sort", "intent"];
  if (keys.some((k) => one(sp[k]) !== undefined)) return true;
  const page = num(sp.page);
  return page !== undefined && page > 1;
}

/** Rebuild a query string with one value changed — used by pagination. */
export function withParam(sp: SearchParams, key: string, value: string | undefined): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    const s = one(v);
    if (s !== undefined && k !== key) params.set(k, s);
  }
  if (value !== undefined) params.set(key, value);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
