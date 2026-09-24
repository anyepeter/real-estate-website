import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, href, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/routes";
import type { SearchParams } from "@/lib/data/params";
import ListingIndex from "@/components/listings/ListingIndex";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<SearchParams>;
};

/**
 * The interactive search.
 *
 * Permanently noindex — not conditionally, the way the index pages are.
 * This is the query-string surface by design, and it is the one route
 * robots.txt disallows. The plan's whole faceted-navigation position rests
 * on exactly one page being allowed to be messy, and every clean path
 * staying clean.
 *
 * So there is no canonical here either: a page that should never be indexed
 * does not need to nominate itself. Visitors who want a shareable, rankable
 * URL are served by /buy, /rent and /commercial.
 */
export const metadata: Metadata = {
  title: "Search Properties",
  robots: { index: false, follow: true },
};

export default async function SearchPage({ params, searchParams }: Props) {
  const { lang } = await params;
  const sp = await searchParams;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;

  return (
    <ListingIndex
      lang={locale}
      baseFilters={{}}
      searchParams={sp}
      action={href(locale, routes.search)}
      title="Search"
      intro="Everything we hold, filtered however you like — sale and rent, residential and commercial."
      emptyMessage="Nothing matches that combination."
      showIntentFilter
    />
  );
}
