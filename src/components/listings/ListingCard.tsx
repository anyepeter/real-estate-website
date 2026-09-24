import Image from "next/image";
import Link from "next/link";
import type { ListingFull } from "@/lib/data";
import { href, type Locale } from "@/lib/i18n";
import { property } from "@/lib/routes";
import { formatPrice, formatArea, formatBeds, formatBaths, propertyTypeLabels } from "@/lib/format";

/**
 * A single property card.
 *
 * Deliberately a Server Component with no GSAP, no Lenis and no client
 * JavaScript. The marketing page spends the whole 150 kB budget on motion;
 * the pages that have to rank and convert cannot afford to, and a grid of
 * forty of these would multiply any per-card runtime cost by forty.
 */
export default function ListingCard({
  listing,
  lang,
  priority = false,
}: {
  listing: ListingFull;
  lang: Locale;
  /** Set on the first row so the grid's LCP image isn't lazy-loaded. */
  priority?: boolean;
}) {
  const photo = listing.photos[0];
  const beds = formatBeds(listing.bedrooms);
  const baths = formatBaths(listing.bathrooms);
  const size = formatArea(listing.areaSqft, lang);

  return (
    <article className="group">
      <Link
        href={href(lang, property(listing.id, listing.slugEn))}
        className="block"
        prefetch={false}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[#ededed]">
          {photo?.url ? (
            <Image
              src={photo.url}
              alt={photo.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              priority={priority}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          ) : null}

          <span className="absolute left-[1.2rem] top-[1.2rem] rounded-[100px] bg-white/95 px-[1.4rem] py-[0.6rem] text-[1.2rem] font-medium leading-none text-[#151717]">
            {propertyTypeLabels[listing.propertyType]}
          </span>
        </div>

        <div className="pt-[1.6rem]">
          <p className="text-[2rem] font-semibold leading-[1.2] tracking-[-0.01em] md:text-[2.4rem]">
            {formatPrice(listing.price, listing.intent, lang)}
          </p>

          <h3 className="mt-[0.8rem] text-[1.6rem] font-medium leading-[1.35] md:text-[1.8rem]">
            {listing.title}
          </h3>

          <p className="mt-[0.4rem] text-[1.4rem] leading-[1.4] text-[#b3b3b3] md:text-[1.6rem]">
            {listing.area.nameEn}
          </p>

          {(beds || baths || size) && (
            <ul className="mt-[1.2rem] flex flex-wrap items-center gap-x-[1.6rem] gap-y-[0.4rem] text-[1.4rem] leading-[1.4] text-[#383a3a] md:text-[1.6rem]">
              {beds && <li>{beds}</li>}
              {baths && <li>{baths}</li>}
              {size && <li>{size}</li>}
            </ul>
          )}
        </div>
      </Link>

      {/* Required on every advert by RERA, and a genuine trust signal in a
          market where bait listings are common. Not decoration. */}
      {listing.permit && (
        <p className="mt-[1.2rem] border-t border-[rgba(21,23,23,0.1)] pt-[1.2rem] text-[1.2rem] leading-[1.4] text-[#b3b3b3]">
          DLD permit {listing.permit.number}
        </p>
      )}
    </article>
  );
}
