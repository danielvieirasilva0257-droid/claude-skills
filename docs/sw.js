// Placas NFC: guarda o app no aparelho para abrir sem internet.
// Os registros NÃO passam por aqui: ficam no localStorage do aparelho.
const CACHE = "placas-nfc-v6";
const APP = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(APP)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  // Só cuida dos arquivos do app de placas. Outros apps na mesma pasta do site
  // (ex.: /financeiro/) têm o próprio service worker e não podem ser tocados aqui.
  const url = new URL(req.url);
  const raiz = new URL("./", self.registration.scope).pathname;
  if (url.origin === location.origin && url.pathname.startsWith(raiz) && /^(financeiro)\//.test(url.pathname.slice(raiz.length))) return;

  // A página: tenta a internet primeiro (para pegar atualizações) e cai no que está guardado.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => { const copia = res.clone(); caches.open(CACHE).then((c) => c.put("./index.html", copia)); return res; })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Ícones, fontes e o resto: usa o guardado e, se não tiver, busca e guarda.
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok || res.type === "opaque") { const copia = res.clone(); caches.open(CACHE).then((c) => c.put(req, copia)); }
      return res;
    }))
  );
});
