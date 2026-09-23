/**
 * All landing-page copy in one place. `lead`/`rest` pairs drive the
 * two-tone treatment: the lead clause sits in ink, the rest in grey.
 *
 * ───────────────────────────────────────────────────────────────────────────
 *  PLACEHOLDER CONTENT. Everything here is provisional and written for a
 *  Dubai brokerage. Two rules it already obeys, which must survive editing:
 *
 *  1. No service is advertised that the trade licence does not cover.
 *     Brokerage only — buying, selling, leasing. Property management and
 *     mortgage advisory are deliberately absent; advertising an unlicensed
 *     activity is a RERA problem, not a copy preference.
 *
 *  2. No fabricated social proof. The testimonials below are marked
 *     placeholders, not invented clients. Replace with real reviews or
 *     remove the section.
 *
 *  The image paths still point at the cloned site's photography. Every file
 *  under public/images/ has to be replaced before this goes anywhere public.
 * ───────────────────────────────────────────────────────────────────────────
 */

import { brand } from "./brand";

export const nav = [
  { label: "Buy", href: "/buy" },
  { label: "Rent", href: "/rent" },
  { label: "Sell", href: "/sell" },
  {
    label: "Commercial",
    href: "/commercial",
    items: ["Offices", "Retail", "Warehouses", "Coworking"],
  },
  {
    label: "Areas",
    href: "/areas",
    items: ["Dubai Marina", "Business Bay", "Downtown Dubai", "JVC"],
  },
  {
    label: "Insights",
    href: "/insights",
    items: ["Market Data", "Guides", "Blog"],
  },
];

export const hero = {
  title: "Find Your Place in Dubai",
  lead: "Licensed brokerage. Verified listings.",
  rest: "Every property permitted, every price current.",
  cta: { label: "Browse Properties", href: "/buy" },
};

export const whyUs = {
  label: `Why ${brand.name}`,
  lead: "Dubai moves fast. Your search shouldn’t feel like guesswork.",
  rest: "We work one property at a time, with current prices and real availability — not listings that went weeks ago.",
};

export const arrows = {
  titleLead: "This isn’t just",
  titleRest: "about property.",
  images: [
    { src: "/images/arrow-1.jpg", alt: "Residential towers along a Dubai waterfront" },
    { src: "/images/arrow-2.jpg", alt: "Sunlit bedroom with a skyline view" },
    { src: "/images/arrow-3.jpg", alt: "Dining area in a modern Dubai apartment" },
    { src: "/images/arrow-4.jpg", alt: "Agent outside a Business Bay tower" },
  ],
  lead: "It’s a visa, a school run, a commute, a first home in a new country.",
  rest: "Getting it right matters more here than almost anywhere. That’s the part we take seriously.",
};

export const rewired = {
  titleLead: "Dubai Property,",
  titleRest: "Without the Noise.",
  cta: { label: "Start Your Search", href: "/buy" },
  label: "Steps:",
  steps: [
    { lead: "Tell us what you need.", rest: "Budget, area, timing — and what actually matters to you." },
    { lead: "See what’s genuinely available.", rest: "Permitted listings, current prices, no bait." },
    { lead: "Move.", rest: "We handle the paperwork, Ejari and handover." },
  ],
};

/**
 * Repurposed from the clone's agent-recruitment slot into the inbound
 * mandate funnel — the actual acquisition channel for a brokerage this size.
 */
export const forAgents = {
  label: "For Owners",
  titleLead: "Have a Property",
  titleRest: "to List?",
  lead: "Free valuation, based on what comparable units in your building actually transacted for.",
  rest: "We handle the Form A, the DLD advertising permit and the photography, and your property goes live the same week. You get one point of contact for the whole process — not a call centre, not a rotating cast of agents.",
  cta: { label: "Request a Valuation", href: "/sell" },
};

export const testimonials = {
  titleLead: "Don’t Take",
  titleRest: "Our Word for It.",
  image: "/images/testimonials.jpg",
  /**
   * PLACEHOLDER — these are not real reviews and must not ship as such.
   * Replace with genuine client reviews (which also feed AggregateRating
   * structured data) or delete the section from app/page.tsx.
   */
  items: [
    {
      quote: "\"Placeholder — a real client review goes here before launch.\"",
      author: "Client name",
      rating: 5,
    },
    {
      quote: "\"Placeholder — a real client review goes here before launch.\"",
      author: "Client name",
      rating: 5,
    },
    {
      quote: "\"Placeholder — a real client review goes here before launch.\"",
      author: "Client name",
      rating: 5,
    },
  ],
};

export const services = {
  label: "Services",
  titleLead: `How ${brand.name}`,
  titleRest: "Can Help You",
  items: [
    {
      name: "Buy",
      image: "/images/service-buy.jpg",
      text: "Ready and off-plan across Dubai. We show you what the building actually transacted for before you make an offer, not just what it’s listed at.",
      href: "/buy",
    },
    {
      name: "Sell",
      image: "/images/service-sell.jpg",
      text: "Priced against real DLD transaction data, permitted properly, photographed well, and marketed where buyers are actually looking.",
      href: "/sell",
    },
    {
      name: "Rent",
      image: "/images/service-rent.jpg",
      text: "Long and short term, furnished and unfurnished. Current availability only — if it’s on the site, it’s still on the market.",
      href: "/rent",
    },
  ],
  briefLead: "A licensed Dubai brokerage covering sales and leasing",
  briefRest: "across residential, commercial and workspace.",
  cta: { label: "Talk to Us", href: "/contact" },
};

export const features = {
  titleLead: "Beyond the",
  titleRest: "Transaction",
  lead: "The Dubai market never stands still — and the public data is better here than almost anywhere.",
  rest: "We use it, and we publish it, so you can see the market the way we do.",
  cta: { label: "Explore Insights", href: "/insights" },
  items: [
    {
      title: "Off-Plan & New Projects",
      text: "Every DLD-registered launch, with registration status and construction progress from the official project registry.",
      image: "/images/feature-development.jpg",
      href: "/off-plan",
    },
    {
      title: "Commercial & Workspace",
      text: "Offices, retail, warehouses and coworking — the corner of the market the big portals barely cover.",
      image: "/images/feature-property.jpg",
      href: "/commercial",
    },
    {
      title: "Market Data & Valuations",
      text: "Recorded sale and rent prices by area and building, straight from Dubai Land Department open data.",
      image: "/images/feature-mortgage.jpg",
      href: "/insights",
    },
  ],
};

export const latestPosts = {
  titleLead: "Guides &",
  titleRest: "Market Data",
  text: "The things people actually ask us, written down properly — plus what the transaction record says about each area.",
  cta: { label: "Read the Guides", href: "/insights" },
  /** PLACEHOLDER — titles reflect the planned editorial, none are written yet. */
  items: [
    {
      date: "2026-09-01",
      title: "Renting in Dubai as a New Expat: The Whole Process, Start to Finish",
      text: "Ejari, the deposit, the cheques, the agent fee and the handover — what each step costs and when it happens.",
      image: "/images/feature-property.jpg",
      href: "/insights/renting-in-dubai-guide",
    },
    {
      date: "2026-08-15",
      title: "What a 2-Bed in Business Bay Actually Rents For",
      text: "Recorded transactions by tower, not asking prices — and how far the gap between the two really goes.",
      image: "/images/feature-mortgage.jpg",
      href: "/insights/business-bay-2-bed-rents",
    },
    {
      date: "2026-08-02",
      title: "Buying Off-Plan in Dubai: How to Check a Project Before You Commit",
      text: "Escrow, DLD project registration and completion percentage — all public, all checkable in ten minutes.",
      image: "/images/feature-development.jpg",
      href: "/insights/off-plan-due-diligence",
    },
  ],
};

export const outro = {
  lead: "Know What You’re Looking For?",
  rest: "Let’s Go Find It.",
  cta: { label: "Get Started", href: "/contact" },
  image: "/images/outro-bg.jpg",
};

export const footer = {
  newsletterTitle: "Market updates, once a month.",
  placeholder: "Enter your email",
  contacts: [
    {
      label: "Office",
      value: `${brand.contact.address.line1},\n${brand.contact.address.line2}, ${brand.contact.address.city}`,
    },
    { label: "Email Us", value: brand.contact.email, href: `mailto:${brand.contact.email}` },
    {
      label: "Call Us",
      value: brand.contact.phone,
      href: `tel:${brand.contact.phone.replace(/\s/g, "")}`,
    },
  ],
  nav: [
    { label: "Buy", href: "/buy" },
    { label: "Rent", href: "/rent" },
    { label: "Sell", href: "/sell" },
    { label: "Commercial", href: "/commercial" },
    { label: "Insights", href: "/insights" },
  ],
  /** PLACEHOLDER — accounts not created yet. See the roadmap: these need to
      exist and be posting manually from week 1 so the Instagram API has
      impression quota by the time app review clears. */
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
    { label: "TikTok", href: "https://tiktok.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
  ],
  /** UAE-appropriate. The clone shipped US federal and New York State
      housing notices — Fair Housing, Housing Choice Vouchers, Reasonable
      Accommodation — which mean nothing here and read as an unedited template. */
  sublinks: ["Terms", "Privacy Policy", "Cookie Policy", "RERA Compliance"],
};
