import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Areas } from "./collections/Areas";
import { Agents } from "./collections/Agents";
import { Permits } from "./collections/Permits";
import { Listings } from "./collections/Listings";
import { Enquiries } from "./collections/Enquiries";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Payload runs inside this Next.js app rather than beside it — one repo,
 * one deploy, one bill. The admin panel lives at /admin and shares the same
 * database connection as the public pages.
 *
 * Collection order here is the order they appear in the admin sidebar, so
 * it's grouped by how often the owner will actually touch them.
 */
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: "— Admin",
    },
    components: {
      /**
       * Replaces Payload's default landing view. The stock one lists
       * collections, which answers "what is in this system" — a question
       * the owner already knows the answer to. The custom view answers
       * "what needs doing", which is why they logged in.
       */
      views: {
        dashboard: {
          Component: "@/components/admin/Dashboard#Dashboard",
        },
      },
    },
  },

  collections: [Listings, Enquiries, Permits, Areas, Agents, Media, Users],

  editor: lexicalEditor(),

  /**
   * Both of these come from .env.local, which is gitignored. There is no
   * fallback on purpose: a missing secret should fail loudly at boot rather
   * than silently signing sessions with an empty string.
   */
  secret: process.env.PAYLOAD_SECRET || "",

  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || "" },
  }),

  /** Drives the AVIF conversion configured on the Media collection. */
  sharp,

  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
