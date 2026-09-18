import { brand } from "@/content/brand";

/**
 * ASH logosu.
 *
 * Resmi logo dosyalari oldugu gibi kullanilir - hicbiri yeniden cizilmez:
 *   public/brand/ash-dark.svg   "AS" koyu  -> ACIK zeminler icin
 *   public/brand/ash-light.svg  "AS" beyaz -> KOYU zeminler icin
 *
 * Tema, logo kutusuna "variant-dark" (koyu zemin) ya da "variant-light"
 * (acik zemin) sinifini veriyor; dogru dosya buna gore secilir. Zemin
 * koyuyken koyu logo, acikken beyaz logo okunmaz hale geldigi icin
 * tek dosya her yerde kullanilamaz.
 *
 * brand.logoPath doluysa her zeminde SADECE o dosya kullanilir.
 */
export function BrandLogo({ className }: { className: string }) {
  const onDarkSurface = className.includes("variant-dark");
  const src =
    brand.logoPath ?? (onDarkSurface ? "/brand/ash-light.svg" : "/brand/ash-dark.svg");

  return <img src={src} className={className} alt={brand.name} />;
}
