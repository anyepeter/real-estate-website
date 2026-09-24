import Image from "next/image";
import { RevealWords, ClipIn, FadeUp } from "@/components/Reveal";
import { ButtonLink } from "@/components/ui/button";
import { forAgents } from "@/lib/content";
import { href, type Locale } from "@/lib/i18n";

export default function ForAgents({ lang }: { lang: Locale }) {
  return (
    <section className="py-[6rem] md:py-[15rem]">
      <div className="container">
        <div className="flex flex-col gap-[4rem] md:flex-row">
          {/* Left rail: the small portrait hangs low, well below the fold
              of the headline, which is what gives the split its offset. */}
          <div className="hidden flex-1 md:block">
            <RevealWords className="text-[2rem] font-semibold leading-[1.4]">
              {forAgents.label}
            </RevealWords>
            <ClipIn selector="[data-small]">
              <div
                data-small
                className="relative mt-[69%] aspect-[364/431] w-[36.4rem] overflow-hidden"
              >
                <Image
                  src="/images/agents-small.jpg"
                  alt="Agent outside a Dubai residential tower"
                  fill
                  sizes="(max-width: 768px) 96vw, (max-width: 1920px) 19vw, 360px"
                  className="object-cover"
                />
              </div>
            </ClipIn>
          </div>

          <div className="flex shrink-0 flex-col gap-[4rem] md:basis-[97.6rem] md:gap-[8rem]">
            <RevealWords
              as="h2"
              className="text-[3rem] font-medium leading-[1.15] tracking-[-0.01em] md:text-[7.2rem] md:tracking-[-0.04em]"
            >
              {forAgents.titleLead} <span className="em">{forAgents.titleRest}</span>
            </RevealWords>

            <ClipIn selector="[data-large]">
              <div
                data-large
                className="relative -mx-[calc(50vw-50%-0.5rem)] aspect-[365/450] overflow-hidden md:mx-0 md:aspect-[976/688]"
              >
                <Image
                  src="/images/agents-large.jpg"
                  alt="Aerial view of a tree-lined neighborhood"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1920px) 51vw, 976px"
                  className="object-cover"
                />
              </div>
            </ClipIn>

            <div>
              <RevealWords
                as="p"
                className="text-[2.2rem] font-medium leading-[1.4] md:text-[3.2rem] md:leading-[1.3]"
              >
                {forAgents.lead} <span className="em">{forAgents.rest}</span>
              </RevealWords>

              <FadeUp className="mt-[3rem] flex flex-col gap-[1rem] md:mt-[4rem] md:flex-row md:gap-[1.2rem]">
                <ButtonLink href={href(lang, forAgents.cta.href)}>{forAgents.cta.label}</ButtonLink>
              </FadeUp>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
