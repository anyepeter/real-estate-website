import type { MetadataRoute } from "next";
import { getListings, getAreas } from "@/lib/data";
import { locales, href, defaultLocale, type Locale } from "@/lib/i18n";
import { routes, property, area as areaRoute } from "@/lib/routes";
import { abs } from "@/lib/site";

/**
 * The sitemap.
 *
 * Every entry carries hreflang alternates for both locales plus x-default,
 * which is the half of an EN/AR rollout that search engines actually read.
 * haus & haus is English-only; Property Finder runs full alternates and
 * takes the Arabic traffic. Building it now means the Arabic copy, when it
 * lands, is already wired.
 *
 * Note what is absent: /search. It is robots-disallowed and noindex, so
 * listing it here would be contradictory instructions.
 *
 * This reads through lib/data, so it becomes accurate the moment Neon is
 * connected — no separate query to keep in step.
 */

type Entry = MetadataRoute.Sitemap[number];

/** One entry per path, with both locales cross-referenced. */
function localized(path: string, opts: Partial<Entry> = {}): Entry[] {
  const languages = Object.fromEntries(
    locales.map((l) => [l, abs(href(l, path))])
  ) as Record<string, string>;

  return locales.map((locale) => ({
    url: abs(href(locale, path)),
    alternates: {
      languages: {
        ...languages,
        // x-default points at the locale we redirect bare paths to, which
        // is what the proxy actually does — they must agree.
        "x-default": abs(href(defaultLocale as Locale, path)),
      },
    },
    ...opts,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [listingPage, areas] = await Promise.all([
    // High limit: the sitemap wants everything, not a paginated view.
    getListings({ limit: 1000 }),
    getAreas(),
  ]);

  const staticPages: Entry[] = [
    ...localized(routes.home, { changeFrequency: "weekly", priority: 1 }),
    ...localized(routes.buy, { changeFrequency: "daily", priority: 0.9 }),
    ...localized(routes.rent, { changeFrequency: "daily", priority: 0.9 }),
    ...localized(routes.commercial, { changeFrequency: "daily", priority: 0.8 }),
    ...localized(routes.sell, { changeFrequency: "monthly", priority: 0.8 }),
    ...localized(routes.offPlan, { changeFrequency: "monthly", priority: 0.7 }),
    ...localized(routes.areas, { changeFrequency: "weekly", priority: 0.7 }),
    ...localized(routes.insights, { changeFrequency: "weekly", priority: 0.6 }),
    ...localized(routes.contact, { changeFrequency: "yearly", priority: 0.5 }),
  ];

  const listingPages: Entry[] = listingPage.docs.flatMap((l) =>
    localized(property(l.id, l.slugEn), {
      lastModified: new Date(l.updatedAt),
      changeFrequency: "daily",
      priority: 0.8,
    })
  );

  // Emirates are excluded: /areas/dubai/dubai is not a page, and the
  // emirate node exists to parent the tree rather than to be visited.
  const areaPages: Entry[] = areas
    .filter((a) => a.level !== "emirate")
    .flatMap((a) =>
      localized(areaRoute("dubai", a.slugEn), {
        changeFrequency: "weekly",
        priority: 0.6,
      })
    );

  return [...staticPages, ...listingPages, ...areaPages];
}
