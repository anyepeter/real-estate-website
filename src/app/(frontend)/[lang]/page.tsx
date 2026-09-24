import { notFound } from "next/navigation";
import Hero from "@/components/sections/Hero";
import WhyUs from "@/components/sections/WhyUs";
import Arrows from "@/components/sections/Arrows";
import Rewired from "@/components/sections/Rewired";
import ForAgents from "@/components/sections/ForAgents";
import Testimonials from "@/components/sections/Testimonials";
import Services from "@/components/sections/Services";
import Features from "@/components/sections/Features";
import LatestPosts from "@/components/sections/LatestPosts";
import Outro from "@/components/sections/Outro";
import { isLocale, type Locale } from "@/lib/i18n";

/**
 * `lang` is threaded down as a prop rather than read from context, because
 * four of these sections are Server Components — context would only reach
 * the client ones, which is the kind of split that produces links that
 * work in some sections and not others.
 */
export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;

  return (
    <>
      <Hero lang={locale} />
      <WhyUs />
      <Arrows />
      <Rewired lang={locale} />
      <ForAgents lang={locale} />
      <Testimonials />
      <Services lang={locale} />
      <Features lang={locale} />
      <LatestPosts lang={locale} />
      <Outro lang={locale} />
    </>
  );
}
