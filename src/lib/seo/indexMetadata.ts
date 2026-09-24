import type { Metadata } from "next";
import { isFiltered, type SearchParams } from "@/lib/data/params";
import { href, locales, defaultLocale, type Locale } from "@/lib/i18n";
import { abs } from "@/lib/site";

/**
 * Metadata for a listing index that can be filtered.
 *
 * The whole point: an unfiltered /buy is the page we want ranking.
 * /buy?beds=2&max=90000 is a *view* of it. Indexing both is how faceted
 * navigation quietly consumes a crawl budget — Property Finder avoids it by
 * disallowing ~40 parameters outright and pushing everything to clean
 * landing-page URLs.
 *
 * So a filtered view is noindex,follow with a canonical pointing back at
 * the bare path. `follow` matters: we still want the crawler walking
 * through to the property pages it links to.
 */
export function indexMetadata({
  lang,
  path,
  searchParams,
  title,
  description,
}: {
  lang: Locale;
  /** Route path without locale, e.g. "/buy". */
  path: string;
  searchParams: SearchParams;
  title: string;
  description: string;
}): Metadata {
  const canonical = abs(href(lang, path));
  const filtered = isFiltered(searchParams);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        ...(Object.fromEntries(locales.map((l) => [l, abs(href(l, path))])) as Record<
          string,
          string
        >),
        "x-default": abs(href(defaultLocale, path)),
      },
    },
    robots: filtered ? { index: false, follow: true } : undefined,
  };
}
