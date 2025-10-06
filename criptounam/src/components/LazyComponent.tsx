import React, { useState, useRef, useEffect, ReactNode } from 'react'

interface LazyComponentProps {
  children: ReactNode
  fallback?: ReactNode
  threshold?: number
  rootMargin?: string
  className?: string
  style?: React.CSSProperties
}

const LazyComponent: React.FC<LazyComponentProps> = ({
  children,
  fallback = <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    minHeight: '200px',
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: '8px'
  }}>
    <style jsx>{`
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `}</style>
    Cargando...
  </div>,
  threshold = 0.1,
  rootMargin = '50px',
  className = '',
  style = {}
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true)
          setHasLoaded(true)
          observer.disconnect()
        }
      },
      { 
        threshold,
        rootMargin
      }
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [threshold, rootMargin, hasLoaded])

  return (
    <div
      ref={ref}
      className={`lazy-component ${className}`}
      style={{
        minHeight: '200px',
        ...style
      }}
    >
      {isVisible ? children : fallback}
    </div>
  )
}

export default LazyComponent
