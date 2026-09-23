import type { CollectionConfig } from "payload";

/**
 * Brokers. One row today — the owner — but modelled as a collection because
 * RERA ties a BRN to a person, not to the office, and every listing has to
 * name the broker responsible for it.
 *
 * Note this is separate from Users (who can log in). A broker might appear
 * on the site without having an admin account, and an admin account holder
 * is not necessarily a licensed broker.
 */
export const Agents: CollectionConfig = {
  slug: "agents",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "brn", "brnExpiresAt"],
    group: "Inventory",
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { description: "URL segment for the agent page, e.g. terence-tumambang" },
    },
    {
      name: "brn",
      type: "text",
      required: true,
      unique: true,
      label: "BRN",
      admin: {
        description:
          "Broker registration number from the RERA broker card. Displayed on every listing this agent holds.",
      },
    },
    {
      name: "brnExpiresAt",
      type: "date",
      label: "BRN expires",
      admin: {
        date: { pickerAppearance: "dayOnly" },
        description:
          "Watched by the same nightly sweep as permits. A lapsed BRN is as disqualifying as a lapsed permit.",
      },
    },
    { name: "photo", type: "upload", relationTo: "media" },
    {
      name: "languages",
      type: "select",
      hasMany: true,
      options: [
        { label: "English", value: "en" },
        { label: "Arabic", value: "ar" },
        { label: "Hindi", value: "hi" },
        { label: "Urdu", value: "ur" },
        { label: "Russian", value: "ru" },
        { label: "French", value: "fr" },
      ],
      admin: {
        description:
          "Genuinely a filter buyers use in this market, not decoration — it drives agent matching later.",
      },
    },
    {
      name: "whatsapp",
      type: "text",
      admin: {
        description:
          "Digits only, country code included, no +. Becomes a wa.me link — the default enquiry channel here.",
      },
    },
    { name: "email", type: "email" },
    { name: "bio", type: "textarea" },
  ],
  timestamps: true,
};
