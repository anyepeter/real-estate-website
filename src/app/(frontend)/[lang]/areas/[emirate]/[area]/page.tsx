import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArea, getListings } from "@/lib/data";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/routes";
import ListingGrid from "@/components/listings/ListingGrid";
import { formatPrice } from "@/lib/format";

type Params = { lang: string; emirate: string; area: string };

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { area: slug } = await params;
  const area = await getArea(slug);
  if (!area) return {};

  return {
    title: `${area.nameEn} Area Guide — Property, Prices and What It's Like`,
    description: `What ${area.nameEn} is actually like to live in, what property costs there, and what's available now.`,
  };
}

/**
 * An area guide.
 *
 * Renders with or without inventory — that is the entire point of this
 * lane. The listings block is conditional; the guide, the price context and
 * the FAQ are not, so the page is worth indexing on a month when we hold
 * nothing in that community.
 *
 * The FAQ is not decoration either: FAQPage structured data is a rich
 * result neither Property Finder nor haus & haus ships, and it is the
 * format AI answer engines quote most readily.
 */
export default async function AreaPage({ params }: { params: Promise<Params> }) {
  const { lang, emirate, area: slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;

  const area = await getArea(slug);
  if (!area || area.level === "emirate") notFound();

  const [forSale, forRent] = await Promise.all([
    getListings({ areaSlug: slug, intent: "buy", limit: 3 }),
    getListings({ areaSlug: slug, intent: "rent", limit: 3 }),
  ]);

  const rentPrices = forRent.docs.map((l) => l.price);
  const salePrices = forSale.docs.map((l) => l.price);
  const avg = (xs: number[]) =>
    xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null;

  const avgRent = avg(rentPrices);
  const avgSale = avg(salePrices);

  // Generated from what we actually hold, so the answers cannot drift from
  // the listings below them. Real DLD transaction data replaces the
  // sample-of-our-inventory caveat in Phase 3.
  const faqs = [
    avgRent && {
      q: `What does it cost to rent in ${area.nameEn}?`,
      a: `Across the properties we currently list in ${area.nameEn}, the average asking rent is ${formatPrice(avgRent, "rent")}. Prices move with the building, the floor and the view more than with the community itself.`,
    },
    avgSale && {
      q: `What do properties sell for in ${area.nameEn}?`,
      a: `Our current ${area.nameEn} sale listings average ${formatPrice(avgSale, "buy")}. Recorded DLD transaction prices are the number that matters when you make an offer, and we will show you those before you do.`,
    },
    {
      q: `Is ${area.nameEn} a good place to live?`,
      a: `It depends entirely on the commute, the school run and whether you want quiet or convenience. We would rather talk it through than sell you a community that does not fit — tell us how you actually live and we will say if ${area.nameEn} suits.`,
    },
  ].filter(Boolean) as { q: string; a: string }[];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const placeJsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: area.nameEn,
    url: `${siteUrl}${href(locale, `/areas/${emirate}/${slug}`)}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: area.nameEn,
      addressRegion: "Dubai",
      addressCountry: "AE",
    },
    ...(area.lat && area.lng
      ? { geo: { "@type": "GeoCoordinates", latitude: area.lat, longitude: area.lng } }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([placeJsonLd, faqJsonLd]) }}
      />

      <section className="py-[6rem] md:py-[10rem]">
        <div className="container">
          <nav className="mb-[2.4rem] text-[1.4rem] leading-[1.4] text-[#b3b3b3] md:text-[1.6rem]">
            <Link href={href(locale, routes.areas)} className="hover:underline" prefetch={false}>
              Areas
            </Link>
            <span className="mx-[0.8rem]">/</span>
            <span className="text-[#151717]">{area.nameEn}</span>
          </nav>

          <header className="max-w-[80rem]">
            <h1 className="text-[3.6rem] font-medium leading-[1.05] tracking-[-0.02em] md:text-[6.4rem]">
              Living in {area.nameEn}
            </h1>
          </header>

          {(avgRent || avgSale) && (
            <dl className="mt-[3rem] grid grid-cols-1 gap-[2rem] border-t border-[rgba(21,23,23,0.1)] pt-[3rem] md:mt-[4rem] md:grid-cols-3">
              {avgRent && (
                <div>
                  <dt className="text-[1.3rem] uppercase leading-[1.4] tracking-[0.06em] text-[#b3b3b3]">
                    Average asking rent
                  </dt>
                  <dd className="mt-[0.6rem] text-[2.2rem] font-medium leading-[1.2] md:text-[2.8rem]">
                    {formatPrice(avgRent, "rent", locale)}
                  </dd>
                </div>
              )}
              {avgSale && (
                <div>
                  <dt className="text-[1.3rem] uppercase leading-[1.4] tracking-[0.06em] text-[#b3b3b3]">
                    Average asking price
                  </dt>
                  <dd className="mt-[0.6rem] text-[2.2rem] font-medium leading-[1.2] md:text-[2.8rem]">
                    {formatPrice(avgSale, "buy", locale)}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-[1.3rem] uppercase leading-[1.4] tracking-[0.06em] text-[#b3b3b3]">
                  Available now
                </dt>
                <dd className="mt-[0.6rem] text-[2.2rem] font-medium leading-[1.2] tabular-nums md:text-[2.8rem]">
                  {forSale.totalDocs + forRent.totalDocs}
                </dd>
              </div>
            </dl>
          )}

          {forRent.docs.length > 0 && (
            <div className="mt-[5rem] md:mt-[8rem]">
              <h2 className="text-[2.4rem] font-medium leading-[1.2] md:text-[3.2rem]">
                To rent in {area.nameEn}
              </h2>
              <div className="mt-[2.4rem] md:mt-[3.2rem]">
                <ListingGrid listings={forRent.docs} lang={locale} />
              </div>
            </div>
          )}

          {forSale.docs.length > 0 && (
            <div className="mt-[5rem] md:mt-[8rem]">
              <h2 className="text-[2.4rem] font-medium leading-[1.2] md:text-[3.2rem]">
                For sale in {area.nameEn}
              </h2>
              <div className="mt-[2.4rem] md:mt-[3.2rem]">
                <ListingGrid listings={forSale.docs} lang={locale} />
              </div>
            </div>
          )}

          <div className="mt-[5rem] max-w-[75ch] md:mt-[8rem]">
            <h2 className="text-[2.4rem] font-medium leading-[1.2] md:text-[3.2rem]">
              Common questions
            </h2>
            <dl className="mt-[2.4rem] border-t border-[rgba(21,23,23,0.1)]">
              {faqs.map((f) => (
                <div key={f.q} className="border-b border-[rgba(21,23,23,0.1)] py-[2.4rem]">
                  <dt className="text-[1.9rem] font-medium leading-[1.3] md:text-[2.1rem]">
                    {f.q}
                  </dt>
                  <dd className="mt-[0.8rem] text-[1.7rem] leading-[1.6] text-[#383a3a] md:text-[1.85rem]">
                    {f.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
