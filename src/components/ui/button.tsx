"use client";

import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ArrowRight } from "./icons";

/**
 * Pill button. The hover is a springy horizontal stretch rather than a
 * colour change — it reads as the button flexing under the cursor.
 */
const buttonVariants = cva(
  [
    "relative inline-block cursor-pointer rounded-[100px] border border-transparent",
    "text-[1.6rem] font-medium leading-[1.5] md:text-[1.8rem] md:leading-[1.4]",
    "px-[2.4rem] py-[1.4rem] md:px-[3rem] md:py-[1.54rem]",
    "transition-transform duration-300",
    "hover:[transition:transform_.7s_cubic-bezier(.34,3.56,.64,1)] hover:scale-x-[1.02]",
    "disabled:pointer-events-none disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "bg-[#151717] text-white",
        secondary: "bg-white text-[#151717] border-[rgba(21,23,23,0.3)]",
      },
      inversed: { true: "", false: "" },
    },
    compoundVariants: [
      { variant: "primary", inversed: true, class: "bg-white text-[#151717]" },
      {
        variant: "secondary",
        inversed: true,
        class: "bg-transparent text-white border-[hsla(0,0%,100%,0.5)]",
      },
    ],
    defaultVariants: { variant: "primary", inversed: false },
  }
);

type BaseProps = VariantProps<typeof buttonVariants> & {
  children: React.ReactNode;
  icon?: boolean;
  className?: string;
};

function Inner({ children, icon = true }: { children: React.ReactNode; icon?: boolean }) {
  return (
    <span className="flex items-center justify-center gap-[1.4rem] overflow-hidden">
      <span className="overflow-hidden">{children}</span>
      {icon && (
        <span className="flex h-[2.4rem] w-[2.4rem] min-w-[2.4rem] items-center justify-center">
          <ArrowRight className="h-full w-full" />
        </span>
      )}
    </span>
  );
}

export function Button({
  children,
  icon,
  variant,
  inversed,
  className,
  ...props
}: BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(buttonVariants({ variant, inversed }), className)} {...props}>
      <Inner icon={icon}>{children}</Inner>
    </button>
  );
}

export function ButtonLink({
  children,
  icon,
  variant,
  inversed,
  className,
  href,
  ...props
}: BaseProps & { href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "children">) {
  return (
    <Link href={href} prefetch={false} className={cn(buttonVariants({ variant, inversed }), className)} {...props}>
      <Inner icon={icon}>{children}</Inner>
    </Link>
  );
}

export { buttonVariants };
