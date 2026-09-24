import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import ListingIndex from "@/components/listings/ListingIndex";

export const metadata: Metadata = {
  title: "Property for Sale in Dubai",
  description:
    "Apartments, villas and townhouses for sale across Dubai. Every listing DLD-permitted, with current prices and real availability.",
};

export default async function BuyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <ListingIndex
      lang={lang as Locale}
      filters={{ intent: "buy", category: "residential" }}
      title="Property for sale in Dubai"
      intro="Every one carries a valid DLD advertising permit — if it’s here, it’s genuinely on the market."
      emptyMessage="Nothing for sale on the site right now."
    />
  );
}
