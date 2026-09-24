"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { RevealWords, FadeUp } from "@/components/Reveal";
import { ButtonLink } from "@/components/ui/button";
import { parallaxOnScroll } from "@/lib/animations";
import { outro } from "@/lib/content";
import { href, type Locale } from "@/lib/i18n";

export default function Outro({ lang }: { lang: Locale }) {
  const bg = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bg.current;
    const img = el?.querySelector("img");
    if (!el || !img) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const st = parallaxOnScroll(img, el, { fromY: "-10%", toY: "10%", fromScale: 1.2, toScale: 1.2 });
    return () => st.kill();
  }, []);

  return (
    <section className="relative flex h-[55rem] items-center justify-center text-white md:h-[90rem]">
      <div ref={bg} className="absolute inset-0 overflow-hidden">
        <Image
          src={outro.image}
          alt=""
          fill
          sizes="100vw"
          className="h-full w-full object-cover"
        />
        <span className="absolute inset-0 block bg-[rgba(21,23,23,0.8)]" />
      </div>

      <div className="container relative">
        <RevealWords
          as="h2"
          className="text-balance text-center text-[3rem] font-medium leading-[115%] tracking-[-0.01em] md:text-[7.2rem] [&_.em]:text-[hsla(0,0%,100%,0.7)]"
        >
          {outro.lead} <span className="em">{outro.rest}</span>
        </RevealWords>
        <FadeUp className="mt-[3rem] text-center md:mt-[4rem]">
          <ButtonLink href={href(lang, outro.cta.href)} variant="primary" inversed>
            {outro.cta.label}
          </ButtonLink>
        </FadeUp>
      </div>
    </section>
  );
}
