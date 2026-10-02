import { XMLParser } from "fast-xml-parser";
import { stripHtml } from "./stripHtml";

export type ParsedFeedItem = {
  title: string;
  link: string;
  excerpt: string;
  image: string | null;
  publishedAt: Date | null;
};

type XmlNode = Record<string, unknown>;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseTagValue: false,
  parseAttributeValue: false,
  trimValues: true,
  processEntities: true,
  htmlEntities: true,
});

function asArray<T>(value: T | T[] | undefined | null): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function text(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (value && typeof value === "object" && "#text" in value) return text((value as XmlNode)["#text"]);
  return "";
}

function attr(value: unknown, name: string): string {
  return value && typeof value === "object" ? text((value as XmlNode)[`@_${name}`]) : "";
}

function toAbsoluteUrl(value: string, base: string): string | null {
  if (!value) return null;
  try {
    const url = new URL(value.trim(), base || undefined);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

function toDate(value: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function firstImageInHtml(html: string): string {
  const match = html.match(/<img\b[^>]*?\bsrc\s*=\s*["']([^"']+)["']/i);
  return match ? match[1].replace(/&amp;/g, "&") : "";
}

function isImageMedia(node: unknown): boolean {
  const medium = attr(node, "medium");
  const type = attr(node, "type");
  if (medium) return medium === "image";
  if (type) return type.startsWith("image/");
  return /\.(jpe?g|png|webp|gif|avif)(\?|$)/i.test(attr(node, "url"));
}

function findImage(item: XmlNode, htmlFields: string[], link: string): string | null {
  const mediaGroups = asArray(item["media:group"] as XmlNode | XmlNode[]);
  const mediaContents = [
    ...asArray(item["media:content"]),
    ...mediaGroups.flatMap((group) => asArray(group["media:content"])),
  ];
  const thumbnails = [
    ...asArray(item["media:thumbnail"]),
    ...mediaGroups.flatMap((group) => asArray(group["media:thumbnail"])),
  ];
  const enclosures = [
    ...asArray(item.enclosure),
    ...asArray(item.link).filter((node) => attr(node, "rel") === "enclosure"),
  ];

  const candidates = [
    ...mediaContents.filter(isImageMedia).map((node) => attr(node, "url")),
    ...thumbnails.map((node) => attr(node, "url")),
    ...enclosures.filter(isImageMedia).map((node) => attr(node, "url") || attr(node, "href")),
    attr(item.image, "url") || text((item.image as XmlNode | undefined)?.url) || attr(item.image, "href"),
    ...htmlFields.map(firstImageInHtml),
  ];

  for (const candidate of candidates) {
    const url = toAbsoluteUrl(candidate, link);
    if (url) return url;
  }
  return null;
}

function rssLink(item: XmlNode): string {
  const links = asArray(item.link);
  const plain = links.map(text).find(Boolean);
  if (plain) return plain;
  const atomLink = asArray(item["atom:link"]).find((node) => !attr(node, "rel") || attr(node, "rel") === "alternate");
  if (atomLink) return attr(atomLink, "href");
  const guid = item.guid;
  return attr(guid, "isPermaLink") !== "false" ? text(guid) : "";
}

function atomLink(entry: XmlNode): string {
  const links = asArray(entry.link);
  const alternate =
    links.find((node) => attr(node, "rel") === "alternate" && (!attr(node, "type") || attr(node, "type") === "text/html")) ??
    links.find((node) => !attr(node, "rel")) ??
    links.find((node) => attr(node, "rel") === "alternate");
  return alternate ? attr(alternate, "href") || text(alternate) : "";
}

function parseRssItem(item: XmlNode, base: string): ParsedFeedItem | null {
  const link = toAbsoluteUrl(rssLink(item), base);
  const title = stripHtml(text(item.title));
  if (!link || !title) return null;

  const description = text(item.description);
  const content = text(item["content:encoded"]);

  return {
    title,
    link,
    excerpt: stripHtml(description || content),
    image: findImage(item, [content, description], link),
    publishedAt: toDate(text(item.pubDate) || text(item["dc:date"]) || text(item.published) || text(item.updated)),
  };
}

function parseAtomEntry(entry: XmlNode, base: string): ParsedFeedItem | null {
  const link = toAbsoluteUrl(atomLink(entry), base);
  const title = stripHtml(text(entry.title));
  if (!link || !title) return null;

  const summary = text(entry.summary);
  const content = text(entry.content);

  return {
    title,
    link,
    excerpt: stripHtml(summary || content),
    image: findImage(entry, [content, summary], link),
    publishedAt: toDate(text(entry.published) || text(entry.updated) || text(entry["dc:date"])),
  };
}

/** Lee un feed RSS 2.0, RSS 1.0 (RDF) o Atom. Retorna [] si el texto no es un feed. */
export function parseFeed(xml: string, baseUrl = ""): ParsedFeedItem[] {
  if (!xml.trimStart().startsWith("<")) return [];

  let doc: XmlNode;
  try {
    doc = parser.parse(xml) as XmlNode;
  } catch {
    return [];
  }

  const rss = doc.rss as XmlNode | undefined;
  const rdf = doc["rdf:RDF"] as XmlNode | undefined;
  const atom = doc.feed as XmlNode | undefined;

  if (rss || rdf) {
    const channel = (rss?.channel ?? rdf?.channel) as XmlNode | undefined;
    const base = toAbsoluteUrl(text(channel?.link), baseUrl) ?? baseUrl;
    const items = asArray((rss ? channel?.item : rdf?.item) as XmlNode | XmlNode[]);
    return items.map((item) => parseRssItem(item, base)).filter((item): item is ParsedFeedItem => item !== null);
  }

  if (atom) {
    const base = toAbsoluteUrl(atomLink(atom), baseUrl) ?? baseUrl;
    return asArray(atom.entry as XmlNode | XmlNode[])
      .map((entry) => parseAtomEntry(entry, base))
      .filter((item): item is ParsedFeedItem => item !== null);
  }

  return [];
}
