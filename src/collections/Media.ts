import type { CollectionConfig } from "payload";

/**
 * Uploads — property photography, agent portraits, area guide imagery.
 *
 * Photos are the bulk of a property site's weight and its carbon footprint,
 * and the performance budget (<300 KB HTML, LCP <1.5s) lives or dies here.
 * The cloned repo carries 21 MB of JPEGs; that cannot repeat. So every
 * upload is converted to AVIF at fixed widths on the way in, rather than
 * trusting whoever uploads to have resized anything.
 *
 * Storage is local disk for now. Cloudflare R2 (no egress fees) goes in via
 * @payloadcms/storage-s3 before launch — it's a config swap, not a
 * refactor, because nothing references file paths directly.
 */
export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: "Inventory",
    description: "Every upload is re-encoded to AVIF. Originals are not served.",
  },
  access: {
    read: () => true,
  },
  upload: {
    staticDir: "media",
    mimeTypes: ["image/*"],
    /** Widths chosen against the layout's real breakpoints, not round numbers. */
    imageSizes: [
      { name: "thumb", width: 400, formatOptions: { format: "avif", options: { quality: 55 } } },
      { name: "card", width: 800, formatOptions: { format: "avif", options: { quality: 55 } } },
      { name: "hero", width: 1600, formatOptions: { format: "avif", options: { quality: 60 } } },
      { name: "full", width: 2400, formatOptions: { format: "avif", options: { quality: 62 } } },
    ],
    /** The stored original is AVIF too — we never serve the uploaded JPEG. */
    formatOptions: { format: "avif", options: { quality: 62 } },
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description:
          "Describe what is actually in the frame. This is read aloud by screen readers and indexed by image search — 'property' is not a description.",
      },
    },
    {
      name: "credit",
      type: "text",
      admin: { description: "Photographer or source, where one needs crediting." },
    },
  ],
  timestamps: true,
};
