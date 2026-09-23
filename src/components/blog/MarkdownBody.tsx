import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Raw HTML is ignored; links use react-markdown's safe URL transform. */
export function MarkdownBody({ content }: { content: string }) {
  return <Markdown remarkPlugins={[remarkGfm]} skipHtml components={{
    h1: ({ children }) => <h2>{children}</h2>,
    img: () => null,
    a: ({ href, children }) => <a href={href} rel="noopener noreferrer">{children}</a>,
  }}>{content}</Markdown>;
}
