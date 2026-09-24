import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Locale } from "@/i18n/config";
import { createProductLinker } from "./productLinks";

/**
 * Raw HTML is ignored; links use react-markdown's safe URL transform.
 * locale verilirse urun adlarinin ilk gecisi urun sayfasina baglanir.
 */
export function MarkdownBody({ content, locale }: { content: string; locale?: Locale }) {
  const plugins = locale ? [remarkGfm, createProductLinker(locale).remarkPlugin] : [remarkGfm];
  return <Markdown remarkPlugins={plugins} skipHtml components={{
    h1: ({ children }) => <h2>{children}</h2>,
    img: () => null,
    a: ({ href, children }) => href?.startsWith("/")
      ? <Link href={href}>{children}</Link>
      : <a href={href} rel="noopener noreferrer">{children}</a>,
  }}>{content}</Markdown>;
}
