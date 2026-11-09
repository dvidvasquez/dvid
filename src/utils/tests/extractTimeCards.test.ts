import assert from "node:assert/strict";
import test from "node:test";
import { extractTimeCards } from "../extractTimeCards";

const LIST = `
<ul>
  <li class="card">
    <a href="/eventos/rock"><img src="/img/rock.jpg" alt=""></a>
    <time datetime="2026-11-14T20:00:00-05:00">14 nov</time>
    <h3><a href="/eventos/rock">Noche de rock</a></h3>
    <span class="event-venue">Teatro Lido</span>
    <p>Bandas locales en una sola noche de ruido.</p>
  </li>
  <li class="card">
    <time datetime="2026-11-21">21 nov</time>
    <h3><a href="/eventos/jazz">Jazz en el parque</a></h3>
  </li>
</ul>`;

test("arma un evento por cada tarjeta con <time datetime> y un titulo", () => {
  assert.deepEqual(extractTimeCards(LIST), [
    {
      "@type": "Event",
      name: "Noche de rock",
      startDate: "2026-11-14T20:00:00-05:00",
      url: "/eventos/rock",
      image: "/img/rock.jpg",
      location: "Teatro Lido",
      description: "Bandas locales en una sola noche de ruido.",
    },
    { "@type": "Event", name: "Jazz en el parque", startDate: "2026-11-21", url: "/eventos/jazz" },
  ]);
});

test("la fecha puede estar en un <header> dentro de un <article>", () => {
  const html = `<article><header><time datetime="2026-12-01T19:00">1 dic</time></header><h2>Feria del libro</h2><a href="/feria">ver</a></article>`;
  const [event] = extractTimeCards(html);
  assert.equal(event.name, "Feria del libro");
  assert.equal(event.url, "/feria");
});

test("con dos fechas en la tarjeta, la primera es el inicio y la segunda el fin", () => {
  const html = `<div><h3>Festival</h3><time datetime="2026-12-05">5</time><time datetime="2026-12-02">2</time></div>`;
  const [event] = extractTimeCards(html);
  assert.equal(event.startDate, "2026-12-02");
  assert.equal(event.endDate, "2026-12-05");
});

test("no ata una fecha a un contenedor con varios titulos", () => {
  const html = `<main><time datetime="2026-11-14">14</time><h3>Uno</h3><h3>Dos</h3></main>`;
  assert.deepEqual(extractTimeCards(html), []);
});

test("ignora <time> sin datetime valido y tarjetas sin titulo", () => {
  const html = `<div><h3>Hora</h3><time datetime="PT2H">2 horas</time></div><div><time datetime="2026-11-14">14</time></div>`;
  assert.deepEqual(extractTimeCards(html), []);
});

test("usa la imagen diferida (data-src) y descarta enlaces vacios", () => {
  const html = `<div><img src="data:image/gif;base64,AAA" data-src="/img/a.jpg"><time datetime="2026-11-14">14</time><h3><a href="#">Taller</a></h3></div>`;
  const [event] = extractTimeCards(html);
  assert.equal(event.image, "/img/a.jpg");
  assert.equal("url" in event, false);
});

test("una pagina sin <time> da una lista vacia", () => {
  assert.deepEqual(extractTimeCards("<div><h3>Nada</h3></div>"), []);
});
