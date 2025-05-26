import { useState } from 'react'
import '../styles/global.css'

const Comunidad = () => {
  const [showGallery, setShowGallery] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [galleryType, setGalleryType] = useState<'photos' | 'videos' | 'presentations'>('photos')
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const eventos = [
    {
      id: 1,
      titulo: "Hackathon Web3 2024",
      fecha: "Marzo 2024",
      lugar: "Ciudad Universitaria",
      imagen: "images/eventos/hackathon2024.jpg",
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
      titulo: "Hackathon Web3 2024",
      fecha: "Marzo 2024",
      lugar: "Ciudad Universitaria",
      imagen: "images/eventos/hackathon2024.jpg",
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
//proximos eventos
  const proximosEventos = [
    {
      id: 1,
      titulo: "Smart Contracts Workshop",
      fecha: "15 de Abril, 2024",
      hora: "16:00",
      lugar: "Auditorio de la Facultad de Ingeniería",
      cupo: 50,
      registroLink: "https://www.google.com",
      imagen: "/eventos/proximo1.jpg"
    },
    {
      id: 2,
      titulo: "Crypto Trading Masterclass",
      fecha: "22 de Abril, 2024",
      hora: "18:00",
      lugar: "Facultad de Contaduría",
      cupo: 30,
      registroLink: "https://www.google.com",
      imagen: "/eventos/proximo2.jpg"
    }
    
  ]

  const handleOpenGallery = (evento: any, type: 'photos' | 'videos' | 'presentations') => {
    setSelectedEvent(evento)
    setGalleryType(type)
    setCurrentImageIndex(0)
    setShowGallery(true)
  }

 /* const handleCloseGallery = () => {
    setShowGallery(false)
    setSelectedEvent(null)
  }

  const handlePrevImage = () => {
    if (selectedEvent) {
      const media = galleryType === 'photos' ? selectedEvent.fotos : 
                   galleryType === 'videos' ? selectedEvent.videos : 
                   selectedEvent.presentaciones
      setCurrentImageIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1))
    }
  }

  const handleNextImage = () => {
    if (selectedEvent) {
      const media = galleryType === 'photos' ? selectedEvent.fotos : 
                   galleryType === 'videos' ? selectedEvent.videos : 
                   selectedEvent.presentaciones
      setCurrentImageIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1))
    }
  }
*/
  return (
    <div className="section" style={{minHeight:'100vh', display:'flex', flexDirection:'column', paddingTop:'2rem'}}>
      <header className="community-header" style={{textAlign:'center', marginBottom:'2.5rem'}}>
        <div className="header-content">
          <h1 className="hero-title" style={{fontFamily:'Orbitron', color:'#D4AF37', marginBottom:8}}>Nuestra Comunidad</h1>
          <p className="hero-subtitle" style={{color:'#E0E0E0', fontSize:'1.2rem'}}>Conoce los eventos y actividades de la comunidad CriptoUNAM</p>
        </div>
      </header>

      {/* Estadísticas */}
      <div className="comunidad-stats" style={{margin:'0 auto 2.5rem auto', maxWidth:900}}>
        <div className="grid-4">
          {[{icon:'fas fa-users', num:'500+', text:'Miembros Activos'},{icon:'fas fa-calendar-check',num:'30+',text:'Eventos Realizados'},{icon:'fas fa-university',num:'10+',text:'Facultades Participantes'},{icon:'fas fa-laptop-code',num:'15+',text:'Proyectos Desarrollados'}].map((stat,i)=>(
            <div key={i} className="card" style={{textAlign:'center', padding:'2rem 1rem', minWidth:180}}>
              <i className={stat.icon+" stat-icon"} style={{fontSize:'2.2rem', color:'#D4AF37', marginBottom:10}}></i>
              <h3 style={{fontFamily:'Orbitron', color:'#D4AF37', fontSize:'2rem', margin:0}}>{stat.num}</h3>
              <p style={{color:'#E0E0E0', margin:0}}>{stat.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Próximos Eventos */}
      <section className="upcoming-events" style={{margin:'0 auto 2.5rem auto', maxWidth:1200}}>
        <h2 className="hero-title" style={{fontFamily:'Orbitron', color:'#D4AF37', marginBottom:'1.5rem', fontSize:'1.7rem'}}>Próximos Eventos</h2>
        <div className="events-timeline grid-4">
          {proximosEventos.map(evento => (
            <div key={evento.id} className="card" style={{padding:'1.5rem', display:'flex', flexDirection:'column', gap:'0.7rem', minHeight:200, justifyContent:'space-between'}}>
              {evento.imagen && (
                <img src={evento.imagen} alt={evento.titulo} style={{width:'100%', height:140, objectFit:'cover', borderRadius:16, boxShadow:'0 4px 18px 0 #1E3A8A22', marginBottom:12}} />
              )}
              <div className="event-date" style={{display:'flex', alignItems:'center', gap:8, color:'#2563EB', fontWeight:600}}>
                <i className="far fa-calendar"></i>
                <span>{evento.fecha}</span>
              </div>
              <div className="event-content" style={{marginTop:8}}>
                <h3 style={{fontFamily:'Orbitron', color:'#D4AF37', fontSize:'1.2rem', margin:'0 0 0.3rem 0'}}>{evento.titulo}</h3>
                <p style={{margin:'0 0 0.2rem 0', color:'#E0E0E0'}}><i className="far fa-clock"></i> {evento.hora}</p>
                <p style={{margin:'0 0 0.2rem 0', color:'#E0E0E0'}}><i className="fas fa-map-marker-alt"></i> {evento.lugar}</p>
                <p style={{margin:'0 0 0.2rem 0', color:'#E0E0E0'}}><i className="fas fa-users"></i> Cupo: {evento.cupo} personas</p>
                <button 
                  className="primary-button"
                  style={{marginTop:'0.7rem', fontWeight:700, borderRadius:18, fontSize:'1rem', padding:'0.5rem 1.2rem'}}
                  onClick={() => window.open(evento.registroLink, '_blank')}
                >Registrarse</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Galería de Eventos */}
      <section className="events-gallery" style={{margin:'0 auto 2.5rem auto', maxWidth:1200}}>
        <h2 className="hero-title" style={{fontFamily:'Orbitron', color:'#D4AF37', marginBottom:'1.5rem', fontSize:'1.7rem'}}>Eventos Anteriores</h2>
        <div className="gallery-grid grid-4">
          {eventos.map(evento => (
            <div key={evento.id} className="card gallery-item" style={{padding:'1.2rem', display:'flex', flexDirection:'column', alignItems:'center', gap:'0.7rem', minHeight:320}}>
              <img src={evento.imagen} alt={evento.titulo} style={{width:'100%', maxWidth:320, height:170, objectFit:'cover', borderRadius:18, boxShadow:'0 4px 24px 0 #1E3A8A33', marginBottom:8}} />
              <div className="gallery-caption" style={{width:'100%'}}>
                <h3 style={{fontFamily:'Orbitron', color:'#D4AF37', fontSize:'1.1rem', margin:'0 0 0.2rem 0'}}>{evento.titulo}</h3>
                <p className="event-date" style={{color:'#2563EB', margin:'0 0 0.2rem 0'}}>
                  <i className="far fa-calendar-alt"></i> {evento.fecha}
                </p>
                <p className="event-location" style={{color:'#E0E0E0', margin:'0 0 0.2rem 0'}}>
                  <i className="fas fa-map-marker-alt"></i> {evento.lugar}
                </p>
                <p className="event-description" style={{color:'#E0E0E0', margin:'0 0 0.2rem 0', fontSize:'0.98rem'}}>{evento.descripcion}</p>
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
          <p>Únete a nuestros canales y participa en nuestros eventos</p>
          <div className="social-buttons">
            <a href="https://discord.gg/Pmu4JQeNR6" className="discord-btn" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-discord"></i> Unirse al Discord
            </a>
            <a href="https://t.me/+tPgjd4cOxG05NmVh" className="telegram-btn" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-telegram"></i> Grupo de Telegram
            </a>
            <a href="https://wa.me/+525512345678" className="whatsapp-btn" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-whatsapp"></i> Grupo de WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Comunidad 