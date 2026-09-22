/**
 * All landing-page copy in one place. `lead`/`rest` pairs drive the
 * two-tone treatment: the lead clause sits in ink, the rest in grey.
 */

export const nav = [
  { label: "Search", href: "/search" },
  { label: "Agents", href: "/agents" },
  { label: "Join", href: "/join", items: ["Why FIND", "Agent Benefits", "Apply"] },
  { label: "Paperwork", href: "/paperwork", items: ["Forms", "Disclosures", "Contracts"] },
  { label: "Resources", href: "/resources", items: ["Blog", "Market Reports", "Guides"] },
  { label: "About", href: "/about", items: ["Our Story", "Leadership", "Careers"] },
];

export const hero = {
  title: "Find What Moves You",
  lead: "Expert agents. Real guidance.",
  rest: "A clear path to find what’s next.",
  cta: { label: "Find Properties", href: "/search" },
};

export const whyUs = {
  label: "Why FIND",
  lead: "Your life’s changing. Don’t just find a place — find what’s next.",
  rest: "We help you move forward with clarity, confidence, and the right agent by your side.",
};

export const arrows = {
  titleLead: "This isn’t just",
  titleRest: "about real estate.",
  images: [
    { src: "/images/arrow-1.jpg", alt: "Agent walking a city block" },
    { src: "/images/arrow-2.jpg", alt: "Sunlit bedroom with skyline view" },
    { src: "/images/arrow-3.jpg", alt: "Dining area in a modern apartment" },
    { src: "/images/arrow-4.jpg", alt: "Agent outside a downtown building" },
  ],
  lead: "It’s about identity. Progress. Getting unstuck. You’re not just looking for a place.",
  rest: "You’re looking for alignment. That’s what we help you find.",
};

export const rewired = {
  titleLead: "Real Estate,",
  titleRest: "Rewired.",
  cta: { label: "Start Your Search", href: "/search" },
  label: "Steps:",
  steps: [
    { lead: "Talk to a Real Human.", rest: "We match you with an expert who actually listens." },
    { lead: "Get Clarity.", rest: "We define what you really need, not just what’s available." },
    { lead: "Move Forward.", rest: "We find what fits — and make it happen." },
  ],
};

export const forAgents = {
  label: "For Agents",
  titleLead: "Don’t Rent Your Career.",
  titleRest: "Own It.",
  lead: "At FIND, our agents don’t just work for the brand—they own a part of it.",
  rest:
    "We give top performers real equity, so they’re invested in more than just your transaction—they’re invested in your outcome. Agents are certified, supported, and equipped to deliver five-star service—because their success is tied to yours. You’re not just here to close deals — you’re building a career, a life, a legacy. We help agents find the company that gives them the support, tools, and leadership to thrive.",
  cta: { label: "Join The Movement", href: "/join" },
};

export const testimonials = {
  titleLead: "Don’t Take",
  titleRest: "Our Word for It.",
  image: "/images/testimonials.jpg",
  items: [
    {
      quote:
        "\"Michael was a great realtor. Such a hard worker, dedicated to helping us find the perfect neighborhood, price point and home. He's a workaholic so he was available morning, noon and night. Tireless and dedicated. Would recommend him 100%!\"",
      author: "Bernadette Hogan",
      rating: 5,
    },
    {
      quote:
        "\"Working with FIND took every bit of guesswork out of the process. They listened first, then brought us options that actually matched how we wanted to live. We closed faster than we thought possible.\"",
      author: "Tyleen",
      rating: 5,
    },
    {
      quote:
        "\"I had been searching on my own for months with nothing to show for it. One conversation with my FIND agent and suddenly I was seeing places that fit. Genuinely the easiest part of my move.\"",
      author: "Johanna Nieto",
      rating: 5,
    },
    {
      quote:
        "\"Straightforward, responsive, and honest about what my budget could actually get me. No pressure, no games — just real guidance from someone who knew the market cold.\"",
      author: "mattmpowers",
      rating: 5,
    },
    {
      quote:
        "\"They treated a first-time purchase like it mattered. Every question got a real answer, and I never once felt like just another transaction on someone’s list.\"",
      author: "Giavridis Theodore",
      rating: 5,
    },
  ],
};

export const services = {
  label: "Services",
  titleLead: "How FIND",
  titleRest: "Can Help You",
  items: [
    {
      name: "Buy",
      image: "/images/service-buy.jpg",
      text: "Buy smarter with expert agents backed by mortgage, legal, and appraisal pros—dialed in to get you the best deal, fast. We’ve done this over 10,000 times, and we know what wins.",
      href: "/buy",
    },
    {
      name: "Sell",
      image: "/images/service-sell.jpg",
      text: "Sell fast, sell high. Your listing gets pro staging, strategic pricing, constant open houses, and agents who never stop working until the right buyer signs.",
      href: "/sell",
    },
    {
      name: "Rent",
      image: "/images/service-rent.jpg",
      text: "Access hidden rentals before they hit the market through agents who know every landlord in town. With decades of NYC experience, we unlock the best deals you won’t find online.",
      href: "/rent",
    },
  ],
  briefLead: "Our certified agents guide you through every stage of real estate",
  briefRest: "with expert knowledge and reliable support.",
  cta: { label: "Get Started with FIND", href: "/contact" },
};

export const features = {
  titleLead: "Support Beyond",
  titleRest: "Buying and Selling",
  lead: "The real estate market never stands still — and neither do we.",
  rest: "Our experts offer continued support beyond the sale, helping you maximize your investment.",
  cta: { label: "Discover Our Services", href: "/services" },
  items: [
    {
      title: "Mortgage Services",
      text: "Helping you secure your dream home with flexible mortgage options.",
      image: "/images/feature-mortgage.jpg",
      href: "/services/mortgage",
    },
    {
      title: "Property Management",
      text: "Let us handle the details so you can enjoy the rewards.",
      image: "/images/feature-property.jpg",
      href: "/services/property-management",
    },
    {
      title: "Construction and Real Estate Development",
      text: "Guiding you through the intricacies of building and developing properties with expert insight and support.",
      image: "/images/feature-development.jpg",
      href: "/services/development",
    },
  ],
};

export const latestPosts = {
  titleLead: "Blog &",
  titleRest: "Resources",
  text: "See how we’ve helped clients achieve their real estate dreams, one successful move at a time.",
  cta: { label: "Visit Our Blog", href: "/blog" },
  items: [
    {
      date: "2026-09-02",
      title:
        "FIND Real Estate Featured in Redfin: What It Really Costs to Live in Harry Styles’ Neighborhood",
      text: "A look at the housing prices, everyday expenses, and lifestyle costs in Harry Styles’ neighborhood.",
      image: "/images/feature-property.jpg",
      href: "/blog/redfin-harry-styles-neighborhood",
    },
    {
      date: "2026-04-13",
      title: "Q1 2026 NYC Market Report",
      text: "Q1 2026 saw strong rental demand, active sales, and shifting pricing across NYC. Here’s what it means heading into the spring market.",
      image: "/images/feature-mortgage.jpg",
      href: "/blog/q1-2026-nyc-market-report",
    },
    {
      date: "2026-04-01",
      title: "Philly Real Estate: A Winter Chill or a Spring Opportunity?",
      text: "Record-low listings and steady price growth define a unique February for the Philadelphia Metro.",
      image: "/images/feature-development.jpg",
      href: "/blog/philly-winter-chill-spring-opportunity",
    },
  ],
};

export const outro = {
  lead: "Find You.",
  rest: "We’ll Help You Get There.",
  cta: { label: "Let’s Get Started", href: "/contact" },
  image: "/images/outro-bg.jpg",
};

export const footer = {
  newsletterTitle: "Subscribe to our Newsletter!",
  placeholder: "Enter address",
  contacts: [
    { label: "Head Office", value: "5 West 37th Street, 12th Floor,\nNew York, NY 10018" },
    { label: "Email Us", value: "hello@findrealestate.com", href: "mailto:hello@findrealestate.com" },
    { label: "Call Us", value: "+1 212 994 9965", href: "tel:+12129949965" },
  ],
  nav: [
    { label: "Search", href: "/search" },
    { label: "Agents", href: "/agents" },
    { label: "Join", href: "/join" },
    { label: "About Us", href: "/about" },
    { label: "Agent Portal", href: "/portal" },
  ],
  socials: [
    { label: "Facebook", href: "https://facebook.com" },
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Youtube", href: "https://youtube.com" },
    { label: "Linkedin", href: "https://linkedin.com" },
  ],
  sublinks: [
    "Terms",
    "Privacy policy",
    "Fair Housing Notice",
    "Reasonable Accommodation Notice",
    "Operating Procedure",
    "Press",
    "Housing Choice Vouchers Welcome",
    "Se Aceptan Vales de Elección de Vivienda",
  ],
};
