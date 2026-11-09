import assert from "node:assert/strict";
import test from "node:test";
import { tribeToAgendaEvent } from "../tribeToAgendaEvent";

const SOURCE = { nombre: "Medellín Guru", url: "https://medellinguru.com" };

// Forma documentada de la API REST de The Events Calendar (campos de ejemplo, no una respuesta real).
const RAW = {
  id: 99041,
  title: "Heaven &amp; Hell Symphony Fest",
  description: "<p>Tributo sinf&oacute;nico. Con invitados.</p>",
  url: "https://medellinguru.com/event/heaven-and-hell-symphony-fest/",
  start_date: "2025-08-23 18:00:00",
  end_date: "2025-08-23 23:00:00",
  utc_start_date: "2025-08-23 23:00:00",
  utc_end_date: "2025-08-24 04:00:00",
  timezone: "America/Bogota",
  all_day: false,
  image: { url: "https://medellinguru.com/wp-content/uploads/2025/08/17.-Heaven-and-Hell-Symphony-Fest.webp", id: 1 },
  cost: "$ 45.000",
  cost_details: { currency_symbol: "$", values: ["45000"] },
  venue: { venue: "La Pascasia", city: "Medellín", address: "Calle 47 #43 88" },
  categories: [{ name: "Concerts" }, { name: "Music festivals" }],
};

test("convierte un evento de la API", () => {
  assert.deepEqual(tribeToAgendaEvent(RAW, SOURCE), {
    id: "99041",
    title: "Heaven & Hell Symphony Fest",
    category: "musica",
    start: "2025-08-23T23:00:00.000Z",
    end: "2025-08-24T04:00:00.000Z",
    allDay: false,
    venue: "La Pascasia",
    municipality: "Medellín",
    price: 45000,
    image: "https://medellinguru.com/wp-content/uploads/2025/08/17.-Heaven-and-Hell-Symphony-Fest.webp",
    excerpt: "Tributo sinfónico. Con invitados.",
    source: "Medellín Guru",
    url: "https://medellinguru.com/event/heaven-and-hell-symphony-fest/",
  });
});

test("sin fechas en UTC lee la fecha local en la zona del evento", () => {
  const event = tribeToAgendaEvent({ ...RAW, utc_start_date: undefined, utc_end_date: undefined }, SOURCE);
  assert.equal(event?.start, "2025-08-23T23:00:00.000Z");
  assert.equal(event?.end, "2025-08-24T04:00:00.000Z");
});

test("sin sitio la API manda una lista vacia: el evento sigue siendo valido", () => {
  const event = tribeToAgendaEvent({ ...RAW, venue: [] }, SOURCE);
  assert.equal(event?.venue, "");
  assert.equal(event?.municipality, null);
});

test("image false significa sin imagen", () => {
  assert.equal(tribeToAgendaEvent({ ...RAW, image: false }, SOURCE)?.image, null);
});

test("un evento gratis tiene precio 0 y uno sin costo, null", () => {
  assert.equal(tribeToAgendaEvent({ ...RAW, cost: "Free", cost_details: undefined }, SOURCE)?.price, 0);
  assert.equal(tribeToAgendaEvent({ ...RAW, cost: "", cost_details: undefined }, SOURCE)?.price, null);
});

test("all_day marca el evento de dia completo", () => {
  assert.equal(tribeToAgendaEvent({ ...RAW, all_day: true }, SOURCE)?.allDay, true);
});

test("decodifica entidades numericas del titulo", () => {
  assert.equal(tribeToAgendaEvent({ ...RAW, title: "Rock &#8211; Fest" }, SOURCE)?.title, "Rock – Fest");
});

test("sin titulo, sin fecha o sin objeto no hay evento", () => {
  assert.equal(tribeToAgendaEvent({ ...RAW, title: "" }, SOURCE), null);
  assert.equal(tribeToAgendaEvent({ ...RAW, utc_start_date: undefined, start_date: undefined }, SOURCE), null);
  assert.equal(tribeToAgendaEvent(null, SOURCE), null);
  assert.equal(tribeToAgendaEvent("evento", SOURCE), null);
});
