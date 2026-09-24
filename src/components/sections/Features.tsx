import Image from "next/image";
import Link from "next/link";
import { RevealWords, FadeUp, ClipIn } from "@/components/Reveal";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight } from "@/components/ui/icons";
import { features } from "@/lib/content";
import { href, type Locale } from "@/lib/i18n";

/**
 * Three cards on near-black. On a fine pointer the grid itself animates:
 * the hovered column grows to 1.2fr and its description fades up, so the
 * row rebalances instead of the card popping.
 */
export default function Features({ lang }: { lang: Locale }) {
  return (
    <section className="bg-[#151717] py-[4rem_6rem] pb-[6rem] pt-[4rem] text-white md:py-[15rem]">
      <div className="container">
        <div className="grid gap-[4rem] md:grid-cols-[auto_97.6rem]">
          <RevealWords
            as="h2"
            className="text-[4.4rem] font-medium leading-[105%] tracking-[-0.02em] md:text-[7.2rem] md:leading-[100%] md:tracking-[-0.04em] [&_.em]:text-[hsla(0,0%,100%,0.4)]"
          >
            {features.titleLead} <span className="em">{features.titleRest}</span>
          </RevealWords>

          <div>
            <RevealWords
              as="p"
              className="text-[2.2rem] font-medium leading-[130%] md:text-[3.2rem] md:leading-[115%] md:tracking-[-0.03em] [&_.em]:text-[hsla(0,0%,100%,0.4)]"
            >
              {features.lead} <span className="em">{features.rest}</span>
            </RevealWords>
            <FadeUp className="mt-[3rem] md:mt-[4rem]">
              <ButtonLink href={href(lang, features.cta.href)} variant="primary" inversed>
                {features.cta.label}
              </ButtonLink>
            </FadeUp>
          </div>
        </div>

        <ClipIn
          selector="[data-card]"
          className="-mx-[2rem] mt-[6rem] grid auto-cols-max grid-flow-col gap-[1rem] overflow-auto px-[2rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:mt-[10rem] md:grid-flow-row md:grid-cols-[1fr_1fr_1fr] md:gap-[3rem] md:px-0 md:[transition:grid-template-columns_1s_cubic-bezier(.16,1,.3,1)] md:[&:has(>*:first-child:hover)]:grid-cols-[1.2fr_.9fr_.9fr] md:[&:has(>*:nth-child(2):hover)]:grid-cols-[.9fr_1.2fr_.9fr] md:[&:has(>*:nth-child(3):hover)]:grid-cols-[.9fr_.9fr_1.2fr]"
        >
          {features.items.map((item) => (
            <div
              key={item.title}
              data-card
              className="group relative grid h-[40rem] w-[33rem] gap-[1.5rem] overflow-hidden p-[3rem] md:h-[47rem] md:w-auto md:p-[5rem]"
            >
              <div className="absolute inset-0">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 88vw, 33vw"
                  className="scale-[1.01] object-cover"
                />
              </div>

              <h3 className="relative max-w-[80%] text-[3rem] font-medium leading-[115%] tracking-[-0.01em] md:max-w-[34.5rem] md:text-balance md:text-[4.4rem] md:tracking-[-0.02em]">
                {item.title}
              </h3>
              <p className="relative text-[1.6rem] leading-[150%] md:max-w-[34.5rem] md:text-[2rem] [@media(min-width:768px)_and_(pointer:fine)]:opacity-0 [@media(min-width:768px)_and_(pointer:fine)]:transition-opacity [@media(min-width:768px)_and_(pointer:fine)]:duration-[400ms] [@media(min-width:768px)_and_(pointer:fine)]:group-hover:opacity-100">
                {item.text}
              </p>

              <div className="relative self-end">
                <Link
                  href={href(lang, item.href)}
                  className="inline-flex items-center gap-[1.4rem] rounded-[100px] border border-[hsla(0,0%,100%,0.5)] px-[2.4rem] py-[1.4rem] text-[1.6rem] font-medium transition-transform duration-300 hover:[transition:transform_.7s_cubic-bezier(.34,3.56,.64,1)] hover:scale-x-[1.02] md:px-[3rem] md:py-[1.54rem] md:text-[1.8rem]"
                 prefetch={false}>
                  Learn More
                  <ArrowRight className="h-[2.4rem] w-[2.4rem]" />
                </Link>
              </div>
            </div>
          ))}
        </ClipIn>
      </div>
    </section>
  );
}
