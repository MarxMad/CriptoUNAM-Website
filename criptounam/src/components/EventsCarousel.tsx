import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faCalendarAlt, faMapMarkerAlt, faUsers } from '@fortawesome/free-solid-svg-icons'
import OptimizedImage from './OptimizedImage'
import '../styles/global.css'

interface EventData {
  id: string
  title: string
  date: string
  time: string
  location: string
  image: string
  description: string
  capacity?: number
  registered?: number
  isUpcoming: boolean
}

interface EventsCarouselProps {
  events: EventData[]
  autoPlay?: boolean
  autoPlayInterval?: number
  showIndicators?: boolean
  showNavigation?: boolean
}

const EventsCarousel: React.FC<EventsCarouselProps> = ({
  events,
  autoPlay = true,
  autoPlayInterval = 5000,
  showIndicators = true,
  showNavigation = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && events.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length)
      }, autoPlayInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoPlay, autoPlayInterval, events.length])

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const handleMouseLeave = () => {
    if (autoPlay && events.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length)
      }, autoPlayInterval)
    }
  }

  const goToSlide = (index: number) => {
    if (isTransitioning) return
    
    setIsTransitioning(true)
    setCurrentIndex(index)
    
    setTimeout(() => {
      setIsTransitioning(false)
    }, 300)
  }

  const goToPrevious = () => {
    if (isTransitioning) return
    goToSlide(currentIndex === 0 ? events.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    if (isTransitioning) return
    goToSlide((currentIndex + 1) % events.length)
  }

  if (!events || events.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '3rem',
        background: 'rgba(26,26,26,0.8)',
        borderRadius: '20px',
        border: '1px solid rgba(212,175,55,0.3)',
        margin: '2rem 0'
      }}>
        <h3 style={{ color: '#D4AF37', marginBottom: '1rem' }}>Pr?ximos Eventos</h3>
        <p style={{ color: '#E0E0E0' }}>No hay eventos pr?ximos por el momento</p>
      </div>
    )
  }

  const currentEvent = events[currentIndex]

  return (
    <div 
      ref={carouselRef}
      style={{
        position: 'relative',
        maxWidth: '1400px',
        width: '95%',
        margin: '0 auto',
        padding: '0 20px'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header del carrusel */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{
          fontFamily: 'Orbitron',
          color: '#D4AF37',
          fontSize: '2.5rem',
          marginBottom: '1rem'
        }}>
          Pr?ximos Eventos
        </h2>
        <p style={{
          color: '#E0E0E0',
          fontSize: '1.2rem',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          No te pierdas nuestros pr?ximos eventos y actividades
        </p>
      </div>

      {/* Carrusel principal */}
      <div style={{
        position: 'relative',
        background: 'rgba(26,26,26,0.9)',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid rgba(212,175,55,0.3)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        {/* Imagen del evento */}
        <div style={{
          position: 'relative',
          height: '450px',
          overflow: 'hidden'
        }}>
          <OptimizedImage
            src={currentEvent.image}
            alt={currentEvent.title}
            fallback="/images/LogosCriptounam2.svg"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              transition: 'transform 0.3s ease',
              backgroundColor: 'rgba(26,26,26,0.8)'
            }}
            onError={() => {
              // Imagen no encontrada: se usa fallback (logo) desde OptimizedImage
            }}
            onLoad={() => {
              // Efecto de zoom sutil al cargar
              if (carouselRef.current) {
                const img = carouselRef.current.querySelector('img')
                if (img) {
                  img.style.transform = 'scale(1.05)'
                }
              }
            }}
          />
          
          {/* Overlay con informaci√≥n del evento */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            padding: '2rem',
            color: 'white'
          }}>
            <h3 style={{
              fontFamily: 'Orbitron',
              fontSize: '1.8rem',
              marginBottom: '0.5rem',
              color: '#D4AF37'
            }}>
              {currentEvent.title}
            </h3>
            
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#2563EB' }} />
                <span>{currentEvent.date} - {currentEvent.time}</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#10B981' }} />
                <span>{currentEvent.location}</span>
              </div>
              
              {currentEvent.capacity && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FontAwesomeIcon icon={faUsers} style={{ color: '#F59E0B' }} />
                  <span>{currentEvent.registered || 0}/{currentEvent.capacity} participantes</span>
                </div>
              )}
            </div>
            
            <p style={{
              fontSize: '1rem',
              lineHeight: '1.5',
              margin: 0,
              opacity: 0.9
            }}>
              {currentEvent.description}
            </p>
          </div>
        </div>

        {/* Navegaci√≥n */}
        {showNavigation && events.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(26,26,26,0.8)',
                border: '1px solid rgba(212,175,55,0.3)',
                color: '#D4AF37',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                transition: 'all 0.3s ease',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#D4AF37'
                e.currentTarget.style.color = '#0A0A0A'
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(26,26,26,0.8)'
                e.currentTarget.style.color = '#D4AF37'
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
              }}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            <button
              onClick={goToNext}
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(26,26,26,0.8)',
                border: '1px solid rgba(212,175,55,0.3)',
                color: '#D4AF37',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                transition: 'all 0.3s ease',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#D4AF37'
                e.currentTarget.style.color = '#0A0A0A'
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(26,26,26,0.8)'
                e.currentTarget.style.color = '#D4AF37'
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
              }}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </>
        )}
      </div>

      {/* Indicadores */}
      {showIndicators && events.length > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          marginTop: '1.5rem'
        }}>
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                background: index === currentIndex ? '#D4AF37' : 'rgba(212,175,55,0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (index !== currentIndex) {
                  e.currentTarget.style.background = 'rgba(212,175,55,0.6)'
                }
              }}
              onMouseLeave={(e) => {
                if (index !== currentIndex) {
                  e.currentTarget.style.background = 'rgba(212,175,55,0.3)'
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Informaci√≥n adicional */}
      <div style={{
        textAlign: 'center',
        marginTop: '1.5rem',
        color: '#E0E0E0',
        fontSize: '0.9rem'
      }}>
        {events.length > 1 && (
          <p>
            Evento {currentIndex + 1} de {events.length} ‚ˇ¢ 
            <span style={{ color: '#D4AF37', marginLeft: '0.5rem' }}>
              {autoPlay ? 'Auto-reproducci√≥n activada' : 'Navegaci√≥n manual'}
            </span>
          </p>
        )}
      </div>
    </div>
  )
}

export default EventsCarousel
