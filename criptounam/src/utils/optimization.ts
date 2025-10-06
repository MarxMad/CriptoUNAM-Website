// Sistema de optimización personalizado para CriptoUNAM
// Funciones para mejorar el rendimiento del sitio

// Lazy loading para imágenes
export const lazyLoadImage = (img: HTMLImageElement, src: string) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        img.src = src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });
  
  observer.observe(img);
};

// Preload de recursos críticos
export const preloadCriticalResources = () => {
  const criticalResources = [
    '/images/LogosCriptounam.svg',
    '/images/Comunidad/_DSC0151.jpg',
    '/images/Comunidad/_DSC0129.jpg'
  ];
  
  criticalResources.forEach((resource) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = 'image';
    document.head.appendChild(link);
  });
};

// Optimización de imágenes
export const optimizeImage = (src: string, width?: number, quality: number = 80) => {
  // Si es una imagen de Supabase, podemos optimizarla
  if (src.includes('supabase.co')) {
    const url = new URL(src);
    if (width) {
      url.searchParams.set('width', width.toString());
    }
    url.searchParams.set('quality', quality.toString());
    return url.toString();
  }
  return src;
};

// Debounce para funciones costosas
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle para scroll events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Memoización para funciones costosas
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Compresión de datos
export const compressData = (data: any) => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('Error comprimiendo datos:', error);
    return data;
  }
};

// Cache de API calls
export const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const getCachedData = (key: string) => {
  const cached = apiCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

export const setCachedData = (key: string, data: any) => {
  apiCache.set(key, { data, timestamp: Date.now() });
};

// Optimización de bundle
export const loadComponentLazy = (importFunc: () => Promise<any>) => {
  // Esta función se implementaría en el componente que la use
  return importFunc;
};

// Service Worker para cache
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registrado:', registration);
      })
      .catch((error) => {
        console.log('Error registrando SW:', error);
      });
  }
};

// Métricas de rendimiento
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} tomó ${end - start} milisegundos`);
};

// Optimización de scroll
export const optimizedScroll = (callback: () => void) => {
  let ticking = false;
  
  const updateScroll = () => {
    callback();
    ticking = false;
  };
  
  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(updateScroll);
      ticking = true;
    }
  };
  
  return requestTick;
};

// Prefetch de rutas
export const prefetchRoute = (route: string) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = route;
  document.head.appendChild(link);
};

// Optimización de imágenes con WebP
export const getOptimizedImageSrc = (src: string, format: 'webp' | 'jpeg' = 'webp') => {
  if (src.includes('supabase.co')) {
    const url = new URL(src);
    url.searchParams.set('format', format);
    return url.toString();
  }
  return src;
};

// Lazy loading para componentes - función helper
export const createLazyComponent = () => {
  return {
    isVisible: false,
    ref: null as HTMLDivElement | null,
    observer: null as IntersectionObserver | null,
    
    init: function(element: HTMLDivElement) {
      this.ref = element;
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.isVisible = true;
            this.observer?.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      
      if (this.ref) {
        this.observer.observe(this.ref);
      }
    },
    
    cleanup: function() {
      if (this.observer) {
        this.observer.disconnect();
      }
    }
  };
};
