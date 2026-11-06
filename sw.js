/* Service Worker - Verificador de Presiones VALSER (Offline First) */
const CACHE_NAME = 'presiones-offline-v5';
const APP_SHELL = [
  './',
  './index.html',
  './validacion_incertidumbre_banco.html',
  './validacion_incertidumbre_VST.html',
  './student-t.js',
  './manifest.json',
  './LOGO VALSER.png',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Todos los recursos críticos son locales; si falta alguno, la instalación
    // falla de forma visible en consola en lugar de activar una app incompleta.
    await cache.addAll(APP_SHELL);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE_NAME && key.startsWith('presiones-')).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Las integraciones externas (por ejemplo, EmailJS) solo se consultan en línea.
  // Nunca deben bloquear la navegación ni los cálculos locales.
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response && response.ok && response.type === 'basic') {
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch (error) {
      if (request.mode === 'navigate') {
        const fallback = await cache.match('./index.html');
        if (fallback) return fallback;
      }
      return new Response('Recurso no disponible sin conexión.', {
        status: 503,
        statusText: 'Offline',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
  })());
});
