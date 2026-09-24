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
    path: routes.rent,
    searchParams: sp,
    title: "Property for Rent in Dubai",
    description: "Apartments, villas and studios for rent across Dubai. Yearly prices, current availability, every listing DLD-permitted.",
  });
}

export default async function RentPage({ params, searchParams }: Props) {
  const { lang } = await params;
  const sp = await searchParams;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;

  return (
    <ListingIndex
      lang={locale}
      baseFilters={{ intent: "rent", category: "residential" }}
      searchParams={sp}
      action={href(locale, routes.rent)}
      title="Property for rent in Dubai"
      intro="Prices are yearly, as they are quoted here — and if a listing is on the site, it is still on the market."
      emptyMessage="Nothing matches that yet. Widen the filters, or tell us what you are after."
    />
  );
}
