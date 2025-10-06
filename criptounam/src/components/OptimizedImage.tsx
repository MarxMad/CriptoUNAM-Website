import React, { useState, useRef, useEffect } from 'react'
import { optimizeImage, getOptimizedImageSrc } from '../utils/optimization'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  quality?: number
  className?: string
  style?: React.CSSProperties
  lazy?: boolean
  fallback?: string
  onLoad?: () => void
  onError?: () => void
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  quality = 80,
  className = '',
  style = {},
  lazy = true,
  fallback = '/images/placeholder.jpg',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(!lazy)
  const imgRef = useRef<HTMLImageElement>(null)

  // Optimizar la URL de la imagen
  const optimizedSrc = React.useMemo(() => {
    if (hasError) return fallback
    
    let optimizedUrl = src
    
    // Si es una imagen de Supabase, optimizarla
    if (src.includes('supabase.co')) {
      optimizedUrl = getOptimizedImageSrc(src, 'webp')
    }
    
    // Aplicar optimizaciones adicionales
    return optimizeImage(optimizedUrl, width, quality)
  }, [src, width, quality, hasError, fallback])

  // Intersection Observer para lazy loading
  useEffect(() => {
    if (!lazy || !imgRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    )

    observer.observe(imgRef.current)

    return () => observer.disconnect()
  }, [lazy])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  return (
    <div
      ref={imgRef}
      className={`optimized-image-container ${className}`}
      style={{
        position: 'relative',
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
        overflow: 'hidden',
        ...style
      }}
    >
      {/* Placeholder mientras carga */}
      {!isLoaded && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            fontSize: '0.9rem'
          }}
        >
          Cargando...
        </div>
      )}

      {/* Imagen optimizada */}
      {isInView && (
        <img
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
            ...style
          }}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
        />
      )}

      {/* CSS para animación shimmer */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  )
}

export default OptimizedImage
