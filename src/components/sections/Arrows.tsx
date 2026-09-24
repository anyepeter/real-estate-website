"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { RevealWords } from "@/components/Reveal";
import { gsap, ScrollTrigger } from "@/lib/animations";
import { arrows } from "@/lib/content";

/**
 * Four chevrons, each masked to an arrowhead and overlapped so they
 * interlock into a single forward-pointing run.
 */
export default function Arrows() {
  const row = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = row.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const items = el.querySelectorAll("[data-arrow]");
      // ScrollTrigger.init calls refresh(), which reads .end off the
      // animation's first target. Handed a tween with no targets it throws
      // "Cannot read properties of undefined (reading 'end')" and takes the
      // rest of the page's JS down with it.
      if (!items.length) return;

      gsap.set(items, { opacity: 0, xPercent: 12 });
      ScrollTrigger.create({
        trigger: el,
        once: true,
        animation: gsap.to(items, {
          opacity: 1,
          xPercent: 0,
          duration: 1.8,
          stagger: 0.12,
          ease: "expo.out",
        }),
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section className="py-[4rem] md:py-[15rem]">
      <div className="container">
        <RevealWords
          as="h2"
          className="m-0 mb-[4rem] text-center text-[4.4rem] font-medium leading-[105%] tracking-[-0.02em] md:mx-auto md:mb-[8rem] md:text-[7.2rem] md:leading-[100%] md:tracking-[-0.04em]"
        >
          {arrows.titleLead} <span className="em">{arrows.titleRest}</span>
        </RevealWords>

        <div ref={row} className="relative ml-[1.8rem] flex justify-center md:ml-[6.7rem]">
          {arrows.images.map((img) => (
            <div
              key={img.src}
              data-arrow
              className="relative -ml-[1.8rem] h-[11.8rem] w-[9.3rem] shrink-0 [mask-image:url(/arrow-mask.svg)] [mask-repeat:no-repeat] [mask-size:100%_100%] md:-ml-[6.7rem] md:h-[44rem] md:w-[34.6rem]"
            >
              <Image src={img.src} alt={img.alt} fill sizes="35rem" className="object-cover" />
            </div>
          ))}
        </div>

        <RevealWords
          as="p"
          className="mt-[4rem] text-[2.2rem] font-medium leading-[130%] md:mx-auto md:mt-[8rem] md:max-w-[81.2rem] md:text-balance md:text-center md:text-[3.2rem] md:tracking-[-0.01em]"
        >
          {arrows.lead} <span className="em">{arrows.rest}</span>
        </RevealWords>
      </div>
    </section>
  );
}
