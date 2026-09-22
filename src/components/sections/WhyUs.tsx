"use client";

import { useEffect, useRef } from "react";
import { RevealWords, ClipIn } from "@/components/Reveal";
import { parallaxOnScroll } from "@/lib/animations";
import { whyUs } from "@/lib/content";

export default function WhyUs() {
  const preview = useRef<HTMLDivElement>(null);

  // Slow drift on the footage so the frame doesn't sit dead still.
  useEffect(() => {
    const el = preview.current;
    const media = el?.querySelector("video");
    if (!el || !media) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const st = parallaxOnScroll(media, el, { fromY: "-8%", toY: "8%", fromScale: 1.12, toScale: 1.12 });
    return () => st.kill();
  }, []);

  return (
    <section className="relative bg-white py-[6rem] md:py-[15rem]">
      <div className="container">
        <div className="mb-[6rem] grid md:mb-[10rem] md:grid-cols-[auto_97.6rem]">
          <div className="hidden md:block">
            <RevealWords className="text-[2rem] font-semibold leading-[140%]">
              {whyUs.label}
            </RevealWords>
          </div>
          <RevealWords
            as="h2"
            className="text-[3rem] font-medium leading-[115%] tracking-[-0.01em] md:text-[5.6rem] md:tracking-[-0.03em]"
          >
            {whyUs.lead} <span className="em">{whyUs.rest}</span>
          </RevealWords>
        </div>

        <ClipIn selector="[data-preview]">
          <div
            ref={preview}
            data-preview
            className="-mx-[2rem] aspect-[365/450] overflow-hidden md:mx-0 md:aspect-auto md:h-[97.6rem]"
          >
            <video
              src="/videos/why-us.mp4"
              autoPlay
              playsInline
              loop
              muted
              className="h-full w-full object-cover"
            />
          </div>
        </ClipIn>
      </div>
    </section>
  );
}
