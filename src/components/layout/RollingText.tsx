import { cn } from "@/lib/utils";

/**
 * Hover rolls the label up and a duplicate takes its place. The copy is
 * drawn from a data attribute so there's only one text node to translate.
 */
export default function RollingText({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <span className="block overflow-hidden">
      <span
        data-text={children}
        className={cn(
          "relative block transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)]",
          "after:absolute after:left-0 after:right-0 after:top-[105%] after:block after:content-[attr(data-text)]",
          "group-hover:-translate-y-[105%] hover:-translate-y-[105%]",
          className
        )}
      >
        {children}
      </span>
    </span>
  );
}
