"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/animations";

/** Thin progress line that runs across the top on first paint. */
export default function LoadingLine() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const tl = gsap.timeline();
    tl.fromTo(
      el,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.1, ease: "power2.inOut", transformOrigin: "left center" }
    ).to(el, { opacity: 0, duration: 0.4, ease: "power1.out" });
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 right-0 top-0 z-[100] h-[2px] origin-left bg-[#151717]"
    />
  );
}
