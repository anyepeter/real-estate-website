import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import ListingIndex from "@/components/listings/ListingIndex";

export const metadata: Metadata = {
  title: "Property for Rent in Dubai",
  description:
    "Apartments, villas and studios for rent across Dubai. Yearly prices, current availability, every listing DLD-permitted.",
};

export default async function RentPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <ListingIndex
      lang={lang as Locale}
      filters={{ intent: "rent", category: "residential" }}
      title="Property for rent in Dubai"
      intro="Prices are yearly, as they are quoted here — and if a listing is on the site, it is still on the market."
      emptyMessage="Nothing available to rent on the site right now."
    />
  );
}
