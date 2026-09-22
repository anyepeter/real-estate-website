import type { SVGProps } from "react";

export function ArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fill="currentColor"
        d="m20.78 12.531-6.75 6.75a.75.75 0 1 1-1.06-1.061l5.47-5.47H3.75a.75.75 0 1 1 0-1.5h14.69l-5.47-5.469a.75.75 0 1 1 1.06-1.061l6.75 6.75a.75.75 0 0 1 0 1.061"
      />
    </svg>
  );
}

export function ChevronDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m6 9 6 6 6-6"
      />
    </svg>
  );
}

export function Quote(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 28" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M0 27.6 7.2 0h9.1l-4.9 27.6H0Zm22.6 0L29.8 0h9.1L34 27.6h-11.4Z" />
    </svg>
  );
}

export function Star(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="m12 17.27 5.18 3.13c.95.57 2.11-.28 1.86-1.35l-1.37-5.89 4.57-3.96c.83-.72.39-2.09-.71-2.18l-6.02-.51-2.35-5.56c-.43-1.01-1.88-1.01-2.31 0L8.5 6.51l-6.02.51c-1.1.09-1.54 1.46-.71 2.18l4.57 3.96-1.37 5.89c-.25 1.07.91 1.92 1.86 1.35L12 17.27Z" />
    </svg>
  );
}
