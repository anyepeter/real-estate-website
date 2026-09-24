/**
 * Locales.
 *
 * Built now rather than retrofitted, because adding a [lang] segment later
 * means moving every route file and rewriting every internal link — and
 * Arabic is the single biggest gap in the competitor set. haus & haus is
 * English-only in an Arabic-speaking country; Property Finder runs full
 * EN/AR with translated slugs and takes the traffic.
 *
 * Arabic copy does not exist yet. That is fine: the structure, the routing
 * and the hreflang wiring are what is expensive to add late. Translations
 * are cheap to add on top and need a native speaker regardless.
 */

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Arabic reverses the layout, which affects more than text alignment —
 *  carousels, icon direction and the whole grid flip with it. */
export function dir(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

/**
 * Every internal link goes through this. Hardcoding "/buy" anywhere is the
 * bug that makes a locale rollout painful, so the one rule is: no bare
 * paths in components.
 */
export function href(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}
