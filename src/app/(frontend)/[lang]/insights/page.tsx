import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { latestPosts } from "@/lib/content";
import { href, isLocale, type Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Guides & Dubai Market Data",
  description:
    "How renting, buying and off-plan actually work in Dubai, and what the transaction record says about each area.",
};

export default async function InsightsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;

  return (
    <section className="py-[6rem] md:py-[10rem]">
      <div className="container">
        <header className="max-w-[80rem]">
          <h1 className="text-[3.6rem] font-medium leading-[1.05] tracking-[-0.02em] md:text-[6.4rem]">
            Guides &amp; market data
          </h1>
          <p className="mt-[1.6rem] text-[1.8rem] leading-[1.5] text-[#383a3a] md:mt-[2.4rem] md:text-[2.2rem]">
            The things people actually ask us, written down properly.{" "}
            <span className="em">
              Plus what the Dubai Land Department transaction record says about each area.
            </span>
          </p>
        </header>

        <ul className="mt-[4rem] grid grid-cols-1 gap-x-[2.4rem] gap-y-[4rem] md:mt-[6rem] md:grid-cols-3">
          {latestPosts.items.map((post) => (
            <li key={post.href}>
              <article>
                {/* Not linked. These are the planned editorial and none of
                    them are written yet — a link to a 404 is worse than an
                    honest "coming". Article routes land with the CMS. */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#ededed]">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <time
                  dateTime={post.date}
                  className="mt-[1.6rem] block text-[1.3rem] uppercase leading-[1.4] tracking-[0.06em] text-[#b3b3b3]"
                >
                  Coming soon
                </time>
                <h2 className="mt-[0.8rem] text-[1.9rem] font-medium leading-[1.3] md:text-[2.1rem]">
                  {post.title}
                </h2>
                <p className="mt-[0.8rem] text-[1.6rem] leading-[1.55] text-[#383a3a] md:text-[1.7rem]">
                  {post.text}
                </p>
              </article>
            </li>
          ))}
        </ul>

        <div className="mt-[5rem] max-w-[70ch] border-t border-[rgba(21,23,23,0.1)] pt-[3rem] md:mt-[8rem]">
          <p className="text-[1.7rem] leading-[1.6] text-[#383a3a] md:text-[1.85rem]">
            Want something specific answered before it&rsquo;s written?{" "}
            <Link href={href(locale, "/contact")} className="underline" prefetch={false}>
              Ask us directly
            </Link>{" "}
            — the questions people send are what decides the order these get written in.
          </p>
        </div>
      </div>
    </section>
  );
}
