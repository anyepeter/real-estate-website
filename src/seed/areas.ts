/**
 * The Dubai location tree.
 *
 * This is the spine of the whole SEO engine: landing pages are generated
 * from area × type × bedrooms, and the thin-content gate counts live
 * listings per node before letting a page exist. Get the tree wrong and
 * every generated URL inherits the mistake, so it is seeded from a reviewed
 * list rather than accumulated ad hoc from whatever a feed happens to say.
 *
 * Scope is deliberate, not exhaustive. Dubai has hundreds of registered
 * communities; these are the ones a brokerage actually transacts in, plus
 * the commercial and workspace areas both competitors barely cover. Towers
 * are only listed where we are likely to hold repeat inventory — that is
 * where Property Finder makes its money (exact-match pages like "2 bed in
 * Executive Towers") and it is the cheapest traffic on the site.
 *
 * ── Arabic names ──────────────────────────────────────────────────────
 * Filled in only where confident. A wrong Arabic name reads as careless to
 * exactly the audience the Arabic rollout is meant to win, so the rest are
 * deliberately null and need a native speaker before Phase 3. Do not
 * machine-translate them into place: a null is honest, a bad name is not.
 *
 * Coordinates are approximate community centroids — good enough for map
 * bounds and "near this area", not for anything that needs a real boundary.
 * Polygons come with PostGIS in Phase 2.
 */

export type SeedArea = {
  nameEn: string;
  nameAr?: string;
  slugEn: string;
  slugAr?: string;
  lat?: number;
  lng?: number;
  /** Towers or districts sitting directly under this community. */
  children?: SeedArea[];
};

export const dubai: SeedArea = {
  nameEn: "Dubai",
  nameAr: "دبي",
  slugEn: "dubai",
  slugAr: "دبي",
  lat: 25.2048,
  lng: 55.2708,
  children: [
    {
      nameEn: "Downtown Dubai",
      nameAr: "وسط مدينة دبي",
      slugEn: "downtown-dubai",
      lat: 25.1972,
      lng: 55.2744,
      children: [
        { nameEn: "Burj Khalifa", slugEn: "burj-khalifa" },
        { nameEn: "The Address Downtown", slugEn: "address-downtown" },
        { nameEn: "Boulevard Point", slugEn: "boulevard-point" },
        { nameEn: "Opera District", slugEn: "opera-district" },
      ],
    },
    {
      nameEn: "Business Bay",
      nameAr: "الخليج التجاري",
      slugEn: "business-bay",
      lat: 25.1857,
      lng: 55.2766,
      children: [
        { nameEn: "Executive Towers", slugEn: "executive-towers" },
        { nameEn: "Bay Square", slugEn: "bay-square" },
        { nameEn: "The Binary Tower", slugEn: "binary-tower" },
        { nameEn: "Churchill Towers", slugEn: "churchill-towers" },
      ],
    },
    {
      nameEn: "Dubai Marina",
      nameAr: "دبي مارينا",
      slugEn: "dubai-marina",
      lat: 25.0805,
      lng: 55.1403,
      children: [
        { nameEn: "Marina Gate", slugEn: "marina-gate" },
        { nameEn: "Cayan Tower", slugEn: "cayan-tower" },
        { nameEn: "Princess Tower", slugEn: "princess-tower" },
        { nameEn: "Marina Promenade", slugEn: "marina-promenade" },
      ],
    },
    {
      nameEn: "Jumeirah Beach Residence",
      nameAr: "جميرا بيتش ريزيدنس",
      slugEn: "jumeirah-beach-residence",
      lat: 25.0785,
      lng: 55.1336,
    },
    {
      nameEn: "Palm Jumeirah",
      nameAr: "نخلة جميرا",
      slugEn: "palm-jumeirah",
      lat: 25.1124,
      lng: 55.139,
      children: [
        { nameEn: "The Crescent", slugEn: "the-crescent" },
        { nameEn: "Shoreline Apartments", slugEn: "shoreline-apartments" },
        { nameEn: "Golden Mile", slugEn: "golden-mile" },
      ],
    },
    {
      nameEn: "Jumeirah Village Circle",
      nameAr: "قرية جميرا الدائرية",
      slugEn: "jumeirah-village-circle",
      lat: 25.0589,
      lng: 55.2089,
    },
    {
      nameEn: "Jumeirah Lake Towers",
      nameAr: "أبراج بحيرات جميرا",
      slugEn: "jumeirah-lake-towers",
      lat: 25.0693,
      lng: 55.1424,
    },
    {
      nameEn: "Dubai International Financial Centre",
      nameAr: "مركز دبي المالي العالمي",
      slugEn: "difc",
      lat: 25.2138,
      lng: 55.2819,
    },
    {
      nameEn: "Dubai Hills Estate",
      slugEn: "dubai-hills-estate",
      lat: 25.1094,
      lng: 55.2478,
    },
    {
      nameEn: "Dubai Creek Harbour",
      slugEn: "dubai-creek-harbour",
      lat: 25.2048,
      lng: 55.3479,
    },
    { nameEn: "Bluewaters Island", slugEn: "bluewaters-island", lat: 25.0785, lng: 55.1216 },
    { nameEn: "City Walk", slugEn: "city-walk", lat: 25.2048, lng: 55.2612 },
    { nameEn: "Arabian Ranches", slugEn: "arabian-ranches", lat: 25.0516, lng: 55.2672 },
    { nameEn: "Emirates Hills", nameAr: "تلال الإمارات", slugEn: "emirates-hills", lat: 25.0691, lng: 55.1704 },
    { nameEn: "The Greens", slugEn: "the-greens", lat: 25.0977, lng: 55.1712 },
    { nameEn: "The Views", slugEn: "the-views", lat: 25.0932, lng: 55.1637 },
    { nameEn: "Al Barsha", nameAr: "البرشاء", slugEn: "al-barsha", lat: 25.1107, lng: 55.1964 },
    { nameEn: "Al Furjan", nameAr: "الفرجان", slugEn: "al-furjan", lat: 25.0272, lng: 55.1459 },
    { nameEn: "Discovery Gardens", slugEn: "discovery-gardens", lat: 25.0424, lng: 55.1391 },
    { nameEn: "Dubai Silicon Oasis", nameAr: "واحة دبي للسيليكون", slugEn: "dubai-silicon-oasis", lat: 25.1279, lng: 55.3854 },
    { nameEn: "Dubai Sports City", slugEn: "dubai-sports-city", lat: 25.0387, lng: 55.2246 },
    { nameEn: "Motor City", slugEn: "motor-city", lat: 25.0489, lng: 55.2399 },
    { nameEn: "Damac Hills", slugEn: "damac-hills", lat: 25.0263, lng: 55.2478 },
    { nameEn: "Town Square", slugEn: "town-square", lat: 24.9913, lng: 55.2515 },
    { nameEn: "Mirdif", nameAr: "مردف", slugEn: "mirdif", lat: 25.2172, lng: 55.4181 },
    { nameEn: "Deira", nameAr: "ديرة", slugEn: "deira", lat: 25.2697, lng: 55.3094 },
    { nameEn: "Bur Dubai", nameAr: "بر دبي", slugEn: "bur-dubai", lat: 25.2582, lng: 55.2962 },
    { nameEn: "International City", slugEn: "international-city", lat: 25.1625, lng: 55.4074 },
    { nameEn: "Dubai South", slugEn: "dubai-south", lat: 24.8967, lng: 55.1614 },

    /* Commercial and workspace. Deliberately included — both competitors
       treat this corner of the market as an afterthought, and "office space
       for rent in Business Bay" is a genuinely under-contested query. */
    { nameEn: "Al Quoz", nameAr: "القوز", slugEn: "al-quoz", lat: 25.1425, lng: 55.2325 },
    { nameEn: "Ras Al Khor", slugEn: "ras-al-khor", lat: 25.1785, lng: 55.3396 },
    { nameEn: "Dubai Investment Park", slugEn: "dubai-investment-park", lat: 24.9857, lng: 55.1735 },
    { nameEn: "Jebel Ali Free Zone", nameAr: "منطقة جبل علي الحرة", slugEn: "jebel-ali-free-zone", lat: 24.9857, lng: 55.0653 },
  ],
};
