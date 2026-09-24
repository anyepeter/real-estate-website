import type { MetadataRoute } from "next";
import { abs } from "@/lib/site";

/**
 * robots.txt.
 *
 * Two deliberate positions here, both taken from the competitor teardown.
 *
 * 1. /search is disallowed. It is the one query-string route on the site,
 *    and letting a crawler loose on faceted search is the infinite-URL trap
 *    that quietly eats a property site's crawl budget. Property Finder
 *    blocks roughly forty facet parameters for exactly this reason and
 *    funnels everything into clean landing-page URLs. So do we.
 *
 * 2. AI crawlers are allowed, on purpose rather than by default. Property
 *    Finder blocks CCBot; most UAE brokerages ship no structured data at
 *    all. That leaves nobody well-positioned to be the cited source when
 *    someone asks an answer engine what a 2-bed in JVC rents for — and
 *    being that source is the cheapest distribution available to a
 *    brokerage this size.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/search", // faceted, query-string, deliberately noindex
          "/admin", // Payload CMS
          "/api/",
          "/cron/",
          "/*?sent=", // form confirmation states
          "/*?error=",
        ],
      },
      // Named explicitly so the intent survives someone later tightening
      // the wildcard rule above without thinking about it.
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
    ],
    sitemap: abs("/sitemap.xml"),
  };
}
