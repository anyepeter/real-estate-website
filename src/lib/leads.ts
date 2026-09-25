"use server";

import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";

/**
 * Lead capture.
 *
 * Deliberately a plain Server Action with a redirect rather than
 * useActionState: that keeps the whole form working with JavaScript
 * disabled and ships no client bundle for it. On a page whose entire job is
 * to convert, the form failing because a script didn't load is the one
 * failure mode worth engineering out.
 */

export type LeadKind = "viewing" | "valuation" | "general";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitLead(formData: FormData) {
  const redirectTo = String(formData.get("redirectTo") ?? "/");

  // Honeypot. Bots fill every field they find; people never see this one.
  // Answers success so a bot learns nothing from the difference.
  if (formData.get("company")) redirect(`${redirectTo}?sent=1`);

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const kind = (String(formData.get("kind") ?? "general") as LeadKind) ?? "general";
  const listingId = formData.get("listingId") ? Number(formData.get("listingId")) : undefined;

  // Server-side regardless of the browser's. Native `required` is a
  // convenience for people, not a guarantee against anything else.
  const errors: string[] = [];
  if (name.length < 2) errors.push("name");
  if (!EMAIL.test(email)) errors.push("email");
  if (phone.replace(/\D/g, "").length < 7) errors.push("phone");

  if (errors.length) {
    redirect(`${redirectTo}?error=${errors.join(",")}`);
  }

  try {
    const payload = await getPayload({ config });
    await payload.create({
      collection: "enquiries",
      data: {
        name,
        email,
        phone,
        kind,
        message: message || undefined,
        status: "new",
        source: redirectTo,
        ...(listingId && Number.isFinite(listingId) ? { listing: listingId } : {}),
      },
    });
  } catch (err) {
    /**
     * A lead is worth more than a clean error page. If the database is
     * unreachable we log loudly and still tell the visitor it sent, because
     * the alternative — showing a stranger an error and losing their phone
     * number — is strictly worse. The log is the recovery path.
     *
     * TODO: once Resend is wired, send the email here too, so a database
     * outage and a mail outage have to coincide before a lead is lost.
     */
    console.error("[lead] FAILED TO PERSIST — capture manually:", {
      name, email, phone, kind, message, listingId, source: redirectTo, error: String(err),
    });
  }

  redirect(`${redirectTo}?sent=1`);
}
