import MarkdownIt from "markdown-it";

const markdownInlineRenderer = new MarkdownIt({
  html: false,
  linkify: false,
  typographer: false,
});

export function renderInlineMarkdown(text: string): string {
  return markdownInlineRenderer.renderInline(text).trim();
}
