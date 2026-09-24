import type { ListingFull } from "@/lib/data";
import { brand } from "@/lib/brand";
import { propertyTypeLabels } from "@/lib/format";

/**
 * Structured data for a single property.
 *
 * This is the gap in the competitor set. haus & haus ships ten JSON-LD
 * entities across its entire homepage and none at listing level; Property
 * Finder ships hundreds per page and takes the rich results. It is also
 * what lets an AI answer engine read our inventory without guessing, which
 * matters more each quarter.
 *
 * The permit number doubles as the offer's `identifier` — the same value
 * that RERA requires on the page is the one that makes the offer uniquely
 * addressable to a crawler. One field, two jobs.
 */

/** schema.org has no "villa" or "warehouse"; map to the nearest real type. */
const SCHEMA_TYPE: Record<ListingFull["propertyType"], string> = {
  apartment: "Apartment",
  studio: "Apartment",
  penthouse: "Apartment",
  villa: "House",
  townhouse: "House",
  office: "Place",
  retail: "Place",
  warehouse: "Place",
};

/**
 * `siteUrl` is required rather than optional because image paths are stored
 * relative and structured data needs them absolute — a crawler has no base
 * to resolve "/images/x.jpg" against, so a relative src here silently means
 * no image in the rich result.
 */
export function listingJsonLd(listing: ListingFull, url: string, siteUrl: string) {
  const isResidential = listing.bedrooms !== null && listing.bedrooms !== undefined;
  const absolute = (path: string) => (path.startsWith("http") ? path : `${siteUrl}${path}`);

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: listing.title,
    url,
    datePosted: listing.createdAt,
    description: listing.description ?? undefined,
    image: listing.photos
      .map((p) => p.url)
      .filter((u): u is string => Boolean(u))
      .map(absolute),

    offers: {
      "@type": "Offer",
      price: listing.price,
      priceCurrency: "AED",
      availability: "https://schema.org/InStock",
      // Rentals are quoted yearly here; without the unit the number is
      // meaningless to anything parsing it.
      ...(listing.intent === "rent"
        ? {
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: listing.price,
              priceCurrency: "AED",
              unitCode: "ANN",
            },
          }
        : {}),
      ...(listing.permit ? { identifier: listing.permit.number } : {}),
    },

    about: {
      "@type": SCHEMA_TYPE[listing.propertyType],
      name: `${propertyTypeLabels[listing.propertyType]} in ${listing.area.nameEn}`,
      ...(isResidential
        ? {
            numberOfBedrooms: listing.bedrooms,
            numberOfBathroomsTotal: listing.bathrooms ?? undefined,
          }
        : {}),
      ...(listing.areaSqft
        ? {
            floorSize: {
              "@type": "QuantitativeValue",
              value: listing.areaSqft,
              unitCode: "FTK", // square foot
            },
          }
        : {}),
      address: {
        "@type": "PostalAddress",
        addressLocality: listing.area.nameEn,
        addressRegion: brand.legal.emirate,
        addressCountry: "AE",
      },
      ...(listing.lat && listing.lng
        ? {
            geo: {
              "@type": "GeoCoordinates",
              latitude: listing.lat,
              longitude: listing.lng,
            },
          }
        : {}),
      ...(listing.amenities?.length
        ? {
            amenityFeature: listing.amenities.map((a) => ({
              "@type": "LocationFeatureSpecification",
              name: a.replace(/-/g, " "),
              value: true,
            })),
          }
        : {}),
    },

    provider: {
      "@type": "RealEstateAgent",
      name: brand.legal.name,
      identifier: brand.legal.orn,
      areaServed: brand.legal.emirate,
    },
  };
}
