/**
 * Urun sayfalarinin gorsel dili.
 *
 * Stok fotograf yok: her gorsel HTML/CSS + inline SVG ile cizilir. Mockup
 * icindeki metinler dekoratiftir (aria-hidden) ve anonim ornek veridir;
 * gercek musteri, marka ya da iddia icermez.
 */
import type { CSSProperties, ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Atmosfer katmanlari                                                 */
/* ------------------------------------------------------------------ */

/** Bolumun karsit koselerinde iki yumusak isik kuresi. */
export function Ambient() {
  return (
    <div className="pp-ambient" aria-hidden="true">
      <span className="pp-ambient__a" />
      <span className="pp-ambient__b" />
    </div>
  );
}

/** Merkezden disa sonen teknik cizim izgarasi (hero ve kapanista). */
export function Blueprint() {
  return <div className="pp-blueprint" aria-hidden="true" />;
}

/** Secili kartin dort kosesindeki olcum isaretleri. */
export function Crosshair() {
  return (
    <svg className="pp-crosshair" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 10V0h10M90 0h10v10M100 90v10H90M10 100H0V90" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Tarayici cercevesi: tum urun mockup'larinin ortak kabugu. */
export function BrowserFrame({ url, children, className = "" }: { url: string; children: ReactNode; className?: string }) {
  return (
    <div className={`pp-browser ${className}`} aria-hidden="true">
      <div className="pp-browser__chrome">
        <span className="pp-browser__dots"><i /><i /><i /></span>
        <span className="pp-browser__url">{url}</span>
        <span className="pp-browser__live"><i />Canlı</span>
      </div>
      <div className="pp-browser__body">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Imza gorselleri (hero)                                              */
/* ------------------------------------------------------------------ */

/** HubAI-X: tek kurumsal istek, bes modele yonlendirilir + yonetim konsolu. */
function HubaiSignature() {
  const models = ["Kurum içi model", "Sağlayıcı A", "Sağlayıcı B", "Belge arama", "Kendi modeliniz"];
  const ys = [40, 110, 180, 250, 320];
  return (
    <div className="pp-sig pp-sig--hubai">
      <svg className="pp-router" viewBox="0 0 760 360" aria-hidden="true">
        <defs>
          <linearGradient id="pp-hub-grad" x1="0" x2="1">
            <stop offset="0" stopColor="#2f6bff" />
            <stop offset=".5" stopColor="#7448e8" />
            <stop offset="1" stopColor="#d946b5" />
          </linearGradient>
          <filter id="pp-hub-glow" x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        {ys.map((y, i) => {
          const d = `M170 180 C 330 180, 360 ${y}, 520 ${y}`;
          const active = i === 1;
          return (
            <g key={y}>
              {active && <path d={d} className="pp-router__glow" filter="url(#pp-hub-glow)" />}
              <path d={d} className={active ? "pp-router__path pp-router__path--active" : "pp-router__path"} />
              {active && <circle r="4" className="pp-router__beam"><animateMotion dur="2.6s" repeatCount="indefinite" path={d} /></circle>}
            </g>
          );
        })}
        <rect x="24" y="148" width="146" height="64" rx="14" className="pp-router__in" />
        <text x="97" y="177" className="pp-router__label" textAnchor="middle">Kurumsal istek</text>
        <text x="97" y="196" className="pp-router__meta" textAnchor="middle">yetki · bütçe · kaynak</text>
        {ys.map((y, i) => (
          <g key={`m${y}`}>
            <rect x="520" y={y - 22} width="214" height="44" rx="11" className={i === 1 ? "pp-router__model pp-router__model--active" : "pp-router__model"} />
            <text x="542" y={y + 5} className="pp-router__label">{models[i]}</text>
          </g>
        ))}
      </svg>
      <BrowserFrame url="hubai-x.com/konsol" className="pp-sig__panel">
        <div className="pp-mock-head"><b>Departman kullanımı</b><span>Bu ay</span></div>
        {[["Operasyon", 78], ["Finans", 54], ["İnsan Kaynakları", 36], ["Satış", 61]].map(([d, v]) => (
          <div className="pp-bar" key={d as string}>
            <span>{d}</span>
            <i><b style={{ width: `${v}%` } as CSSProperties} /></i>
            <em>%{v}</em>
          </div>
        ))}
        <div className="pp-matrix">
          <span />
          <span>İç</span><span>A</span><span>B</span>
          {[["Analist", 1, 1, 0], ["Yönetici", 1, 1, 1], ["Stajyer", 1, 0, 0]].map(([r, ...cells]) => (
            <Row key={r as string} role={r as string} cells={cells as number[]} />
          ))}
        </div>
      </BrowserFrame>
    </div>
  );
}

function Row({ role, cells }: { role: string; cells: number[] }) {
  return (
    <>
      <span>{role}</span>
      {cells.map((c, i) => <span key={i} className={c ? "pp-ok" : "pp-no"}>{c ? "✓" : "×"}</span>)}
    </>
  );
}

/** SAPAI-X: satir numarali ABAP paneli + talepten cozume akis. */
function SapaiSignature() {
  const code: [string, string][] = [
    ["kw", "FUNCTION"], ["fn", " z_mm_fatura_kontrol."],
    ["cm", "  \" Tedarikçi faturası ile satınalma siparişi eşleşmesi"],
    ["kw", "  SELECT"], ["tx", " ebeln, ebelp, netwr "], ["kw", "FROM"], ["tx", " ekpo"],
    ["kw", "    WHERE"], ["tx", " ebeln = @iv_ebeln"],
    ["kw", "    INTO TABLE"], ["tx", " @DATA(lt_kalem)."],
    ["kw", "  IF"], ["tx", " lv_fark > "], ["nm", "0.05"], ["kw", " THEN"],
    ["tx", "    ls_sonuc-durum = "], ["st", "'ONAY_BEKLIYOR'"], ["tx", "."],
    ["kw", "  ENDIF"], ["tx", "."],
    ["kw", "ENDFUNCTION"], ["tx", "."],
  ];
  const lines: [string, string][][] = [[]];
  for (const tok of code) {
    if (tok[1].startsWith("  ") || tok[1].startsWith("    ") || tok[0] === "cm" || tok[1] === "ENDFUNCTION") lines.push([]);
    lines[lines.length - 1].push(tok);
  }
  return (
    <div className="pp-sig pp-sig--sapai">
      <div className="pp-code" aria-hidden="true">
        <div className="pp-code__tab">Z_MM_FATURA_KONTROL.abap</div>
        <ol>
          {lines.filter((l) => l.length).map((l, i) => (
            <li key={i}>{l.map(([k, t], j) => <span key={j} className={`pp-tk-${k}`}>{t}</span>)}</li>
          ))}
        </ol>
      </div>
      <BrowserFrame url="sapai-x.com/asistan" className="pp-sig__panel">
        <div className="pp-ticket">
          <small>Talep · CR-2026-118 · MM</small>
          <p>Fatura tutarı siparişten farklıysa onaya düşsün.</p>
        </div>
        <div className="pp-pulse"><i />Sistem analiz ediliyor</div>
        <div className="pp-kv">
          <span>Taranan Z objesi</span><b>148</b>
          <span>İlgili işlem</span><b>ME21N · MIRO</b>
          <span>Modül</span><b>MM · FI/CO</b>
        </div>
        <div className="pp-btn-mock">Onaya gönder</div>
      </BrowserFrame>
    </div>
  );
}

/** Masraf-X: onay zinciri + politika kontrollu fis karti. */
function MasrafSignature() {
  const stages = [["Fiş", "done"], ["Okuma", "done"], ["Politika", "active"], ["Onay", "wait"], ["Muhasebe", "wait"]];
  return (
    <div className="pp-sig pp-sig--masraf">
      <div className="pp-chevrons" aria-hidden="true">
        {stages.map(([s, st]) => <span key={s} className={`pp-chev pp-chev--${st}`}>{s}</span>)}
      </div>
      <div className="pp-receipt-row">
        <div className="pp-receipt" aria-hidden="true">
          <div className="pp-receipt__head"><b>FİŞ #EXP-2026-0431</b><span className="pp-tag">DEĞİŞTİRİLEMEZ</span></div>
          <div className="pp-receipt__line"><span>Konaklama · 2 gece</span><b>₺3.240,00</b></div>
          <div className="pp-receipt__line"><span>Ulaşım · taksi</span><b>₺412,50</b></div>
          <div className="pp-receipt__line pp-receipt__line--bad"><span>Temsil · akşam yemeği</span><b><s>₺1.487,50</s></b></div>
          <div className="pp-receipt__line"><span>KDV %20</span><b>₺758,40</b></div>
          <div className="pp-receipt__alert">Politika ihlali — kişi başı limit aşıldı, giriş engellendi</div>
        </div>
        <ol className="pp-timeline" aria-hidden="true">
          <li><time>09:14</time>Fiş fotoğrafı yüklendi</li>
          <li><time>09:14</time>Tutar, tarih ve KDV okundu</li>
          <li><time>09:15</time>Mükerrer kayıt kontrolü: temiz</li>
          <li className="pp-timeline--bad"><time>09:15</time>Temsil limiti aşıldı</li>
          <li className="pp-timeline--wait"><time>—</time>Yönetici onayı bekleniyor</li>
        </ol>
      </div>
    </div>
  );
}

/** CRM-X: kapali musteri yolculugu yorunge diyagrami. */
function CrmSignature() {
  const steps = ["Temas", "Nitelendirme", "Fırsat", "Teklif", "Kazanım", "Sadakat"];
  const colors = ["#2f6bff", "#4a5bf4", "#7448e8", "#a947d0", "#d946b5", "#f08bc2"];
  const cx = 300, cy = 300, r = 215;
  const pt = (deg: number, rad = r) => [cx + rad * Math.cos((deg * Math.PI) / 180), cy + rad * Math.sin((deg * Math.PI) / 180)];
  const active = 3;
  return (
    <div className="pp-sig pp-sig--crm">
      <svg className="pp-orbit" viewBox="0 0 600 600" aria-hidden="true">
        <defs>
          <radialGradient id="pp-orbit-core">
            <stop offset="0" stopColor={colors[active]} stopOpacity=".22" />
            <stop offset="1" stopColor={colors[active]} stopOpacity="0" />
          </radialGradient>
          <filter id="pp-orbit-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="10" /></filter>
        </defs>
        <circle cx={cx} cy={cy} r={r + 32} className="pp-orbit__dots" />
        <circle cx={cx} cy={cy} r={r} className="pp-orbit__ring" />
        {steps.map((_, i) => {
          const a0 = -90 + i * 60 + 9, a1 = -90 + (i + 1) * 60 - 9;
          const [x0, y0] = pt(a0), [x1, y1] = pt(a1);
          const d = `M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}`;
          return (
            <g key={i}>
              {i === active && <path d={d} stroke={colors[i]} className="pp-orbit__arc-glow" filter="url(#pp-orbit-glow)" />}
              <path d={d} stroke={colors[i]} className={i === active ? "pp-orbit__arc pp-orbit__arc--active" : "pp-orbit__arc"} />
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r="140" className="pp-orbit__core" />
        <circle cx={cx} cy={cy} r="140" fill="url(#pp-orbit-core)" />
        <text x={cx} y={cy - 14} textAnchor="middle" className="pp-orbit__brand">CRM-X</text>
        <text x={cx} y={cy + 18} textAnchor="middle" className="pp-orbit__step">{steps[active]}</text>
        <text x={cx} y={cy + 44} textAnchor="middle" className="pp-orbit__meta">Fırsat #OPP-2140 · %60</text>
        {steps.map((s, i) => {
          const [x, y] = pt(-90 + i * 60);
          return (
            <g key={s}>
              {i === active && <circle cx={x} cy={y} r="34" fill={colors[i]} opacity=".35" filter="url(#pp-orbit-glow)" />}
              <circle cx={x} cy={y} r="22" className={i === active ? "pp-orbit__node pp-orbit__node--active" : "pp-orbit__node"} style={{ "--node": colors[i] } as CSSProperties} />
              <text x={x} y={y + (y < cy ? -34 : 44)} textAnchor="middle" className="pp-orbit__label">{s}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function HeroSignature({ slug }: { slug: string }) {
  switch (slug) {
    case "hubai-x": return <HubaiSignature />;
    case "sapai-x": return <SapaiSignature />;
    case "masraf-x": return <MasrafSignature />;
    case "crm-x": return <CrmSignature />;
    default: return null;
  }
}

/* ------------------------------------------------------------------ */
/* Ozellik bloklari icin kanitlayici mini ekranlar                     */
/* ------------------------------------------------------------------ */

type MockData = { url: string; rows: [string, string, "ok" | "wait" | "bad"][]; chat: [string, string]; chart: number[] };

const MOCK: Record<string, MockData> = {
  "hubai-x": {
    url: "hubai-x.com/asistan",
    rows: [["IK_Yonetmeligi_2026.pdf · s.34", "Kaynak", "ok"], ["Satınalma_Proseduru.docx", "Kaynak", "ok"], ["Finans limit tablosu", "Yetki yok", "bad"]],
    chat: ["Yıllık izin devri kaç gün?", "Yönetmeliğin 4.2 maddesine göre en fazla 10 gün devredilebilir. Kaynak: s.34"],
    chart: [32, 44, 41, 58, 63, 71, 78],
  },
  "sapai-x": {
    url: "sapai-x.com/talepler",
    rows: [["CR-2026-118 · MM", "Çözüldü", "ok"], ["CR-2026-121 · SD", "Geliştirmede", "wait"], ["CR-2026-124 · FI", "Onay bekliyor", "wait"]],
    chat: ["VA01'de kredi limiti uyarısı neden çıkıyor?", "Müşteri kredi kontrol alanı 'statik' ayarlı. Z_SD_KREDI_EXIT içinde eşik 0,9 olarak tanımlı."],
    chart: [18, 26, 31, 29, 42, 48, 55],
  },
  "masraf-x": {
    url: "masraf-x.co/onaylar",
    rows: [["EXP-2026-0431 · ₺1.487,50", "İhlal", "bad"], ["EXP-2026-0428 · ₺640,00", "Onaylandı", "ok"], ["EXP-2026-0425 · ₺2.115,20", "Bekliyor", "wait"]],
    chat: ["Bu fiş daha önce girilmiş mi?", "Aynı tutar ve tarihle 12 Mart'ta EXP-2026-0398 olarak kayıtlı. Mükerrer işaretlendi."],
    chart: [64, 58, 61, 49, 44, 38, 31],
  },
  "crm-x": {
    url: "crm-x.co/firsatlar",
    rows: [["Fırsat #OPP-2140 · ₺320.000", "Teklif", "wait"], ["Fırsat #OPP-2133 · ₺85.000", "Kazanıldı", "ok"], ["Fırsat #OPP-2127 · ₺140.000", "Riskli", "bad"]],
    chat: ["Bu hafta hangi fırsatlara dönmeliyim?", "3 fırsatta 10 günden uzun süredir temas yok. En yüksek değerli olan #OPP-2140."],
    chart: [22, 30, 35, 41, 39, 52, 60],
  },
};

const STATUS = { ok: "pp-dot--ok", wait: "pp-dot--wait", bad: "pp-dot--bad" };

export function FeatureMock({ slug, variant }: { slug: string; variant: number }) {
  const m = MOCK[slug] ?? MOCK["hubai-x"];
  const kind = variant % 3;
  if (kind === 0) {
    return (
      <BrowserFrame url={m.url}>
        <div className="pp-mock-head"><b>Son kayıtlar</b><span>Bugün</span></div>
        <ul className="pp-list">
          {m.rows.map(([a, b, s]) => (
            <li key={a}><span>{a}</span><em><i className={`pp-dot ${STATUS[s]}`} />{b}</em></li>
          ))}
        </ul>
      </BrowserFrame>
    );
  }
  if (kind === 1) {
    return (
      <BrowserFrame url={m.url}>
        <div className="pp-chat">
          <p className="pp-chat__q">{m.chat[0]}</p>
          <p className="pp-chat__a">{m.chat[1]}</p>
          <div className="pp-chat__input">Bir soru yazın…</div>
        </div>
      </BrowserFrame>
    );
  }
  const max = Math.max(...m.chart);
  const pts = m.chart.map((v, i) => `${(i / (m.chart.length - 1)) * 300},${110 - (v / max) * 96}`).join(" ");
  return (
    <BrowserFrame url={m.url}>
      <div className="pp-mock-head"><b>Haftalık eğilim</b><span>7 hafta</span></div>
      <svg className="pp-line" viewBox="0 0 300 120" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`pp-line-${slug}`} x1="0" x2="1">
            <stop offset="0" stopColor="#2f6bff" /><stop offset=".5" stopColor="#7448e8" /><stop offset="1" stopColor="#d946b5" />
          </linearGradient>
        </defs>
        {[30, 60, 90].map((y) => <line key={y} x1="0" x2="300" y1={y} y2={y} className="pp-line__grid" />)}
        <polyline points={pts} stroke={`url(#pp-line-${slug})`} className="pp-line__path" />
      </svg>
    </BrowserFrame>
  );
}
