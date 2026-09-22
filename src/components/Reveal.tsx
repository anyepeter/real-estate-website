"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  gsap,
  revealWordsOnScroll,
  fadeUpOnScroll,
  fadeXOnScroll,
  clipRevealOnScroll,
  fadeOnScroll,
} from "@/lib/animations";

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Splitting has to wait for webfonts — measuring against the fallback
 * puts the line breaks in the wrong place and the mask clips mid-word.
 */
function useAfterFonts(run: (el: HTMLElement) => (() => void) | void) {
  const ref = React.useRef<HTMLElement>(null);
  const runRef = React.useRef(run);
  runRef.current = run;

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cleanup: (() => void) | void;
    let cancelled = false;

    const start = () => {
      if (cancelled || !ref.current) return;
      ref.current.classList.add("is-ready");
      if (prefersReduced()) return;
      cleanup = runRef.current(ref.current);
    };

    if (document.fonts?.status === "loaded") start();
    else document.fonts?.ready.then(start).catch(start);

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return ref;
}

type Tag = "div" | "h1" | "h2" | "h3" | "p" | "span" | "li";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  as?: Tag;
  delay?: number;
  duration?: number;
};

/** Masked word rise — the headline treatment used site-wide. */
export function RevealWords({ children, className, as = "div", delay, duration }: RevealProps) {
  const ref = useAfterFonts((el) => {
    const st = revealWordsOnScroll(el, { delay, duration });
    return () => st.kill();
  });
  const Tag = as as React.ElementType;
  return (
    <Tag ref={ref} className={cn("will-reveal", className)}>
      {children}
    </Tag>
  );
}

/** Fade + rise for blocks and staggered lists. */
export function FadeUp({
  children,
  className,
  as = "div",
  stagger,
  selector,
  fromY,
}: RevealProps & { stagger?: number; selector?: string; fromY?: number }) {
  const ref = useAfterFonts((el) => {
    const targets = selector ? el.querySelectorAll(selector) : el;
    const st = fadeUpOnScroll(el, targets, { stagger, fromY });
    return () => st.kill();
  });
  const Tag = as as React.ElementType;
  return (
    <Tag ref={ref} className={cn("will-reveal", className)}>
      {children}
    </Tag>
  );
}

/** Horizontal variant of FadeUp. */
export function FadeInX({
  children,
  className,
  as = "div",
  selector,
}: RevealProps & { selector?: string }) {
  const ref = useAfterFonts((el) => {
    const st = fadeXOnScroll(el, selector ? el.querySelectorAll(selector) : el);
    return () => st.kill();
  });
  const Tag = as as React.ElementType;
  return (
    <Tag ref={ref} className={cn("will-reveal", className)}>
      {children}
    </Tag>
  );
}

/** Left-to-right clip wipe — the image treatment. */
export function ClipIn({
  children,
  className,
  as = "div",
  selector,
  duration,
}: RevealProps & { selector?: string }) {
  const ref = useAfterFonts((el) => {
    const targets = selector ? el.querySelectorAll(selector) : el;
    gsap.set(targets, { clipPath: "inset(0 100% 0 0)" });
    const st = clipRevealOnScroll(el, targets, { duration });
    return () => st.kill();
  });
  const Tag = as as React.ElementType;
  return (
    <Tag ref={ref} className={cn("will-reveal", className)}>
      {children}
    </Tag>
  );
}

/** Plain opacity fade. */
export function FadeIn({
  children,
  className,
  as = "div",
  selector,
  stagger,
}: RevealProps & { selector?: string; stagger?: number }) {
  const ref = useAfterFonts((el) => {
    const st = fadeOnScroll(el, selector ? el.querySelectorAll(selector) : el, { stagger });
    return () => st.kill();
  });
  const Tag = as as React.ElementType;
  return (
    <Tag ref={ref} className={cn("will-reveal", className)}>
      {children}
    </Tag>
  );
}
