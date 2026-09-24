import Link from "next/link";
import type { ReactNode } from "react";
import type { Root, RootContent, PhrasingContent } from "mdast";
import { getProducts } from "@/content/products";
import { localePath, type Locale } from "@/i18n/config";

/**
 * Yazi govdesinde her urun adinin (HubAI-X, SAPAI-X, ...) ilk gectigi yeri
 * urun sayfasina baglar. Ic baglanti okuyucuyu cozume, arama motorlarini da
 * konu ile urun arasindaki iliskiye goturur. Bir yazida her urun bir kez
 * baglanir; basliklar ve mevcut baglantilar ellenmez.
 */
export function createProductLinker(locale: Locale) {
  const products = getProducts(locale);
  const byName = new Map(products.map((p) => [p.name, p]));
  const pattern = new RegExp(`(${products.map((p) => p.name.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&")).join("|")})`);
  const linked = new Set<string>();
  const hrefFor = (name: string) => {
    const product = byName.get(name);
    if (!product || linked.has(product.slug)) return null;
    linked.add(product.slug);
    return localePath(locale, `/products/${product.slug}`);
  };

  /** Duz metin paragraflari (dosyadaki yazilar). */
  function text(value: string): ReactNode {
    const parts = value.split(pattern);
    if (parts.length === 1) return value;
    return parts.map((part, i) => {
      const href = i % 2 === 1 ? hrefFor(part) : null;
      return href ? <Link key={i} href={href}>{part}</Link> : part;
    });
  }

  /** Markdown yazilar (yonetim panelinden) icin remark eklentisi. */
  function remarkPlugin() {
    const skip = new Set(["link", "linkReference", "heading", "code", "inlineCode", "definition"]);
    const walk = (node: Root | RootContent) => {
      if (skip.has(node.type) || !("children" in node)) return;
      const children: RootContent[] = [];
      for (const child of node.children as RootContent[]) {
        if (child.type !== "text") {
          walk(child);
          children.push(child);
          continue;
        }
        child.value.split(pattern).forEach((part, i) => {
          if (!part) return;
          const href = i % 2 === 1 ? hrefFor(part) : null;
          const piece: PhrasingContent = href
            ? { type: "link", url: href, children: [{ type: "text", value: part }] }
            : { type: "text", value: part };
          children.push(piece);
        });
      }
      (node as { children: RootContent[] }).children = children;
    };
    return (tree: Root) => walk(tree);
  }

  return { text, remarkPlugin };
}
