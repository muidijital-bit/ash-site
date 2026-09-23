import { z } from "zod";

/**
 * Iletisim formu mesaji. Tarayicidaki required/minLength kurallari yalnizca
 * kolaylik; asil sinir sunucuda calisan bu sema.
 */
const tekSatir = (max: number) => z.string().trim().max(max).transform((s) => s.replace(/\s+/g, " "));

export const contactMessageSchema = z.object({
  // Tek satira indirilir: ad, mail konusunda da kullaniliyor.
  name: tekSatir(120).pipe(z.string().min(2)),
  email: z.string().trim().max(254).pipe(z.email()),
  phone: tekSatir(40),
  message: z.string().trim().min(5).max(5000),
  locale: z.enum(["tr", "en"]),
});

export type ContactMessage = z.infer<typeof contactMessageSchema>;

/** Gelen kutusuna dusecek mailin konusu ve duz metin govdesi. */
export function contactEmail(message: ContactMessage) {
  return {
    subject: `Web sitesi iletişim formu: ${message.name}`,
    text: [
      `Ad soyad: ${message.name}`,
      `E-posta: ${message.email}`,
      ...(message.phone ? [`Telefon: ${message.phone}`] : []),
      `Sayfa dili: ${message.locale === "en" ? "İngilizce" : "Türkçe"}`,
      "",
      "Mesaj:",
      message.message,
    ].join("\n"),
  };
}
