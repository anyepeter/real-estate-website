import type { CollectionConfig } from "payload";

/**
 * The location tree — one self-referencing table covering the whole
 * hierarchy: emirate › community › sub-community › tower.
 *
 * One table rather than four because the depth is not actually fixed.
 * "Business Bay" is a community with towers directly under it; "Jumeirah
 * Village Circle" has districts in between. A parent pointer handles both
 * without a schema change.
 *
 * This is also the spine of the SEO engine. Landing pages are generated
 * from area × type × beds, and the thin-content gate counts live listings
 * per node before a page is allowed to exist — so the tree has to be
 * accurate before any of that is switched on.
 */
export const Areas: CollectionConfig = {
  slug: "areas",
  admin: {
    useAsTitle: "nameEn",
    defaultColumns: ["nameEn", "level", "parent"],
    group: "Inventory",
    description: "Emirates, communities, sub-communities and towers.",
  },
  fields: [
    {
      type: "row",
      fields: [
        { name: "nameEn", type: "text", required: true, label: "Name (EN)" },
        { name: "nameAr", type: "text", label: "Name (AR)" },
      ],
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
          admin: { description: "URL segment, e.g. business-bay" },
        },
        {
          name: "slugAr",
          type: "text",
          label: "Slug (AR)",
          admin: {
            description:
              "Arabic slug. Property Finder translates these rather than transliterating; so do we.",
          },
        },
      ],
    },
    {
      name: "level",
      type: "select",
      required: true,
      options: [
        { label: "Emirate", value: "emirate" },
        { label: "Community", value: "community" },
        { label: "Sub-community", value: "subcommunity" },
        { label: "Tower / Building", value: "tower" },
      ],
    },
    {
      name: "parent",
      type: "relationship",
      relationTo: "areas",
      admin: {
        description: "Leave empty for an emirate. Everything else has a parent.",
      },
      /** Stops someone making an area its own ancestor. */
      validate: (value: unknown, { id }: { id?: string | number }) => {
        if (value && id && String(value) === String(id)) {
          return "An area cannot be its own parent.";
        }
        return true;
      },
    },
    {
      type: "row",
      fields: [
        { name: "lat", type: "number", admin: { step: 0.000001 } },
        { name: "lng", type: "number", admin: { step: 0.000001 } },
      ],
      /**
       * Plain columns for now. The PostGIS geometry column and the radius /
       * polygon queries land with search in Phase 2 — no point carrying the
       * extension dependency before anything queries it.
       */
    },
  ],
  timestamps: true,
};
