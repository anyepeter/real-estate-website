"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/animations";

/**
 * Lenis drives the scroll and GSAP's ticker drives Lenis, so scrubbed
 * ScrollTriggers stay in lockstep with the smoothed position instead of
 * lagging a frame behind it.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // The sticky hero measures in vh; re-measure once mobile chrome settles.
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      gsap.ticker.remove(raf);
      window.removeEventListener("resize", onResize);
      lenis.destroy();
    };
  }, []);

  return null;
}
