# FIND Real Estate — landing page

A clone of the `findrealestate.com` landing page, rebuilt on Next.js + Tailwind + GSAP.

## Stack

| | |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn-style primitives (CVA + Radix conventions) |
| Animation | GSAP 3 — ScrollTrigger, SplitText, CustomEase |
| Smooth scroll | Lenis, driven off the GSAP ticker |
| Carousel | Swiper |

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## The sizing system

The whole design is authored in `rem` against a **fluid root font-size**, which is how
the original scales every dimension — type, spacing, image boxes — from one set of numbers:

```css
html { font-size: 2.6666666667vw }                    /* 10px @ 375px  */
@media (min-width: 768px)  { html { font-size: .5208333333vw } }  /* 10px @ 1920px */
@media (min-width: 1920px) { html { font-size: 10px } }           /* frozen        */
```

So `7.2rem` is 72px on a 1920px screen and shrinks proportionally below that. There are only
two breakpoints in the entire page. Verified against the original: both report a computed
root of `8.33333px` at a 1600px viewport.

## The hero

A 500vh scroll stage with a sticky 100vh viewport, driven by one scrubbed timeline.
The camera appears to descend the building while the FIND wordmark assembles out of it:

| Layer | Animation | Ease |
|---|---|---|
| house (two copies) | `scale 1 → 1.3`, `y 0 → -40%` | `power2.out` |
| clouds | `x 0 → ∓15%` of own width | `power2.out` |
| fog | `y 70% → 0%` | `power2.out` |
| copy | `opacity 1 → 0` (0–20%), `scale 1 → 0.9` | `power2.out` |
| stroked logotype | fade in 5–15%, out 25–45% | — |
| masked composite | `opacity 0 → 1` at 30–40% | `power2.out` |

The trick is the **cross-fade at 30–40%**: there are two copies of the building, and the
second lives inside a layer masked to the logotype (`/logotype.svg`). As the real building
dissolves, the masked twin arrives — so all that remains of the façade is the wordmark
filled with it.

These curves were measured off the live original by sampling computed styles at 21 scroll
positions, not guessed.

## Animation primitives

`src/lib/animations.ts` ports the original's reusable set — same durations, staggers and eases:

- `revealWords` — masked word rise (`y 115% → 0`, 2s, `power4.out`, stagger `{amount: .4}` over 5 words)
- `clipReveal` — `inset(0 100% 0 0) → inset(0 0% 0 0)` wipe, 2s, `power3.out`
- `fadeUp` / `fadeX` — 70px travel, 2s, `expo.out`
- `lineWipe` — per-line cover retracting right, `power3.out`
- `parallax` — `10% → -10%` scrubbed at 1.5
- `fade`, `counter`

`src/components/Reveal.tsx` wraps these as declarative components that split only after
`document.fonts.ready` (splitting against a fallback face breaks the line boxes) and respect
`prefers-reduced-motion`.

## Assets

All imagery, the video, and the logotype are the originals, pulled from the live site.
`house.png` was 26MB; re-encoded to WebP at 3.9MB with alpha intact.

**One substitution:** the three blog thumbnails are lazy-loaded from a CMS on the original and
have no `src` in the served HTML, so they were never fetchable. The feature photography stands
in for them — swap `image` in `src/lib/content.ts` when real posts exist.

## Notes

- Copy lives in `src/lib/content.ts` as `lead`/`rest` pairs, which drive the two-tone
  headline treatment (lead clause in ink, remainder in grey) used in every section.
- Nav destinations are placeholders with `prefetch={false}`, since only the landing page
  is in scope — remove that once the routes exist.
