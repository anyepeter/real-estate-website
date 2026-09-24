import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/routes";
import LeadForm from "@/components/forms/LeadForm";

export const metadata: Metadata = {
  title: "Off-Plan Property in Dubai",
  description:
    "How to check a Dubai off-plan project before you commit — escrow, DLD registration and completion percentage are all public and all checkable.",
};

/**
 * Informational, not an advert — and the distinction is legal, not stylistic.
 *
 * Explaining how off-plan works is market information and needs no permit.
 * The moment a page says "enquire to buy a unit in this project" it becomes
 * an advertisement requiring a Trakheesi permit and developer authorisation.
 * So this page teaches and captures interest; it does not list units.
 *
 * Project listings arrive in Phase 3 from the Dubai Pulse project registry,
 * which is where the completion percentages below come from.
 */
export default async function OffPlanPage({
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

  const checks = [
    {
      title: "Is the project registered with DLD?",
      body: "Every legitimate Dubai off-plan project is on the Land Department's register. If it isn't, that is the end of the conversation — not a negotiating point.",
    },
    {
      title: "Is there an escrow account?",
      body: "Your payments must go into a project-specific escrow account, not to the developer directly. The account number is verifiable before you transfer anything.",
    },
    {
      title: "What is the actual completion percentage?",
      body: "Construction progress is published, and it frequently disagrees with the brochure. It takes about ten minutes to check and it is the number that predicts handover.",
    },
    {
      title: "What happens if handover slips?",
      body: "Read what the SPA says about delay, not what the salesperson says. Dubai handovers move; the contract decides whether that costs you anything.",
    },
  ];

  return (
    <section className="py-[6rem] md:py-[10rem]">
      <div className="container">
        <div className="grid grid-cols-1 gap-[5rem] md:grid-cols-[1fr_44rem] md:gap-[8rem]">
          <div>
            <h1 className="text-[3.6rem] font-medium leading-[1.05] tracking-[-0.02em] md:text-[6.4rem]">
              Buying off-plan in Dubai
            </h1>
            <p className="mt-[1.6rem] max-w-[58ch] text-[1.8rem] leading-[1.5] text-[#383a3a] md:mt-[2.4rem] md:text-[2.2rem]">
              Four things worth checking before you commit.{" "}
              <span className="em">
                All four are public record, and all four are checkable in an afternoon.
              </span>
            </p>

            <ol className="mt-[4rem] flex flex-col md:mt-[6rem]">
              {checks.map((c, i) => (
                <li
                  key={c.title}
                  className="grid grid-cols-[3.2rem_1fr] gap-[1.6rem] border-t border-[rgba(21,23,23,0.1)] py-[2.4rem]"
                >
                  <span className="text-[1.5rem] font-medium leading-[1.5] text-[#b3b3b3] tabular-nums">
                    0{i + 1}
                  </span>
                  <div>
                    <h2 className="text-[1.9rem] font-medium leading-[1.3] md:text-[2.2rem]">
                      {c.title}
                    </h2>
                    <p className="mt-[0.6rem] max-w-[58ch] text-[1.65rem] leading-[1.6] text-[#383a3a] md:text-[1.8rem]">
                      {c.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="md:sticky md:top-[10rem] md:self-start">
            <div className="border border-[rgba(21,23,23,0.15)] p-[2.4rem] md:p-[3.2rem]">
              <h2 className="text-[2.2rem] font-medium leading-[1.2] md:text-[2.6rem]">
                Looking at a project?
              </h2>
              <p className="mb-[2.4rem] mt-[0.8rem] text-[1.5rem] leading-[1.5] text-[#b3b3b3] md:text-[1.6rem]">
                Tell us which one and we&rsquo;ll run the four checks above and send you what
                the register actually says.
              </p>

              <LeadForm
                kind="general"
                redirectTo={href(locale, routes.offPlan)}
                submitLabel="Check a project"
                messageLabel="Which project or developer?"
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
