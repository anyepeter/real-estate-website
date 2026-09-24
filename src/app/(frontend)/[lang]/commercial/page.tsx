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
    path: routes.commercial,
    searchParams: sp,
    title: "Commercial Property & Workspace in Dubai",
    description: "Offices, retail units and warehouses across Dubai — to rent and to buy. The corner of the market the big portals barely cover.",
  });
}

export default async function CommercialPage({ params, searchParams }: Props) {
  const { lang } = await params;
  const sp = await searchParams;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;

  return (
    <ListingIndex
      lang={locale}
      baseFilters={{ category: "commercial" }}
      searchParams={sp}
      action={href(locale, routes.commercial)}
      title="Commercial space in Dubai"
      intro="Offices, retail and warehousing — to rent and to buy, across the free zones and the mainland."
      emptyMessage="No commercial space matches that yet."
    />
  );
}
