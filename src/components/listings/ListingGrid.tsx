import type { ListingFull } from "@/lib/data";
import type { Locale } from "@/lib/i18n";
import ListingCard from "./ListingCard";

export default function ListingGrid({
  listings,
  lang,
  emptyMessage = "No properties match this search yet.",
}: {
  listings: ListingFull[];
  lang: Locale;
  emptyMessage?: string;
}) {
  if (listings.length === 0) {
    return (
      <div className="border border-[rgba(21,23,23,0.1)] px-[2.4rem] py-[6rem] text-center">
        <p className="text-[1.8rem] leading-[1.4] text-[#383a3a] md:text-[2rem]">
          {emptyMessage}
        </p>
        <p className="mt-[1.2rem] text-[1.5rem] leading-[1.5] text-[#b3b3b3] md:text-[1.6rem]">
          Tell us what you&rsquo;re looking for and we&rsquo;ll go and find it — a good deal of
          Dubai inventory never reaches a portal.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-x-[2.4rem] gap-y-[4rem] md:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing, i) => (
        <li key={listing.id}>
          {/* Only the first row gets priority — beyond the fold, eager
              loading just competes with the LCP image for bandwidth. */}
          <ListingCard listing={listing} lang={lang} priority={i < 3} />
        </li>
      ))}
    </ul>
  );
}
