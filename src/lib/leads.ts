"use server";

import { redirect } from "next/navigation";

/**
 * Lead capture.
 *
 * Deliberately a plain Server Action with a redirect rather than
 * useActionState: that keeps the whole form working with JavaScript
 * disabled and ships no client bundle for it. On a page whose entire job is
 * to convert, the form failing because a script didn't load is the one
 * failure mode worth engineering out.
 *
 * NOT YET WIRED: persistence and notification. When Neon and Resend are
 * connected this writes an Enquiry and emails the owner. Until then it
 * validates, logs, and returns success — so the UI is finished and the
 * integration is a body change here.
 */

export type LeadKind = "viewing" | "valuation" | "general";

export type Lead = {
  kind: LeadKind;
  name: string;
  email: string;
  phone: string;
  message?: string;
  /** Set on property pages so the enquiry arrives attached to something. */
  listingId?: number;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitLead(formData: FormData) {
  const redirectTo = String(formData.get("redirectTo") ?? "/");

  // Honeypot. Bots fill every field they find; people never see this one.
  if (formData.get("company")) redirect(`${redirectTo}?sent=1`);

  const lead: Lead = {
    kind: (formData.get("kind") as LeadKind) ?? "general",
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim() || undefined,
    listingId: formData.get("listingId")
      ? Number(formData.get("listingId"))
      : undefined,
  };

  // Server-side validation regardless of the browser's. Native `required`
  // is a convenience for people, not a guarantee against anything else.
  const errors: string[] = [];
  if (lead.name.length < 2) errors.push("name");
  if (!EMAIL.test(lead.email)) errors.push("email");
  if (lead.phone.replace(/\D/g, "").length < 7) errors.push("phone");

  if (errors.length) {
    redirect(`${redirectTo}?error=${errors.join(",")}`);
  }

  // eslint-disable-next-line no-console
  console.log("[lead]", lead);

  redirect(`${redirectTo}?sent=1`);
}
