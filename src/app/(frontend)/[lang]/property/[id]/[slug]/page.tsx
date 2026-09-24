import type { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { getListing } from "@/lib/data";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { property, routes } from "@/lib/routes";
import { brand } from "@/lib/brand";
import { listingJsonLd } from "@/lib/seo/listingJsonLd";
import {
  formatPrice, formatArea, formatBeds, formatBaths, propertyTypeLabels,
} from "@/lib/format";
import { ButtonLink } from "@/components/ui/button";

type Params = { lang: string; id: string; slug: string };

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { lang, id } = await params;
  const listing = await getListing(Number(id));
  if (!listing) return {};

  const canonical = `${siteUrl}${href(lang as Locale, property(listing.id, listing.slugEn))}`;

  return {
    title: listing.title,
    description:
      listing.description?.slice(0, 155) ??
      `${listing.title} — ${formatPrice(listing.price, listing.intent)}.`,
    alternates: { canonical },
    openGraph: {
      title: listing.title,
      type: "website",
      url: canonical,
      images: listing.photos[0]?.url ? [`${siteUrl}${listing.photos[0].url}`] : [],
    },
  };
}

export default async function PropertyPage({ params }: { params: Promise<Params> }) {
  const { lang, id, slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;

  const listing = await getListing(Number(id));
  // getListing already filters out unpermitted and lapsed listings, so a
  // miss here covers "never existed" and "no longer legal to advertise"
  // with the same 404. That is the correct outcome for both.
  if (!listing) notFound();

  // The id is canonical; the slug is decoration. If someone arrives on a
  // stale slug after a retitle, send them to the current one rather than
  // serving the same property on two URLs.
  if (slug !== listing.slugEn) {
    redirect(href(locale, property(listing.id, listing.slugEn)));
  }

  const beds = formatBeds(listing.bedrooms);
  const baths = formatBaths(listing.bathrooms);
  const size = formatArea(listing.areaSqft, locale);
  const canonical = `${siteUrl}${href(locale, property(listing.id, listing.slugEn))}`;

  const specs = [
    { label: "Type", value: propertyTypeLabels[listing.propertyType] },
    beds ? { label: "Bedrooms", value: beds } : null,
    baths ? { label: "Bathrooms", value: baths } : null,
    size ? { label: "Size", value: size } : null,
    listing.furnished ? { label: "Furnishing", value: listing.furnished } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(listingJsonLd(listing, canonical, siteUrl)),
        }}
      />

      <article className="py-[4rem] md:py-[8rem]">
        <div className="container">
          {/* gallery */}
          <div className="grid grid-cols-1 gap-[0.8rem] md:grid-cols-3">
            {listing.photos.slice(0, 3).map((photo, i) => (
              <div
                key={photo.id}
                className={
                  i === 0
                    ? "relative aspect-[4/3] overflow-hidden bg-[#ededed] md:col-span-2 md:aspect-[16/10]"
                    : "relative hidden aspect-[4/3] overflow-hidden bg-[#ededed] md:block"
                }
              >
                <Image
                  src={photo.url!}
                  alt={photo.alt}
                  fill
                  sizes={i === 0 ? "(max-width: 768px) 100vw, 66vw" : "33vw"}
                  priority={i === 0}
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="mt-[3rem] grid grid-cols-1 gap-[4rem] md:mt-[5rem] md:grid-cols-[1fr_36rem] md:gap-[6rem]">
            {/* main */}
            <div>
              <p className="text-[1.5rem] leading-[1.4] text-[#b3b3b3] md:text-[1.6rem]">
                {listing.area.nameEn}
              </p>
              <h1 className="mt-[0.8rem] text-[3rem] font-medium leading-[1.1] tracking-[-0.02em] md:text-[4.4rem]">
                {listing.title}
              </h1>
              <p className="mt-[1.6rem] text-[2.8rem] font-semibold leading-[1.1] tracking-[-0.01em] md:text-[3.6rem]">
                {formatPrice(listing.price, listing.intent, locale)}
              </p>

              <dl className="mt-[3rem] grid grid-cols-2 gap-[2rem] border-t border-[rgba(21,23,23,0.1)] pt-[3rem] md:grid-cols-3">
                {specs.map((s) => (
                  <div key={s.label}>
                    <dt className="text-[1.3rem] uppercase leading-[1.4] tracking-[0.06em] text-[#b3b3b3]">
                      {s.label}
                    </dt>
                    <dd className="mt-[0.4rem] text-[1.7rem] font-medium capitalize leading-[1.4] md:text-[1.9rem]">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {listing.description && (
                <div className="mt-[3rem] border-t border-[rgba(21,23,23,0.1)] pt-[3rem]">
                  <h2 className="text-[2rem] font-medium leading-[1.2] md:text-[2.4rem]">
                    About this property
                  </h2>
                  <p className="mt-[1.6rem] max-w-[65ch] text-[1.7rem] leading-[1.6] text-[#383a3a] md:text-[1.9rem]">
                    {listing.description}
                  </p>
                </div>
              )}

              {listing.amenities?.length ? (
                <div className="mt-[3rem] border-t border-[rgba(21,23,23,0.1)] pt-[3rem]">
                  <h2 className="text-[2rem] font-medium leading-[1.2] md:text-[2.4rem]">
                    Amenities
                  </h2>
                  <ul className="mt-[1.6rem] flex flex-wrap gap-[0.8rem]">
                    {listing.amenities.map((a) => (
                      <li
                        key={a}
                        className="rounded-[100px] border border-[rgba(21,23,23,0.15)] px-[1.6rem] py-[0.8rem] text-[1.4rem] capitalize leading-none md:text-[1.5rem]"
                      >
                        {a.replace(/-/g, " ")}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            {/* sidebar: agent + compliance */}
            <aside className="md:sticky md:top-[10rem] md:self-start">
              <div className="border border-[rgba(21,23,23,0.15)] p-[2.4rem]">
                <p className="text-[1.3rem] uppercase leading-[1.4] tracking-[0.06em] text-[#b3b3b3]">
                  Your broker
                </p>
                <p className="mt-[0.8rem] text-[2rem] font-medium leading-[1.2] md:text-[2.2rem]">
                  {listing.agent.name}
                </p>
                <p className="mt-[0.4rem] text-[1.4rem] leading-[1.4] text-[#b3b3b3]">
                  BRN {listing.agent.brn}
                </p>

                <div className="mt-[2rem] flex flex-col gap-[1rem]">
                  <ButtonLink href={href(locale, routes.contact)} icon={false}>
                    Request a viewing
                  </ButtonLink>
                  {listing.agent.whatsapp && (
                    <a
                      href={`https://wa.me/${listing.agent.whatsapp}?text=${encodeURIComponent(
                        `Hi, I'm interested in ${listing.title} (ref ${listing.id}).`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-[100px] border border-[rgba(21,23,23,0.3)] px-[2.4rem] py-[1.4rem] text-center text-[1.6rem] font-medium leading-[1.5] transition-colors hover:bg-[#ededed] md:text-[1.8rem]"
                    >
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>

              {/* Legally required on every advert, and the thing that
                  separates a real listing from a bait one. */}
              {listing.permit && (
                <div className="mt-[1.6rem] border border-[rgba(21,23,23,0.15)] bg-[#f1f1f1] p-[2.4rem]">
                  <p className="text-[1.3rem] uppercase leading-[1.4] tracking-[0.06em] text-[#b3b3b3]">
                    DLD verified
                  </p>
                  <p className="mt-[0.8rem] text-[1.6rem] font-medium leading-[1.4]">
                    Permit {listing.permit.number}
                  </p>
                  <p className="mt-[0.4rem] text-[1.4rem] leading-[1.5] text-[#383a3a]">
                    {brand.legal.name} · ORN {brand.legal.orn}
                  </p>
                  {listing.permit.qrUrl && (
                    <a
                      href={listing.permit.qrUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-[1.2rem] inline-block text-[1.4rem] leading-[1.4] underline"
                    >
                      Verify with Dubai Land Department
                    </a>
                  )}
                </div>
              )}
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}
