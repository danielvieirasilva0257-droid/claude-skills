// O Finanças saiu deste endereço. Este service worker substitui o antigo, apaga o que ele
// guardou e leva quem abrir para o endereço novo. Não mexe nos dados (eles ficam no navegador
// e o endereço novo é do mesmo site) nem no cache do app Plaquinhas NFC.
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) {
  e.waitUntil((async function () {
    var keys = await caches.keys();
    await Promise.all(keys.filter(function (k) { return k.indexOf("/claude-skills/financeiro/") !== -1; }).map(function (k) { return caches.delete(k); }));
    await self.registration.unregister();
    var janelas = await self.clients.matchAll({ type: "window" });
    janelas.forEach(function (c) { c.navigate("https://antoniofeli3478-rgb.github.io/Finan-as/"); });
  })());
});
