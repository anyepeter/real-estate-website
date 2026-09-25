import type { CollectionConfig } from "payload";

/**
 * Leads.
 *
 * Until now submitLead validated a form and then logged it into the void.
 * For a brokerage where one missed viewing request is a lost commission,
 * that was the most expensive gap in the build.
 *
 * Modelled with a status rather than a boolean `read` flag: the useful
 * question is not "has anyone looked at this" but "what still needs doing",
 * which is what the dashboard sorts on.
 */
export const Enquiries: CollectionConfig = {
  slug: "enquiries",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "kind", "status", "listing", "createdAt"],
    group: "Leads",
    description: "Enquiries from the website. Newest first.",
  },
  access: {
    // Anyone can create — the public form posts here. Nobody unauthenticated
    // can read them back.
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true },
        {
          name: "kind",
          type: "select",
          required: true,
          defaultValue: "general",
          options: [
            { label: "Viewing request", value: "viewing" },
            { label: "Valuation", value: "valuation" },
            { label: "General", value: "general" },
          ],
        },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "email", type: "email", required: true },
        { name: "phone", type: "text", required: true },
      ],
    },
    { name: "message", type: "textarea" },
    {
      name: "listing",
      type: "relationship",
      relationTo: "listings",
      admin: {
        position: "sidebar",
        description: "Set automatically when the enquiry came from a property page.",
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Contacted", value: "contacted" },
        { label: "Viewing booked", value: "booked" },
        { label: "Closed", value: "closed" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "notes",
      type: "textarea",
      admin: {
        position: "sidebar",
        description: "Internal. Never shown to the enquirer.",
      },
    },
    {
      /**
       * Captured because the same person enquiring from an area guide and
       * from a property page are different conversations, and because it is
       * the only honest way to tell which pages actually produce leads.
       */
      name: "source",
      type: "text",
      admin: { position: "sidebar", readOnly: true, description: "Page the form was on." },
    },
  ],
  timestamps: true,
};
