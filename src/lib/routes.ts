/**
 * The route map.
 *
 * Centralised so the URL architecture is one file rather than a hundred
 * string literals — which matters because these paths are the SEO strategy,
 * not just navigation. The shape follows the plan: path segments rather
 * than query strings, so every one of these is indexable, and the
 * interactive search at /search is deliberately the only query-string route
 * (and the only noindexed one).
 */

export const routes = {
  home: "/",

  /* transaction intents — the money pages */
  buy: "/buy",
  rent: "/rent",
  sell: "/sell",
  commercial: "/commercial",
  offPlan: "/off-plan",

  /* content */
  areas: "/areas",
  insights: "/insights",
  contact: "/contact",

  /* interactive, noindexed */
  search: "/search",
} as const;

/** /buy/dubai/business-bay, /rent/dubai/dubai-marina … */
export function intentArea(intent: "buy" | "rent", emirate: string, area?: string): string {
  return area ? `/${intent}/${emirate}/${area}` : `/${intent}/${emirate}`;
}

/** A single property. The id is in the path so a retitled listing keeps a
 *  stable URL, with the slug carried for readability and keywords. */
export function property(id: number | string, slug: string): string {
  return `/property/${id}/${slug}`;
}

export function area(emirate: string, slug: string): string {
  return `/areas/${emirate}/${slug}`;
}

export function insight(slug: string): string {
  return `/insights/${slug}`;
}
