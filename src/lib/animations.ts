"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

export { gsap, ScrollTrigger, SplitText };

/** The signature ease used for the burger overlay and menu transitions. */
export const MENU_EASE = CustomEase.create("menu", ".76, 0, .2, 1");

type Target = gsap.TweenTarget;

/* ------------------------------------------------------------------ *
 * Word mask reveal
 * Words are split twice: the outer copy clips, the inner copy rises
 * from below the clip. The padding/negative-margin pair keeps
 * descenders and diacritics from being shaved off by the clip.
 * ------------------------------------------------------------------ */
export function revealWords(
  target: Element,
  opts: { duration?: number; delay?: number; ease?: string } = {}
) {
  const o = { duration: 2, delay: 0, ease: "power4.out", ...opts };
  const tl = gsap.timeline();

  // `mask: "words"` wraps each word in its own overflow-hidden clip, which
  // keeps the inter-word spacing intact (splitting twice by hand collapses it).
  const split = new SplitText(target, { type: "words", mask: "words" });
  const masks = (split as unknown as { masks?: Element[] }).masks ?? [];

  // Slack around the clip so descenders and diacritics aren't shaved off.
  gsap.set(masks, { padding: "0.15em", margin: "-0.15em", verticalAlign: "top" });

  tl.set(split.words, { willChange: "transform" }, 0)
    .fromTo(
      split.words,
      { yPercent: 115 },
      {
        yPercent: 0,
        duration: o.duration,
        // A long line staggers over a fixed window; a short one gets a
        // per-word beat so 2-3 words don't feel instantaneous.
        stagger: split.words.length > 5 ? { amount: 0.4 } : 0.1,
        delay: o.delay,
        ease: o.ease,
      },
      0
    )
    .set(split.words, { willChange: "auto" });

  return tl;
}

export const revealWordsOnScroll = (target: Element, opts = {}) =>
  ScrollTrigger.create({ trigger: target, animation: revealWords(target, opts), once: true });

/* ------------------------------------------------------------------ *
 * Clip wipe — images sweep open left to right.
 * ------------------------------------------------------------------ */
export function clipReveal(
  target: Target,
  opts: {
    from?: string;
    to?: string;
    duration?: number;
    stagger?: number | gsap.StaggerVars;
    ease?: string;
    clearProps?: string;
  } = {}
) {
  const o = {
    from: "inset(0 100% 0 0)",
    to: "inset(0 0% 0 0)",
    duration: 2,
    stagger: { amount: 0.15 },
    ease: "power3.out",
    clearProps: "clipPath",
    ...opts,
  };
  return gsap
    .timeline()
    .fromTo(
      target,
      { clipPath: o.from },
      {
        clipPath: o.to,
        duration: o.duration,
        stagger: o.stagger,
        ease: o.ease,
        clearProps: o.clearProps,
      }
    );
}

export const clipRevealOnScroll = (trigger: Element, target: Target, opts = {}) =>
  ScrollTrigger.create({ trigger, animation: clipReveal(target, opts), once: true });

/* ------------------------------------------------------------------ *
 * Fade + rise
 * ------------------------------------------------------------------ */
export function fadeUp(
  target: Target,
  opts: {
    fromY?: number;
    toY?: number;
    fromX?: number;
    toX?: number;
    duration?: number;
    opacityDuration?: number;
    stagger?: number;
    ease?: string;
  } = {}
) {
  const o = {
    fromY: 70,
    toY: 0,
    fromX: 0,
    toX: 0,
    duration: 2,
    opacityDuration: 0.1,
    stagger: 0.1,
    ease: "expo.out",
    ...opts,
  };
  const tl = gsap.timeline();
  gsap.set(target, { opacity: 0 });
  tl.set(target, { willChange: "transform" })
    .fromTo(target, { opacity: 0 }, { opacity: 1, duration: o.opacityDuration, stagger: o.stagger }, 0)
    .fromTo(
      target,
      { y: o.fromY, x: o.fromX },
      { y: o.toY, x: o.toX, duration: o.duration, stagger: o.stagger, ease: o.ease },
      0
    )
    .set(target, { willChange: "auto" });
  return tl;
}

export const fadeUpOnScroll = (trigger: Element, target: Target, opts = {}) =>
  ScrollTrigger.create({ trigger, animation: fadeUp(target, opts), once: true });

/** Same curve as fadeUp, travelling on X instead. */
export const fadeX = (target: Target, opts = {}) =>
  fadeUp(target, { fromY: 0, fromX: 70, ...opts });

export const fadeXOnScroll = (trigger: Element, target: Target, opts = {}) =>
  ScrollTrigger.create({ trigger, animation: fadeX(target, opts), once: true });

/* ------------------------------------------------------------------ *
 * Plain fade
 * ------------------------------------------------------------------ */
export function fade(
  target: Target,
  opts: { from?: number; to?: number; duration?: number; stagger?: number } = {}
) {
  const o = { from: 0, to: 1, duration: 1, stagger: 0.1, ...opts };
  gsap.set(target, { opacity: 0 });
  return gsap
    .timeline()
    .fromTo(target, { opacity: o.from }, { opacity: o.to, duration: o.duration, stagger: o.stagger }, 0);
}

export const fadeOnScroll = (trigger: Element, target: Target, opts = {}) =>
  ScrollTrigger.create({ trigger, animation: fade(target, opts), once: true });

/* ------------------------------------------------------------------ *
 * Line wipe — a cover sits over each split line and retracts to the
 * right, so copy is uncovered rather than moved.
 * ------------------------------------------------------------------ */
export function lineWipe(
  target: Element,
  opts: { color?: string; style?: gsap.TweenVars; origin?: string } = {}
) {
  const o = {
    color: "rgba(255,255,255,0.8)",
    style: {} as gsap.TweenVars,
    origin: "right center",
    ...opts,
  };
  const tl = gsap.timeline();
  const split = new SplitText(target, { type: "lines" });
  const covers: HTMLDivElement[] = [];

  split.lines.forEach((line) => {
    const cover = document.createElement("div");
    gsap.set(line, { width: "fit-content" });
    gsap.set(cover, {
      position: "absolute",
      top: "10%",
      right: "-1%",
      left: 0,
      bottom: "-10%",
      zIndex: 1,
      opacity: 0.9,
      background: o.color,
      ...o.style,
    });
    line.appendChild(cover);
    covers.push(cover);
  });

  tl.to(
    covers,
    {
      transform: "scaleX(0)",
      transformOrigin: o.origin,
      duration: 2,
      stagger: { amount: 0.15 },
      ease: "power3.out",
    },
    0
  );
  return tl;
}

export const lineWipeOnScroll = (target: Element, opts = {}) =>
  ScrollTrigger.create({
    trigger: target,
    animation: lineWipe(target, opts),
    start: "top bottom-=200px",
    end: "center center",
  });

/* ------------------------------------------------------------------ *
 * Parallax — scrubbed drift across the element's own travel.
 * ------------------------------------------------------------------ */
export function parallax(
  target: Target,
  opts: {
    fromY?: string;
    toY?: string;
    fromScale?: number;
    toScale?: number;
    opacityDuration?: number;
    scaleDuration?: number;
    ease?: string;
  } = {}
) {
  const o = {
    fromY: "10%",
    toY: "-10%",
    fromScale: 1,
    toScale: 1,
    opacityDuration: 0,
    scaleDuration: 1,
    ease: "none",
    ...opts,
  };
  const tl = gsap.timeline();
  tl.set(target, { willChange: "transform" });
  if (o.opacityDuration) {
    tl.fromTo(target, { opacity: 0 }, { opacity: 1, duration: o.opacityDuration, ease: o.ease }, 0);
  }
  if (o.fromScale !== o.toScale && o.scaleDuration) {
    tl.fromTo(
      target,
      { scale: o.fromScale },
      { scale: o.toScale, duration: o.scaleDuration, ease: o.ease },
      0
    );
  }
  tl.fromTo(target, { y: o.fromY }, { y: o.toY, duration: 1, ease: o.ease }, 0).set(target, {
    willChange: "auto",
  });
  return tl;
}

export const parallaxOnScroll = (
  target: Target,
  trigger: Element,
  opts = {},
  stOpts: ScrollTrigger.Vars = {}
) =>
  ScrollTrigger.create({
    trigger,
    animation: parallax(target, opts),
    start: "top bottom",
    end: "bottom top",
    scrub: 1.5,
    ...stOpts,
  });

/* ------------------------------------------------------------------ *
 * Number counter
 * ------------------------------------------------------------------ */
export function counter(el: HTMLElement, opts: { from?: number; to?: number } = {}) {
  const o = { from: 0, ...opts };
  const proxy = { i: o.from };
  const format = (n: number) => n.toLocaleString("en-US");

  if (o.to != null) el.dataset.count = String(o.to);
  else if (!el.dataset.count) el.dataset.count = el.innerText.replace(/,/g, "").trim();

  const to = Number.parseFloat(el.dataset.count || "0") || 0;
  const decimals = el.dataset.count?.includes(".")
    ? el.dataset.count.split(".")[1]?.length
    : undefined;

  el.innerText = decimals ? o.from.toFixed(decimals) : format(o.from);

  return gsap.timeline().fromTo(
    proxy,
    { i: o.from },
    {
      i: to,
      duration: 1.5,
      immediateRender: false,
      ease: String(Math.floor(to)).length < 3 || decimals ? "power2.inOut" : "expo.out",
      onUpdate: () => {
        el.innerText = decimals ? proxy.i.toFixed(decimals) : format(proxy.i);
      },
    }
  );
}

export const counterOnScroll = (el: HTMLElement, opts = {}) =>
  ScrollTrigger.create({ trigger: el, animation: counter(el, opts), once: true });
