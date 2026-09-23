"use client";

import Image from "next/image";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import { RevealWords, ClipIn } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { testimonials } from "@/lib/content";
import "swiper/css";

export default function Testimonials() {
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const [active, setActive] = useState(0);

  return (
    <section className="bg-[#f1f1f1] py-[6rem] md:py-[15rem]">
      <div className="container">
        <RevealWords
          as="h2"
          className="mb-[4rem] text-[4.4rem] font-medium leading-[105%] tracking-[-0.02em] md:mb-[10rem] md:text-[7.2rem] md:leading-[100%] md:tracking-[-0.04em]"
        >
          {testimonials.titleLead} <span className="em">{testimonials.titleRest}</span>
        </RevealWords>

        <div className="md:grid md:grid-cols-[auto_65.2rem] md:gap-[9.2rem]">
          {/* Quote column — second in the DOM, pulled left on desktop. */}
          <div className="mt-[4rem] md:order-first md:mt-0">
            <ClipIn selector="[data-shot]">
              <div data-shot className="relative aspect-[400/365] overflow-hidden md:aspect-[976/688]">
                <Image
                  src={testimonials.image}
                  alt="Two people talking over coffee on a city street"
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
            </ClipIn>
          </div>

          <div>
            <div className="border-t border-current" />

            <div className="relative mt-[4rem] md:mt-[5rem]">
              {/* pager */}
              <div className="relative z-[4] flex gap-[1.3rem]">
                {testimonials.items.map((t, i) => (
                  <button
                    key={t.id}
                    type="button"
                    aria-label={`Testimonial ${i + 1}`}
                    onClick={() => swiper?.slideTo(i)}
                    className={cn(
                      "inline-flex h-[3.6rem] min-w-[3.6rem] items-center justify-center rounded-full border text-[1.4rem] font-medium leading-[140%] transition-[color,transform] duration-300 md:h-[4.6rem] md:w-[4.6rem] md:text-[1.6rem]",
                      i === active
                        ? "pointer-events-none scale-100 text-[#151717]"
                        : "text-[#b3b3b3] hover:scale-95"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
                <span
                  aria-hidden
                  className="absolute right-0 top-0 block h-[3.7rem] w-[3.7rem] bg-cover md:h-[4.9rem] md:w-[4.9rem]"
                  style={{ backgroundImage: "url(/quote-mark.svg)" }}
                />
              </div>

              <Swiper
                onSwiper={setSwiper}
                onSlideChange={(s) => setActive(s.activeIndex)}
                spaceBetween={40}
                speed={700}
                className="!pt-[10rem]"
              >
                {testimonials.items.map((t) => (
                  <SwiperSlide key={t.id}>
                    <blockquote className="font-secondary text-[2.2rem] leading-[115%] tracking-[-0.01em] md:text-[3.2rem] md:tracking-[-0.02em]">
                      {t.quote}
                    </blockquote>
                    <div className="mt-[3rem] md:mt-[5rem]">
                      <cite className="font-secondary inline-block align-middle text-[1.2rem] font-medium uppercase not-italic leading-[110%] md:text-[1.8rem]">
                        {t.author}
                      </cite>
                      <span className="font-secondary relative top-[-.14em] mx-[2rem] inline-block align-middle text-[1.2rem] font-medium uppercase leading-[110%] md:mx-[3rem] md:text-[1.8rem]">
                        /
                      </span>
                      <span
                        aria-label={`${t.rating} out of 5 stars`}
                        className="stars inline-block h-[1.6rem] w-[8rem] align-middle md:h-[2rem] md:w-[10rem]"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
