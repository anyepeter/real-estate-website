import Link from "next/link";
import { routes } from "@/lib/routes";

/**
 * 404.
 *
 * Reached most often by a property that has been let, sold, or whose permit
 * lapsed — getListing returns null for all three and the page 404s. So this
 * is less an error page than a redirect point for someone who was looking
 * at something real a week ago, and the links out matter more than the
 * apology.
 *
 * Not locale-aware: Next renders the nearest not-found without resolving
 * route params, so the links use the default locale. The proxy would send a
 * bare path there anyway.
 *
 * SCOPE — this covers notFound() thrown inside [lang], which is the case
 * that matters: a sold property, a lapsed permit, an area that doesn't
 * exist. A URL matching no route at all (/en/nope) still gets Next's
 * default 404 instead.
 *
 * Fixing that needs app/global-not-found.tsx behind the experimental
 * `globalNotFound` flag. The Next 16 docs name our exact situation as the
 * reason it exists — multiple root layouts ((frontend) and (payload)) and a
 * top-level dynamic segment ([lang]) — but it bypasses the layout, so it
 * would need its own copy of the fonts and global styles. Left off
 * deliberately: an experimental flag is a poor trade for the rarer half of
 * the 404 cases.
 */
export default function NotFound() {
  const links = [
    { href: `/en${routes.buy}`, label: "Property for sale" },
    { href: `/en${routes.rent}`, label: "Property to rent" },
    { href: `/en${routes.areas}`, label: "Browse by area" },
    { href: `/en${routes.contact}`, label: "Talk to us" },
  ];

  return (
    <section className="py-[8rem] md:py-[14rem]">
      <div className="container">
        <p className="text-[1.3rem] uppercase leading-[1.4] tracking-[0.06em] text-[#b3b3b3]">
          404
        </p>
        <h1 className="mt-[1.2rem] max-w-[20ch] text-[3.6rem] font-medium leading-[1.05] tracking-[-0.02em] md:text-[6.4rem]">
          That one&rsquo;s gone.
        </h1>
        <p className="mt-[1.6rem] max-w-[55ch] text-[1.8rem] leading-[1.5] text-[#383a3a] md:mt-[2.4rem] md:text-[2.2rem]">
          Either the property has been taken, or the link is wrong.{" "}
          <span className="em">
            Dubai moves quickly — if you saw something here recently, it may simply have let.
          </span>
        </p>

        <ul className="mt-[4rem] flex flex-col border-t border-[rgba(21,23,23,0.1)] md:mt-[6rem] md:max-w-[60rem]">
          {links.map((l) => (
            <li key={l.href} className="border-b border-[rgba(21,23,23,0.1)]">
              <Link
                href={l.href}
                prefetch={false}
                className="block py-[2rem] text-[2rem] font-medium leading-[1.2] transition-colors hover:text-[#b3b3b3] md:py-[2.4rem] md:text-[2.6rem]"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
