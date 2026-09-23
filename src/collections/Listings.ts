import type { CollectionConfig } from "payload";
import { isPermitValid } from "./Permits";

/**
 * Properties.
 *
 * The rule this collection exists to enforce: **a listing cannot reach
 * published state without a valid, unexpired advertising permit.** Not a
 * warning, not a lint — a hard block in beforeChange, because the failure
 * mode is an AED 50,000 fine against our ORN rather than a broken page.
 *
 * That guard is deliberately not in the admin UI alone. Anything that can
 * write — the portal feed importer, a future API route, a seed script —
 * goes through the same hook.
 */
export const Listings: CollectionConfig = {
  slug: "listings",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "intent", "propertyType", "price", "_status"],
    group: "Inventory",
    description:
      "A listing only publishes with a valid permit attached. Drafts need nothing.",
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
    /**
     * Cap the version history. Payload writes a full row copy on every save,
     * so an uncapped listing that gets priced, re-photographed and re-worded
     * over a year quietly becomes hundreds of rows. Nothing prunes that on
     * its own — Neon never deletes data, which is correct for a database and
     * unhelpful for a table that only grows.
     *
     * 20 keeps a useful audit trail (who dropped the price, and when) without
     * the table outliving its usefulness.
     */
    maxPerDoc: 20,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: {
        description:
          "Human title, e.g. '2 Bedroom Apartment in Executive Towers'. Page titles are generated separately from the facets below.",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "slugEn",
          type: "text",
          required: true,
          unique: true,
          label: "Slug (EN)",
        },
        { name: "slugAr", type: "text", label: "Slug (AR)" },
      ],
    },

    /* ── what kind of transaction ─────────────────────────────────────── */
    {
      type: "row",
      fields: [
        {
          name: "intent",
          type: "select",
          required: true,
          options: [
            { label: "For sale", value: "buy" },
            { label: "For rent", value: "rent" },
          ],
        },
        {
          name: "propertyType",
          type: "select",
          required: true,
          options: [
            { label: "Apartment", value: "apartment" },
            { label: "Villa", value: "villa" },
            { label: "Townhouse", value: "townhouse" },
            { label: "Penthouse", value: "penthouse" },
            { label: "Studio", value: "studio" },
            { label: "Office", value: "office" },
            { label: "Retail", value: "retail" },
            { label: "Warehouse", value: "warehouse" },
          ],
          admin: {
            description:
              "Drives the URL and the landing-page facets. Commercial types are here on purpose — both competitors treat them as an afterthought.",
          },
        },
      ],
    },

    /* ── the facets that generate landing pages ───────────────────────── */
    {
      type: "row",
      fields: [
        { name: "bedrooms", type: "number", min: 0, admin: { description: "0 for studio." } },
        { name: "bathrooms", type: "number", min: 0 },
        { name: "areaSqft", type: "number", min: 0, label: "Area (sqft)" },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "price",
          type: "number",
          required: true,
          min: 0,
          admin: { description: "AED. Yearly for rentals." },
        },
        {
          name: "furnished",
          type: "select",
          defaultValue: "unfurnished",
          options: [
            { label: "Unfurnished", value: "unfurnished" },
            { label: "Furnished", value: "furnished" },
            { label: "Partly furnished", value: "partly" },
          ],
        },
      ],
    },

    /* ── where ────────────────────────────────────────────────────────── */
    {
      name: "area",
      type: "relationship",
      relationTo: "areas",
      required: true,
      admin: {
        description:
          "Point at the deepest node that applies — the tower if we have it, the community otherwise.",
      },
    },
    {
      type: "row",
      fields: [
        { name: "lat", type: "number", admin: { step: 0.000001 } },
        { name: "lng", type: "number", admin: { step: 0.000001 } },
      ],
    },

    /* ── compliance: the gate ─────────────────────────────────────────── */
    {
      name: "permit",
      type: "relationship",
      relationTo: "permits",
      admin: {
        position: "sidebar",
        description:
          "Required to publish. Drafts can exist without one so a property can be prepared while the permit is being issued.",
      },
    },
    {
      name: "agent",
      type: "relationship",
      relationTo: "agents",
      required: true,
      admin: { position: "sidebar" },
    },

    /* ── content ──────────────────────────────────────────────────────── */
    {
      name: "photos",
      type: "upload",
      relationTo: "media",
      hasMany: true,
      admin: {
        description:
          "First photo is the card image and the LCP element on the detail page. Order matters.",
      },
    },
    { name: "description", type: "textarea" },
    {
      name: "amenities",
      type: "select",
      hasMany: true,
      options: [
        { label: "Balcony", value: "balcony" },
        { label: "Parking", value: "parking" },
        { label: "Pool", value: "pool" },
        { label: "Gym", value: "gym" },
        { label: "Maid's room", value: "maids-room" },
        { label: "Study", value: "study" },
        { label: "Sea view", value: "sea-view" },
        { label: "Metro nearby", value: "metro-nearby" },
      ],
    },
  ],

  hooks: {
    beforeChange: [
      async ({ data, req, originalDoc }) => {
        const status = data?._status ?? originalDoc?._status;
        if (status !== "published") return data;

        const permitId = data?.permit ?? originalDoc?.permit;
        if (!permitId) {
          throw new Error(
            "Cannot publish without an advertising permit. Attach a Trakheesi permit, or save as a draft."
          );
        }

        // The relationship may arrive as an id or as a populated object.
        const permit =
          typeof permitId === "object"
            ? permitId
            : await req.payload.findByID({
                collection: "permits",
                id: permitId,
                depth: 0,
                req,
              });

        if (!isPermitValid(permit as { expiresAt?: string | null })) {
          throw new Error(
            `Permit ${(permit as { number?: string })?.number ?? permitId} has expired or has no expiry date. ` +
              "Renew it in Trakheesi before publishing — advertising on a lapsed permit is a RERA violation."
          );
        }

        return data;
      },
    ],
    afterChange: [
      /** Keep Permits.listing in step so the nightly expiry sweep can
          resolve affected listings without scanning the whole table. */
      async ({ doc, req, operation }) => {
        if (operation !== "create" && operation !== "update") return doc;
        const permitId = typeof doc.permit === "object" ? doc.permit?.id : doc.permit;
        if (!permitId) return doc;

        await req.payload.update({
          collection: "permits",
          id: permitId,
          data: { listing: doc.id },
          req,
          // This write must not re-trigger the listing hooks.
          context: { skipSync: true },
        });

        return doc;
      },
    ],
  },

  timestamps: true,
};
