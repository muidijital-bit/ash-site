import { ImageResponse } from "next/og";
import type { Locale } from "@/i18n/config";

/**
 * Paylasim gorseli (og:image) kartlari.
 *
 * Sosyal platformlar SVG onizleme gostermez; bu yuzden her sayfanin
 * paylasim gorseli burada 1200x630 PNG olarak uretilir. Metin gorselin
 * icine yazildigi icin gorseller iki dilde farklidir.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const NAVY = "#050a2b";
const SOFT_WHITE = "#f8f8f6";
const GRADIENT = "linear-gradient(90deg, #2f6bff 0%, #7448e8 55%, #d946b5 100%)";

export function ogCard({ eyebrow, title, note, locale }: { eyebrow?: string; title: string; note?: string; locale: Locale }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: NAVY,
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 46, fontWeight: 700, color: SOFT_WHITE, letterSpacing: -1 }}>
            ASH.
          </div>
          {eyebrow ? (
            <div
              style={{
                display: "flex",
                marginLeft: 28,
                paddingLeft: 28,
                borderLeft: "2px solid rgba(248,248,246,0.22)",
                fontSize: 24,
                letterSpacing: 3,
                color: "#8b94b3",
              }}
            >
              {eyebrow.toLocaleUpperCase(locale === "en" ? "en-US" : "tr-TR")}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: title.length > 64 ? 54 : 64, fontWeight: 700, color: SOFT_WHITE, lineHeight: 1.14 }}>
            {title}
          </div>
          {note ? (
            <div style={{ display: "flex", marginTop: 26, fontSize: 28, lineHeight: 1.45, color: "rgba(248,248,246,0.62)" }}>
              {note}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", width: 280, height: 10, borderRadius: 8, background: GRADIENT }} />
      </div>
    ),
    OG_SIZE,
  );
}

/** Uzun metinleri karta sigacak sekilde kisaltir. */
export function ogClamp(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}
