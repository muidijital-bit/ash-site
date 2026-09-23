import Link from "next/link";
import type { LegalDoc } from "@/content/legal/types";
import { localePath, type Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import "./legal.css";

export function LegalPage({ doc, locale }: { doc: LegalDoc; locale: Locale }) {
  const ui = getUi(locale);
  const date = new Intl.DateTimeFormat(ui.dateLocale, { day: "numeric", month: "long", year: "numeric" });
  return (
    <main className="blog legal">
      <header className="blog-band">
        <div className="blog-wrap">
          <p className="blog-cat">{ui.legal.label}</p>
          <h1 className="blog-title">{doc.title}</h1>
          <p className="blog-meta">
            <span>
              {ui.legal.updated}: <time dateTime={doc.updated}>{date.format(new Date(`${doc.updated}T00:00:00`))}</time>
            </span>
          </p>
        </div>
      </header>

      <article className="blog-wrap blog-article">
        <div className="blog-body">
          {doc.intro.map((p) => <p key={p} className="blog-p--lead">{p}</p>)}

          {doc.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.paragraphs?.map((p) => <p key={p}>{p}</p>)}
              {s.bullets && s.bullets.length > 0 && (
                <ul className="legal-list">
                  {s.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
              )}
            </section>
          ))}
        </div>

        <footer className="legal-foot">
          <Link href={localePath(locale, "/contact")}>{ui.getInTouch}</Link>
        </footer>
      </article>
    </main>
  );
}
