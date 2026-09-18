/* Form altinda, tam genislikte harita. Baslik yok; adres bilgisi formun
   yanindaki listede duruyor. */
import "./MapSection.css";

export function MapSection() {
  return (
    <section className="ash-map" aria-label="Ofis konumu">
      {/* Adres netlesince buraya gercek harita gomulecek; simdilik sematik cizim. */}
      <img className="ash-map__image" src="/images/ash-harita.svg" alt="" width={1600} height={900} />
    </section>
  );
}
