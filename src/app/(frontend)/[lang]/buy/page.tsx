import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, href, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/routes";
import { indexMetadata } from "@/lib/seo/indexMetadata";
import type { SearchParams } from "@/lib/data/params";
import ListingIndex from "@/components/listings/ListingIndex";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { lang } = await params;
  const sp = await searchParams;
  return indexMetadata({
    lang: (isLocale(lang) ? lang : "en") as Locale,
    path: routes.buy,
    searchParams: sp,
    title: "Property for Sale in Dubai",
    description: "Apartments, villas and townhouses for sale across Dubai. Every listing DLD-permitted, with current prices and real availability.",
  });
}

export default async function BuyPage({ params, searchParams }: Props) {
  const { lang } = await params;
  const sp = await searchParams;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;

  return (
    <ListingIndex
      lang={locale}
      baseFilters={{ intent: "buy", category: "residential" }}
      searchParams={sp}
      action={href(locale, routes.buy)}
      title="Property for sale in Dubai"
      intro="Every one carries a valid DLD advertising permit — if it is here, it is genuinely on the market."
      emptyMessage="Nothing matches that yet. Widen the filters, or tell us what you are after."
    />
  );
}
