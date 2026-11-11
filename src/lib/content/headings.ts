import type { MarkdownHeading } from "astro";

// Keep long technical notes scannable; Astro owns the anchor generation.
export function getTocHeadings(headings: MarkdownHeading[]): MarkdownHeading[] {
  const depth = headings.some((heading) => heading.depth === 2) ? 2 : 3;
  return headings
    .filter((heading) => heading.depth === depth)
    .map((heading) => ({
      ...heading,
      // The directory supplies its own sequence numbers; keep the anchor unchanged.
      text: heading.text.replace(/^\d+[.、]\s+/u, ""),
    }));
}
