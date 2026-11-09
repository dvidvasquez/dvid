export type IcsDateTime = {
  /** `YYYY-MM-DDTHH:mm` (o `YYYY-MM-DD` si es de dia completo), tal cual viene, sin convertir. */
  value: string;
  /** `TZID` del campo; `null` si es UTC o flotante. */
  timeZone: string | null;
  /** Termina en `Z`: la hora ya esta en UTC. */
  utc: boolean;
  dateOnly: boolean;
};

export type IcsEvent = {
  uid: string;
  summary: string;
  description: string;
  location: string;
  url: string;
  categories: string[];
  image: string | null;
  start: IcsDateTime | null;
  end: IcsDateTime | null;
};

type Property = { name: string; params: Record<string, string>; value: string };

const IMAGE_URL = /\.(jpe?g|png|webp|gif|avif)(\?|$)/i;
const DATE_TIME = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(?:\d{2})?(Z)?)?$/;

function splitOutsideQuotes(text: string, separator: string): string[] {
  const parts: string[] = [];
  let current = "";
  let quoted = false;
  for (const char of text) {
    if (char === '"') quoted = !quoted;
    if (char === separator && !quoted) {
      parts.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  parts.push(current);
  return parts;
}

function parseProperty(line: string): Property | null {
  let quoted = false;
  let colon = -1;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') quoted = !quoted;
    else if (char === ":" && !quoted) {
      colon = index;
      break;
    }
  }
  if (colon <= 0) return null;

  const [name = "", ...rawParams] = splitOutsideQuotes(line.slice(0, colon), ";");
  const params: Record<string, string> = {};
  for (const raw of rawParams) {
    const equals = raw.indexOf("=");
    if (equals > 0) params[raw.slice(0, equals).toUpperCase()] = raw.slice(equals + 1).replace(/^"|"$/g, "");
  }
  return { name: name.toUpperCase(), params, value: line.slice(colon + 1) };
}

function unescapeText(value: string): string {
  return value.replace(/\\([nN,;\\])/g, (_match, char: string) => (char === "n" || char === "N" ? "\n" : char));
}

function parseDateTime({ value, params }: Property): IcsDateTime | null {
  const match = value.trim().match(DATE_TIME);
  if (!match) return null;
  const [, year, month, day, hour, minute, zulu] = match;
  const date = `${year}-${month}-${day}`;
  if (hour === undefined) return { value: date, timeZone: null, utc: false, dateOnly: true };
  return {
    value: `${date}T${hour}:${minute}`,
    timeZone: zulu ? null : (params.TZID ?? null),
    utc: Boolean(zulu),
    dateOnly: false,
  };
}

function createEvent(): IcsEvent {
  return {
    uid: "",
    summary: "",
    description: "",
    location: "",
    url: "",
    categories: [],
    image: null,
    start: null,
    end: null,
  };
}

function applyProperty(event: IcsEvent, property: Property) {
  const { name, params, value } = property;
  switch (name) {
    case "UID":
      event.uid = value.trim();
      break;
    case "SUMMARY":
      event.summary = unescapeText(value).trim();
      break;
    case "DESCRIPTION":
      event.description = unescapeText(value).trim();
      break;
    case "LOCATION":
      event.location = unescapeText(value).trim();
      break;
    case "URL":
      event.url = value.trim();
      break;
    case "CATEGORIES":
      event.categories.push(
        ...value
          .split(/(?<!\\),/)
          .map((category) => unescapeText(category).trim())
          .filter(Boolean),
      );
      break;
    case "DTSTART":
      event.start = parseDateTime(property);
      break;
    case "DTEND":
      event.end = parseDateTime(property);
      break;
    case "ATTACH": {
      const isImage = (params.FMTTYPE ?? "").startsWith("image/") || IMAGE_URL.test(value);
      if (isImage && !event.image) event.image = value.trim();
      break;
    }
  }
}

/** Lee los `VEVENT` de un archivo iCalendar (RFC 5545). Ignora alarmas y lo que no entiende. */
export function parseIcs(text: string): IcsEvent[] {
  const lines = text.replace(/\r?\n[ \t]/g, "").split(/\r?\n/);
  const events: IcsEvent[] = [];
  let current: IcsEvent | null = null;
  let nested = 0;

  for (const line of lines) {
    const property = parseProperty(line);
    if (!property) continue;

    if (property.name === "BEGIN") {
      if (current) nested += 1;
      else if (property.value.trim() === "VEVENT") current = createEvent();
    } else if (property.name === "END") {
      if (current && nested > 0) nested -= 1;
      else if (current && property.value.trim() === "VEVENT") {
        events.push(current);
        current = null;
      }
    } else if (current && nested === 0) {
      applyProperty(current, property);
    }
  }

  return events;
}
