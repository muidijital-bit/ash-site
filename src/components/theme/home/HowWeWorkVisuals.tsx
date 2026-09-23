/**
 * "Kurumsal Deneyim ile Yapay Zeka Uzmanligi" bolumunun diyagramlari.
 *
 * Urun sayfalarindaki gibi kod ile cizilir: stok gorsel yok, her olcude
 * net, dosya boyutu sifir. Renkler marka paletinden; acik zemine gore.
 */

const INK = "#0a143d";
const HAIR = "rgba(10, 20, 61, 0.14)";
const MUTED = "#5d6688";
const BLUE = "#2f6bff";
const VIOLET = "#7448e8";
const MAGENTA = "#d946b5";

/**
 * Surec hatti: adimlar soldan saga, tikanan adim vurgulu.
 *
 * Iki olcude cizilir ve CSS ile biri gosterilir: genis kartta 500 birimlik
 * cizim, dar kartta (64rem alti: telefon ve tablet) 320 birimlik cizim.
 * Tek cizim kullanilinca dar kartta etiketler ~7px'e kuculup okunmuyordu.
 */
export function FlowDiagram({ steps, note }: { steps: string[]; note: string }) {
  return (
    <>
      <FlowSvg steps={steps} note={note} width={500} fontSize={13} noteSize={11.5} className="ash-bento__svg--genis" />
      <FlowSvg steps={steps} note={note} width={320} fontSize={12.5} noteSize={11.5} className="ash-bento__svg--dar" />
    </>
  );
}

function FlowSvg({ steps, note, width, fontSize, noteSize, className }: {
  steps: string[]; note: string; width: number; fontSize: number; noteSize: number; className: string;
}) {
  // Tikanma, gercek projelerde en sik gelistirme adiminda oldugu icin ortada.
  const stuck = Math.floor(steps.length / 2);
  const x0 = 26;
  const x1 = width - 26;
  const span = (x1 - x0) / (steps.length - 1);
  return (
    <svg className={`ash-bento__svg ${className}`} viewBox={`0 0 ${width} 132`} role="img" aria-label={note}>
      <line x1={x0} y1="52" x2={x1} y2="52" stroke={HAIR} strokeWidth="2" />
      {/* Once tum baglanti cizgileri, sonra daireler: cizgiler dairelerin
          ustunden gecmesin. */}
      {steps.slice(1).map((label, j) => {
        const i = j + 1;
        return (
          <line
            key={`cizgi-${label}`}
            x1={x0 + (i - 1) * span}
            y1="52" x2={x0 + i * span} y2="52"
            stroke={i <= stuck ? BLUE : HAIR}
            strokeWidth="2"
            opacity={i <= stuck ? 0.5 : 1}
          />
        );
      })}
      {steps.map((label, i) => {
        const x = x0 + i * span;
        const on = i === stuck;
        return (
          <g key={label}>
            <circle cx={x} cy="52" r={on ? 13 : 8} fill={on ? MAGENTA : "#ffffff"} stroke={on ? MAGENTA : HAIR} strokeWidth="2" />
            {on && <circle cx={x} cy="52" r="20" fill="none" stroke={MAGENTA} strokeWidth="1.5" opacity="0.35" />}
            <text x={x} y="92" textAnchor="middle" fontSize={fontSize} fill={on ? INK : MUTED} fontWeight={on ? 600 : 400}>
              {label}
            </text>
            {on && (
              <text x={x} y="114" textAnchor="middle" fontSize={noteSize} fill={MAGENTA} fontWeight="500">
                {note}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Metni iki satira mumkun oldugunca dengeli boler.
 * Cikis kutusundaki etiket dillere gore uzadigi icin (TR "Size ozel cozum",
 * EN "A solution built for you") sabit bir bolme yeri kullanilamiyor.
 */
function twoLines(text: string): [string, string] {
  const words = text.split(" ");
  if (words.length < 2) return [text, ""];
  let best = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ").length;
    const b = words.slice(i).join(" ").length;
    if (Math.abs(a - b) < bestDiff) { bestDiff = Math.abs(a - b); best = i; }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
}

/** Uc girdi tek cikisa birlesir: kuruma ozel yaklasim. */
export function InputsDiagram({ inputs, out }: { inputs: string[]; out: string }) {
  const ys = [26, 66, 106];
  const [line1, line2] = twoLines(out);
  return (
    <svg className="ash-bento__svg" viewBox="0 0 352 132" role="img" aria-label={out}>
      {inputs.slice(0, 3).map((label, i) => (
        <g key={label}>
          <rect x="2" y={ys[i] - 14} width="146" height="28" rx="14" fill="#ffffff" stroke={HAIR} strokeWidth="1.5" />
          <text x="75" y={ys[i] + 4.5} textAnchor="middle" fontSize="13.5" fill={MUTED}>{label}</text>
          <path
            d={`M152 ${ys[i]} C 180 ${ys[i]}, 186 66, 208 66`}
            fill="none"
            stroke={[BLUE, VIOLET, MAGENTA][i]}
            strokeWidth="2"
            opacity="0.55"
          />
        </g>
      ))}
      <rect x="210" y="44" width="140" height="44" rx="12" fill={INK} />
      <text x="280" y={line2 ? 62 : 71} textAnchor="middle" fontSize="13" fill="#f8f8f6">{line1}</text>
      {line2 && <text x="280" y="79" textAnchor="middle" fontSize="13" fill="#f8f8f6">{line2}</text>}
    </svg>
  );
}

/** Pilot ile uretim yukunu karsilastiran iki bar. */
export function LoadDiagram({ pilot, prod }: { pilot: string; prod: string }) {
  return (
    <svg className="ash-bento__svg" viewBox="0 0 320 132" role="img" aria-label={`${pilot} / ${prod}`}>
      <defs>
        <linearGradient id="ash-load" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={BLUE} />
          <stop offset="0.5" stopColor={VIOLET} />
          <stop offset="1" stopColor={MAGENTA} />
        </linearGradient>
      </defs>
      <text x="4" y="34" fontSize="12" fill={MUTED}>{pilot}</text>
      <rect x="4" y="44" width="312" height="14" rx="7" fill="rgba(10, 20, 61, 0.07)" />
      <rect x="4" y="44" width="78" height="14" rx="7" fill={HAIR} />
      <text x="4" y="90" fontSize="12" fill={INK} fontWeight="600">{prod}</text>
      <rect x="4" y="100" width="312" height="14" rx="7" fill="rgba(10, 20, 61, 0.07)" />
      <rect x="4" y="100" width="312" height="14" rx="7" fill="url(#ash-load)" />
    </svg>
  );
}
