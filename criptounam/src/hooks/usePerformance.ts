import { useEffect, useCallback, useRef, useState } from 'react'
import { debounce, throttle, measurePerformance } from '../utils/optimization'

// Hook para lazy loading
export const useLazyLoading = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible }
}

// Hook para debounced search
export const useDebouncedSearch = (callback: (value: string) => void, delay = 300) => {
  const debouncedCallback = useCallback(
    debounce(callback, delay),
    [callback, delay]
  )

  return debouncedCallback
}

// Hook para throttled scroll
export const useThrottledScroll = (callback: () => void, limit = 100) => {
  const throttledCallback = useCallback(
    throttle(callback, limit),
    [callback, limit]
  )

  useEffect(() => {
    window.addEventListener('scroll', throttledCallback)
    return () => window.removeEventListener('scroll', throttledCallback)
  }, [throttledCallback])

  return throttledCallback
}

// Hook para medir rendimiento
export const usePerformanceMonitor = (componentName: string) => {
  const startTime = useRef<number>(0)
  const [metrics, setMetrics] = useState<{
    renderTime: number
    mountTime: number
    updateCount: number
  }>({
    renderTime: 0,
    mountTime: 0,
    updateCount: 0
  })

  useEffect(() => {
    startTime.current = performance.now()
  }, [])

  useEffect(() => {
    const endTime = performance.now()
    const renderTime = endTime - startTime.current
    
    setMetrics(prev => ({
      ...prev,
      renderTime,
      updateCount: prev.updateCount + 1
    }))

    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`)
    }
  })

  return metrics
}

// Hook para preload de recursos
export const usePreload = (resources: string[]) => {
  useEffect(() => {
    resources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource
      
      if (resource.includes('.css')) {
        link.as = 'style'
      } else if (resource.includes('.js')) {
        link.as = 'script'
      } else if (resource.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        link.as = 'image'
      }
      
      document.head.appendChild(link)
    })
  }, [resources])
}

// Hook para cache de API
export const useApiCache = <T>(key: string, fetcher: () => Promise<T>, ttl = 300000) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const cacheRef = useRef<{ data: T; timestamp: number } | null>(null)

  const fetchData = useCallback(async () => {
    // Verificar cache
    if (cacheRef.current && Date.now() - cacheRef.current.timestamp < ttl) {
      setData(cacheRef.current.data)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await fetcher()
      cacheRef.current = { data: result, timestamp: Date.now() }
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [fetcher, ttl])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

// Hook para optimización de imágenes
export const useImageOptimization = (src: string, options: {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'jpeg' | 'png'
} = {}) => {
  const [optimizedSrc, setOptimizedSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!src) return

    setIsLoading(true)
    setHasError(false)

    // Simular optimización (en producción esto sería real)
    const optimizeImage = async () => {
      try {
        // Aquí iría la lógica real de optimización
        const optimized = src // Por ahora retornamos la original
        setOptimizedSrc(optimized)
      } catch (error) {
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }

    optimizeImage()
  }, [src, options.width, options.height, options.quality, options.format])

  return { optimizedSrc, isLoading, hasError }
}

// Hook para monitoreo de Core Web Vitals
export const useWebVitals = () => {
  const [vitals, setVitals] = useState<{
    FCP?: number
    LCP?: number
    FID?: number
    CLS?: number
  }>({})

  useEffect(() => {
    if (typeof window === 'undefined') return

    // First Contentful Paint
    const measureFCP = () => {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            setVitals(prev => ({ ...prev, FCP: entry.startTime }))
          }
        }
      }).observe({ entryTypes: ['paint'] })
    }

    // Largest Contentful Paint
    const measureLCP = () => {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]
        setVitals(prev => ({ ...prev, LCP: lastEntry.startTime }))
      }).observe({ entryTypes: ['largest-contentful-paint'] })
    }

    // First Input Delay
    const measureFID = () => {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const fidEntry = entry as any
          if (fidEntry.processingStart && fidEntry.startTime) {
            setVitals(prev => ({ ...prev, FID: fidEntry.processingStart - fidEntry.startTime }))
          }
        }
      }).observe({ entryTypes: ['first-input'] })
    }

    // Cumulative Layout Shift
    const measureCLS = () => {
      let clsValue = 0
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
            setVitals(prev => ({ ...prev, CLS: clsValue }))
          }
        }
      }).observe({ entryTypes: ['layout-shift'] })
    }

    measureFCP()
    measureLCP()
    measureFID()
    measureCLS()
  }, [])

  return vitals
}

// Hook para cleanup de recursos
export const useCleanup = () => {
  const cleanupFunctions = useRef<(() => void)[]>([])

  const addCleanup = useCallback((fn: () => void) => {
    cleanupFunctions.current.push(fn)
  }, [])

  useEffect(() => {
    return () => {
      cleanupFunctions.current.forEach(fn => fn())
      cleanupFunctions.current = []
    }
  }, [])

  return addCleanup
}
