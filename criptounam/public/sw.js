// Service Worker para CriptoUNAM
// Cache inteligente para mejorar el rendimiento

const CACHE_NAME = 'criptounam-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Recursos críticos para cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/images/LogosCriptounam.svg',
  '/images/LogosCriptounam2.svg',
  '/images/LogosCriptounam3.svg',
  '/images/LogosCriptounamBlanco.svg',
  '/images/5.png',
  '/images/cursos/1.svg',
  '/images/cursos/2.svg',
  '/images/cursos/3.svg'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('SW: Instalando...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('SW: Cacheando recursos estáticos');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('SW: Instalación completada');
        return self.skipWaiting();
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('SW: Activando...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('SW: Eliminando cache antiguo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('SW: Activación completada');
        return self.clients.claim();
      })
  );
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Estrategia para diferentes tipos de recursos
  if (request.method === 'GET') {
    // Recursos estáticos - Cache First
    if (isStaticAsset(url.pathname)) {
      event.respondWith(cacheFirst(request));
    }
    // Imágenes - Cache First con fallback
    else if (isImage(url.pathname)) {
      event.respondWith(cacheFirstWithFallback(request));
    }
    // API calls - Network First
    else if (isApiCall(url.pathname)) {
      event.respondWith(networkFirst(request));
    }
    // Páginas - Network First con cache
    else {
      event.respondWith(networkFirstWithCache(request));
    }
  }
});

// Estrategia Cache First
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('SW: Error en cacheFirst:', error);
    return new Response('Recurso no disponible', { status: 404 });
  }
}

// Estrategia Network First
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Estrategia Network First con Cache
async function networkFirstWithCache(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Fallback para páginas
    return caches.match('/index.html');
  }
}

// Cache First con fallback para imágenes
async function cacheFirstWithFallback(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Fallback a imagen placeholder
    return new Response('', { status: 404 });
  }
}

// Helper functions
function isStaticAsset(pathname) {
  return STATIC_ASSETS.includes(pathname) || 
         pathname.includes('/static/') ||
         pathname.includes('/assets/');
}

function isImage(pathname) {
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(pathname);
}

function isApiCall(pathname) {
  return pathname.includes('/api/') || 
         pathname.includes('supabase.co') ||
         pathname.includes('telegram.org');
}

// Limpiar cache periódicamente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAN_CACHE') {
    cleanOldCache();
  }
});

async function cleanOldCache() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(name => 
    name !== STATIC_CACHE && name !== DYNAMIC_CACHE
  );
  
  await Promise.all(
    oldCaches.map(cacheName => caches.delete(cacheName))
  );
  
  console.log('SW: Cache limpiado');
}
