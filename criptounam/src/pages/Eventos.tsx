import { spacesData, hackathonsData, eventosData } from '../data/eventosData'
import SEOHead from '../components/SEOHead'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faMapMarkerAlt, faMicrophone, faCode, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import '../styles/global.css'

const Eventos = () => {
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

                {/* Sección 1: Eventos Presenciales */}
                <section style={{ maxWidth: 1200, margin: '0 auto 5rem auto', padding: '0 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <FontAwesomeIcon icon={faMapMarkerAlt} style={{ fontSize: '2rem', color: '#D4AF37' }} />
                        <h2 style={{ fontFamily: 'Orbitron', color: '#fff', fontSize: '2rem', margin: 0 }}>
                            Eventos Presenciales
                        </h2>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '2rem'
                    }}>
                        {eventosData.map((evento) => (
                            <article key={evento.id} className="card" style={{
                                background: 'rgba(26,26,26,0.8)',
                                borderRadius: 20,
                                border: '1px solid rgba(212,175,55,0.2)',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                                    <img src={evento.image} alt={evento.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    {!evento.isUpcoming && (
                                        <div style={{
                                            position: 'absolute',
                                            top: 10,
                                            right: 10,
                                            background: 'rgba(0,0,0,0.7)',
                                            color: '#B0B0B0',
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: 8,
                                            fontSize: '0.8rem'
                                        }}>
                                            Finalizado
                                        </div>
                                    )}
                                </div>
                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ fontFamily: 'Orbitron', color: '#D4AF37', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
                                        {evento.title}
                                    </h3>
                                    <p style={{ color: '#E0E0E0', fontSize: '0.95rem', marginBottom: '1rem', flex: 1 }}>
                                        {evento.description}
                                    </p>
                                    <div style={{ fontSize: '0.9rem', color: '#A0A0A0', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                        <span><FontAwesomeIcon icon={faCalendarAlt} /> {evento.date} - {evento.time}</span>
                                        <span><FontAwesomeIcon icon={faMapMarkerAlt} /> {evento.location}</span>
                                    </div>
                                    {evento.link && (
                                        <a
                                            href={evento.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="primary-button"
                                            style={{
                                                marginTop: '1rem',
                                                textAlign: 'center',
                                                textDecoration: 'none',
                                                borderRadius: 12,
                                                padding: '0.8rem',
                                                fontWeight: 600,
                                                fontSize: '0.95rem'
                                            }}
                                        >
                                            Registrarse
                                        </a>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* Sección 2: Spaces & Online Talks */}
                <section style={{ maxWidth: 1200, margin: '0 auto 5rem auto', padding: '0 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <FontAwesomeIcon icon={faMicrophone} style={{ fontSize: '2rem', color: '#4ecdc4' }} />
                        <h2 style={{ fontFamily: 'Orbitron', color: '#fff', fontSize: '2rem', margin: 0 }}>
                            Spaces & Charlas
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                        {spacesData.map(space => (
                            <a
                                href={space.url}
                                target="_blank"
                                rel="noreferrer"
                                key={space.id}
                                className="card"
                                style={{
                                    background: 'linear-gradient(145deg, rgba(20,20,20,0.9), rgba(30,30,30,0.9))',
                                    padding: '1.5rem',
                                    borderRadius: 16,
                                    borderLeft: `4px solid ${space.status === 'upcoming' ? '#4ecdc4' : '#666'}`,
                                    textDecoration: 'none',
                                    display: 'block',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{
                                        color: space.status === 'upcoming' ? '#4ecdc4' : '#888',
                                        fontWeight: 700,
                                        fontSize: '0.8rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}>
                                        {space.status === 'upcoming' ? 'PROXIMAMENTE' : 'GRABACIÓN'}
                                    </span>
                                    <FontAwesomeIcon icon={faExternalLinkAlt} style={{ color: '#666' }} />
                                </div>
                                <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: '0 0 0.5rem 0', fontWeight: 600 }}>{space.title}</h3>
                                <p style={{ color: '#aaa', fontSize: '0.9rem', margin: 0 }}>{space.host} • {space.date}</p>
                            </a>
                        ))}
                    </div>
                </section>

                {/* Sección 3: Hackathons */}
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
        </>
    )
}

export default Eventos
