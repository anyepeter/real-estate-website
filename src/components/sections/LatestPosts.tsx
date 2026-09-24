import Image from "next/image";
import Link from "next/link";
import { RevealWords, FadeUp, ClipIn } from "@/components/Reveal";
import { ButtonLink } from "@/components/ui/button";
import { ArrowRight } from "@/components/ui/icons";
import { latestPosts } from "@/lib/content";
import { href, type Locale } from "@/lib/i18n";

export default function LatestPosts({ lang }: { lang: Locale }) {
  return (
    <section className="bg-[#f1f1f1] py-[6rem] md:py-[15rem]">
      <div className="container">
        <div className="grid gap-[4rem] md:grid-cols-[auto_97.6rem]">
          <RevealWords
            as="h2"
            className="text-[4.4rem] font-medium leading-[105%] tracking-[-0.02em] md:text-[8rem] md:leading-[100%] md:tracking-[-0.04em]"
          >
            {latestPosts.titleLead}
            <br />
            <span className="em">{latestPosts.titleRest}</span>
          </RevealWords>

          <div>
            <RevealWords
              as="p"
              className="text-[2.2rem] font-medium leading-[115%] md:text-[3.2rem] md:leading-[130%] md:tracking-[-0.01em]"
            >
              {latestPosts.text}
            </RevealWords>
            <FadeUp className="mt-[3rem] md:mt-[4rem]">
              <ButtonLink href={href(lang, latestPosts.cta.href)}>{latestPosts.cta.label}</ButtonLink>
            </FadeUp>
          </div>
        </div>

        <div className="mt-[4rem] grid gap-[6rem] md:mt-[10rem] md:gap-0 md:border-b md:border-[rgba(21,23,23,0.1)]">
          {latestPosts.items.map((post) => (
            <article key={post.href} className="relative md:border-t md:border-[rgba(21,23,23,0.1)] md:py-[3rem]">
              <div className="grid gap-[3rem] md:grid-cols-[auto_97.6rem]">
                {/* Thumbnail is authored first but sits right of the copy. */}
                <ClipIn selector="[data-thumb]" className="md:order-1">
                  <Link
                    href={href(lang, post.href)}
                    data-thumb
                    className="relative -mx-[2rem] block aspect-[365/250] overflow-hidden md:mx-0 md:aspect-[976/450]"
                   prefetch={false}>
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 97.6rem"
                      className="object-cover"
                    />
                  </Link>
                </ClipIn>

                <div className="flex flex-col justify-between">
                  <div>
                    <p className="mb-[3rem] text-[1.4rem] font-medium leading-[150%] md:mb-[6.85rem] md:text-[2rem]">
                      <time dateTime={post.date}>{post.date}</time>
                    </p>
                    <Link
                      href={href(lang, post.href)}
                      className="block text-[2.2rem] font-medium leading-[115%] md:text-[4.4rem] md:tracking-[-0.02em]"
                     prefetch={false}>
                      {post.title}
                    </Link>
                    <p className="mt-[1.5rem] text-[1.6rem] font-medium leading-[150%] md:mt-[2.4rem]">
                      {post.text}
                    </p>
                  </div>

                  <div className="mt-[3rem]">
                    <Link
                      href={href(lang, post.href)}
                      className="inline-flex items-center gap-[1.4rem] rounded-[100px] border border-[rgba(21,23,23,0.3)] bg-white px-[2.4rem] py-[1.4rem] text-[1.6rem] font-medium transition-transform duration-300 hover:[transition:transform_.7s_cubic-bezier(.34,3.56,.64,1)] hover:scale-x-[1.02] md:px-[3rem] md:py-[1.54rem] md:text-[1.8rem]"
                     prefetch={false}>
                      Read More
                      <ArrowRight className="h-[2.4rem] w-[2.4rem]" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
