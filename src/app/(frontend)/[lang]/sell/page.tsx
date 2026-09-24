import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/routes";
import LeadForm from "@/components/forms/LeadForm";

export const metadata: Metadata = {
  title: "Sell or Let Your Property in Dubai",
  description:
    "Free valuation based on what comparable units in your building actually transacted for. We handle the Form A, the DLD permit and the photography.",
};

/**
 * The inbound mandate funnel — the actual acquisition channel for a
 * brokerage this size, since listings can only come from properties we hold
 * a signed Form A on. Everything else on the site depends on this page
 * working.
 */
export default async function SellPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { lang } = await params;
  const { sent, error } = await searchParams;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;

  const steps = [
    {
      title: "We value it properly",
      body: "Against recorded DLD transactions in your building, not asking prices. You get the real number, including the ones that argue against listing right now.",
    },
    {
      title: "We handle the paperwork",
      body: "Form A, the Trakheesi advertising permit and the photography. You sign once; we do the rest.",
    },
    {
      title: "It goes live the same week",
      body: "On this site with full structured data, and on the portals where your buyers already are.",
    },
  ];

  return (
    <section className="py-[6rem] md:py-[10rem]">
      <div className="container">
        <div className="grid grid-cols-1 gap-[5rem] md:grid-cols-[1fr_48rem] md:gap-[8rem]">
          <div>
            <h1 className="text-[3.6rem] font-medium leading-[1.05] tracking-[-0.02em] md:text-[6.4rem]">
              What&rsquo;s your property worth?
            </h1>
            <p className="mt-[1.6rem] max-w-[55ch] text-[1.8rem] leading-[1.5] text-[#383a3a] md:mt-[2.4rem] md:text-[2.2rem]">
              A free valuation based on what comparable units actually transacted for.{" "}
              <span className="em">
                No obligation, and no pressure to list if the number isn&rsquo;t right yet.
              </span>
            </p>

            <ol className="mt-[4rem] flex flex-col gap-[2.4rem] md:mt-[6rem]">
              {steps.map((step, i) => (
                <li
                  key={step.title}
                  className="grid grid-cols-[3.2rem_1fr] gap-[1.6rem] border-t border-[rgba(21,23,23,0.1)] pt-[2.4rem]"
                >
                  <span className="text-[1.5rem] font-medium leading-[1.4] text-[#b3b3b3] tabular-nums">
                    0{i + 1}
                  </span>
                  <div>
                    <h2 className="text-[1.9rem] font-medium leading-[1.3] md:text-[2.2rem]">
                      {step.title}
                    </h2>
                    <p className="mt-[0.6rem] max-w-[55ch] text-[1.6rem] leading-[1.55] text-[#383a3a] md:text-[1.75rem]">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="md:sticky md:top-[10rem] md:self-start">
            <div className="border border-[rgba(21,23,23,0.15)] p-[2.4rem] md:p-[3.2rem]">
              <h2 className="text-[2.2rem] font-medium leading-[1.2] md:text-[2.6rem]">
                Request a valuation
              </h2>
              <p className="mb-[2.4rem] mt-[0.8rem] text-[1.5rem] leading-[1.5] text-[#b3b3b3] md:text-[1.6rem]">
                Tell us the building and the unit type and we&rsquo;ll come back with a range.
              </p>

              <LeadForm
                kind="valuation"
                redirectTo={href(locale, routes.sell)}
                submitLabel="Get my valuation"
                messageLabel="Which building, and what size?"
                sent={sent === "1"}
                errorFields={error ? error.split(",") : []}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
