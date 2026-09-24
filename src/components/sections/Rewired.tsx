import { RevealWords, FadeUp } from "@/components/Reveal";
import { ButtonLink } from "@/components/ui/button";
import { rewired } from "@/lib/content";
import { href, type Locale } from "@/lib/i18n";

export default function Rewired({ lang }: { lang: Locale }) {
  return (
    <section className="py-[4rem] md:py-[15rem]">
      <div className="container">
        <div className="flex flex-col gap-[4rem] md:flex-row">
          <div className="flex-1">
            <div className="flex flex-col items-start gap-[3rem] md:gap-[4rem]">
              <RevealWords
                as="h2"
                className="text-[4.4rem] font-medium leading-[1] tracking-[-0.02em] md:text-[7.2rem] md:tracking-[-0.04em]"
              >
                {rewired.titleLead}
                {/* block-level, so "Rewired." always takes its own line */}
                <span className="em block">{rewired.titleRest}</span>
              </RevealWords>
              <FadeUp>
                <ButtonLink href={href(lang, rewired.cta.href)}>{rewired.cta.label}</ButtonLink>
              </FadeUp>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-[4rem] md:basis-[97.6rem] md:gap-[8rem]">
            <div>
              <RevealWords className="mb-[3rem] text-[2.2rem] font-medium leading-[1.15] md:text-[3.2rem] md:leading-[1.3] md:tracking-[-0.01em]">
                {rewired.label}
              </RevealWords>

              <FadeUp selector="[data-step]" stagger={0.12}>
                {rewired.steps.map((step, i) => (
                  <div
                    key={step.lead}
                    data-step
                    className="border-b border-[rgba(21,23,23,0.07)] py-[3rem] text-[2.2rem] font-medium leading-[1.15] first:border-t md:flex md:items-center md:gap-[5rem] md:text-[4.4rem] md:leading-[1.15] md:tracking-[-0.03em]"
                  >
                    <span className="mb-[3rem] block text-[1.4rem] font-medium leading-[1.5] text-[#b3b3b3] md:mb-0 md:text-[2rem]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      {step.lead} <span className="em">{step.rest}</span>
                    </span>
                  </div>
                ))}
              </FadeUp>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
