import React, { useEffect } from 'react'
import { hackathonsData, eventosLumaPresenciales, eventosLumaPasados } from '../data/eventosData'
import SEOHead from '../components/SEOHead'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faMapMarkerAlt, faCode, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import '../styles/global.css'

const LUMA_CHECKOUT_SCRIPT = 'https://embed.lu.ma/checkout-button.js'

const Eventos = () => {
    useEffect(() => {
        if (document.getElementById('luma-checkout')) return
        const script = document.createElement('script')
        script.id = 'luma-checkout'
        script.src = LUMA_CHECKOUT_SCRIPT
        script.async = true
        document.body.appendChild(script)
        return () => {
            const s = document.getElementById('luma-checkout')
            if (s) s.remove()
        }
    }, [])

    return (
        <>
            <SEOHead
                title="Eventos - CriptoUNAM"
                description="Descubre los próximos eventos, spaces y hackathons de la comunidad CriptoUNAM."
                image="/images/LogosCriptounam.svg"
                url="https://criptounam.xyz/eventos"
                type="website"
            />

            <div className="section" style={{ minHeight: '100vh', paddingTop: '2rem', paddingBottom: '4rem' }}>

                {/* Header */}
                <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 className="hero-title" style={{ fontFamily: 'Orbitron', color: '#D4AF37', marginBottom: '1rem', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                        Eventos CriptoUNAM
                    </h1>
                    <p style={{ color: '#E0E0E0', fontSize: '1.2rem', maxWidth: 600, margin: '0 auto' }}>
                        Conéctate, aprende y construye con la comunidad.
                    </p>
                </header>

                {/* Sección 1: Eventos Presenciales (vigentes) */}
                <section style={{ maxWidth: 1200, margin: '0 auto 5rem auto', padding: '0 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <FontAwesomeIcon icon={faMapMarkerAlt} style={{ fontSize: '2rem', color: '#D4AF37' }} />
                        <h2 style={{ fontFamily: 'Orbitron', color: '#fff', fontSize: '2rem', margin: 0 }}>
                            Eventos Presenciales
                        </h2>
                    </div>
                    <p style={{ color: '#888', marginBottom: '2rem', maxWidth: 600 }}>
                        Eventos vigentes. Inscríbete y participa.
                    </p>

                    {/* Eventos vigentes: mismo nivel, 2 columnas en desktop */}
                    {eventosLumaPresenciales.length > 0 && (
                        <div className="eventos-presenciales-grid eventos-vigentes-grid" style={{ display: 'grid', gap: '2.5rem', alignItems: 'stretch' }}>
                            {eventosLumaPresenciales.map((evento) => (
                                <article
                                    key={evento.id}
                                    className="card"
                                    style={{
                                        background: 'rgba(26,26,26,0.8)',
                                        borderRadius: 20,
                                        border: '1px solid rgba(212,175,55,0.2)',
                                        overflow: 'hidden',
                                        padding: '1.5rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        minHeight: 320,
                                    }}
                                >
                                    <h3 style={{ fontFamily: 'Orbitron', color: '#D4AF37', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                                        {evento.title}
                                    </h3>
                                    {evento.description && (
                                        <p style={{ color: '#E0E0E0', fontSize: '0.95rem', marginBottom: '1rem' }}>
                                            {evento.description}
                                        </p>
                                    )}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem', flex: 1 }}>
                                        <iframe
                                            src={`https://luma.com/embed/event/${evento.lumaEventId}/simple`}
                                            width="100%"
                                            height="450"
                                            style={{
                                                maxWidth: 600,
                                                border: '1px solid rgba(191, 203, 218, 0.53)',
                                                borderRadius: 4,
                                                background: '#fff',
                                            }}
                                            title={evento.title}
                                            allow="fullscreen; payment"
                                        />
                                        <a
                                            href={`https://luma.com/event/${evento.lumaEventId}`}
                                            className="luma-checkout--button"
                                            data-luma-action="checkout"
                                            data-luma-event-id={evento.lumaEventId}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                background: 'linear-gradient(45deg, #D4AF37, #b8962e)',
                                                color: '#0A0A0A',
                                                padding: '0.75rem 1.5rem',
                                                borderRadius: 12,
                                                textDecoration: 'none',
                                                fontWeight: 600,
                                                fontSize: '1rem',
                                            }}
                                        >
                                            Inscribirse al evento
                                            <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: '0.85rem' }} />
                                        </a>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {/* Eventos pasados desde Luma */}
                    {eventosLumaPasados.length > 0 && (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '4rem', marginBottom: '2rem' }}>
                                <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: '1.75rem', color: '#888' }} />
                                <h3 style={{ fontFamily: 'Orbitron', color: '#A0A0A0', fontSize: '1.5rem', margin: 0 }}>
                                    Eventos pasados
                                </h3>
                            </div>
                            <div className="eventos-pasados-grid" style={{ display: 'grid', gap: '2rem' }}>
                                {eventosLumaPasados.map((evento) => (
                                    <article
                                        key={evento.id}
                                        className="card"
                                        style={{
                                            background: 'rgba(26,26,26,0.6)',
                                            borderRadius: 20,
                                            border: '1px solid rgba(212,175,55,0.15)',
                                            overflow: 'hidden',
                                            padding: '1.5rem',
                                        }}
                                    >
                                        <h4 style={{ fontFamily: 'Orbitron', color: '#D4AF37', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                                            {evento.title}
                                        </h4>
                                        <div style={{ fontSize: '0.9rem', color: '#A0A0A0', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <span><FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '0.5rem' }} /> {evento.date}{evento.time ? ` · ${evento.time}` : ''}</span>
                                            <span><FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '0.5rem' }} /> {evento.location}</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <iframe
                                                src={`https://luma.com/embed/event/${evento.lumaEventId}/simple`}
                                                width="100%"
                                                height="450"
                                                style={{
                                                    maxWidth: 600,
                                                    border: '1px solid rgba(191, 203, 218, 0.53)',
                                                    borderRadius: 4,
                                                    background: '#fff',
                                                }}
                                                title={evento.title}
                                                allow="fullscreen; payment"
                                            />
                                            <a
                                                href={`https://luma.com/event/${evento.lumaEventId}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    color: '#D4AF37',
                                                    fontSize: '0.95rem',
                                                    fontWeight: 600,
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                Ver en Luma
                                                <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: '0.8rem' }} />
                                            </a>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </>
                    )}
                </section>

                {/* Sección 2: Hackathons */}
                <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <FontAwesomeIcon icon={faCode} style={{ fontSize: '2rem', color: '#F4D03F' }} />
                        <h2 style={{ fontFamily: 'Orbitron', color: '#fff', fontSize: '2rem', margin: 0 }}>
                            Próximos Hackathons 2026
                        </h2>
                    </div>
                    <p style={{ color: '#888', marginBottom: '2rem', maxWidth: 600 }}>
                        Participa en los mejores hackathones del ecosistema Web3. ¡Gana premios y construye el futuro!
                    </p>

                    <div style={{
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
                        gap: '1.5rem' 
                    }}>
                        {hackathonsData.map(hack => (
                            <article
                                key={hack.id}
                                className="card"
                                style={{
                                    background: 'rgba(26,26,26,0.8)',
                                    border: '2px solid rgba(244, 208, 63, 0.2)',
                                    borderRadius: 20,
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#F4D03F'
                                    e.currentTarget.style.transform = 'translateY(-5px)'
                                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(244, 208, 63, 0.2)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(244, 208, 63, 0.2)'
                                    e.currentTarget.style.transform = 'translateY(0)'
                                    e.currentTarget.style.boxShadow = 'none'
                                }}
                            >
                                {/* Imagen del Hackathon */}
                                <div style={{ 
                                    height: 180, 
                                    overflow: 'hidden', 
                                    position: 'relative',
                                    background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)'
                                }}>
                                    <img 
                                        src={hack.image} 
                                        alt={hack.name} 
                                        style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            objectFit: 'cover',
                                            transition: 'transform 0.3s ease'
                                        }}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none'
                                        }}
                                    />
                                    {/* Badge de premios */}
                                    {hack.prizes && (
                                        <div style={{
                                            position: 'absolute',
                                            top: 12,
                                            right: 12,
                                            background: 'rgba(0,0,0,0.8)',
                                            color: '#4ecdc4',
                                            padding: '0.4rem 0.8rem',
                                            borderRadius: 8,
                                            fontSize: '0.8rem',
                                            fontWeight: 700,
                                            border: '1px solid #4ecdc4'
                                        }}>
                                            🏆 {hack.prizes}
                                        </div>
                                    )}
                                </div>

                                {/* Contenido */}
                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ 
                                        fontFamily: 'Orbitron', 
                                        color: '#F4D03F', 
                                        fontSize: '1.2rem', 
                                        marginBottom: '0.5rem',
                                        lineHeight: 1.3
                                    }}>
                                        {hack.name}
                                    </h3>
                                    <p style={{ 
                                        color: '#B0B0B0', 
                                        fontSize: '0.9rem', 
                                        marginBottom: '1rem', 
                                        flex: 1,
                                        lineHeight: 1.5,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {hack.description}
                                    </p>
                                    
                                    {/* Metadata */}
                                    <div style={{ 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        gap: '0.4rem', 
                                        fontSize: '0.85rem', 
                                        color: '#888',
                                        marginBottom: '1rem'
                                    }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#F4D03F' }} />
                                            {hack.date}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#4ecdc4' }} />
                                            {hack.location}
                                        </span>
                                    </div>

                                    {/* Botón */}
                                    <a
                                        href={hack.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="primary-button"
                                        style={{
                                            textAlign: 'center',
                                            padding: '0.8rem 1.5rem',
                                            borderRadius: 12,
                                            textDecoration: 'none',
                                            fontWeight: 600,
                                            fontSize: '0.95rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        Participar
                                        <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: '0.8rem' }} />
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

            </div>

            <style>{`
              .eventos-presenciales-grid.eventos-vigentes-grid {
                grid-template-columns: 1fr;
              }
              @media (min-width: 900px) {
                .eventos-presenciales-grid.eventos-vigentes-grid {
                  grid-template-columns: repeat(2, 1fr);
                }
              }
              .eventos-pasados-grid {
                grid-template-columns: 1fr;
              }
              @media (min-width: 700px) {
                .eventos-pasados-grid {
                  grid-template-columns: repeat(2, 1fr);
                }
              }
            `}</style>
        </>
    )
}

export default Eventos
