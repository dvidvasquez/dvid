// Revisa que cada fuente de noticias responda con un feed valido.
// Uso: npm run news:check
import { getNewsFeed } from "../src/services/news.service";

const ICONS = { ok: "✔", "sin-feed": "–", error: "✖" } as const;

async function main() {
  const { statuses, sections } = await getNewsFeed();

  for (const { source, status, feedUrl, itemCount, message } of statuses) {
    const detail = status === "ok" ? `${itemCount} noticias · ${feedUrl}` : (message ?? "sin feed RSS/Atom");
    console.log(`${ICONS[status]} ${source.nombre.padEnd(28)} ${detail}`);
  }

  const working = statuses.filter(({ status }) => status === "ok").length;
  console.log(`\n${working}/${statuses.length} fuentes con noticias en ${sections.length} categorías.`);
}

main();
