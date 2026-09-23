"use server";

import { contact } from "@/content/contact";
import { contactEmail, contactMessageSchema } from "@/lib/contact-message";

export type ContactResult = "sent" | "invalid" | "failed";

/**
 * Iletisim formunu Resend uzerinden kurumsal adrese (hello@) iletir. Yanit
 * adresi ziyaretcinin e-postasi oldugu icin gelen maile dogrudan yanit
 * verilebilir. Anahtar yoksa ya da gonderim basarisizsa "failed" doner;
 * form bu durumda yazilanlari tarayicida saklar.
 */
export async function sendContactMessage(form: FormData): Promise<ContactResult> {
  // Gorunmeyen tuzak alan: yalnizca botlar doldurur. Bota hata verilmez,
  // mesaj da gonderilmez.
  if (String(form.get("website") ?? "")) return "sent";

  const parsed = contactMessageSchema.safeParse({
    name: String(form.get("name") ?? ""),
    email: String(form.get("email") ?? ""),
    phone: String(form.get("phone") ?? ""),
    message: String(form.get("message") ?? ""),
    locale: String(form.get("locale") ?? "tr"),
  });
  if (!parsed.success) return "invalid";

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[iletisim] RESEND_API_KEY tanimli degil; mesaj gonderilemedi.");
    return "failed";
  }

  const { subject, text } = contactEmail(parsed.data);
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "AI Solution House <form@aisolutionhouse.com>",
        // Birden fazla alici virgulle ayrilir; hepsi ayni maili alir.
        to: (process.env.CONTACT_TO_EMAIL || contact.email).split(",").map((adres) => adres.trim()).filter(Boolean),
        reply_to: parsed.data.email,
        subject,
        text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (response.ok) return "sent";
    console.error("[iletisim] Resend", response.status, (await response.text()).slice(0, 500));
  } catch (error) {
    console.error("[iletisim] Resend istegi basarisiz", error);
  }
  return "failed";
}
