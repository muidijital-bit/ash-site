/**
 * Urun sayfalarinin gorsel dili.
 *
 * Stok fotograf yok: her gorsel HTML/CSS + inline SVG ile cizilir. Mockup
 * icindeki metinler dekoratiftir (aria-hidden) ve anonim ornek veridir;
 * gercek musteri, marka ya da iddia icermez. Mockup metinleri iki dilde
 * asagidaki tablolarda durur.
 */
import { useId, type CSSProperties, type ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";

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
export function BrowserFrame({ url, children, className = "", locale }: { url: string; children: ReactNode; className?: string; locale: Locale }) {
  return (
    <div className={`pp-browser ${className}`} aria-hidden="true">
      <div className="pp-browser__chrome">
        <span className="pp-browser__dots"><i /><i /><i /></span>
        <span className="pp-browser__url">{url}</span>
        <span className="pp-browser__live"><i />{getUi(locale).live}</span>
      </div>
      <div className="pp-browser__body">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Imza gorselleri (hero)                                              */
/* ------------------------------------------------------------------ */

const SIG = {
  tr: {
    hubai: {
      models: ["Kurum içi model", "Sağlayıcı A", "Sağlayıcı B", "Belge arama", "Kendi modeliniz"],
      request: "Kurumsal istek",
      requestMeta: "yetki · bütçe · kaynak",
      url: "hubai-x.com/konsol",
      usage: "Departman kullanımı",
      period: "Bu ay",
      departments: ["Operasyon", "Finans", "İnsan Kaynakları", "Satış"],
      percent: (v: number) => `%${v}`,
      columns: ["İç", "A", "B"],
      roles: ["Analist", "Yönetici", "Stajyer"],
    },
    sapai: {
      fn: " z_mm_fatura_kontrol.",
      comment: "  \" Tedarikçi faturası ile satınalma siparişi eşleşmesi",
      table: " @DATA(lt_kalem).",
      diff: " lv_fark > ",
      field: "    ls_sonuc-durum = ",
      status: "'ONAY_BEKLIYOR'",
      tab: "Z_MM_FATURA_KONTROL.abap",
      ticketMeta: "Talep · CR-2026-118 · MM",
      ticket: "Fatura tutarı siparişten farklıysa onaya düşsün.",
      analyzing: "Sistem analiz ediliyor",
      kv: ["Taranan Z objesi", "İlgili işlem", "Modül"],
      button: "Onaya gönder",
    },
    masraf: {
      stages: ["Fiş", "Okuma", "Politika", "Onay", "Muhasebe"],
      receipt: "FİŞ #EXP-2026-0431",
      immutable: "DEĞİŞTİRİLEMEZ",
      lines: [["Konaklama · 2 gece", "₺3.240,00"], ["Ulaşım · taksi", "₺412,50"], ["Temsil · akşam yemeği", "₺1.487,50"], ["KDV %20", "₺758,40"]],
      alert: "Politika ihlali — kişi başı limit aşıldı, giriş engellendi",
      timeline: ["Fiş fotoğrafı yüklendi", "Tutar, tarih ve KDV okundu", "Mükerrer kayıt kontrolü: temiz", "Temsil limiti aşıldı", "Yönetici onayı bekleniyor"],
    },
    crm: {
      steps: ["Temas", "Nitelendirme", "Fırsat", "Teklif", "Kazanım", "Sadakat"],
      meta: "Fırsat #OPP-2140 · %60",
    },
  },
  en: {
    hubai: {
      models: ["In-house model", "Provider A", "Provider B", "Document search", "Your own model"],
      request: "Company request",
      requestMeta: "access · budget · source",
      url: "hubai-x.com/console",
      usage: "Department usage",
      period: "This month",
      departments: ["Operations", "Finance", "Human Resources", "Sales"],
      percent: (v: number) => `${v}%`,
      columns: ["Int", "A", "B"],
      roles: ["Analyst", "Manager", "Intern"],
    },
    sapai: {
      fn: " z_mm_invoice_check.",
      comment: "  \" Match supplier invoice against purchase order",
      table: " @DATA(lt_items).",
      diff: " lv_diff > ",
      field: "    ls_result-status = ",
      status: "'PENDING_APPROVAL'",
      tab: "Z_MM_INVOICE_CHECK.abap",
      ticketMeta: "Request · CR-2026-118 · MM",
      ticket: "Send the invoice for approval if its amount differs from the order.",
      analyzing: "Analyzing the system",
      kv: ["Z objects scanned", "Related transactions", "Module"],
      button: "Send for approval",
    },
    masraf: {
      stages: ["Receipt", "Reading", "Policy", "Approval", "Accounting"],
      receipt: "RECEIPT #EXP-2026-0431",
      immutable: "IMMUTABLE",
      lines: [["Accommodation · 2 nights", "₺3,240.00"], ["Transport · taxi", "₺412.50"], ["Hospitality · dinner", "₺1,487.50"], ["VAT 20%", "₺758.40"]],
      alert: "Policy violation — per-person limit exceeded, entry blocked",
      timeline: ["Receipt photo uploaded", "Amount, date and VAT read", "Duplicate check: clean", "Hospitality limit exceeded", "Awaiting manager approval"],
    },
    crm: {
      steps: ["Contact", "Qualification", "Opportunity", "Proposal", "Win", "Loyalty"],
      meta: "Opportunity #OPP-2140 · 60%",
    },
  },
};

/** HubAI-X: tek kurumsal istek, bes modele yonlendirilir + yonetim konsolu. */
function HubaiSignature({ locale }: { locale: Locale }) {
  const t = SIG[locale].hubai;
  const ys = [40, 110, 180, 250, 320];
  const usage = [78, 54, 36, 61];
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
        <text x="97" y="177" className="pp-router__label" textAnchor="middle">{t.request}</text>
        <text x="97" y="196" className="pp-router__meta" textAnchor="middle">{t.requestMeta}</text>
        {ys.map((y, i) => (
          <g key={`m${y}`}>
            <rect x="520" y={y - 22} width="214" height="44" rx="11" className={i === 1 ? "pp-router__model pp-router__model--active" : "pp-router__model"} />
            <text x="542" y={y + 5} className="pp-router__label">{t.models[i]}</text>
          </g>
        ))}
      </svg>
      <BrowserFrame url={t.url} className="pp-sig__panel" locale={locale}>
        <div className="pp-mock-head"><b>{t.usage}</b><span>{t.period}</span></div>
        {t.departments.map((d, i) => (
          <div className="pp-bar" key={d}>
            <span>{d}</span>
            <i><b style={{ width: `${usage[i]}%` } as CSSProperties} /></i>
            <em>{t.percent(usage[i])}</em>
          </div>
        ))}
        <div className="pp-matrix">
          <span />
          {t.columns.map((c) => <span key={c}>{c}</span>)}
          {([[1, 1, 0], [1, 1, 1], [1, 0, 0]] as number[][]).map((cells, i) => (
            <Row key={t.roles[i]} role={t.roles[i]} cells={cells} />
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
function SapaiSignature({ locale }: { locale: Locale }) {
  const t = SIG[locale].sapai;
  const code: [string, string][] = [
    ["kw", "FUNCTION"], ["fn", t.fn],
    ["cm", t.comment],
    ["kw", "  SELECT"], ["tx", " ebeln, ebelp, netwr "], ["kw", "FROM"], ["tx", " ekpo"],
    ["kw", "    WHERE"], ["tx", " ebeln = @iv_ebeln"],
    ["kw", "    INTO TABLE"], ["tx", t.table],
    ["kw", "  IF"], ["tx", t.diff], ["nm", "0.05"], ["kw", " THEN"],
    ["tx", t.field], ["st", t.status], ["tx", "."],
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
        <div className="pp-code__tab">{t.tab}</div>
        <ol>
          {lines.filter((l) => l.length).map((l, i) => (
            <li key={i}>{l.map(([k, text], j) => <span key={j} className={`pp-tk-${k}`}>{text}</span>)}</li>
          ))}
        </ol>
      </div>
      <BrowserFrame url={locale === "en" ? "sapai-x.com/assistant" : "sapai-x.com/asistan"} className="pp-sig__panel" locale={locale}>
        <div className="pp-ticket">
          <small>{t.ticketMeta}</small>
          <p>{t.ticket}</p>
        </div>
        <div className="pp-pulse"><i />{t.analyzing}</div>
        <div className="pp-kv">
          <span>{t.kv[0]}</span><b>148</b>
          <span>{t.kv[1]}</span><b>ME21N · MIRO</b>
          <span>{t.kv[2]}</span><b>MM · FI/CO</b>
        </div>
        <div className="pp-btn-mock">{t.button}</div>
      </BrowserFrame>
    </div>
  );
}

/** Masraf-X: onay zinciri + politika kontrollu fis karti. */
function MasrafSignature({ locale }: { locale: Locale }) {
  const t = SIG[locale].masraf;
  const states = ["done", "done", "active", "wait", "wait"];
  const times = ["09:14", "09:14", "09:15", "09:15", "—"];
  return (
    <div className="pp-sig pp-sig--masraf">
      <div className="pp-chevrons" aria-hidden="true">
        {t.stages.map((s, i) => <span key={s} className={`pp-chev pp-chev--${states[i]}`}>{s}</span>)}
      </div>
      <div className="pp-receipt-row">
        <div className="pp-receipt" aria-hidden="true">
          <div className="pp-receipt__head"><b>{t.receipt}</b><span className="pp-tag">{t.immutable}</span></div>
          {t.lines.map(([label, amount], i) => (
            <div key={label} className={i === 2 ? "pp-receipt__line pp-receipt__line--bad" : "pp-receipt__line"}>
              <span>{label}</span><b>{i === 2 ? <s>{amount}</s> : amount}</b>
            </div>
          ))}
          <div className="pp-receipt__alert">{t.alert}</div>
        </div>
        <ol className="pp-timeline" aria-hidden="true">
          {t.timeline.map((item, i) => (
            <li key={item} className={i === 3 ? "pp-timeline--bad" : i === 4 ? "pp-timeline--wait" : undefined}>
              <time>{times[i]}</time>{item}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** CRM-X: kapali musteri yolculugu yorunge diyagrami. */
function CrmSignature({ locale }: { locale: Locale }) {
  const t = SIG[locale].crm;
  const steps = t.steps;
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
        <text x={cx} y={cy + 44} textAnchor="middle" className="pp-orbit__meta">{t.meta}</text>
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

export function HeroSignature({ slug, locale }: { slug: string; locale: Locale }) {
  switch (slug) {
    case "hubai-x": return <HubaiSignature locale={locale} />;
    case "sapai-x": return <SapaiSignature locale={locale} />;
    case "masraf-x": return <MasrafSignature locale={locale} />;
    case "crm-x": return <CrmSignature locale={locale} />;
    default: return null;
  }
}

/* ------------------------------------------------------------------ */
/* Ozellik bloklari icin kanitlayici mini ekranlar                     */
/* ------------------------------------------------------------------ */

type MockData = { url: string; rows: [string, string, "ok" | "wait" | "bad"][]; chat: [string, string]; chart: number[] };

const MOCK: Record<Locale, Record<string, MockData>> = {
  tr: {
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
  },
  en: {
    "hubai-x": {
      url: "hubai-x.com/assistant",
      rows: [["HR_Handbook_2026.pdf · p.34", "Source", "ok"], ["Purchasing_Procedure.docx", "Source", "ok"], ["Finance limit table", "No access", "bad"]],
      chat: ["How many leave days can I carry over?", "Under section 4.2 of the handbook, up to 10 days can be carried over. Source: p.34"],
      chart: [32, 44, 41, 58, 63, 71, 78],
    },
    "sapai-x": {
      url: "sapai-x.com/requests",
      rows: [["CR-2026-118 · MM", "Resolved", "ok"], ["CR-2026-121 · SD", "In development", "wait"], ["CR-2026-124 · FI", "Awaiting approval", "wait"]],
      chat: ["Why does VA01 show a credit limit warning?", "The customer's credit check is set to 'static'. The threshold is defined as 0.9 in Z_SD_CREDIT_EXIT."],
      chart: [18, 26, 31, 29, 42, 48, 55],
    },
    "masraf-x": {
      url: "masraf-x.co/approvals",
      rows: [["EXP-2026-0431 · ₺1,487.50", "Violation", "bad"], ["EXP-2026-0428 · ₺640.00", "Approved", "ok"], ["EXP-2026-0425 · ₺2,115.20", "Pending", "wait"]],
      chat: ["Has this receipt been entered before?", "Yes. It was recorded on 12 March as EXP-2026-0398 with the same amount and date, and has been flagged as a duplicate."],
      chart: [64, 58, 61, 49, 44, 38, 31],
    },
    "crm-x": {
      url: "crm-x.co/opportunities",
      rows: [["Opportunity #OPP-2140 · ₺320,000", "Proposal", "wait"], ["Opportunity #OPP-2133 · ₺85,000", "Won", "ok"], ["Opportunity #OPP-2127 · ₺140,000", "At risk", "bad"]],
      chat: ["Which opportunities should I follow up on this week?", "3 opportunities have had no contact for more than 10 days. The highest-value one is #OPP-2140."],
      chart: [22, 30, 35, 41, 39, 52, 60],
    },
  },
};

const MOCK_LABELS = {
  tr: { recent: "Son kayıtlar", today: "Bugün", trend: "Haftalık eğilim", weeks: "7 hafta" },
  en: { recent: "Recent records", today: "Today", trend: "Weekly trend", weeks: "7 weeks" },
};

const STATUS = { ok: "pp-dot--ok", wait: "pp-dot--wait", bad: "pp-dot--bad" };

export function FeatureMock({ slug, variant, locale }: { slug: string; variant: number; locale: Locale }) {
  const gradientId = useId();
  const m = MOCK[locale][slug] ?? MOCK[locale]["hubai-x"];
  const l = MOCK_LABELS[locale];
  const kind = variant % 3;
  if (kind === 0) {
    return (
      <BrowserFrame url={m.url} locale={locale}>
        <div className="pp-mock-head"><b>{l.recent}</b><span>{l.today}</span></div>
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
      <BrowserFrame url={m.url} locale={locale}>
        <div className="pp-chat">
          <p className="pp-chat__q">{m.chat[0]}</p>
          <p className="pp-chat__a">{m.chat[1]}</p>
          <div className="pp-chat__input">{getUi(locale).askPlaceholder}</div>
        </div>
      </BrowserFrame>
    );
  }
  const max = Math.max(...m.chart);
  const pts = m.chart.map((v, i) => `${(i / (m.chart.length - 1)) * 300},${110 - (v / max) * 96}`).join(" ");
  return (
    <BrowserFrame url={m.url} locale={locale}>
      <div className="pp-mock-head"><b>{l.trend}</b><span>{l.weeks}</span></div>
      <svg className="pp-line" viewBox="0 0 300 120" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0" x2="1">
            <stop offset="0" stopColor="#2f6bff" /><stop offset=".5" stopColor="#7448e8" /><stop offset="1" stopColor="#d946b5" />
          </linearGradient>
        </defs>
        {[30, 60, 90].map((y) => <line key={y} x1="0" x2="300" y1={y} y2={y} className="pp-line__grid" />)}
        <polyline points={pts} stroke={`url(#${gradientId})`} className="pp-line__path" />
      </svg>
    </BrowserFrame>
  );
}
