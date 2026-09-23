/**
 * ───────────────────────────────────────────────────────────────────────────
 *  PLACEHOLDER BRAND — change these values and the whole site follows.
 * ───────────────────────────────────────────────────────────────────────────
 *
 *  "ACME" is deliberately provisional: nobody ships ACME by accident, and it
 *  is four letters so it sits in the existing wordmark rhythm without
 *  breaking the hero layout. Replace `name` / `fullName` once the trade name
 *  is settled with DET.
 *
 *  STILL TO REPLACE BY HAND — cloned brand assets that no find-and-replace
 *  can reach:
 *    · public/logotype.svg      the full wordmark drawn in the hero
 *    · src/components/Logo.tsx  inline SVG paths for the compact mark
 *    · public/images/*          all photography
 *
 *  The `legal` block is not decoration. RERA requires the brokerage name and
 *  ORN on every advert, on the website and on social alike. These values also
 *  feed the LocalBusiness / RealEstateAgent structured data once that lands.
 */

export const brand = {
  /* — provisional identity — */
  name: "ACME",
  fullName: "ACME Real Estate",
  tagline: "Buy, rent and sell property in Dubai.",

  /* — registered identity: Dubai DET + RERA, verified 29 Aug 2026 — */
  legal: {
    name: "TERENCE TUMAMBANG REAL ESTATE",
    nameAr: "تيرينس تومامبانج للعقارات",
    orn: "33927", // RERA office registration number
    brn: "44557", // broker card number
    tradeLicence: "1138855", // Dubai DET professional licence
    emirate: "Dubai",
    authority: "Dubai Land Department / RERA",
    /** All three documents lapse together. The expiry job watches this. */
    expires: "2027-01-30",
  },

  /* — PLACEHOLDER contact: real values once the domain and business line exist.
       Deliberately not the owner's personal mobile from the licence. — */
  contact: {
    email: "info@example.com",
    phone: "+971 4 000 0000",
    whatsapp: "9714000000",
    address: {
      line1: "Office C-135-1804",
      line2: "Business Bay",
      city: "Dubai",
      country: "United Arab Emirates",
    },
  },

  /* Licensed activities, per the trade licence. Anything not on this list
     must not be advertised — property management is deliberately absent. */
  licensedActivities: [
    "Real Estate Buying & Selling Brokerage",
    "Leasing Property Brokerage Agents",
  ],
} as const;

/** Required on every advert by RERA. Rendered in the footer. */
export const regulatoryLine = `${brand.legal.name} · ORN ${brand.legal.orn} · BRN ${brand.legal.brn}`;
