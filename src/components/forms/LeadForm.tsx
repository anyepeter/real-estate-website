import { submitLead, type LeadKind } from "@/lib/leads";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/**
 * The shared enquiry form behind /sell, /contact and the property pages.
 *
 * A Server Component with no client JavaScript: the form posts to a Server
 * Action and the page re-renders with ?sent=1 or ?error=. It works with
 * scripting disabled, which on the surfaces whose only job is to convert
 * is worth more than any interaction polish.
 */
export default function LeadForm({
  kind,
  redirectTo,
  listingId,
  submitLabel = "Send enquiry",
  messageLabel = "Anything we should know?",
  sent = false,
  errorFields = [],
}: {
  kind: LeadKind;
  /** Where the action sends the browser back to. Locale-prefixed. */
  redirectTo: string;
  listingId?: number;
  submitLabel?: string;
  messageLabel?: string;
  sent?: boolean;
  errorFields?: string[];
}) {
  if (sent) {
    return (
      <div className="border border-[rgba(21,23,23,0.15)] bg-[#f1f1f1] p-[2.4rem] md:p-[3.2rem]">
        <p className="text-[2rem] font-medium leading-[1.2] md:text-[2.4rem]">
          Thanks — that&rsquo;s with us.
        </p>
        <p className="mt-[1.2rem] text-[1.6rem] leading-[1.5] text-[#383a3a] md:text-[1.8rem]">
          You&rsquo;ll hear back the same working day. If it&rsquo;s urgent, WhatsApp is
          faster than email.
        </p>
      </div>
    );
  }

  const invalid = (field: string) => errorFields.includes(field);

  return (
    <form action={submitLead} className="flex flex-col gap-[2rem]">
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="redirectTo" value={redirectTo} />
      {listingId ? <input type="hidden" name="listingId" value={listingId} /> : null}

      {/* Honeypot: off-screen rather than display:none, which some bots skip. */}
      <div className="absolute left-[-9999px]" aria-hidden tabIndex={-1}>
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {errorFields.length > 0 && (
        <p
          role="alert"
          className="border-l-[3px] border-[#d92424] bg-[#f1f1f1] px-[1.6rem] py-[1.2rem] text-[1.5rem] leading-[1.5]"
        >
          Please check the highlighted fields and send again.
        </p>
      )}

      <div className="flex flex-col gap-[0.8rem]">
        <Label htmlFor="name" className="text-[1.5rem]">
          Your name
        </Label>
        <Input
          id="name"
          name="name"
          required
          autoComplete="name"
          aria-invalid={invalid("name")}
          className="h-auto rounded-none border-[rgba(21,23,23,0.25)] px-[1.6rem] py-[1.4rem] text-[1.6rem] md:text-[1.7rem]"
        />
      </div>

      <div className="grid grid-cols-1 gap-[2rem] md:grid-cols-2">
        <div className="flex flex-col gap-[0.8rem]">
          <Label htmlFor="email" className="text-[1.5rem]">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={invalid("email")}
            className="h-auto rounded-none border-[rgba(21,23,23,0.25)] px-[1.6rem] py-[1.4rem] text-[1.6rem] md:text-[1.7rem]"
          />
        </div>

        <div className="flex flex-col gap-[0.8rem]">
          <Label htmlFor="phone" className="text-[1.5rem]">
            Phone
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            /* inputMode so mobile opens the number pad — most of this
               traffic is on a phone. */
            inputMode="tel"
            placeholder="+971 …"
            aria-invalid={invalid("phone")}
            className="h-auto rounded-none border-[rgba(21,23,23,0.25)] px-[1.6rem] py-[1.4rem] text-[1.6rem] md:text-[1.7rem]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-[0.8rem]">
        <Label htmlFor="message" className="text-[1.5rem]">
          {messageLabel}
        </Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          className="rounded-none border-[rgba(21,23,23,0.25)] px-[1.6rem] py-[1.4rem] text-[1.6rem] md:text-[1.7rem]"
        />
      </div>

      <button
        type="submit"
        className="mt-[0.8rem] self-start rounded-[100px] bg-[#151717] px-[3rem] py-[1.54rem] text-[1.6rem] font-medium leading-[1.4] text-white transition-transform duration-300 hover:[transition:transform_.7s_cubic-bezier(.34,3.56,.64,1)] hover:scale-x-[1.02] md:text-[1.8rem]"
      >
        {submitLabel}
      </button>

      <p className="text-[1.3rem] leading-[1.5] text-[#b3b3b3]">
        We only use these details to answer your enquiry.
      </p>
    </form>
  );
}
