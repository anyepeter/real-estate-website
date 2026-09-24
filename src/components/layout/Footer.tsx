"use client";

import Link from "next/link";
import { useState } from "react";
import { LogoMark } from "@/components/Logo";
import { ArrowRight } from "@/components/ui/icons";
import RollingText from "./RollingText";
import { footer } from "@/lib/content";
import { brand, regulatoryLine } from "@/lib/brand";
import { href, type Locale } from "@/lib/i18n";
import { routes } from "@/lib/routes";

export default function Footer({ lang }: { lang: Locale }) {
  const [email, setEmail] = useState("");

  return (
    <footer className="z-0 bg-[#151717] text-white">
      <div className="container">
        <div className="grid grid-cols-1 [grid-template-areas:'newsletter''links''logo''copyright'] pb-[4rem] pt-[6rem] md:grid-cols-[78.1rem_48.3rem] md:grid-rows-[repeat(3,auto)] md:justify-between md:[grid-template-areas:'newsletter_links''logo_logo''copyright_copyright'] md:pb-[5rem] md:pt-[15rem]">
          {/* newsletter + contacts */}
          <div className="flex flex-col gap-[8rem] [grid-area:newsletter] md:w-[86.2rem] md:gap-0">
            <div className="order-1 md:order-none">
              <h2 className="text-[1.6rem] font-medium leading-[1.5] md:text-[3.2rem] md:leading-[1.1] md:tracking-[-0.01em]">
                {footer.newsletterTitle}
              </h2>
              <form
                className="mt-[2.5rem] md:mt-[4rem]"
                onSubmit={(e) => {
                  e.preventDefault();
                  setEmail("");
                }}
              >
                <div className="flex items-center gap-[2rem] border-b border-[hsla(0,0%,100%,0.4)] pb-[1.5rem] transition-colors focus-within:border-white">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={footer.placeholder}
                    className="w-full bg-transparent text-[1.6rem] font-medium outline-none placeholder:text-[hsla(0,0%,100%,0.4)] md:text-[2rem]"
                  />
                  <button type="submit" aria-label="Subscribe" className="shrink-0">
                    <ArrowRight className="h-[2.4rem] w-[2.4rem]" />
                  </button>
                </div>
              </form>
            </div>

            <div className="flex flex-col gap-[4rem] md:mt-[10rem] md:flex-row md:gap-[10rem]">
              {footer.contacts.map((c) => (
                <div key={c.label}>
                  <p className="mb-[2.5rem] hidden text-[1.6rem] font-medium leading-[1.5] text-[hsla(0,0%,100%,0.4)] md:block">
                    {c.label}
                  </p>
                  {c.href ? (
                    <a
                      href={c.href}
                      className="text-[1.6rem] font-medium leading-[1.5] underline md:text-[2rem]"
                    >
                      {c.value}
                    </a>
                  ) : (
                    <p className="whitespace-pre-line text-[1.6rem] font-medium leading-[1.5] md:text-[2rem]">
                      {c.value}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* nav + socials */}
          <div className="mt-[8rem] flex justify-between [grid-area:links] md:mt-0">
            <nav className="flex flex-col gap-[0.5rem]">
              {footer.nav.map((l) => (
                <Link
                  key={l.label}
                  href={href(lang, l.href)}
                  className="overflow-hidden text-[3rem] font-medium leading-[1.1] tracking-[-0.01em] md:text-[3.2rem]"
                 prefetch={false}>
                  <RollingText>{l.label}</RollingText>
                </Link>
              ))}
            </nav>
            <ul className="flex flex-col gap-[1.2rem]">
              {footer.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block overflow-hidden pr-[3.5rem] text-[1.6rem] font-medium leading-[1.5] md:pr-0 md:text-[2rem]"
                  >
                    <RollingText>{s.label}</RollingText>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* oversized wordmark */}
          <div className="mt-[8rem] [grid-area:logo] md:mt-[15rem]">
            <LogoMark className="h-auto w-full" />
          </div>

          <div className="mt-[4rem] [grid-area:copyright] md:mt-[6rem]">
            <ul className="flex flex-wrap gap-x-[4rem] gap-y-[1.5rem] text-[1.4rem] font-medium leading-[1.4] md:text-[1.6rem]">
              {footer.sublinks.map((s) => (
                <li key={s}>
                  {/* These pages don't exist yet — Terms, Privacy and the
                      RERA notice are Phase 2. Pointing them home is honest
                      until then; a dead link is not. */}
                  <Link href={href(lang, routes.home)} className="hover:underline" prefetch={false}>
                    {s}
                  </Link>
                </li>
              ))}
              {/* RERA requires the brokerage name and ORN on every advert —
                  the website included, not just the listing pages. */}
              <li className="text-[hsla(0,0%,100%,0.4)]">{regulatoryLine}</li>
              <li className="text-[hsla(0,0%,100%,0.4)]">
                Trade licence {brand.legal.tradeLicence}
              </li>
              <li className="text-[hsla(0,0%,100%,0.4)]">
                Copyright &copy; {new Date().getFullYear()} {brand.fullName}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
