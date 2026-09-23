import type { ReactNode } from "react";

/**
 * Urun adindaki sondaki "X" harfini marka gradyaniyla yazar:
 * "HubAI-X" -> HubAI-<span class="ash-grad-text">X</span>
 *
 * Yalnizca ad bir etiket/baslik olarak gectigi yerlerde kullanilir
 * (kartlar, menu, urun sayfasi basligi, footer). Duz metin icindeki
 * gecislere dokunulmaz: cumle icinde renkli harf okumayi bolerdi.
 *
 * Buyuk harfli yazimlar da ("HUBAI-X") ayni sekilde ayrilir.
 */
export function ProductName({ name }: { name: string }): ReactNode {
  const eslesme = name.match(/^(.*-)([Xx])$/);
  if (!eslesme) return name;
  const [, govde, x] = eslesme;
  return (
    <>
      {govde}
      <span className="ash-grad-text">{x}</span>
    </>
  );
}

/**
 * Ust etiket gibi "MASRAF-X · HARCAMA YONETIMI" bicimindeki metinlerde
 * yalnizca ilk parcadaki X'i renklendirir.
 */
export function ProductEyebrow({ text }: { text: string }): ReactNode {
  const ayirac = text.indexOf("·");
  if (ayirac === -1) return <ProductName name={text.trim()} />;
  const ad = text.slice(0, ayirac).trim();
  const kalan = text.slice(ayirac);
  return (
    <>
      <ProductName name={ad} /> {kalan}
    </>
  );
}
