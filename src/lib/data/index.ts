import * as fixtures from "./fixtureQueries";
import * as db from "./payload";

export type {
  Area, ListingFull, ListingFilters, Paginated, ListingCategory,
} from "./types";
export { COMMERCIAL_TYPES } from "./types";

/**
 * ───────────────────────────────────────────────────────────────────────────
 *  The data layer. Every page reads through here and nothing else.
 * ───────────────────────────────────────────────────────────────────────────
 *
 *  Two implementations behind one surface: Payload when a database is
 *  configured, fixtures when it isn't.
 *
 *  The switch is on DATABASE_URI being *absent*, not on a query failing.
 *  That distinction is the whole point — "nobody has set this up yet" is a
 *  development state worth handling gracefully, whereas "the database is
 *  unreachable" is an outage that must surface loudly rather than quietly
 *  serving eleven invented properties to real buyers.
 *
 *  So: configured and broken throws. Unconfigured falls back and says so.
 */

const hasDatabase = Boolean(process.env.DATABASE_URI);

let warned = false;
function warnOnce() {
  if (warned || hasDatabase) return;
  warned = true;
  console.warn(
    "\n[data] DATABASE_URI is not set — serving fixture listings.\n" +
      "       Nothing you see on the site is real inventory.\n" +
      "       Set it in .env.local to connect Payload.\n"
  );
}

const impl = () => {
  warnOnce();
  return hasDatabase ? db : fixtures;
};

export const getListings: typeof fixtures.getListings = (...args) =>
  impl().getListings(...args);

export const getListing: typeof fixtures.getListing = (...args) =>
  impl().getListing(...args);

export const getAreas: typeof fixtures.getAreas = (...args) =>
  impl().getAreas(...args);

export const getArea: typeof fixtures.getArea = (...args) =>
  impl().getArea(...args);

export const getAreaCounts: typeof fixtures.getAreaCounts = (...args) =>
  impl().getAreaCounts(...args);
