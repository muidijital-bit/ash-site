import { jsonLdString } from "@/lib/seo";

/** Arama motorlarina yapilandirilmis veri (schema.org JSON-LD). */
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(data) }} />;
}
