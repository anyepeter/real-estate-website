import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAreas, getAreaCounts } from "@/lib/data";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { area as areaRoute } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Dubai Areas & Communities",
  description:
    "Where to live in Dubai, community by community — what each area is actually like, what it costs, and what's available now.",
};

/**
 * The index of the inventory-independent lane.
 *
 * Area pages are the half of the SEO strategy that does not scale with how
 * many properties we happen to hold this month — the half a one-person
 * brokerage can genuinely compete on against a portal. So the index lists
 * every community we cover, not only the ones with live listings.
 */
export default async function AreasPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;

  const [areas, counts] = await Promise.all([getAreas(), getAreaCounts()]);
  const communities = areas.filter((a) => a.level === "community");

  return (
    <section className="py-[6rem] md:py-[10rem]">
      <div className="container">
        <header className="max-w-[80rem]">
          <h1 className="text-[3.6rem] font-medium leading-[1.05] tracking-[-0.02em] md:text-[6.4rem]">
            Dubai, community by community
          </h1>
          <p className="mt-[1.6rem] text-[1.8rem] leading-[1.5] text-[#383a3a] md:mt-[2.4rem] md:text-[2.2rem]">
            What each area is actually like to live in.{" "}
            <span className="em">
              Written from the transaction record and from having walked them, not from a
              developer brochure.
            </span>
          </p>
        </header>

        <ul className="mt-[4rem] grid grid-cols-1 border-t border-[rgba(21,23,23,0.1)] md:mt-[6rem] md:grid-cols-2">
          {communities.map((a) => {
            const count = counts[a.slugEn] ?? 0;
            return (
              <li key={a.id} className="border-b border-[rgba(21,23,23,0.1)]">
                <Link
                  href={href(locale, areaRoute("dubai", a.slugEn))}
                  prefetch={false}
                  className="group flex items-baseline justify-between gap-[2rem] py-[2.4rem] pr-[1rem] transition-colors hover:text-[#b3b3b3] md:py-[3rem]"
                >
                  <span className="text-[2.2rem] font-medium leading-[1.2] tracking-[-0.01em] md:text-[3rem]">
                    {a.nameEn}
                  </span>
                  <span className="shrink-0 text-[1.4rem] leading-[1.4] text-[#b3b3b3] tabular-nums md:text-[1.6rem]">
                    {count > 0 ? `${count} available` : "Guide"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
