import assert from "node:assert/strict";
import test from "node:test";
import { expandJsonLdPages } from "../expandJsonLdPages";

const NOW = new Date("2026-11-09T15:00:00.000Z");

test("una pagina con {month} sale una vez por mes, desde el actual", () => {
  const pages = expandJsonLdPages([{ url: "https://sitio.co/eventos/month/{month}/", months: 3 }], NOW);
  assert.deepEqual(
    pages.map((page) => page.url),
    [
      "https://sitio.co/eventos/month/2026-11/",
      "https://sitio.co/eventos/month/2026-12/",
      "https://sitio.co/eventos/month/2027-01/",
    ],
  );
});

test("cada pagina generada conserva la categoria y ya no lleva months", () => {
  const [page] = expandJsonLdPages([{ url: "https://sitio.co/{month}", months: 1, categoryHint: "teatro" }], NOW);
  assert.deepEqual(page, { url: "https://sitio.co/2026-11", categoryHint: "teatro" });
});

test("las paginas sin months o sin {month} no cambian", () => {
  const input = [{ url: "https://sitio.co/agenda" }, { url: "https://sitio.co/{month}" }, { url: "https://sitio.co/otra", months: 2 }];
  assert.deepEqual(
    expandJsonLdPages(input, NOW).map((page) => page.url),
    ["https://sitio.co/agenda", "https://sitio.co/{month}", "https://sitio.co/otra"],
  );
});

test("el mes cuenta en hora de Colombia: la noche del 31 aun es el mes que termina", () => {
  const lastNight = new Date("2026-12-01T03:00:00.000Z");
  const [page] = expandJsonLdPages([{ url: "https://sitio.co/{month}", months: 1 }], lastNight);
  assert.equal(page.url, "https://sitio.co/2026-11");
});

test("cruza el año: diciembre sigue en enero", () => {
  const pages = expandJsonLdPages([{ url: "https://sitio.co/{month}", months: 2 }], new Date("2026-12-15T12:00:00.000Z"));
  assert.deepEqual(
    pages.map((page) => page.url),
    ["https://sitio.co/2026-12", "https://sitio.co/2027-01"],
  );
});

test("una fecha invalida deja las paginas como estan", () => {
  const pages = expandJsonLdPages([{ url: "https://sitio.co/{month}", months: 2 }], new Date("nope"));
  assert.deepEqual(
    pages.map((page) => page.url),
    ["https://sitio.co/{month}"],
  );
});
