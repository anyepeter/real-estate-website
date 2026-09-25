import { getPayload, type Where } from "payload";
import config from "@payload-config";
import { COMMERCIAL_TYPES } from "./types";
import type { Area, ListingFull, ListingFilters, Paginated } from "./types";

/**
 * The Payload-backed data layer.
 *
 * Mirrors the fixture implementation exactly — same signatures, same return
 * shapes — so pages never learn which one they are talking to.
 *
 * ── Written blind ─────────────────────────────────────────────────────
 * There is no database to run this against yet, so it is typechecked but
 * unexercised. The likely first-boot failures are the ones only a real
 * query surfaces: relationship depth, the `permit.expiresAt` join, and
 * whether drafts leak through `where._status`. Worth reading with that in
 * mind rather than assuming green.
 */

const DEFAULT_LIMIT = 12;

async function client() {
  return getPayload({ config });
}

const SORTS: Record<NonNullable<ListingFilters["sort"]>, string> = {
  newest: "-createdAt",
  "price-asc": "price",
  "price-desc": "-price",
};

/**
 * Every area at or beneath a slug.
 *
 * /buy/dubai/business-bay has to include listings attached to towers under
 * Business Bay, not just the community node itself. Two shallow queries
 * beats a recursive walk at this tree depth (emirate › community › tower).
 */
async function areaSubtreeIds(slug: string): Promise<number[]> {
  const payload = await client();

  const root = await payload.find({
    collection: "areas",
    where: { slugEn: { equals: slug } },
    limit: 1,
    depth: 0,
  });
  const node = root.docs[0];
  if (!node) return [];

  const children = await payload.find({
    collection: "areas",
    where: { parent: { equals: node.id } },
    limit: 500,
    depth: 0,
  });

  const grandchildren = children.docs.length
    ? await payload.find({
        collection: "areas",
        where: { parent: { in: children.docs.map((c) => c.id) } },
        limit: 1000,
        depth: 0,
      })
    : { docs: [] as { id: number }[] };

  return [node.id, ...children.docs.map((c) => c.id), ...grandchildren.docs.map((g) => g.id)];
}

export async function getListings(
  filters: ListingFilters = {}
): Promise<Paginated<ListingFull>> {
  const payload = await client();
  const {
    intent, category, propertyType, bedrooms, areaSlug, minPrice, maxPrice, furnished,
    sort = "newest", page = 1, limit = DEFAULT_LIMIT,
  } = filters;

  const and: Where[] = [
    // Belt and braces with the nightly sweep: it unpublishes lapsed
    // listings once a day, and a permit can lapse at any hour in between.
    { _status: { equals: "published" } },
    { "permit.expiresAt": { greater_than: new Date().toISOString() } },
  ];

  if (intent) and.push({ intent: { equals: intent } });
  if (category) {
    and.push(
      category === "commercial"
        ? { propertyType: { in: [...COMMERCIAL_TYPES] } }
        : { propertyType: { not_in: [...COMMERCIAL_TYPES] } }
    );
  }
  if (propertyType) and.push({ propertyType: { equals: propertyType } });
  if (bedrooms !== undefined) and.push({ bedrooms: { equals: bedrooms } });
  if (minPrice !== undefined) and.push({ price: { greater_than_equal: minPrice } });
  if (maxPrice !== undefined) and.push({ price: { less_than_equal: maxPrice } });
  if (furnished) and.push({ furnished: { equals: furnished } });

  if (areaSlug) {
    const ids = await areaSubtreeIds(areaSlug);
    // An unknown slug must return nothing, not everything — omitting the
    // clause here would silently widen the query instead of narrowing it.
    and.push({ area: { in: ids.length ? ids : [-1] } });
  }

  const result = await payload.find({
    collection: "listings",
    where: { and },
    sort: SORTS[sort],
    limit,
    page,
    depth: 1, // resolves area, agent, permit and photos
  });

  return {
    docs: result.docs as unknown as ListingFull[],
    totalDocs: result.totalDocs,
    page: result.page ?? 1,
    totalPages: result.totalPages,
    hasNextPage: result.hasNextPage,
    hasPrevPage: result.hasPrevPage,
  };
}

export async function getListing(id: number): Promise<ListingFull | null> {
  const payload = await client();

  // Queried through find rather than findByID so the permit and status
  // conditions apply. findByID would happily return a lapsed listing.
  const result = await payload.find({
    collection: "listings",
    where: {
      and: [
        { id: { equals: id } },
        { _status: { equals: "published" } },
        { "permit.expiresAt": { greater_than: new Date().toISOString() } },
      ],
    },
    limit: 1,
    depth: 1,
  });

  return (result.docs[0] as unknown as ListingFull) ?? null;
}

export async function getAreas(): Promise<Area[]> {
  const payload = await client();
  const result = await payload.find({
    collection: "areas",
    limit: 1000,
    sort: "nameEn",
    depth: 1, // parent, for the subtree check in the UI
  });
  return result.docs as Area[];
}

export async function getArea(slug: string): Promise<Area | null> {
  const payload = await client();
  const result = await payload.find({
    collection: "areas",
    where: { slugEn: { equals: slug } },
    limit: 1,
    depth: 1,
  });
  return (result.docs[0] as Area) ?? null;
}

export async function getAreaCounts(
  intent?: ListingFilters["intent"]
): Promise<Record<string, number>> {
  const payload = await client();

  const result = await payload.find({
    collection: "listings",
    where: {
      and: [
        { _status: { equals: "published" } },
        { "permit.expiresAt": { greater_than: new Date().toISOString() } },
        ...(intent ? [{ intent: { equals: intent } }] : []),
      ],
    },
    limit: 2000,
    depth: 1,
    // Only the area is needed; pulling photos for a count is wasteful.
    select: { area: true },
  });

  const counts: Record<string, number> = {};
  for (const doc of result.docs) {
    const area = doc.area as Area | number | undefined;
    if (area && typeof area === "object" && area.slugEn) {
      counts[area.slugEn] = (counts[area.slugEn] ?? 0) + 1;
    }
  }
  return counts;
}
