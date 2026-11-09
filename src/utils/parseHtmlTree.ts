export type HtmlElement = { tag: string; attrs: Record<string, string>; children: Array<HtmlElement | string> };

/** Etiquetas HTML que no tienen cierre. */
const VOID_TAGS = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
/** Etiquetas que el navegador cierra solas al abrir otra igual justo despues. */
const SELF_CLOSING_SIBLINGS = new Set(["li", "dt", "dd", "option", "tr", "td", "th", "p"]);

const TOKEN = /<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>|<(\/?)([A-Za-z][A-Za-z0-9:-]*)((?:"[^"]*"|'[^']*'|[^'">])*)>/gi;
const ATTRIBUTE = /([^\s=/"'<>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'<>=`]+)))?/g;

function parseAttributes(source: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const match of source.matchAll(ATTRIBUTE)) {
    const name = match[1].toLowerCase();
    if (!(name in attrs)) attrs[name] = match[2] ?? match[3] ?? match[4] ?? "";
  }
  return attrs;
}

/** Arbol HTML sencillo, sin comentarios, `<script>` ni `<style>`: suficiente para leer atributos y texto aunque falten cierres. */
export function parseHtmlTree(html: string): HtmlElement {
  const root: HtmlElement = { tag: "#root", attrs: {}, children: [] };
  const stack: HtmlElement[] = [root];
  let cursor = 0;

  const addText = (end: number) => {
    const text = html.slice(cursor, end);
    if (text.trim()) stack[stack.length - 1].children.push(text);
  };

  for (const match of html.matchAll(TOKEN)) {
    const start = match.index ?? 0;
    addText(start);
    cursor = start + match[0].length;

    const [, skipped, closing, rawTag, rawAttrs = ""] = match;
    if (skipped || !rawTag) continue; // comentarios, <script> y <style>

    const tag = rawTag.toLowerCase();
    if (closing) {
      const open = stack.map((element) => element.tag).lastIndexOf(tag);
      if (open > 0) stack.length = open;
      continue;
    }

    if (SELF_CLOSING_SIBLINGS.has(tag) && stack[stack.length - 1].tag === tag) stack.pop();

    const element: HtmlElement = { tag, attrs: parseAttributes(rawAttrs), children: [] };
    stack[stack.length - 1].children.push(element);
    if (!VOID_TAGS.has(tag) && !rawAttrs.trimEnd().endsWith("/")) stack.push(element);
  }

  addText(html.length);
  return root;
}
