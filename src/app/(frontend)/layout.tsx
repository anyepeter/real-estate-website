import type { Metadata } from "next";
import { Instrument_Sans, Lora } from "next/font/google";
import "./globals.css";
import { brand } from "@/lib/brand";
import SmoothScroll from "@/components/layout/SmoothScroll";
import LoadingLine from "@/components/layout/LoadingLine";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
  // `template` is here so the routes added in the next phase only supply
  // their own title. The absolute form keeps the homepage from reading
  // "ACME Real Estate | ACME Real Estate".
  title: {
    default: `${brand.fullName} | Buy, Rent and Sell Property in Dubai`,
    template: `%s | ${brand.fullName}`,
  },
  description:
    "Licensed Dubai brokerage for sales and leasing across residential, commercial and workspace. Verified listings, current prices, DLD-permitted.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${lora.variable}`}>
      <body>
        <LoadingLine />
        <SmoothScroll />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
