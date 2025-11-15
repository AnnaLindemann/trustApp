// public/sw.js

const CACHE_VERSION = "v7";
const CACHE_NAME = `trustapp-cache-${CACHE_VERSION}`;

// ⚠️ тут должны быть ТОЛЬКО реально существующие файлы из public
const PRECACHE_URLS = [
  "/",
  "/manifest.webmanifest",
  "/icons/logoPNG192.png",
  "/icons/logoPNG512.png",
  "/icons/logoPNG32Favicon.png",
  "/icons/logoPNG16Favicon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return undefined;
        })
      )
    )
  );

  self.clients.claim();
});

function isNavigationRequest(request) {
  if (request.mode === "navigate") return true;
  const acceptHeader = request.headers.get("accept") || "";
  return acceptHeader.includes("text/html");
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // не трогаем чужие домены
  if (url.origin !== self.location.origin) return;

  if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  event.respondWith(handleStaticRequest(request));
});

async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request);

    // если онлайн, обновляем app-shell
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put("/", networkResponse.clone());
    }

    return networkResponse;
  } catch {
    // оффлайн → отдаём кешированный /
    const cachedShell = await caches.match("/");
    if (cachedShell) {
      return cachedShell;
    }

    // вообще нет шелла — честный 503
    return new Response("Offline (no cached shell)", {
      status: 503,
      statusText: "Service Unavailable (offline - no shell)",
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

async function handleStaticRequest(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }

  try {
    const networkResponse = await fetch(request);

    if (
      networkResponse &&
      networkResponse.status === 200 &&
      (networkResponse.type === "basic" || networkResponse.type === "default")
    ) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch {
    return new Response("", {
      status: 503,
      statusText: "Resource unavailable (offline)",
    });
  }
}
