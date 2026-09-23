import type { CollectionConfig } from "payload";

/**
 * DLD advertising permits.
 *
 * Every property advertisement in Dubai needs a Trakheesi permit issued
 * against our ORN and tied to that specific property and advert. Abu Dhabi
 * uses Madhmoun. Fines start at AED 50,000 per violation, so this is
 * modelled as its own collection rather than a few loose fields on Listing:
 * permits expire independently of the listing, need auditing, and a listing
 * can be re-permitted over its life.
 *
 * Nothing here issues a permit. Issuance is a portal workflow at
 * dubailand.gov.ae because it depends on a signed Form A. The owner pastes
 * the number in; everything downstream is automatic.
 */
export const Permits: CollectionConfig = {
  slug: "permits",
  admin: {
    useAsTitle: "number",
    defaultColumns: ["number", "authority", "expiresAt", "listing"],
    group: "Compliance",
    description:
      "Advertising permits from DLD (Trakheesi) or ADREC (Madhmoun). A listing cannot publish without a valid, unexpired permit.",
  },
  fields: [
    {
      name: "number",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "Permit number exactly as DLD issued it.",
      },
    },
    {
      name: "authority",
      type: "select",
      required: true,
      defaultValue: "trakheesi",
      options: [
        { label: "Trakheesi (Dubai / DLD)", value: "trakheesi" },
        { label: "Madhmoun (Abu Dhabi / ADREC)", value: "madhmoun" },
      ],
      admin: {
        description:
          "Our licence covers Dubai only. Madhmoun requires separate ADREC registration.",
      },
    },
    {
      name: "issuedAt",
      type: "date",
      admin: { date: { pickerAppearance: "dayOnly" } },
    },
    {
      name: "expiresAt",
      type: "date",
      required: true,
      admin: {
        date: { pickerAppearance: "dayOnly" },
        description:
          "Checked on every publish, and nightly. An expired permit unpublishes its listing automatically.",
      },
    },
    {
      name: "qrUrl",
      type: "text",
      admin: {
        description:
          "Madmoun QR target — the DLD permit card URL. Required on adverts since April 2023, on social as well as the website.",
      },
    },
    {
      /**
       * Denormalised so the nightly expiry sweep can find affected listings
       * without loading every listing. Kept in step by the Listings hook.
       */
      name: "listing",
      type: "relationship",
      relationTo: "listings",
      admin: {
        readOnly: true,
        description: "Set automatically when a listing claims this permit.",
      },
    },
  ],
  timestamps: true,
};

/** True when the permit exists and has not lapsed. Used by the publish guard. */
export function isPermitValid(permit: { expiresAt?: string | Date | null } | null | undefined): boolean {
  if (!permit?.expiresAt) return false;
  return new Date(permit.expiresAt).getTime() > Date.now();
}
