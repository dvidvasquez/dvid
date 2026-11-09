// Revisa que cada fuente de eventos responda y muestra cuantos eventos trae, con cuantas imagenes.
// Uso: npm run events:check
import { EVENT_CATEGORIES } from "../src/constants/events";
import { getEventsFeed } from "../src/services/events.service";
import { formatEventTime } from "../src/utils/formatEventTime";
import { toDayKey } from "../src/utils/toDayKey";

const ICONS = { ok: "✔", "sin-eventos": "–", error: "✖" } as const;
const SAMPLE_SIZE = 5;

async function main() {
  const { events, statuses } = await getEventsFeed();

  for (const { source, status, via, eventCount, withImageCount, message } of statuses) {
    const detail =
      status === "ok"
        ? `${eventCount} eventos (${withImageCount} con imagen) · vía ${via?.toUpperCase()}`
        : (message ?? "sin eventos en el rango");
    console.log(`${ICONS[status]} ${source.nombre.padEnd(24)} ${detail}`);
  }

  console.log("\nPor categoría:");
  for (const { id, label } of EVENT_CATEGORIES) {
    const count = events.filter((event) => event.category === id).length;
    if (count > 0) console.log(`  ${label.padEnd(22)} ${count}`);
  }

  console.log(`\nPróximos ${Math.min(SAMPLE_SIZE, events.length)}:`);
  for (const event of events.slice(0, SAMPLE_SIZE)) {
    const place = [event.venue, event.municipality].filter(Boolean).join(", ");
    console.log(`  ${toDayKey(event.start)} ${formatEventTime(event)}  [${event.category}] ${event.title} — ${place || "sin lugar"}`);
  }

  console.log(`\n${events.length} eventos en total.`);
}

main();
