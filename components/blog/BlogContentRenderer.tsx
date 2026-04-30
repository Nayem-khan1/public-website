import type { ReactNode } from "react";
import { PublicBlogContentBlock } from "@/lib/public-api";
import { DEFAULT_BLOG_IMAGE_URL } from "@/lib/public-api";

interface RichTextNode {
  type?: string;
  text?: string;
  marks?: Array<{ type?: string }>;
  attrs?: Record<string, unknown>;
  content?: RichTextNode[];
}

function renderMarkedText(node: RichTextNode, key: string): ReactNode {
  let content: ReactNode = node.text ?? "";

  node.marks?.forEach((mark, index) => {
    if (mark.type === "bold") {
      content = <strong key={`${key}-bold-${index}`} className="font-bold text-slate-900">{content}</strong>;
      return;
    }

    if (mark.type === "italic") {
      content = <em key={`${key}-italic-${index}`} className="italic text-slate-700">{content}</em>;
    }
  });

  return content;
}

function renderRichNode(node: RichTextNode, key: string): ReactNode {
  if (node.type === "text") {
    return renderMarkedText(node, key);
  }

  if (node.type === "paragraph") {
    return (
      <p key={key} className="text-xl leading-[1.8] text-slate-700 mb-8 font-serif tracking-wide">
        {renderRichNodes(node.content ?? [], `${key}-paragraph`)}
      </p>
    );
  }

  if (node.type === "bulletList") {
    return (
      <ul key={key} className="list-disc space-y-3 pl-8 mb-8 text-xl leading-[1.8] text-slate-700 font-serif tracking-wide marker:text-primary/70">
        {renderRichNodes(node.content ?? [], `${key}-bullet`)}
      </ul>
    );
  }

  if (node.type === "orderedList") {
    return (
      <ol key={key} className="list-decimal space-y-3 pl-8 mb-8 text-xl leading-[1.8] text-slate-700 font-serif tracking-wide marker:text-primary font-medium">
        {renderRichNodes(node.content ?? [], `${key}-ordered`)}
      </ol>
    );
  }

  if (node.type === "listItem") {
    return <li key={key} className="pl-2">{renderRichNodes(node.content ?? [], `${key}-item`)}</li>;
  }

  if (node.type === "hardBreak") {
    return <br key={key} />;
  }

  return (
    <span key={key}>
      {renderRichNodes(node.content ?? [], `${key}-nested`)}
    </span>
  );
}

function renderRichNodes(nodes: RichTextNode[], keyPrefix: string): ReactNode[] {
  return nodes.map((node, index) => renderRichNode(node, `${keyPrefix}-${index}`));
}

export function renderTextBlock(
  block: PublicBlogContentBlock,
  postTitle: string,
  index: number,
) {
  if (block.type === "heading") {
    const HeadingTag = block.level === 1 ? "h1" : block.level === 3 ? "h3" : "h2";

    return (
      <HeadingTag
        key={`${block.type}-${index}`}
        className="mt-16 mb-8 font-display text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-snug"
      >
        {block.value}
      </HeadingTag>
    );
  }

  if (block.type === "image") {
    return (
      <figure key={`${block.type}-${index}`} className="my-14 -mx-4 sm:mx-0">
        <div className="overflow-hidden sm:rounded-[2rem] bg-slate-50 border border-slate-100 shadow-sm relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.url || DEFAULT_BLOG_IMAGE_URL}
            alt={block.caption || postTitle}
            loading="lazy"
            decoding="async"
            className="w-full h-auto object-cover"
          />
        </div>
        {block.caption ? (
          <figcaption className="mt-4 text-center text-sm font-medium text-slate-500 max-w-lg mx-auto">
            {block.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (block.rich_text && Array.isArray((block.rich_text as RichTextNode).content)) {
    return (
      <div key={`${block.type}-${index}`}>
        {renderRichNodes(
          ((block.rich_text as RichTextNode).content ?? []) as RichTextNode[],
          `rich-${index}`,
        )}
      </div>
    );
  }

  return (
    <p
      key={`${block.type}-${index}`}
      className="text-xl leading-[1.8] text-slate-700 mb-8 font-serif tracking-wide"
    >
      {block.value}
    </p>
  );
}

interface BlogContentRendererProps {
  blocks: PublicBlogContentBlock[];
  postTitle: string;
}

export function BlogContentRenderer({ blocks, postTitle }: BlogContentRendererProps) {
  return (
    <div className="prose prose-lg max-w-none prose-a:text-primary hover:prose-a:text-secondary prose-a:transition-colors prose-strong:text-slate-900 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-slate-50 prose-blockquote:py-3 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:text-slate-700 prose-blockquote:font-medium prose-blockquote:italic prose-blockquote:shadow-sm">
      {blocks.map((block, index) => renderTextBlock(block, postTitle, index))}
    </div>
  );
}
