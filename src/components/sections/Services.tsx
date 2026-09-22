"use client";

import Image from "next/image";
import Link from "next/link";
import { RevealWords, FadeUp } from "@/components/Reveal";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight } from "@/components/ui/icons";
import { services } from "@/lib/content";

/**
 * Three full-bleed rows on near-black. Hovering a row wipes its photo up
 * from the baseline while the still underneath drifts back to rest over
 * four seconds — slow enough to read as depth rather than motion.
 */
export default function Services() {
  return (
    <section className="bg-[#151717] py-[6rem] text-white md:py-[15rem]">
      <div className="container">
        <div className="mb-[6rem] grid md:mb-[10rem] md:grid-cols-[auto_97.6rem]">
          <div className="hidden md:block">
            <RevealWords className="text-[2rem] font-semibold leading-[140%]">
              {services.label}
            </RevealWords>
          </div>
          <RevealWords
            as="h2"
            className="text-[4.4rem] font-medium leading-[105%] tracking-[-0.02em] md:text-[7.2rem] md:tracking-[-0.03em]"
          >
            {services.titleLead}
            <br />
            <span className="em">{services.titleRest}</span>
          </RevealWords>
        </div>
      </div>

      <div className="border-b border-[#383a3a]">
        {services.items.map((item, i) => (
          <Link
            key={item.name}
            href={item.href}
            className="group relative block h-[40rem] w-full overflow-hidden border-t border-[#383a3a]"
           prefetch={false}>
            {/* still photo, revealed on hover */}
            <div className="pointer-events-none absolute inset-0 bg-[#1a1c1c] opacity-30 [@media(pointer:fine)]:scale-105 [@media(pointer:fine)]:opacity-0 [@media(pointer:fine)]:[clip-path:inset(100%_0_0_0)] [@media(pointer:fine)]:[transition:opacity_.4s,transform_4s_cubic-bezier(.5,1,.89,1),clip-path_1s_cubic-bezier(.16,1,.3,1)] [@media(pointer:fine)]:group-hover:scale-100 [@media(pointer:fine)]:group-hover:opacity-40 [@media(pointer:fine)]:group-hover:[clip-path:inset(0_0_0_0)]">
              <Image
                src={item.image}
                alt=""
                fill
                sizes="100vw"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="container">
              <div className="grid h-full pb-[5.2rem] pt-[6rem] md:grid-cols-[4.6rem_auto_97.6rem] md:gap-[6rem]">
                <div className="relative grid h-[3.6rem] w-[3.6rem] items-center justify-center rounded-full border text-[1.4rem] font-medium leading-[140%] md:h-[4.6rem] md:w-[4.6rem] md:text-[1.6rem]">
                  {i + 1}
                </div>

                <p className="relative text-left text-[1.6rem] font-medium leading-[150%] md:max-w-[40rem] md:text-balance md:text-[2.4rem] md:tracking-[-0.01em]">
                  {item.text}
                </p>

                <div className="relative flex items-center justify-between self-end whitespace-nowrap text-[10.45rem] leading-[95%] tracking-[-0.04em] md:self-start md:text-[24rem] md:tracking-[-0.05em]">
                  {/* the underline draws in from the left on hover */}
                  <span className="relative inline-block after:absolute after:bottom-0 after:left-[.085em] after:right-0 after:block after:origin-left after:scale-x-0 after:border-t-[.0333em] after:border-current after:transition-transform after:duration-1000 after:ease-[cubic-bezier(.16,1,.3,1)] after:content-[''] group-hover:after:scale-x-100">
                    {item.name}
                  </span>
                  <ArrowRight className="relative top-[.05em] h-[1em] w-[1em] [@media(pointer:fine)]:-translate-x-[10%] [@media(pointer:fine)]:opacity-0 [@media(pointer:fine)]:[transition:opacity_.4s,transform_.8s] [@media(pointer:fine)]:group-hover:translate-x-0 [@media(pointer:fine)]:group-hover:opacity-100" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="container">
        <RevealWords
          as="p"
          className="mt-[6rem] text-[2.2rem] font-medium leading-[130%] md:max-w-[77.6rem] md:text-[4.4rem] md:leading-[115%] md:tracking-[-0.02em] [&_.em]:text-[hsla(0,0%,100%,0.4)]"
        >
          {services.briefLead} <span className="em">{services.briefRest}</span>
        </RevealWords>
        <FadeUp className="mt-[4rem]">
          <ButtonLink href={services.cta.href} variant="secondary" inversed>
            {services.cta.label}
          </ButtonLink>
        </FadeUp>
      </div>
    </section>
  );
}
