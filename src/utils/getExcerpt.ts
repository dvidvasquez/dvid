const ELLIPSIS = "…";

export function getExcerpt(text: string, maxLength = 160): string {
  const normalized = text.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) return normalized;

  const cut = normalized.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > 0 ? cut.slice(0, lastSpace) : cut;

  return `${base.replace(/[\s.,;:!?-]+$/, "")}${ELLIPSIS}`;
}
