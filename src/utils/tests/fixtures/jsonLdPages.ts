// Formas habituales de JSON-LD de eventos (campos de ejemplo, no respuestas reales de ningun sitio).

/** Una pagina con un arreglo de eventos sueltos y otro bloque que no es de eventos. */
export const ARRAY_PAGE = `<!doctype html><html><head>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Sitio"}</script>
<script type="application/ld+json">[
  {"@context":"https://schema.org","@type":"MusicEvent","name":"Kampfar","startDate":"2026-11-20T20:00:00-05:00",
   "location":{"@type":"Place","name":"Estadio Atanasio Girardot","address":{"@type":"PostalAddress","addressLocality":"Medellín"}},
   "url":"/concerts/1-kampfar","image":["https://images.example.com/kampfar.jpg"]},
  {"@context":"https://schema.org","@type":"MusicEvent","name":"Hocico","startDate":"2026-11-22T21:00:00",
   "location":{"@type":"Place","name":"Green Club"},"url":"https://www.example.com/concerts/2-hocico"}
]</script>
</head><body></body></html>`;

/** Lista (`ItemList`) con eventos dentro de `item`, como las paginas de busqueda de entradas. */
export const ITEM_LIST_PAGE = `<script type="application/ld+json">{
  "@context":"https://schema.org","@type":"ItemList",
  "itemListElement":[
    {"@type":"ListItem","position":1,"item":{"@type":"Event","name":"Festival de la Empanada","startDate":"2026-11-28","endDate":"2026-11-29",
      "location":{"@type":"Place","name":"Parque Lleras"},"offers":{"@type":"Offer","price":"0","priceCurrency":"COP"},"url":"https://www.example.com/e/empanada"}},
    {"@type":"ListItem","position":2,"item":{"@type":"TheaterEvent","name":"Hamlet","startDate":"2026-12-02T19:30:00-05:00","url":"https://www.example.com/e/hamlet"}}
  ]}</script>`;

/** Eventos dentro de `@graph`, mezclados con otros nodos. */
export const GRAPH_PAGE = `<script type="application/ld+json">{
  "@context":"https://schema.org",
  "@graph":[
    {"@type":"WebSite","name":"Sitio"},
    {"@type":["Event","SocialEvent"],"name":"Noche Punk","startDate":"2026-12-05T20:00:00-05:00","@id":"https://www.example.com/#punk"}
  ]}</script>`;
