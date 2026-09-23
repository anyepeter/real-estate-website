import type { Payload } from "payload";
import { brand } from "@/lib/brand";

/**
 * The nightly compliance sweep.
 *
 * The publish guard in Listings stops a bad listing going live. This is the
 * other half: it stops a good listing *staying* live after its permit runs
 * out. Without it the guard only holds at the moment of publishing, which
 * is the easy case — the expensive failure is a property that was legal in
 * March and is quietly illegal by September.
 *
 * It watches three clocks, not one. A lapsed ORN or BRN invalidates every
 * advert underneath it just as surely as a lapsed permit does, and all
 * three of our documents happen to expire on the same day (2027-01-30), so
 * a single missed renewal takes the whole site down at once.
 *
 * Deliberately separated from the route handler so it can be run from a
 * script, a test, or the admin panel without going through HTTP.
 */

const DAY = 24 * 60 * 60 * 1000;

/** Warning thresholds, in days. 90 to plan, 30 to act, 7 to panic. */
export const WARN_AT_DAYS = [90, 30, 7] as const;

export type ExpiryWarning = {
  kind: "permit" | "brn" | "licence";
  label: string;
  expiresAt: string;
  daysLeft: number;
};

export type SweepResult = {
  ranAt: string;
  warnings: ExpiryWarning[];
  unpublished: { listingId: number; title: string; permitNumber: string }[];
  errors: string[];
};

function daysUntil(date: string | Date): number {
  return Math.floor((new Date(date).getTime() - Date.now()) / DAY);
}

/** Only warn on the thresholds themselves, so a 45-day-out permit doesn't
 *  generate an identical email every night for six weeks. */
function isWarnDay(daysLeft: number): boolean {
  return (WARN_AT_DAYS as readonly number[]).includes(daysLeft);
}

export async function runExpirySweep(payload: Payload): Promise<SweepResult> {
  const result: SweepResult = {
    ranAt: new Date().toISOString(),
    warnings: [],
    unpublished: [],
    errors: [],
  };

  /* ── 1. permits ─────────────────────────────────────────────────────── */
  try {
    const permits = await payload.find({
      collection: "permits",
      limit: 1000,
      depth: 0,
    });

    for (const permit of permits.docs) {
      if (!permit.expiresAt) continue;
      const left = daysUntil(permit.expiresAt);

      if (left < 0) {
        // Lapsed. Take down anything still advertising on it.
        if (!permit.listing) continue;
        const listingId =
          typeof permit.listing === "object" ? permit.listing.id : permit.listing;

        try {
          const listing = await payload.findByID({
            collection: "listings",
            id: listingId,
            depth: 0,
          });

          if (listing._status === "published") {
            await payload.update({
              collection: "listings",
              id: listingId,
              data: { _status: "draft" },
              // The publish guard only fires on publish; reverting to draft
              // is exactly what we want and needs no override.
            });
            result.unpublished.push({
              listingId,
              title: listing.title,
              permitNumber: permit.number,
            });
          }
        } catch (err) {
          result.errors.push(
            `Permit ${permit.number}: could not unpublish listing ${listingId} — ${String(err)}`
          );
        }
        continue;
      }

      if (isWarnDay(left)) {
        result.warnings.push({
          kind: "permit",
          label: `Permit ${permit.number}`,
          expiresAt: String(permit.expiresAt),
          daysLeft: left,
        });
      }
    }
  } catch (err) {
    result.errors.push(`Permit sweep failed: ${String(err)}`);
  }

  /* ── 2. broker cards ────────────────────────────────────────────────── */
  try {
    const agents = await payload.find({ collection: "agents", limit: 200, depth: 0 });
    for (const agent of agents.docs) {
      if (!agent.brnExpiresAt) continue;
      const left = daysUntil(agent.brnExpiresAt);
      if (left < 0 || isWarnDay(left)) {
        result.warnings.push({
          kind: "brn",
          label: `BRN ${agent.brn} (${agent.name})`,
          expiresAt: String(agent.brnExpiresAt),
          daysLeft: left,
        });
      }
    }
  } catch (err) {
    result.errors.push(`Agent sweep failed: ${String(err)}`);
  }

  /* ── 3. the office licence itself ───────────────────────────────────── */
  const licenceLeft = daysUntil(brand.legal.expires);
  if (licenceLeft < 0 || isWarnDay(licenceLeft)) {
    result.warnings.push({
      kind: "licence",
      label: `Trade licence ${brand.legal.tradeLicence} / ORN ${brand.legal.orn}`,
      expiresAt: brand.legal.expires,
      daysLeft: licenceLeft,
    });
  }

  return result;
}
