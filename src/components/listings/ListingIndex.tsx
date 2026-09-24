import { getListings, type ListingFilters } from "@/lib/data";
import type { Locale } from "@/lib/i18n";
import ListingGrid from "./ListingGrid";

/**
 * The shared body behind /buy, /rent and /commercial.
 *
 * These three differ only by filter and copy. Extracting the shell means the
 * permit guarantee, the empty state and the grid behaviour are written once —
 * and when filters and pagination land they land in one place rather than
 * three that have quietly drifted apart.
 */
export default async function ListingIndex({
  lang,
  filters,
  title,
  intro,
  emptyMessage,
}: {
  lang: Locale;
  filters: ListingFilters;
  title: string;
  /** Rendered after the count. The count itself is generated. */
  intro: string;
  emptyMessage: string;
}) {
  const { docs, totalDocs } = await getListings(filters);

  return (
    <section className="py-[6rem] md:py-[10rem]">
      <div className="container">
        <header className="max-w-[80rem]">
          <h1 className="text-[3.6rem] font-medium leading-[1.05] tracking-[-0.02em] md:text-[6.4rem]">
            {title}
          </h1>
          <p className="mt-[1.6rem] text-[1.8rem] leading-[1.5] text-[#383a3a] md:mt-[2.4rem] md:text-[2.2rem]">
            {totalDocs} propert{totalDocs === 1 ? "y" : "ies"} available.{" "}
            <span className="em">{intro}</span>
          </p>
        </header>

        <div className="mt-[4rem] md:mt-[6rem]">
          <ListingGrid listings={docs} lang={lang} emptyMessage={emptyMessage} />
        </div>
      </div>
    </section>
  );
}
