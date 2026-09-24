import { getListings, getAreas, type ListingFilters } from "@/lib/data";
import { parseFilters, isFiltered, withParam, type SearchParams } from "@/lib/data/params";
import type { Locale } from "@/lib/i18n";
import ListingGrid from "./ListingGrid";
import FilterBar from "./FilterBar";

/**
 * The shared body behind /buy, /rent, /commercial and /search.
 *
 * `baseFilters` are fixed by the route — /rent is always intent: rent —
 * and the visitor's query string narrows within them. That order matters:
 * ?intent=buy on /rent must not turn it into a sale page, so the route's
 * filters are applied last and win.
 */
export default async function ListingIndex({
  lang,
  baseFilters,
  searchParams,
  action,
  title,
  intro,
  emptyMessage,
  showIntentFilter = false,
}: {
  lang: Locale;
  baseFilters: ListingFilters;
  searchParams: SearchParams;
  /** Where the filter form submits — the route's own path, locale-prefixed. */
  action: string;
  title: string;
  intro: string;
  emptyMessage: string;
  showIntentFilter?: boolean;
}) {
  const userFilters = parseFilters(searchParams);
  const filters: ListingFilters = { ...userFilters, ...baseFilters };

  const [{ docs, totalDocs, page, totalPages, hasNextPage, hasPrevPage }, areas] =
    await Promise.all([getListings(filters), getAreas()]);

  const filtered = isFiltered(searchParams);

  return (
    <section className="py-[6rem] md:py-[10rem]">
      <div className="container">
        <header className="max-w-[80rem]">
          <h1 className="text-[3.6rem] font-medium leading-[1.05] tracking-[-0.02em] md:text-[6.4rem]">
            {title}
          </h1>
          <p className="mt-[1.6rem] text-[1.8rem] leading-[1.5] text-[#383a3a] md:mt-[2.4rem] md:text-[2.2rem]">
            {totalDocs} propert{totalDocs === 1 ? "y" : "ies"}
            {filtered ? " match" : " available"}
            {filtered && totalDocs === 1 ? "es" : ""}.{" "}
            <span className="em">{intro}</span>
          </p>
        </header>

        <div className="mt-[3rem] md:mt-[4rem]">
          <FilterBar
            action={action}
            searchParams={searchParams}
            areas={areas}
            showIntent={showIntentFilter}
            intent={baseFilters.intent ?? userFilters.intent ?? "rent"}
          />
        </div>

        <div className="mt-[4rem] md:mt-[5rem]">
          <ListingGrid listings={docs} lang={lang} emptyMessage={emptyMessage} />
        </div>

        {totalPages > 1 && (
          <nav
            aria-label="Pagination"
            className="mt-[4rem] flex items-center justify-between border-t border-[rgba(21,23,23,0.12)] pt-[2.4rem] md:mt-[6rem]"
          >
            {hasPrevPage ? (
              <a
                href={`${action}${withParam(searchParams, "page", String(page - 1))}`}
                rel="prev"
                className="text-[1.6rem] leading-none underline md:text-[1.8rem]"
              >
                Previous
              </a>
            ) : (
              <span />
            )}

            <span className="text-[1.4rem] leading-none text-[#b3b3b3] tabular-nums md:text-[1.6rem]">
              Page {page} of {totalPages}
            </span>

            {hasNextPage ? (
              <a
                href={`${action}${withParam(searchParams, "page", String(page + 1))}`}
                rel="next"
                className="text-[1.6rem] leading-none underline md:text-[1.8rem]"
              >
                Next
              </a>
            ) : (
              <span />
            )}
          </nav>
        )}
      </div>
    </section>
  );
}
