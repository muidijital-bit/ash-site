/* Form altinda, tam genislikte ofis haritasi. Baslik yok; adres bilgisi
   formun yanindaki listede duruyor. */
import { contact } from "@/content/contact";
import type { Locale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import "./MapSection.css";

/**
 * Harita statik bir gorsel: doseme goruntuleri bir kez indirilip tek dosyaya
 * dikildi (scripts/ash-harita.py). Gomulu cerceve yerine bunu kullaniyoruz
 * cunku OpenStreetMap'in gomulusu artik WebGL istiyor ve desteklemeyen
 * tarayicida haritanin yerine hata metni cikiyor; Google'inki ise ucuncu
 * taraf cerezi birakiyor. Boylece sayfada hic ucuncu taraf istegi yok.
 * Gorsele tiklanince gercek haritada acilir.
 */
export function MapSection({ locale }: { locale: Locale }) {
  const ui = getUi(locale).contact;
  const office = contact.offices.find((office) => office.id === "istanbul");
  if (!office || office.lines.length === 0) return null;

  // Mobilde serit 4:3'e doner; o kirpim onceden uretildi, boylece kucuk ekran
  // 360 KB'lik genis gorseli indirmiyor.
  const harita = (
    <picture>
      <source media="(max-width: 47.99rem)" type="image/avif" srcSet="/images/ash-harita-zorlu-dar.avif" width={1080} height={810} />
      <source media="(max-width: 47.99rem)" srcSet="/images/ash-harita-zorlu-dar.webp" width={1080} height={810} />
      <source type="image/avif" srcSet="/images/ash-harita-zorlu-1440.avif 1440w, /images/ash-harita-zorlu.avif 2880w" sizes="100vw" width={2880} height={1080} />
      <img
        className="ash-map__image"
        src="/images/ash-harita-zorlu.webp"
        srcSet="/images/ash-harita-zorlu-1440.webp 1440w, /images/ash-harita-zorlu.webp 2880w"
        sizes="100vw"
        alt={`${ui.mapAria}: ${office.lines.join(", ")}`}
        width={2880}
        height={1080}
        loading="lazy"
        decoding="async"
      />
    </picture>
  );

  return (
    <section className="ash-map" aria-label={`${office.name[locale]} — ${ui.mapAria}`}>
      {office.mapUrl ? (
        <a className="ash-map__link" href={office.mapUrl} target="_blank" rel="noopener noreferrer">
          {harita}
          <span className="ash-map__badge">{ui.directions} <span aria-hidden="true">→</span></span>
        </a>
      ) : (
        harita
      )}
      {/* Doseme goruntulerinin lisansi atif ister; gorsele gommek yerine
          burada, dile gore ve lisans sayfasina baglanarak veriliyor. */}
      <a
        className="ash-map__attribution"
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noopener noreferrer"
      >
        © {ui.mapAttribution}
      </a>
    </section>
  );
}
