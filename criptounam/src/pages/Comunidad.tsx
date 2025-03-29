import React, { useState } from 'react'

const Comunidad = () => {
  const [showGallery, setShowGallery] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<null | any>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [galleryType, setGalleryType] = useState<'photos' | 'videos' | 'presentations'>('photos')

  const eventos = [
    {
      id: 1,
      titulo: "Hackathon Web3 2024",
      fecha: "Marzo 2024",
      lugar: "Ciudad Universitaria",
      imagen: "/eventos/hackathon2024.jpg",
      descripcion: "Primer hackathon enfocado en desarrollo blockchain en la UNAM",
      fotos: [
        "/eventos/hackathon/foto1.jpg",
        "/eventos/hackathon/foto2.jpg",
        "/eventos/hackathon/foto3.jpg",
      ],
      videos: [
        "/eventos/hackathon/video1.mp4",
        "/eventos/hackathon/video2.mp4",
      ],
      presentaciones: [
        "/eventos/hackathon/pres1.pdf",
        "/eventos/hackathon/pres2.pdf",
      ]
    },
    {
      id: 2,
      titulo: "Workshop DeFi",
      fecha: "Febrero 2024",
      lugar: "Facultad de Ingeniería",
      imagen: "/eventos/workshop-defi.jpg",
      descripcion: "Taller práctico sobre finanzas descentralizadas"
    },
    {
      id: 3,
      titulo: "Meetup Blockchain",
      fecha: "Enero 2024",
      lugar: "Facultad de Contaduría",
      imagen: "/eventos/meetup-blockchain.jpg",
      descripcion: "Encuentro mensual de la comunidad blockchain"
    }
  ]

  const proximosEventos = [
    {
      id: 1,
      titulo: "Smart Contracts Workshop",
      fecha: "15 de Abril, 2024",
      hora: "16:00",
      lugar: "Auditorio de la Facultad de Ingeniería",
      cupo: 50
    },
    {
      id: 2,
      titulo: "Crypto Trading Masterclass",
      fecha: "22 de Abril, 2024",
      hora: "18:00",
      lugar: "Facultad de Contaduría",
      cupo: 30
    }
  ]

  const handleOpenGallery = (evento: any, type: 'photos' | 'videos' | 'presentations') => {
    setSelectedEvent(evento)
    setGalleryType(type)
    setCurrentImageIndex(0)
    setShowGallery(true)
  }

  const handleCloseGallery = () => {
    setShowGallery(false)
    setSelectedEvent(null)
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? selectedEvent.galeria.length - 1 : prev - 1
    )
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === selectedEvent.galeria.length - 1 ? 0 : prev + 1
    )
  }

  return (
    <div className="community-page">
      <header className="community-header">
        <div className="header-content">
          <h1>Nuestra Comunidad</h1>
          <p>Conoce los eventos y actividades de la comunidad CriptoUNAM</p>
        </div>
      </header>

      {/* Estadísticas */}
      <div className="comunidad-stats">
        <div className="stats-container">
          <div className="stat-box">
            <i className="fas fa-users stat-icon"></i>
            <h3>500+</h3>
            <p>Miembros Activos</p>
          </div>
          <div className="stat-box">
            <i className="fas fa-calendar-check stat-icon"></i>
            <h3>30+</h3>
            <p>Eventos Realizados</p>
          </div>
          <div className="stat-box">
            <i className="fas fa-university stat-icon"></i>
            <h3>10+</h3>
            <p>Facultades Participantes</p>
          </div>
          <div className="stat-box">
            <i className="fas fa-laptop-code stat-icon"></i>
            <h3>15+</h3>
            <p>Proyectos Desarrollados</p>
          </div>
        </div>
      </div>

      {/* Próximos Eventos */}
      <section className="upcoming-events">
        <h2>Próximos Eventos</h2>
        <div className="events-timeline">
          {proximosEventos.map(evento => (
            <div key={evento.id} className="timeline-event">
              <div className="event-date">
                <i className="far fa-calendar"></i>
                <span>{evento.fecha}</span>
              </div>
              <div className="event-content">
                <h3>{evento.titulo}</h3>
                <p><i className="far fa-clock"></i> {evento.hora}</p>
                <p><i className="fas fa-map-marker-alt"></i> {evento.lugar}</p>
                <p><i className="fas fa-users"></i> Cupo: {evento.cupo} personas</p>
                <button className="register-btn">Registrarse</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Galería de Eventos con botón para ver más fotos */}
      <section className="events-gallery">
        <h2>Eventos Anteriores</h2>
        <div className="gallery-grid">
          {eventos.map(evento => (
            <div key={evento.id} className="gallery-item">
              <img src={evento.imagen} alt={evento.titulo} />
              <div className="gallery-caption">
                <h3>{evento.titulo}</h3>
                <p className="event-date">
                  <i className="far fa-calendar-alt"></i> {evento.fecha}
                </p>
                <p className="event-location">
                  <i className="fas fa-map-marker-alt"></i> {evento.lugar}
                </p>
                <p className="event-description">{evento.descripcion}</p>
                
                <div className="event-buttons">
                  <button 
                    className="event-btn photos-btn"
                    onClick={() => handleOpenGallery(evento, 'photos')}
                  >
                    <i className="fas fa-images"></i>
                    Ver Fotos ({evento.fotos?.length || 0})
                  </button>
                  <button 
                    className="event-btn videos-btn"
                    onClick={() => handleOpenGallery(evento, 'videos')}
                  >
                    <i className="fas fa-video"></i>
                    Ver Videos ({evento.videos?.length || 0})
                  </button>
                  <button 
                    className="event-btn presentations-btn"
                    onClick={() => handleOpenGallery(evento, 'presentations')}
                  >
                    <i className="fas fa-file-powerpoint"></i>
                    Ver Presentaciones ({evento.presentaciones?.length || 0})
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal de Galería mejorado */}
      {showGallery && selectedEvent && (
        <div className="gallery-modal">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowGallery(false)}>
              <i className="fas fa-times"></i>
            </button>
            
            {galleryType === 'photos' && (
              // Contenido de fotos
              <>
                <img 
                  src={selectedEvent.fotos[currentImageIndex]} 
                  alt={`${selectedEvent.titulo} - foto ${currentImageIndex + 1}`}
                  className="gallery-image"
                />
                {/* ... navegación de fotos ... */}
              </>
            )}
            
            {galleryType === 'videos' && (
              // Contenido de videos
              <div className="video-player">
                <video 
                  src={selectedEvent.videos[currentImageIndex]}
                  controls
                  className="gallery-video"
                />
              </div>
            )}
            
            {galleryType === 'presentations' && (
              // Contenido de presentaciones
              <div className="presentation-viewer">
                <iframe
                  src={selectedEvent.presentaciones[currentImageIndex]}
                  title="Presentación"
                  className="gallery-presentation"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Unirse a la Comunidad */}
      <section className="join-community">
        <div className="join-content">
          <h2>¿Quieres ser parte de nuestra comunidad?</h2>
          <p>Únete a nuestro Discord y participa en nuestros eventos</p>
          <div className="social-buttons">
            <a href="https://discord.gg/criptounam" className="discord-btn" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-discord"></i> Unirse al Discord
            </a>
            <a href="https://t.me/criptounam" className="telegram-btn" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-telegram"></i> Grupo de Telegram
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Comunidad 