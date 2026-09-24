import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { href, isLocale, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/routes";
import { brand, regulatoryLine } from "@/lib/brand";
import LeadForm from "@/components/forms/LeadForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to a licensed Dubai broker about buying, renting or selling. One point of contact, not a call centre.",
};

export default async function ContactPage({
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

  return (
    <section className="py-[6rem] md:py-[10rem]">
      <div className="container">
        <div className="grid grid-cols-1 gap-[5rem] md:grid-cols-[1fr_48rem] md:gap-[8rem]">
          <div>
            <h1 className="text-[3.6rem] font-medium leading-[1.05] tracking-[-0.02em] md:text-[6.4rem]">
              Talk to us
            </h1>
            <p className="mt-[1.6rem] max-w-[55ch] text-[1.8rem] leading-[1.5] text-[#383a3a] md:mt-[2.4rem] md:text-[2.2rem]">
              One licensed broker, start to finish.{" "}
              <span className="em">
                Not a call centre, and not a different name every time you ring.
              </span>
            </p>

            <dl className="mt-[4rem] flex flex-col gap-[2.4rem] md:mt-[6rem]">
              <div className="border-t border-[rgba(21,23,23,0.1)] pt-[2.4rem]">
                <dt className="text-[1.3rem] uppercase leading-[1.4] tracking-[0.06em] text-[#b3b3b3]">
                  Office
                </dt>
                <dd className="mt-[0.6rem] text-[1.8rem] leading-[1.5] md:text-[2rem]">
                  {brand.contact.address.line1}
                  <br />
                  {brand.contact.address.line2}, {brand.contact.address.city}
                </dd>
              </div>

              <div className="border-t border-[rgba(21,23,23,0.1)] pt-[2.4rem]">
                <dt className="text-[1.3rem] uppercase leading-[1.4] tracking-[0.06em] text-[#b3b3b3]">
                  Direct
                </dt>
                <dd className="mt-[0.6rem] text-[1.8rem] leading-[1.5] md:text-[2rem]">
                  <a href={`mailto:${brand.contact.email}`} className="underline">
                    {brand.contact.email}
                  </a>
                  <br />
                  <a
                    href={`tel:${brand.contact.phone.replace(/\s/g, "")}`}
                    className="underline"
                  >
                    {brand.contact.phone}
                  </a>
                </dd>
              </div>

              {/* RERA requires the brokerage name and ORN wherever we
                  advertise. On the contact page it doubles as the thing a
                  cautious buyer checks before picking up the phone. */}
              <div className="border-t border-[rgba(21,23,23,0.1)] pt-[2.4rem]">
                <dt className="text-[1.3rem] uppercase leading-[1.4] tracking-[0.06em] text-[#b3b3b3]">
                  Licensed by Dubai Land Department
                </dt>
                <dd className="mt-[0.6rem] text-[1.6rem] leading-[1.6] text-[#383a3a] md:text-[1.75rem]">
                  {regulatoryLine}
                  <br />
                  Trade licence {brand.legal.tradeLicence}
                </dd>
              </div>
            </dl>
          </div>

          <div className="md:sticky md:top-[10rem] md:self-start">
            <div className="border border-[rgba(21,23,23,0.15)] p-[2.4rem] md:p-[3.2rem]">
              <h2 className="text-[2.2rem] font-medium leading-[1.2] md:text-[2.6rem]">
                Send a message
              </h2>
              <p className="mb-[2.4rem] mt-[0.8rem] text-[1.5rem] leading-[1.5] text-[#b3b3b3] md:text-[1.6rem]">
                Same working day, every time.
              </p>

              <LeadForm
                kind="general"
                redirectTo={href(locale, routes.contact)}
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
