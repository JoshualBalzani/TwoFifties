'use strict';
const CACHE = 'twofifties-v17';
const SHELL = ["/translations.js","/i18n.js","/onboarding.js","/onboarding.css","/","/index.html","/fonts.css?v=13","/m3.css?v=20","/color-theme.js?v=13","/features.css?v=20","/readability.css?v=13","/settings.css?v=15","/navigation.css?v=17","/home.css?v=16","/fab-actions.css?v=13","/logic.js?v=14","/gestures.js?v=17","/features-core.js?v=13","/features-ui.js?v=13","/date-fields.js?v=1","/fonts/roboto-latin.woff2","/fonts/roboto-latin-ext.woff2"];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).catch(() => {}))); self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  let url; try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== location.origin) return;
  if (url.pathname.startsWith('/api/')) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res && res.ok) { const clone = res.clone(); caches.open(CACHE).then(c => c.put(req, clone)).catch(() => {}); }
      return res;
    }).catch(() => caches.match(req).then(cached => cached || caches.match('/index.html')))
  );
});
