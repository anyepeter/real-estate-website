import { ImageResponse } from "next/og";
import { brand, regulatoryLine } from "@/lib/brand";

/**
 * The default social card.
 *
 * Generated rather than a static file so it follows lib/brand — when the
 * placeholder name is replaced, every share image updates with it instead
 * of someone remembering to re-export a PNG.
 *
 * Deliberately typographic. Stock property photography makes an unreadable
 * card at thumbnail size, and the one thing a share needs to communicate is
 * who this is.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${brand.fullName} — property in Dubai`;

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#151717",
          color: "#ffffff",
          padding: "72px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#b3b3b3",
            fontFamily: "Helvetica, Arial, sans-serif",
          }}
        >
          Dubai · Licensed brokerage
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 700,
            }}
          >
            {brand.fullName}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 40,
              lineHeight: 1.3,
              color: "#b3b3b3",
            }}
          >
            {brand.tagline}
          </div>
        </div>

        {/* The ORN belongs on the card for the same reason it belongs in the
            footer: it is the thing that separates a real brokerage from a
            scraped listing farm, and a share is often the first contact. */}
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#6b7c86",
            fontFamily: "Helvetica, Arial, sans-serif",
          }}
        >
          {regulatoryLine}
        </div>
      </div>
    ),
    size
  );
}
