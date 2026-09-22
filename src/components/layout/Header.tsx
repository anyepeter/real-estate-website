"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/Logo";
import { ChevronDown } from "@/components/ui/icons";
import { ButtonLink } from "@/components/ui/button";
import RollingText from "./RollingText";
import BurgerMenu from "./BurgerMenu";
import { nav } from "@/lib/content";

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const last = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // Solid once the sky is behind us; transparent while over the hero.
      setSolid(y > window.innerHeight * 0.9);
      // Retract on the way down, return on the way up.
      setHidden(y > last.current && y > 400 && !open);
      last.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "sticky left-0 right-0 top-0 z-50 transition-[background-color,transform] duration-300 ease-in-out",
          solid || open ? "bg-white" : "bg-transparent",
          hidden && "-translate-y-full"
        )}
      >
        <div className="container">
          <div className="relative z-50 grid min-h-[8.4rem] grid-cols-[1fr_auto] items-center text-[#151717] md:min-h-[7.8rem] md:grid-cols-[25rem_1fr_25rem] md:py-[1rem]">
            <Link href="/" aria-label="FIND Real Estate — home" className="flex items-center" prefetch={false}>
              <LogoMark className="h-[2.6rem] w-[9.1rem]" />
            </Link>

            <nav className="hidden items-center justify-center gap-[3.2rem] md:flex">
              {nav.map((item) =>
                item.items ? (
                  <Dropdown key={item.label} item={item} />
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-[1rem] overflow-hidden text-[1.8rem] font-medium leading-[1.25] md:text-[2rem]"
                   prefetch={false}>
                    <RollingText>{item.label}</RollingText>
                  </Link>
                )
              )}
            </nav>

            <div className="hidden items-center justify-end md:flex">
              <ButtonLink href="/sign-in" icon={false} className="!px-[2.4rem] !py-[1.1rem]">
                Sign In
              </ButtonLink>
            </div>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="ml-auto flex h-[4rem] w-[4rem] items-center justify-center md:hidden"
            >
              <span className="relative block h-[1.6rem] w-[2.4rem]">
                <span
                  className={cn(
                    "absolute left-0 h-[2px] w-full bg-current transition-transform duration-300",
                    open ? "top-1/2 rotate-45" : "top-0"
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-[2px] w-full bg-current transition-transform duration-300",
                    open ? "bottom-[calc(50%-2px)] -rotate-45" : ""
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <BurgerMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function Dropdown({ item }: { item: (typeof nav)[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        className="group flex cursor-pointer items-center gap-[1rem] overflow-hidden text-[1.8rem] font-medium leading-[1.25] md:text-[2rem]"
      >
        <RollingText>{item.label}</RollingText>
        <span
          className={cn(
            "relative top-[.05em] flex h-[1em] w-[1em] items-center transition-transform duration-300",
            open && "rotate-180"
          )}
        >
          <ChevronDown className="h-full w-full" />
        </span>
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-[201] min-w-[24rem] -translate-x-1/2 border border-[rgba(21,23,23,0.1)] bg-white py-[2rem]">
          {item.items?.map((sub) => (
            <Link
              key={sub}
              href={item.href}
              className="flex items-center gap-[1rem] px-[3rem] py-[1.35rem] text-[1.8rem] font-medium leading-[1.5] transition-colors hover:bg-[#ededed]"
             prefetch={false}>
              {sub}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
