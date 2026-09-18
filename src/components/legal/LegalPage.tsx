import Link from "next/link";
import { company, contact } from "@/content/contact";
import type { LegalDoc } from "@/content/legal/types";
import "@/components/blog/blog.css";
import "./legal.css";

const DATE_FMT = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" });

/**
 * Yasal metinlerde sirket bilgileri yer tutucu olarak duruyor.
 * src/content/contact.ts doldurulunca metne kendiliginden yerlesirler;
 * bos oldugu surece koseli parantezli isaret gorunur ki eksik oldugu belli olsun.
 */
function doldur(metin: string) {
  return metin
    .replace(/\{\{UNVAN\}\}/g, company.legalName || "[şirket unvanı]")
    .replace(/\{\{ADRES\}\}/g, contact.office.lines.join(", ") || "[adres]")
    .replace(/\{\{EPOSTA\}\}/g, contact.email || "[e-posta adresi]")
    .replace(/\{\{MERSIS\}\}/g, company.mersis || "[MERSİS no]")
    .replace(/\{\{VERBIS\}\}/g, company.verbis || "[VERBİS kaydı]");
}

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <main className="blog legal">
      <header className="blog-band">
        <div className="blog-wrap">
          <p className="blog-cat">Yasal</p>
          <h1 className="blog-title">{doc.title}</h1>
          <p className="blog-meta">
            <span>
              Son güncelleme: <time dateTime={doc.updated}>{DATE_FMT.format(new Date(`${doc.updated}T00:00:00`))}</time>
            </span>
          </p>
        </div>
      </header>

      <article className="blog-wrap blog-article">
        <div className="blog-body">
          {doc.intro.map((p) => <p key={p} className="blog-p--lead">{doldur(p)}</p>)}

          {doc.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.paragraphs?.map((p) => <p key={p}>{doldur(p)}</p>)}
              {s.bullets && s.bullets.length > 0 && (
                <ul className="legal-list">
                  {s.bullets.map((b) => <li key={b}>{doldur(b)}</li>)}
                </ul>
              )}
            </section>
          ))}
        </div>

        <footer className="legal-foot">
          <Link href="/contact">İletişime geçin</Link>
        </footer>
      </article>
    </main>
  );
}
