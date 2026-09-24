import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import ListingIndex from "@/components/listings/ListingIndex";

export const metadata: Metadata = {
  title: "Commercial Property & Workspace in Dubai",
  description:
    "Offices, retail units and warehouses across Dubai — to rent and to buy. The corner of the market the big portals barely cover.",
};

/**
 * Commercial is a deliberate branch rather than a filter buried in search.
 * Both competitors treat offices, retail and warehouses as an afterthought,
 * which leaves queries like "office space for rent in Business Bay"
 * genuinely under-contested.
 */
export default async function CommercialPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <ListingIndex
      lang={lang as Locale}
      filters={{ category: "commercial" }}
      title="Commercial space in Dubai"
      intro="Offices, retail and warehousing — to rent and to buy, across the free zones and the mainland."
      emptyMessage="No commercial space listed right now."
    />
  );
}
