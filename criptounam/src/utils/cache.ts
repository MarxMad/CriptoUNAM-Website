// Sistema de caché y optimización
export interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number // Time to live in milliseconds
  hits: number
}

export interface CacheConfig {
  maxSize: number
  defaultTTL: number
  cleanupInterval: number
}

export class CacheManager<T = any> {
  private cache = new Map<string, CacheEntry<T>>()
  private config: CacheConfig
  private cleanupTimer?: NodeJS.Timeout

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 100,
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      cleanupInterval: 60 * 1000, // 1 minute
      ...config
    }
    this.startCleanup()
  }

  // Obtener valor del caché
  get(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    // Verificar si ha expirado
    if (this.isExpired(entry)) {
      this.cache.delete(key)
      return null
    }

    // Incrementar contador de hits
    entry.hits++
    return entry.data
  }

  // Establecer valor en el caché
  set(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL,
      hits: 0
    }

    // Si el caché está lleno, remover el menos usado
    if (this.cache.size >= this.config.maxSize) {
      this.evictLeastUsed()
    }

    this.cache.set(key, entry)
  }

  // Verificar si existe en caché
  has(key: string): boolean {
    const entry = this.cache.get(key)
    return entry ? !this.isExpired(entry) : false
  }

  // Eliminar del caché
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  // Limpiar todo el caché
  clear(): void {
    this.cache.clear()
  }

  // Obtener estadísticas del caché
  getStats(): {
    size: number
    maxSize: number
    hitRate: number
    totalHits: number
    entries: Array<{
      key: string
      age: number
      hits: number
      ttl: number
    }>
  } {
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      age: Date.now() - entry.timestamp,
      hits: entry.hits,
      ttl: entry.ttl
    }))

    const totalHits = entries.reduce((sum, entry) => sum + entry.hits, 0)
    const hitRate = totalHits > 0 ? totalHits / (totalHits + this.cache.size) : 0

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hitRate,
      totalHits,
      entries
    }
  }

  // Verificar si una entrada ha expirado
  private isExpired(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp > entry.ttl
  }

  // Remover la entrada menos usada
  private evictLeastUsed(): void {
    let leastUsedKey = ''
    let leastHits = Infinity

    for (const [key, entry] of this.cache.entries()) {
      if (entry.hits < leastHits) {
        leastHits = entry.hits
        leastUsedKey = key
      }
    }

    if (leastUsedKey) {
      this.cache.delete(leastUsedKey)
    }
  }

  // Limpiar entradas expiradas
  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }

  // Iniciar limpieza automática
  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup()
    }, this.config.cleanupInterval)
  }

  // Detener limpieza automática
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
    }
    this.clear()
  }
}

// Caché global para la aplicación
export const appCache = new CacheManager({
  maxSize: 200,
  defaultTTL: 10 * 60 * 1000, // 10 minutes
  cleanupInterval: 2 * 60 * 1000 // 2 minutes
})

// Caché específico para datos de API
export const apiCache = new CacheManager({
  maxSize: 100,
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  cleanupInterval: 60 * 1000 // 1 minute
})

// Caché para imágenes
export const imageCache = new CacheManager({
  maxSize: 50,
  defaultTTL: 30 * 60 * 1000, // 30 minutes
  cleanupInterval: 5 * 60 * 1000 // 5 minutes
})

// Utilidades de caché
export class CacheUtils {
  // Generar clave de caché
  static generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&')
    
    return `${prefix}:${sortedParams}`
  }

  // Caché con función de fallback
  static async getOrSet<T>(
    cache: CacheManager<T>,
    key: string,
    fallback: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = cache.get(key)
    if (cached !== null) {
      return cached
    }

    const data = await fallback()
    cache.set(key, data, ttl)
    return data
  }

  // Invalidar caché por patrón
  static invalidatePattern(cache: CacheManager, pattern: string): void {
    const regex = new RegExp(pattern)
    for (const key of cache['cache'].keys()) {
      if (regex.test(key)) {
        cache.delete(key)
      }
    }
  }

  // Pre-cargar datos
  static async preload<T>(
    cache: CacheManager<T>,
    key: string,
    loader: () => Promise<T>,
    ttl?: number
  ): Promise<void> {
    try {
      const data = await loader()
      cache.set(key, data, ttl)
    } catch (error) {
      console.error('Error preloading data:', error)
    }
  }

  // Caché con retry
  static async getWithRetry<T>(
    cache: CacheManager<T>,
    key: string,
    loader: () => Promise<T>,
    maxRetries: number = 3,
    ttl?: number
  ): Promise<T> {
    let retries = 0
    
    while (retries < maxRetries) {
      try {
        const cached = cache.get(key)
        if (cached !== null) {
          return cached
        }

        const data = await loader()
        cache.set(key, data, ttl)
        return data
      } catch (error) {
        retries++
        if (retries >= maxRetries) {
          throw error
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * retries))
      }
    }

    throw new Error('Max retries exceeded')
  }
}

// Hook para React
export const useCache = <T>(cache: CacheManager<T>) => {
  return {
    get: cache.get.bind(cache),
    set: cache.set.bind(cache),
    has: cache.has.bind(cache),
    delete: cache.delete.bind(cache),
    clear: cache.clear.bind(cache),
    stats: cache.getStats.bind(cache)
  }
}

// Configuración de caché por defecto
export const defaultCacheConfig: CacheConfig = {
  maxSize: 100,
  defaultTTL: 5 * 60 * 1000,
  cleanupInterval: 60 * 1000
}

export default CacheManager
