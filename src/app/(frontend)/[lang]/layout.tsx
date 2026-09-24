import type { Metadata } from "next";
import { Instrument_Sans, Lora } from "next/font/google";
import { notFound } from "next/navigation";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import LoadingLine from "@/components/layout/LoadingLine";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { brand } from "@/lib/brand";
import { locales, isLocale, dir, type Locale } from "@/lib/i18n";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  // `template` is here so each route only supplies its own title. The
  // absolute default keeps the homepage from reading "X | X".
  title: {
    default: `${brand.fullName} | Buy, Rent and Sell Property in Dubai`,
    template: `%s | ${brand.fullName}`,
  },
  description:
    "Licensed Dubai brokerage for sales and leasing across residential, commercial and workspace. Verified listings, current prices, DLD-permitted.",
};

/** Both locales are known at build time, so every page under them can be
 *  statically generated rather than rendered per request. */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // An unknown segment here would otherwise render the whole site with a
  // broken `lang` attribute rather than failing — /fr should 404, not serve
  // English claiming to be French.
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;

  return (
    <html
      lang={locale}
      dir={dir(locale)}
      className={`${instrumentSans.variable} ${lora.variable}`}
    >
      <body>
        <LoadingLine />
        <SmoothScroll />
        <Header lang={locale} />
        <main>{children}</main>
        <Footer lang={locale} />
      </body>
    </html>
  );
}
