import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n";

/**
 * Sends bare paths to a locale: / → /en, /buy → /en/buy.
 *
 * Middleware rather than a redirecting page component, because a page would
 * need a root layout to live in, and that layout cannot know the locale —
 * which is the whole thing it exists to set. Redirecting before the router
 * sees the request avoids the problem instead of working around it.
 *
 * 307, not 308: the default locale is a product decision that may later
 * become "detect from Accept-Language", and a permanent redirect is cached
 * by browsers in a way that makes changing your mind expensive.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  /**
   * Everything except Payload's admin and API, the cron endpoint, Next's
   * internals and anything with a file extension. Sending /admin through
   * here would prefix it to /en/admin and break the CMS.
   */
  matcher: ["/((?!api|admin|cron|_next|.*\\..*).*)"],
};
