"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap, MENU_EASE, revealWords, fadeUp } from "@/lib/animations";
import { ButtonLink } from "@/components/ui/button";
import { nav } from "@/lib/content";

/**
 * Mobile overlay. The backdrop unrolls vertically on the house ease,
 * then the links rise out of their masks behind it.
 */
export default function BurgerMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const built = useRef(false);

  useEffect(() => {
    const el = root.current;
    const bd = backdrop.current;
    if (!el || !bd) return;

    if (open) {
      gsap.set(el, { pointerEvents: "auto", opacity: 1 });
      document.body.style.overflow = "hidden";
      document.body.setAttribute("data-lenis-prevent", "true");

      const tl = gsap.timeline();
      tl.fromTo(bd, { scaleY: 0 }, { scaleY: 1, duration: 0.7, ease: MENU_EASE }, 0);

      // Split once; re-splitting on every open leaks wrappers.
      if (!built.current) {
        built.current = true;
        el.querySelectorAll<HTMLElement>("[data-menu-item]").forEach((item, i) => {
          tl.add(revealWords(item, { duration: 1.2 }), 0.4 + i * 0.04);
        });
        tl.add(fadeUp(el.querySelectorAll("[data-menu-action]"), { duration: 1.2 }), 0.6);
      } else {
        tl.fromTo(
          el.querySelectorAll("[data-menu-item], [data-menu-action]"),
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.05, ease: "expo.out" },
          0.4
        );
      }
      return () => {
        tl.kill();
      };
    }

    document.body.style.overflow = "";
    document.body.removeAttribute("data-lenis-prevent");
    const tl = gsap.timeline();
    tl.fromTo(bd, { scaleY: 1 }, { scaleY: 0, duration: 0.7, ease: MENU_EASE }, 0).fromTo(
      el,
      { opacity: 1 },
      { opacity: 0, duration: 0.7, ease: MENU_EASE, onComplete: () => gsap.set(el, { pointerEvents: "none" }) },
      0
    );
    return () => {
      tl.kill();
    };
  }, [open]);

  useEffect(
    () => () => {
      document.body.style.overflow = "";
      document.body.removeAttribute("data-lenis-prevent");
    },
    []
  );

  return (
    <div
      ref={root}
      aria-hidden={!open}
      className="pointer-events-none fixed inset-0 z-40 opacity-0 md:hidden"
    >
      <div ref={backdrop} className="absolute inset-0 origin-top bg-white" />
      <div className="container relative flex h-full flex-col justify-center pt-[8.4rem]">
        <nav className="flex flex-col gap-[1.2rem]">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              data-menu-item
              className="text-[4rem] font-medium leading-[1.1] tracking-[-0.02em]"
             prefetch={false}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div data-menu-action className="mt-[4rem]">
          <ButtonLink href="/sign-in" icon={false} onClick={onClose}>
            Sign In
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
