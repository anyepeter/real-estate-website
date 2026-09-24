import type { Area } from "@/lib/data";
import type { SearchParams } from "@/lib/data/params";

/**
 * Filters.
 *
 * A plain <form method="get"> of native selects. No client JavaScript, no
 * router push, no state — submitting navigates, and the server renders the
 * filtered page.
 *
 * Deliberately NOT shadcn's Select. That one is a Radix listbox: prettier,
 * but it renders a div tree rather than a form control, needs JS to work at
 * all, and needs extra wiring to submit with a form. A native select
 * submits, keyboard-navigates, and opens the platform picker on mobile —
 * where most of this traffic is — for zero bytes. The styling gap is worth
 * less than the reliability.
 */

const SELECT_CLASS =
  "h-[4.8rem] w-full appearance-none rounded-none border border-[rgba(21,23,23,0.25)] bg-white bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 12 8%22 fill=%22none%22 stroke=%22%23151717%22 stroke-width=%221.5%22><path d=%22M1 1l5 5 5-5%22/></svg>')] bg-[length:1.2rem] bg-[right_1.4rem_center] bg-no-repeat px-[1.4rem] pr-[3.6rem] text-[1.5rem] leading-none md:text-[1.6rem]";

const LABEL_CLASS =
  "mb-[0.6rem] block text-[1.2rem] uppercase leading-[1.4] tracking-[0.06em] text-[#b3b3b3]";

function one(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default function FilterBar({
  action,
  searchParams,
  areas,
  showIntent = false,
  /** Price steps differ by an order of magnitude between sale and rent. */
  intent = "rent",
}: {
  /** Where the form submits. Locale-prefixed. */
  action: string;
  searchParams: SearchParams;
  areas: Area[];
  showIntent?: boolean;
  intent?: "buy" | "rent";
}) {
  const sp = searchParams;
  const communities = areas.filter((a) => a.level === "community");

  const priceSteps =
    intent === "buy"
      ? [500_000, 1_000_000, 2_000_000, 3_000_000, 5_000_000, 10_000_000]
      : [40_000, 60_000, 80_000, 120_000, 200_000, 400_000];

  const fmt = (n: number) =>
    n >= 1_000_000 ? `${n / 1_000_000}M` : `${n / 1000}K`;

  return (
    <form
      method="get"
      action={action}
      className="border-y border-[rgba(21,23,23,0.12)] py-[2.4rem]"
    >
      <div className="grid grid-cols-2 gap-[1.2rem] md:grid-cols-6 md:gap-[1.6rem]">
        {showIntent && (
          <div>
            <label htmlFor="f-intent" className={LABEL_CLASS}>
              Buy or rent
            </label>
            <select id="f-intent" name="intent" defaultValue={one(sp.intent) ?? ""} className={SELECT_CLASS}>
              <option value="">Either</option>
              <option value="buy">For sale</option>
              <option value="rent">To rent</option>
            </select>
          </div>
        )}

        <div>
          <label htmlFor="f-area" className={LABEL_CLASS}>
            Area
          </label>
          <select id="f-area" name="area" defaultValue={one(sp.area) ?? ""} className={SELECT_CLASS}>
            <option value="">Anywhere</option>
            {communities.map((a) => (
              <option key={a.id} value={a.slugEn}>
                {a.nameEn}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="f-type" className={LABEL_CLASS}>
            Type
          </label>
          <select id="f-type" name="type" defaultValue={one(sp.type) ?? ""} className={SELECT_CLASS}>
            <option value="">Any</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="townhouse">Townhouse</option>
            <option value="penthouse">Penthouse</option>
            <option value="studio">Studio</option>
            <option value="office">Office</option>
            <option value="retail">Retail</option>
            <option value="warehouse">Warehouse</option>
          </select>
        </div>

        <div>
          <label htmlFor="f-beds" className={LABEL_CLASS}>
            Beds
          </label>
          <select id="f-beds" name="beds" defaultValue={one(sp.beds) ?? ""} className={SELECT_CLASS}>
            <option value="">Any</option>
            <option value="0">Studio</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5+</option>
          </select>
        </div>

        <div>
          <label htmlFor="f-min" className={LABEL_CLASS}>
            Min price
          </label>
          <select id="f-min" name="min" defaultValue={one(sp.min) ?? ""} className={SELECT_CLASS}>
            <option value="">No min</option>
            {priceSteps.map((p) => (
              <option key={p} value={p}>
                {fmt(p)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="f-max" className={LABEL_CLASS}>
            Max price
          </label>
          <select id="f-max" name="max" defaultValue={one(sp.max) ?? ""} className={SELECT_CLASS}>
            <option value="">No max</option>
            {priceSteps.map((p) => (
              <option key={p} value={p}>
                {fmt(p)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-[1.6rem] flex flex-wrap items-center gap-[1.2rem]">
        <button
          type="submit"
          className="rounded-[100px] bg-[#151717] px-[2.8rem] py-[1.3rem] text-[1.5rem] font-medium leading-none text-white transition-transform duration-300 hover:[transition:transform_.7s_cubic-bezier(.34,3.56,.64,1)] hover:scale-x-[1.02] md:text-[1.6rem]"
        >
          Show properties
        </button>

        {/* A link rather than a reset button: it clears by navigating to the
            bare path, which is also the canonical URL. */}
        <a
          href={action}
          className="text-[1.5rem] leading-none text-[#b3b3b3] underline transition-colors hover:text-[#151717]"
        >
          Clear
        </a>

        <div className="ml-auto flex items-center gap-[1rem]">
          <label htmlFor="f-sort" className="text-[1.3rem] leading-none text-[#b3b3b3]">
            Sort
          </label>
          <select
            id="f-sort"
            name="sort"
            defaultValue={one(sp.sort) ?? "newest"}
            className="h-[3.6rem] appearance-none rounded-none border border-[rgba(21,23,23,0.25)] bg-white px-[1.2rem] text-[1.4rem] leading-none"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price, low to high</option>
            <option value="price-desc">Price, high to low</option>
          </select>
        </div>
      </div>
    </form>
  );
}
