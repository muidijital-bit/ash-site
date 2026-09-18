import { products } from "@/content/products";
import "./ProductDemo.css";

/**
 * Anasayfa hero'sundaki urun demosu.
 *
 * Referans sitelerdeki (GitHub'in sessiz donen mp4'u, Bubble'in Lottie'si)
 * gibi surekli donen bir gosterim; ancak video ya da stok dosya degil,
 * tamamen CSS ile cizilip canlandiriliyor:
 *   - indirilecek dosya yok, her cozunurlukte net
 *   - marka paletini degiskenlerden aliyor
 *   - JS yok; prefers-reduced-motion'da duruyor
 *
 * Dongu dort asamali: her asamada urun ailesinden biri one cikiyor,
 * ustteki promt kutusu o urune uygun istegi gosteriyor ve panelde o
 * istegin yaniti beliriyor. Icerik dekoratif ve anonimdir.
 */

type Phase = {
  /** products.ts icindeki slug — kenar cubugunda hangi urunun yanacagini belirler */
  slug: string;
  prompt: string;
  lines: { text: string; strong?: string; tail?: string }[];
  bars?: [string, string][];
  cite: string;
};

const PHASES: Phase[] = [
  {
    slug: "sapai-x",
    prompt: "Fatura tutarı siparişten farklı olan kayıtları bul",
    lines: [
      { text: "Eşleşmeyen ", strong: "12 fatura", tail: " onaya düştü." },
      { text: "İlgili Z objesi taranarak kontrol eklendi." },
    ],
    cite: "SAPAI-X · ME21N · MIRO · CR-2026-118",
  },
  {
    slug: "masraf-x",
    prompt: "Bu çeyrekte politika dışı kalan masrafları listele",
    lines: [
      { text: "Politika dışı ", strong: "6 kayıt", tail: " girişte engellendi." },
      { text: "Mükerrer giriş kontrolü temiz." },
    ],
    bars: [["Operasyon", "78%"], ["Finans", "54%"], ["Satış", "36%"]],
    cite: "Masraf-X · Harcama_Politikasi_2026.pdf · s.12",
  },
  {
    slug: "crm-x",
    prompt: "Takibi geciken satış fırsatlarını göster",
    lines: [
      { text: "On günden uzun süredir temas yok: ", strong: "3 fırsat", tail: "." },
      { text: "En yüksek değerli olan sorumlusuna işaretlendi." },
    ],
    cite: "CRM-X · Fırsat #OPP-2140 · Teklif aşaması",
  },
  {
    slug: "hubai-x",
    prompt: "Yönetmeliğe göre yıllık izin devri kaç gün?",
    lines: [
      { text: "En fazla ", strong: "10 gün", tail: " devredilebilir." },
      { text: "Yanıt kurumsal belgeden alındı, kaynağı açık." },
    ],
    cite: "HubAI-X · IK_Yonetmeligi_2026.pdf · s.34",
  },
];

export function ProductDemo() {
  return (
    <div className="ash-demo" aria-hidden="true">
      {/* Panelin ustune binen promt kutusu */}
      <div className="ash-demo__prompt">
        <span className="ash-demo__spark" />
        <span className="ash-demo__prompt-stack">
          {PHASES.map((p, i) => (
            <span key={p.slug} className={`ash-demo__prompt-text ash-demo__ph-${i + 1}`}>
              {p.prompt}
            </span>
          ))}
        </span>
        <span className="ash-demo__caret" />
        <span className="ash-demo__send">Sor</span>
      </div>

      <div className="ash-demo__frame">
        <div className="ash-demo__chrome">
          <span className="ash-demo__dots"><i /><i /><i /></span>
          <span className="ash-demo__live"><i />Canlı</span>
        </div>

        <div className="ash-demo__body">
          <aside className="ash-demo__side">
            {products.map((product) => {
              const phase = PHASES.findIndex((p) => p.slug === product.slug) + 1;
              return (
                <span key={product.slug} className={`ash-demo__side-item ash-demo__side-${phase}`}>
                  {product.name}
                </span>
              );
            })}
          </aside>

          <div className="ash-demo__main">
            {PHASES.map((p, i) => (
              <div key={p.slug} className={`ash-demo__answer ash-demo__ph-${i + 1}`}>
                <div className="ash-demo__status">
                  <span className="ash-demo__pulse" />
                  Kurumsal veriler taranıyor
                </div>
                {p.lines.map((l) => (
                  <p key={l.text} className="ash-demo__line">
                    {l.text}{l.strong && <b>{l.strong}</b>}{l.tail}
                  </p>
                ))}
                {p.bars && (
                  <div className="ash-demo__bars">
                    {p.bars.map(([label, v]) => (
                      <span key={label}>
                        <i style={{ "--v": v } as React.CSSProperties} />
                        {label}
                      </span>
                    ))}
                  </div>
                )}
                <div className="ash-demo__cite">{p.cite}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
