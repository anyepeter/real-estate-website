import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getListings } from "@/lib/data";
import { isLocale, type Locale } from "@/lib/i18n";
import ListingGrid from "@/components/listings/ListingGrid";

export const metadata: Metadata = {
  title: "Property for Sale in Dubai",
  description:
    "Apartments, villas and townhouses for sale across Dubai. Every listing DLD-permitted, with current prices and real availability.",
};

export default async function BuyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;

  const { docs, totalDocs } = await getListings({ intent: "buy" });

  return (
    <section className="py-[6rem] md:py-[10rem]">
      <div className="container">
        <header className="max-w-[80rem]">
          <h1 className="text-[3.6rem] font-medium leading-[1.05] tracking-[-0.02em] md:text-[6.4rem]">
            Property for sale in Dubai
          </h1>
          <p className="mt-[1.6rem] text-[1.8rem] leading-[1.5] text-[#383a3a] md:mt-[2.4rem] md:text-[2.2rem]">
            {totalDocs} propert{totalDocs === 1 ? "y" : "ies"} available.{" "}
            <span className="em">
              Every one carries a valid DLD advertising permit — if it&rsquo;s here, it&rsquo;s
              genuinely on the market.
            </span>
          </p>
        </header>

        <div className="mt-[4rem] md:mt-[6rem]">
          <ListingGrid
            listings={docs}
            lang={locale}
            emptyMessage="Nothing for sale on the site right now."
          />
        </div>
      </div>
    </section>
  );
}
