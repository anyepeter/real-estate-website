import { getPayload } from "payload";
import config from "@payload-config";

import { runExpirySweep } from "@/lib/compliance/expirySweep";

/**
 * Nightly compliance sweep endpoint.
 *
 * Lives at /cron/expiry rather than under /api, because Payload owns
 * /api/[...slug] with a catch-all and putting a sibling literal route
 * inside it is a resolution order argument waiting to happen.
 *
 * Scheduled by vercel.json. Vercel Cron sends CRON_SECRET as a bearer
 * token; without the check this is an unauthenticated endpoint that can
 * unpublish listings, so the guard is not optional. It fails closed — a
 * missing secret in the environment rejects every request rather than
 * waving them through.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: Request) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return Response.json(
      { error: "CRON_SECRET is not configured. Refusing to run." },
      { status: 500 }
    );
  }

  if (req.headers.get("authorization") !== `Bearer ${expected}`) {
    return Response.json({ error: "Unauthorised" }, { status: 401 });
  }

  const payload = await getPayload({ config });
  const result = await runExpirySweep(payload);

  // Errors inside the sweep are reported, not thrown: one unreachable
  // listing should not stop the other 200 permits being checked.
  const status = result.errors.length > 0 ? 207 : 200;
  return Response.json(result, { status });
}
