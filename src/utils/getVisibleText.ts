import type { HtmlElement } from "./parseHtmlTree";
import { stripHtml } from "./stripHtml";

function textOf(node: HtmlElement | string): string {
  if (typeof node === "string") return node;
  return node.children.map(textOf).join(" ");
}

/** Texto que se ve dentro de un elemento, sin etiquetas ni entidades. */
export function getVisibleText(element: HtmlElement): string {
  return stripHtml(textOf(element));
}
