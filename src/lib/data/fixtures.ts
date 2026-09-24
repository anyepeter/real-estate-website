import type { Area, Agent, Permit, Media, ListingFull } from "./types";

/**
 * ───────────────────────────────────────────────────────────────────────────
 *  FIXTURES — the only file in the codebase that invents data.
 * ───────────────────────────────────────────────────────────────────────────
 *
 *  Shaped exactly as Payload returns at depth 1, so the swap in queries.ts
 *  is a body change rather than a rewrite of every page. Nothing outside
 *  lib/data imports this.
 *
 *  Prices and areas are plausible Dubai figures, not real inventory. Photos
 *  point at the cloned site's stock imagery and inherit its replacement
 *  flag. Permit numbers are obviously fake — real ones come from Trakheesi.
 */

const now = "2026-09-01T00:00:00.000Z";

/* ── agent ─────────────────────────────────────────────────────────────── */

export const agent: Agent = {
  id: 1,
  name: "Terence Tumambang Fon",
  slug: "terence-tumambang",
  brn: "44557",
  brnExpiresAt: "2027-01-30T00:00:00.000Z",
  photo: null,
  languages: ["en", "fr"],
  whatsapp: "9714000000",
  email: "info@example.com",
  bio: "Licensed Dubai broker covering sales and leasing across residential and commercial.",
  updatedAt: now,
  createdAt: now,
};

/* ── areas (slugs match the seed tree) ─────────────────────────────────── */

const mkArea = (
  id: number,
  nameEn: string,
  slugEn: string,
  level: Area["level"],
  lat?: number,
  lng?: number
): Area => ({
  id,
  nameEn,
  nameAr: null,
  slugEn,
  slugAr: null,
  level,
  parent: null,
  lat: lat ?? null,
  lng: lng ?? null,
  updatedAt: now,
  createdAt: now,
});

export const areas: Area[] = [
  mkArea(1, "Dubai", "dubai", "emirate", 25.2048, 55.2708),
  mkArea(2, "Downtown Dubai", "downtown-dubai", "community", 25.1972, 55.2744),
  mkArea(3, "Business Bay", "business-bay", "community", 25.1857, 55.2766),
  mkArea(4, "Dubai Marina", "dubai-marina", "community", 25.0805, 55.1403),
  mkArea(5, "Jumeirah Village Circle", "jumeirah-village-circle", "community", 25.0589, 55.2089),
  mkArea(6, "Arabian Ranches", "arabian-ranches", "community", 25.0516, 55.2672),
  mkArea(7, "Dubai Hills Estate", "dubai-hills-estate", "community", 25.1094, 55.2478),
  mkArea(8, "Dubai International Financial Centre", "difc", "community", 25.2138, 55.2819),
  mkArea(9, "Al Quoz", "al-quoz", "community", 25.1425, 55.2325),
  mkArea(10, "Executive Towers", "executive-towers", "tower", 25.1857, 55.2766),
];

const byArea = (slug: string) => areas.find((a) => a.slugEn === slug)!;

/* ── media ─────────────────────────────────────────────────────────────── */

const mkMedia = (id: number, filename: string, alt: string): Media =>
  ({
    id,
    alt,
    credit: null,
    url: `/images/${filename}`,
    filename,
    mimeType: "image/jpeg",
    width: 1600,
    height: 1067,
    updatedAt: now,
    createdAt: now,
  }) as Media;

const photoSets: Record<string, Media[]> = {
  apartment: [
    mkMedia(1, "arrow-2.jpg", "Sunlit bedroom with a skyline view"),
    mkMedia(2, "arrow-3.jpg", "Dining area in a modern Dubai apartment"),
  ],
  villa: [mkMedia(3, "service-buy.jpg", "Villa exterior with landscaped garden")],
  office: [mkMedia(4, "feature-property.jpg", "Open-plan office floor with city views")],
  warehouse: [mkMedia(5, "feature-development.jpg", "Warehouse unit with loading access")],
};

/* ── permits ───────────────────────────────────────────────────────────── */

const mkPermit = (id: number, number: string, expiresAt: string): Permit => ({
  id,
  number,
  authority: "trakheesi",
  issuedAt: now,
  expiresAt,
  qrUrl: `https://dubailand.gov.ae/permit/${number}`,
  listing: null,
  updatedAt: now,
  createdAt: now,
});

/* ── listings ──────────────────────────────────────────────────────────── */

type Seed = {
  id: number;
  title: string;
  slug: string;
  intent: ListingFull["intent"];
  type: ListingFull["propertyType"];
  beds: number | null;
  baths: number | null;
  sqft: number;
  price: number;
  furnished: NonNullable<ListingFull["furnished"]>;
  area: string;
  photos: keyof typeof photoSets;
  amenities: NonNullable<ListingFull["amenities"]>;
  description: string;
  /** One listing is deliberately lapsed — see queries.ts. */
  permitExpiresAt?: string;
};

const seeds: Seed[] = [
  {
    id: 101,
    title: "1 Bedroom Apartment in Executive Towers",
    slug: "1-bedroom-apartment-executive-towers",
    intent: "rent", type: "apartment", beds: 1, baths: 2, sqft: 880, price: 88000,
    furnished: "unfurnished", area: "executive-towers", photos: "apartment",
    amenities: ["balcony", "parking", "pool", "gym", "metro-nearby"],
    description:
      "Bright one-bedroom on a high floor with canal views, in one of Business Bay's best-connected towers. Walking distance to Business Bay metro.",
  },
  {
    id: 102,
    title: "2 Bedroom Apartment in Business Bay",
    slug: "2-bedroom-apartment-business-bay",
    intent: "rent", type: "apartment", beds: 2, baths: 3, sqft: 1240, price: 135000,
    furnished: "furnished", area: "business-bay", photos: "apartment",
    amenities: ["balcony", "parking", "pool", "gym", "study"],
    description:
      "Fully furnished two-bedroom with a separate study, walk-in wardrobe and unobstructed canal frontage.",
  },
  {
    id: 103,
    title: "Studio Apartment in Jumeirah Village Circle",
    slug: "studio-apartment-jvc",
    intent: "rent", type: "studio", beds: 0, baths: 1, sqft: 480, price: 48000,
    furnished: "partly", area: "jumeirah-village-circle", photos: "apartment",
    amenities: ["parking", "pool", "gym"],
    description:
      "Efficient studio in a quiet residential cluster, with white goods included and covered parking.",
  },
  {
    id: 104,
    title: "1 Bedroom Apartment in Dubai Marina",
    slug: "1-bedroom-apartment-dubai-marina",
    intent: "rent", type: "apartment", beds: 1, baths: 2, sqft: 940, price: 98000,
    furnished: "unfurnished", area: "dubai-marina", photos: "apartment",
    amenities: ["balcony", "parking", "pool", "gym", "sea-view", "metro-nearby"],
    description:
      "Marina-facing one-bedroom with a full-width balcony, two minutes from the tram and the walk.",
  },
  {
    id: 105,
    title: "2 Bedroom Apartment in Downtown Dubai",
    slug: "2-bedroom-apartment-downtown-dubai",
    intent: "buy", type: "apartment", beds: 2, baths: 3, sqft: 1310, price: 2850000,
    furnished: "unfurnished", area: "downtown-dubai", photos: "apartment",
    amenities: ["balcony", "parking", "pool", "gym", "metro-nearby"],
    description:
      "Two-bedroom in the Burj district with fountain-side aspect, handed over and vacant on transfer.",
  },
  {
    id: 106,
    title: "1 Bedroom Apartment in Business Bay",
    slug: "1-bedroom-apartment-business-bay-sale",
    intent: "buy", type: "apartment", beds: 1, baths: 2, sqft: 860, price: 1350000,
    furnished: "unfurnished", area: "business-bay", photos: "apartment",
    amenities: ["balcony", "parking", "gym"],
    description:
      "Tenanted one-bedroom returning a solid yield, ideal for an investor buying into Business Bay.",
  },
  {
    id: 107,
    title: "4 Bedroom Villa in Arabian Ranches",
    slug: "4-bedroom-villa-arabian-ranches",
    intent: "buy", type: "villa", beds: 4, baths: 5, sqft: 3420, price: 6400000,
    furnished: "unfurnished", area: "arabian-ranches", photos: "villa",
    amenities: ["parking", "pool", "maids-room", "study"],
    description:
      "Four-bedroom family villa backing onto landscaped parkland, with a maid's room and private pool.",
  },
  {
    id: 108,
    title: "3 Bedroom Townhouse in Dubai Hills Estate",
    slug: "3-bedroom-townhouse-dubai-hills",
    intent: "buy", type: "townhouse", beds: 3, baths: 4, sqft: 2180, price: 4150000,
    furnished: "unfurnished", area: "dubai-hills-estate", photos: "villa",
    amenities: ["parking", "pool", "study"],
    description:
      "Three-bedroom townhouse on a quiet internal road, a short walk from the park and the school.",
  },
  {
    id: 109,
    title: "Office Space in DIFC",
    slug: "office-space-difc",
    intent: "rent", type: "office", beds: null, baths: 2, sqft: 2400, price: 420000,
    furnished: "unfurnished", area: "difc", photos: "office",
    amenities: ["parking", "metro-nearby"],
    description:
      "Fitted floor plate in the financial district, DIFC-licensed and ready for immediate occupation.",
  },
  {
    id: 110,
    title: "Warehouse in Al Quoz",
    slug: "warehouse-al-quoz",
    intent: "rent", type: "warehouse", beds: null, baths: 2, sqft: 8600, price: 385000,
    furnished: "unfurnished", area: "al-quoz", photos: "warehouse",
    amenities: ["parking"],
    description:
      "Independent warehouse with high eaves, three-phase power and direct loading access off Al Asayel Street.",
  },
  {
    id: 111,
    title: "2 Bedroom Apartment in Dubai Marina",
    slug: "2-bedroom-apartment-dubai-marina-lapsed",
    intent: "rent", type: "apartment", beds: 2, baths: 3, sqft: 1180, price: 142000,
    furnished: "furnished", area: "dubai-marina", photos: "apartment",
    amenities: ["balcony", "parking", "pool", "gym", "sea-view"],
    description:
      "Furnished two-bedroom with marina views. Permit lapsed — used to exercise the compliance filter.",
    permitExpiresAt: "2026-06-30T00:00:00.000Z",
  },
];

export const listings: ListingFull[] = seeds.map((s, i) => ({
  id: s.id,
  title: s.title,
  slugEn: s.slug,
  slugAr: null,
  intent: s.intent,
  propertyType: s.type,
  bedrooms: s.beds,
  bathrooms: s.baths,
  areaSqft: s.sqft,
  price: s.price,
  furnished: s.furnished,
  area: byArea(s.area),
  lat: byArea(s.area).lat,
  lng: byArea(s.area).lng,
  permit: mkPermit(
    900 + i,
    `${71234567 + i}`,
    s.permitExpiresAt ?? "2027-01-30T00:00:00.000Z"
  ),
  agent,
  photos: photoSets[s.photos],
  description: s.description,
  amenities: s.amenities,
  updatedAt: now,
  createdAt: now,
  _status: "published",
}));
