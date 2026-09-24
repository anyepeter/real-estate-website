/**
 * The site's public origin.
 *
 * Centralised because getting it wrong is silent: a relative canonical, a
 * relative OG image or a localhost URL in a sitemap all render fine and
 * simply don't work once deployed. One place to set it, one place to be
 * wrong.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

/** Absolute URL from a site-relative path. */
export function abs(path: string): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
