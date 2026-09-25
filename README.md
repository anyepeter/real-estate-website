# Dubai Real Estate Platform

A bilingual (EN/AR) brokerage site for a licensed Dubai agency — buy, rent and sell across
residential, commercial and workspace — with a Payload CMS admin behind it.

> **Brand is a placeholder.** The site ships as "ACME" pending a trade-name decision with DET.
> Changing it is one file: [`src/lib/brand.ts`](src/lib/brand.ts).
>
> **The wordmark is not ours.** `public/logotype.svg` and the SVG paths in
> [`src/components/Logo.tsx`](src/components/Logo.tsx) still spell FIND and came from the
> reference site this was built on. **Replace before any public deploy.**

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) · React 19 · TypeScript |
| Styling | Tailwind CSS v4 · shadcn primitives |
| Animation | GSAP 3 (ScrollTrigger, SplitText) · Lenis — marketing pages only |
| CMS / admin | Payload 3, mounted at `/admin` in the same app |
| Database | PostgreSQL + PostGIS (Neon) |
| Media | Payload uploads → AVIF at four widths |

## Getting started

```bash
npm install
cp .env.example .env.local     # then fill it in — see below
npm run dev                    # http://localhost:3000
```

### The site runs without a database

`lib/data` falls back to fixtures when `DATABASE_URI` is unset, and warns loudly on boot. The
public pages work; nothing you see is real inventory. `/admin` does **not** work without a
database.

### Connecting the database

1. Create a free project at [neon.tech](https://neon.tech)
2. In its SQL editor: `CREATE EXTENSION IF NOT EXISTS postgis;`
3. Copy the **pooled** connection string into `.env.local`:

```
DATABASE_URI=postgresql://…pooled…
PAYLOAD_SECRET=…            # node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
NEXT_PUBLIC_SITE_URL=http://localhost:3000
CRON_SECRET=…               # any long random string
```

4. Then:

```bash
npm run migrate      # create the tables
npm run seed         # ~60 Dubai areas, idempotent
npm run dev
```

### Creating the first admin user

Visit **http://localhost:3000/admin**. On a fresh database Payload shows a *create first user*
form — you set the email and password there. There is no seeded account and no default
password by design.

## Scripts

| | |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm run migrate` · `migrate:create` | Payload schema migrations |
| `npm run seed` | Seed the Dubai area tree (safe to re-run) |
| `npm run generate:types` | Regenerate `payload-types.ts` after a collection change |
| `npm run generate:importmap` | Regenerate Payload's import map after adding an admin component |
| `npm run ui:fix` | Correct the `cn` import shadcn emits — run after every `shadcn add` |

## Architecture worth knowing

**Two route groups, two root layouts.** `(frontend)` renders the public site under `[lang]`;
`(payload)` renders the admin. Payload emits its own `<html>`, so they cannot share a parent.

**`lib/data` is the only module that knows where listings come from.** Pages never import
fixtures or Payload directly. Swapping implementations is a switch in one file.

**A listing cannot publish without a valid advertising permit.** Enforced in a `beforeChange`
hook on the collection, not in admin validation — so the feed importer, any API route and seed
scripts all hit the same gate. Checked again at read time, because the nightly sweep runs once
a day and a permit can lapse at any hour in between.

**Query strings are never indexed.** `/buy` is canonical and indexable; `/buy?beds=2` is
`noindex,follow` canonicalised back to it; `/search` is permanently noindex and
robots-disallowed. Faceted navigation is the crawl-budget trap this architecture exists to
avoid.

**Marketing pages carry the motion; listing pages do not.** GSAP ships globally via
`SmoothScroll`, but the pages that have to rank and convert are Server Components with no
client JavaScript of their own — including both lead forms, which work with scripting
disabled.

## Compliance

RERA requires the brokerage name and ORN on every advert. Those live in `lib/brand.ts` and
render in the footer, on every listing card, and on the social card.

`/cron/expiry` runs nightly (see `vercel.json`) and watches three clocks: advertising permits,
broker cards, and the trade licence itself. All three of the current documents expire on the
same day, so one missed renewal takes everything down at once. The endpoint fails closed
without `CRON_SECRET`.
