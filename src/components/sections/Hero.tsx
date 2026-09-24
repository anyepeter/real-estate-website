"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, revealWords } from "@/lib/animations";
import { ButtonLink } from "@/components/ui/button";
import { LogoType } from "@/components/Logo";
import { hero } from "@/lib/content";
import { href, type Locale } from "@/lib/i18n";

/**
 * A 500vh scroll stage with a sticky 100vh viewport.
 *
 * The camera appears to descend the building: the house scales up and
 * rises while clouds part sideways and fog settles. Two copies of the
 * house are kept in sync — the second lives inside a layer masked to the
 * FIND logotype, so as the building drifts out of frame the wordmark
 * stays behind, filled with the façade. A stroked copy of the same
 * artwork bridges the handoff.
 */
export default function Hero({ lang }: { lang: Locale }) {
  const root = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el.querySelectorAll("[data-hero-logo]"), { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const houses = el.querySelectorAll("[data-hero-house]");
      const clouds = el.querySelectorAll("[data-hero-cloud]");

      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      // Descent: both house copies move as one.
      tl.to(houses, { scale: 1.3, y: "-40%", duration: 1 }, 0)
        // Clouds part, each by 15% of its own width.
        .to(clouds[0], { xPercent: -15, duration: 1 }, 0)
        .to(clouds[1], { xPercent: 15, duration: 1 }, 0)
        // Fog rises to meet the camera.
        .fromTo("[data-hero-smoke-sticky]", { yPercent: 70 }, { yPercent: 0, duration: 1 }, 0)
        // Copy clears out early so the building has the frame to itself,
        // easing back in scale across the whole descent.
        .to(content.current, { opacity: 0, duration: 0.2 }, 0)
        .to(content.current, { scale: 0.9, duration: 1 }, 0)
        // Outline logo draws on, then hands off to the masked fill.
        .to("[data-hero-logo]", { opacity: 1, duration: 0.1 }, 0.05)
        .to("[data-hero-logo]", { opacity: 0, duration: 0.2 }, 0.25)
        // Cross-fade: the building itself dissolves over the same beat the
        // masked copy arrives, so the wordmark is all that's left of it.
        .to("[data-hero-composite]", { opacity: 1, duration: 0.1 }, 0.3)
        .to("[data-hero-house-main]", { opacity: 0, duration: 0.1 }, 0.3);
    }, el);

    return () => ctx.revert();
  }, []);

  // Entrance: headline rises out of its mask, supporting copy follows.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const run = () => {
      if (!title.current) return;
      title.current.classList.add("is-ready");
      revealWords(title.current, { duration: 2, delay: 0.15 });
      gsap.fromTo(
        "[data-hero-fade]",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.6, stagger: 0.12, delay: 0.45, ease: "expo.out" }
      );
    };
    if (document.fonts?.status === "loaded") run();
    else document.fonts?.ready.then(run).catch(run);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => clearTimeout(id);
  }, []);

  return (
    <section
      ref={root}
      className="relative -mt-[8.4rem] mb-[-100vh] h-[350vh] md:-mt-[9.8rem] md:h-[500vh]"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* ---- stage ---- */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* sky */}
          <div className="absolute inset-0">
            <Image
              src="/images/hero-back.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>

          {/* building */}
          <House main />

          {/* the same building, clipped to the logotype */}
          <div
            data-hero-composite
            className="absolute inset-0 z-[1] opacity-0 [mask-image:url(/logotype.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:23.5rem_10.2rem] md:[mask-size:97.7rem_42.3rem]"
          >
            <House />
          </div>

          {/* clouds */}
          <div className="absolute inset-0 z-[2]">
            <div
              data-hero-cloud
              className="absolute left-[-57.2rem] top-[33.7rem] h-[29.8rem] w-[70.2rem] md:left-[-33.72rem] md:top-[25%] md:h-[47.7rem] md:w-[112.4rem]"
            >
              <Image src="/images/cloud.png" alt="" fill sizes="112rem" className="object-cover" />
            </div>
            <div
              data-hero-cloud
              className="absolute right-[-41.2rem] top-[37.12rem] h-[23.6rem] w-[55.7rem] md:right-[-33.72rem] md:top-[20%] md:h-[39.7rem] md:w-[93.6rem]"
            >
              <Image src="/images/cloud.png" alt="" fill sizes="94rem" className="object-cover" />
            </div>
          </div>

          {/* stroked logotype */}
          <div
            data-hero-logo
            className="absolute left-[calc(50%-11.75rem)] top-[calc(50%-5.1rem)] z-[1] h-[10.2rem] w-[23.5rem] opacity-0 md:left-[calc(50%-48.85rem)] md:top-[calc(50%-21.15rem)] md:h-[42.3rem] md:w-[97.7rem]"
          >
            <LogoType className="h-full w-full overflow-visible [&_path]:fill-transparent [&_path]:stroke-white [&_path]:[stroke-width:3px] md:[&_path]:[stroke-width:2px]" />
          </div>

          {/* fog */}
          <div
            data-hero-smoke-sticky
            className="absolute bottom-0 left-0 right-0 z-[3] h-[45rem] md:h-[62rem]"
          >
            <Image
              src="/images/smoke.png"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-top"
            />
          </div>
        </div>

        {/* ---- copy ---- */}
        <div
          ref={content}
          className="relative grid h-full items-center pb-[15rem] md:pb-[22.8rem]"
        >
          <div className="container">
            <h1
              ref={title}
              className="will-reveal text-center text-[5.4rem] font-bold leading-[100%] tracking-[-0.02em] md:text-[14rem]"
            >
              {hero.title}
            </h1>
            <p
              data-hero-fade
              className="mt-[1.5rem] text-balance text-center text-[1.6rem] font-medium leading-[150%] md:mt-[2rem] md:text-[3.2rem] md:leading-[130%] md:tracking-[-0.01em]"
            >
              {hero.lead} <span className="text-[rgba(21,23,23,0.5)]">{hero.rest}</span>
            </p>
            <div data-hero-fade className="mt-[3rem] flex justify-center md:mt-[4rem]">
              <ButtonLink href={href(lang, hero.cta.href)}>{hero.cta.label}</ButtonLink>
            </div>
          </div>
        </div>
      </div>

      {/* fog that carries over the seam into the next section */}
      <div className="pointer-events-none absolute bottom-[100vh] left-0 right-0 top-0">
        <div className="absolute bottom-0 left-0 right-0 z-[3] h-[45rem] md:h-[62rem]">
          <Image
            src="/images/smoke.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-top"
          />
        </div>
      </div>

      {/* wash to white so the seam disappears */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[3] h-[10rem] bg-gradient-to-b from-transparent to-white md:h-[30.9rem]" />
    </section>
  );
}

function House({ main = false }: { main?: boolean }) {
  return (
    <div
      data-hero-house
      {...(main ? { "data-hero-house-main": "" } : {})}
      className="absolute left-0 right-0 top-[60vh] z-[1] h-[33.4rem] origin-bottom md:h-[170.8rem]"
    >
      <Image
        src="/images/house.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-contain"
      />
    </div>
  );
}
