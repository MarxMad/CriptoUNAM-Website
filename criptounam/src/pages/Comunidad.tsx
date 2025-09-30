import React, { useState, useEffect } from 'react'
import '../styles/global.css'
import { useWallet } from '../context/WalletContext'
import { useAdmin } from '../hooks/useAdmin'
import axios from 'axios'

interface BackendPinataResponse {
  ipfsUrl: string;
}

interface BackendMultipleFilesResponse {
  urls: string[];
}

interface EventoBackend {
  tipo: string;
  titulo: string;
  fecha: string;
  hora?: string;
  lugar: string;
  cupo: number;
  descripcion?: string;
  imagen?: string;
  imagenPrincipal?: string;
  fotos?: string[];
  videos?: string[];
  presentaciones?: string[];
  registroLink?: string;
  creadoEn?: string;
  _id?: string;
}

const Comunidad = () => {
  // Comentado el estado no utilizado
  // const [showGallery, setShowGallery] = useState(false)
  // const [selectedEvent, setSelectedEvent] = useState<any>(null)
  // const [galleryType, setGalleryType] = useState<'photos' | 'videos' | 'presentations'>('photos')
  // const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { walletAddress, isConnected } = useWallet();
  const { isAdmin, canCreateEvent, canDeleteEvent } = useAdmin();

  // Estado para eventos agregados dinámicamente
  const [eventosDinamicos, setEventosDinamicos] = useState<any[]>([]);
  const [eventosAnterioresDinamicos, setEventosAnterioresDinamicos] = useState<any[]>([]);
  const [imagenEventoFile, setImagenEventoFile] = useState<File | null>(null);
  const [previewImagenEvento, setPreviewImagenEvento] = useState<string | null>(null);

  // Estado del formulario
  const [nuevoEvento, setNuevoEvento] = useState({
    titulo: '',
    fecha: '',
    hora: '',
    lugar: '',
    cupo: '',
    descripcion: '',
    registroLink: '',
  });
  const [nuevoEventoAnterior, setNuevoEventoAnterior] = useState({
    titulo: '',
    fecha: '',
    lugar: '',
    cupo: '',
    descripcion: '',
    imagenPrincipal: '',
    videos: [] as string[], // Array para URLs de YouTube
  });
  const [imagenPrincipalFile, setImagenPrincipalFile] = useState<File | null>(null);
  const [previewImagenPrincipal, setPreviewImagenPrincipal] = useState<string | null>(null);
  const [fotosFiles, setFotosFiles] = useState<File[]>([]);
  const [previewFotos, setPreviewFotos] = useState<string[]>([]);
  const [videosFiles, setVideosFiles] = useState<File[]>([]);
  const [presentacionesFiles, setPresentacionesFiles] = useState<File[]>([]);

  // Estado para el modal de nuevo evento
  const [showNuevoEventoModal, setShowNuevoEventoModal] = useState(false);
  // Estado para el modal de evento pasado
  const [showEventoPasadoModal, setShowEventoPasadoModal] = useState(false);

  // Estado para edición
  const [editandoEvento, setEditandoEvento] = useState<any | null>(null);
  const [editandoTipo, setEditandoTipo] = useState<'proximo' | 'anterior' | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNuevoEvento({ ...nuevoEvento, [e.target.name]: e.target.value });
  };
  const handleInputChangeAnterior = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNuevoEventoAnterior({ ...nuevoEventoAnterior, [e.target.name]: e.target.value });
  };
  const handleImagenPrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagenPrincipalFile(e.target.files[0]);
      setPreviewImagenPrincipal(URL.createObjectURL(e.target.files[0]));
    }
  };
  const handleFotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFotosFiles(Array.from(e.target.files));
      setPreviewFotos(Array.from(e.target.files).map(file => URL.createObjectURL(file)));
    }
  };
  const handleVideosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideosFiles(Array.from(e.target.files));
    }
  };
  const handlePresentacionesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPresentacionesFiles(Array.from(e.target.files));
    }
  };
  const handleImagenEventoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagenEventoFile(e.target.files[0]);
      setPreviewImagenEvento(URL.createObjectURL(e.target.files[0]));
    }
  };

  const uploadToPinata = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post<BackendPinataResponse>('http://localhost:4000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.ipfsUrl;
    } catch (error) {
      console.error('Error al subir a Pinata (vía backend):', error);
      throw error;
    }
  };

  const handleAgregarEvento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreateEvent) {
      alert('No tienes permisos para crear eventos');
      return;
    }
    if (!nuevoEvento.titulo || !nuevoEvento.fecha || !nuevoEvento.hora || !nuevoEvento.lugar || !nuevoEvento.cupo || !nuevoEvento.descripcion || !imagenEventoFile) return;
    try {
      const imagenUrl = await uploadToPinata(imagenEventoFile);
      const eventoData = {
        tipo: 'proximo',
        titulo: nuevoEvento.titulo,
        fecha: nuevoEvento.fecha,
        hora: nuevoEvento.hora,
        lugar: nuevoEvento.lugar,
        cupo: Number(nuevoEvento.cupo),
        descripcion: nuevoEvento.descripcion,
        imagen: imagenUrl,
        registroLink: nuevoEvento.registroLink || '',
      };
      const res = await axios.post('http://localhost:4000/evento', eventoData, {
        headers: {
          'x-wallet-address': walletAddress
        }
      });
      setEventosDinamicos([res.data, ...eventosDinamicos]);
      setNuevoEvento({ titulo: '', fecha: '', hora: '', lugar: '', cupo: '', descripcion: '', registroLink: '' });
      setImagenEventoFile(null);
      setPreviewImagenEvento(null);
    } catch (error: any) {
      console.error('Error al subir la imagen del evento:', error);
      alert('Error al subir la imagen. Detalle: ' + (error?.message || error));
    }
  };
  const handleAgregarEventoAnterior = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoEventoAnterior.titulo || !nuevoEventoAnterior.fecha || !nuevoEventoAnterior.lugar || !nuevoEventoAnterior.cupo || !nuevoEventoAnterior.descripcion || !imagenPrincipalFile) return;
    
    try {
      // Subir imagen principal
      const formData = new FormData();
      formData.append('file', imagenPrincipalFile);
      const imagenResponse = await axios.post<BackendPinataResponse>('http://localhost:4000/upload', formData);
      const imagenPrincipalUrl = imagenResponse.data.ipfsUrl;

      // Subir fotos si hay
      let fotosUrls: string[] = [];
      if (fotosFiles.length > 0) {
        const fotosFormData = new FormData();
        fotosFiles.forEach(file => fotosFormData.append('files', file));
        const fotosResponse = await axios.post<BackendMultipleFilesResponse>('http://localhost:4000/upload-multiple', fotosFormData);
        fotosUrls = fotosResponse.data.urls;
      }

      // Subir presentaciones si hay
      let presentacionesUrls: string[] = [];
      if (presentacionesFiles.length > 0) {
        const presentacionesFormData = new FormData();
        presentacionesFiles.forEach(file => presentacionesFormData.append('files', file));
        const presentacionesResponse = await axios.post<BackendMultipleFilesResponse>('http://localhost:4000/upload-multiple', presentacionesFormData);
        presentacionesUrls = presentacionesResponse.data.urls;
      }

      // Combinar videos de IPFS y YouTube
      let videosUrls: string[] = [];
      if (videosFiles.length > 0) {
        const videosFormData = new FormData();
        videosFiles.forEach(file => videosFormData.append('files', file));
        const videosResponse = await axios.post<BackendMultipleFilesResponse>('http://localhost:4000/upload-multiple', videosFormData);
        videosUrls = videosResponse.data.urls;
      }
      // Agregar URLs de YouTube si hay
      videosUrls = [...videosUrls, ...nuevoEventoAnterior.videos];

      const eventoData = {
        tipo: 'anterior',
        titulo: nuevoEventoAnterior.titulo,
        fecha: nuevoEventoAnterior.fecha,
        lugar: nuevoEventoAnterior.lugar,
        cupo: Number(nuevoEventoAnterior.cupo),
        descripcion: nuevoEventoAnterior.descripcion,
        imagenPrincipal: imagenPrincipalUrl,
        fotos: fotosUrls,
        videos: videosUrls,
        presentaciones: presentacionesUrls,
      };

      const res = await axios.post('http://localhost:4000/evento', eventoData, {
        headers: {
          'x-wallet-address': walletAddress
        }
      });
      setEventosAnterioresDinamicos([res.data, ...eventosAnterioresDinamicos]);
      
      // Limpiar formulario
      setNuevoEventoAnterior({
        titulo: '',
        fecha: '',
        lugar: '',
        cupo: '',
        descripcion: '',
        imagenPrincipal: '',
        videos: [],
      });
      setImagenPrincipalFile(null);
      setPreviewImagenPrincipal(null);
      setFotosFiles([]);
      setPreviewFotos([]);
      setVideosFiles([]);
      setPresentacionesFiles([]);
    } catch (error: any) {
      console.error('Error al subir archivos:', error);
      alert('Error al subir archivos. Detalle: ' + (error?.message || error));
    }
  };

  // Agregar función para manejar URLs de YouTube
  const handleYouTubeUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    if (url && (url.includes('youtube.com/') || url.includes('youtu.be/'))) {
      setNuevoEventoAnterior(prev => ({
        ...prev,
        videos: [...prev.videos, url]
      }));
      e.target.value = ''; // Limpiar input
    }
  };

  const handleOpenGallery = (evento: any, type: 'photos' | 'videos' | 'presentations') => {
    // setSelectedEvent(evento)
    // setGalleryType(type)
    // setCurrentImageIndex(0)
    // setShowGallery(true)
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

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const res = await axios.get<EventoBackend[]>('http://localhost:4000/eventos');
        setEventosDinamicos(res.data.filter((e) => e.tipo === 'proximo'));
        setEventosAnterioresDinamicos(res.data.filter((e) => e.tipo === 'anterior'));
      } catch (error) {
        console.error('Error al cargar eventos:', error);
      }
    };
    fetchEventos();
  }, []);

  // Verificar si se debe abrir el modal desde URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shouldOpenModal = urlParams.get('openModal');
    
    if (shouldOpenModal === 'true') {
      console.log('🎪 Comunidad: Abriendo modal desde URL');
      setShowNuevoEventoModal(true);
      // Limpiar el parámetro de la URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  // Listener para el botón de admin
  useEffect(() => {
    const handleOpenComunidadModal = () => {
      console.log('🎪 Comunidad: Abriendo modal desde botón admin');
      setShowNuevoEventoModal(true);
    };

    window.addEventListener('openComunidadModal', handleOpenComunidadModal);
    
    return () => {
      window.removeEventListener('openComunidadModal', handleOpenComunidadModal);
    };
  }, []);

  // Al abrir modal de editar evento próximo
  const handleEditarEvento = (evento: any) => {
    setNuevoEvento({
      titulo: evento.titulo,
      fecha: evento.fecha,
      hora: evento.hora,
      lugar: evento.lugar,
      cupo: evento.cupo.toString(),
      descripcion: evento.descripcion,
      registroLink: evento.registroLink || '',
    });
    setPreviewImagenEvento(evento.imagen || null);
    setEditandoEvento(evento);
    setEditandoTipo('proximo');
    setShowNuevoEventoModal(true);
  };
  // Al abrir modal de editar evento anterior
  const handleEditarEventoAnterior = (evento: any) => {
    setNuevoEventoAnterior({
      titulo: evento.titulo,
      fecha: evento.fecha,
      lugar: evento.lugar,
      cupo: evento.cupo.toString(),
      descripcion: evento.descripcion,
      imagenPrincipal: evento.imagenPrincipal || '',
      videos: evento.videos || [],
    });
    setPreviewImagenPrincipal(evento.imagenPrincipal || null);
    setEditandoEvento(evento);
    setEditandoTipo('anterior');
    setShowEventoPasadoModal(true);
  };
  // Eliminar evento
  const handleEliminarEvento = async (evento: any, tipo: 'proximo' | 'anterior') => {
    if (!window.confirm('¿Seguro que quieres eliminar este evento?')) return;
    if (!canDeleteEvent) {
      alert('No tienes permisos para eliminar eventos');
      return;
    }
    try {
      await axios.delete(`http://localhost:4000/evento/${evento._id}`, {
        headers: {
          'x-wallet-address': walletAddress
        }
      });
      if (tipo === 'proximo') {
        setEventosDinamicos(eventosDinamicos.filter(e => e._id !== evento._id));
      } else {
        setEventosAnterioresDinamicos(eventosAnterioresDinamicos.filter(e => e._id !== evento._id));
      }
    } catch (error) {
      alert('Error al eliminar el evento');
    }
  };
  // Guardar edición evento próximo
  const handleGuardarEdicionEvento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editandoEvento) return;
    try {
      let imagenUrl = previewImagenEvento;
      if (imagenEventoFile) {
        imagenUrl = await uploadToPinata(imagenEventoFile);
      }
      const eventoData = {
        ...nuevoEvento,
        cupo: Number(nuevoEvento.cupo),
        imagen: imagenUrl,
      };
      const res = await axios.put(`http://localhost:4000/evento/${editandoEvento._id}`, eventoData);
      setEventosDinamicos(eventosDinamicos.map(e => e._id === editandoEvento._id ? res.data : e));
      setShowNuevoEventoModal(false);
      setEditandoEvento(null);
      setEditandoTipo(null);
      setNuevoEvento({ titulo: '', fecha: '', hora: '', lugar: '', cupo: '', descripcion: '', registroLink: '' });
      setImagenEventoFile(null);
      setPreviewImagenEvento(null);
    } catch (error) {
      alert('Error al editar el evento');
    }
  };
  // Guardar edición evento anterior
  const handleGuardarEdicionEventoAnterior = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editandoEvento) return;
    try {
      let imagenPrincipalUrl = previewImagenPrincipal;
      if (imagenPrincipalFile) {
        const formData = new FormData();
        formData.append('file', imagenPrincipalFile);
        const imagenResponse = await axios.post<BackendPinataResponse>('http://localhost:4000/upload', formData);
        imagenPrincipalUrl = imagenResponse.data.ipfsUrl;
      }
      // No se permite editar fotos, videos ni presentaciones aquí para simplificar
      const eventoData = {
        ...nuevoEventoAnterior,
        cupo: Number(nuevoEventoAnterior.cupo),
        imagenPrincipal: imagenPrincipalUrl,
      };
      const res = await axios.put(`http://localhost:4000/evento/${editandoEvento._id}`, eventoData);
      setEventosAnterioresDinamicos(eventosAnterioresDinamicos.map(e => e._id === editandoEvento._id ? res.data : e));
      setShowEventoPasadoModal(false);
      setEditandoEvento(null);
      setEditandoTipo(null);
      setNuevoEventoAnterior({ titulo: '', fecha: '', lugar: '', cupo: '', descripcion: '', imagenPrincipal: '', videos: [] });
      setImagenPrincipalFile(null);
      setPreviewImagenPrincipal(null);
    } catch (error) {
      alert('Error al editar el evento');
    }
  };

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


      {/* Modales */}
      {showNuevoEventoModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1200,
          padding: '20px',
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '450px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}>
            {/* Header del modal */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              borderBottom: '2px solid #D4AF37',
              paddingBottom: '12px'
            }}>
              <h2 style={{
                color: '#D4AF37',
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: 'bold',
                fontFamily: 'Orbitron'
              }}>
                {editandoEvento ? 'Editar Evento' : 'Agregar Nuevo Evento'}
              </h2>
              <button
                onClick={() => setShowNuevoEventoModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '4px',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
              >
                ×
              </button>
            </div>

            {/* Contenido del formulario */}
            <form onSubmit={editandoEvento ? handleGuardarEdicionEvento : handleAgregarEvento} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              flex: 1,
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: '#333', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Título del evento *
                </label>
                <input 
                  name="titulo" 
                  value={nuevoEvento.titulo} 
                  onChange={handleInputChange} 
                  placeholder="Título del evento" 
                  required 
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: '#333', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Fecha *
                </label>
                <input 
                  name="fecha" 
                  value={nuevoEvento.fecha} 
                  onChange={handleInputChange} 
                  placeholder="Fecha (ej. 15 de Abril, 2024)" 
                  required 
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: '#333', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Hora *
                </label>
                <input 
                  name="hora" 
                  value={nuevoEvento.hora} 
                  onChange={handleInputChange} 
                  placeholder="Hora (ej. 16:00)" 
                  required 
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: '#333', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Lugar *
                </label>
                <input 
                  name="lugar" 
                  value={nuevoEvento.lugar} 
                  onChange={handleInputChange} 
                  placeholder="Lugar del evento" 
                  required 
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: '#333', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Cupo *
                </label>
                <input 
                  name="cupo" 
                  value={nuevoEvento.cupo} 
                  onChange={handleInputChange} 
                  placeholder="Número de cupos" 
                  type="number" 
                  min="1" 
                  required 
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: '#333', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Descripción *
                </label>
                <textarea 
                  name="descripcion" 
                  value={nuevoEvento.descripcion} 
                  onChange={handleInputChange} 
                  placeholder="Descripción del evento..." 
                  required 
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '1rem',
                    minHeight: '100px',
                    resize: 'vertical',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: '#D4AF37', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Imagen del evento *
                </label>
                <input 
                  type="file" 
                  onChange={handleImagenEventoChange} 
                  accept="image/*" 
                  required 
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                />
              {previewImagenEvento && (
                  <img 
                    src={previewImagenEvento} 
                    alt="Previsualización" 
                    style={{
                      width: '100%',
                      maxWidth: '320px',
                      margin: '8px auto',
                      borderRadius: '8px',
                      boxShadow: '0 2px 12px rgba(30, 58, 138, 0.2)'
                    }} 
                  />
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: '#333', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Link de registro
                </label>
                <input 
                  name="registroLink" 
                  value={nuevoEvento.registroLink} 
                  onChange={handleInputChange} 
                  placeholder="Link de registro (opcional)" 
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              {/* Botones de acción */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid #e0e0e0'
              }}>
                <button 
                  type="submit" 
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                    color: '#000',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    flex: 1
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {editandoEvento ? 'Actualizar Evento' : 'Guardar Evento'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowNuevoEventoModal(false)}
                  style={{
                    background: '#f5f5f5',
                    color: '#666',
                    border: '2px solid #e0e0e0',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    flex: 1
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#e0e0e0';
                    e.currentTarget.style.color = '#333';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f5f5f5';
                    e.currentTarget.style.color = '#666';
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEventoPasadoModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1200,
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 8px 32px #00000044',
          }}>
            <h2>Agregar Evento Anterior</h2>
            <form onSubmit={editandoEvento ? handleGuardarEdicionEventoAnterior : handleAgregarEventoAnterior} style={{display:'flex', flexDirection:'column', gap:14}}>
              <input name="titulo" value={nuevoEventoAnterior.titulo} onChange={handleInputChangeAnterior} placeholder="Título del evento" required style={{padding:8, borderRadius:8}} />
              <input name="fecha" value={nuevoEventoAnterior.fecha} onChange={handleInputChangeAnterior} placeholder="Fecha (ej. Marzo 2024)" required style={{padding:8, borderRadius:8}} />
              <input name="lugar" value={nuevoEventoAnterior.lugar} onChange={handleInputChangeAnterior} placeholder="Lugar" required style={{padding:8, borderRadius:8}} />
              <input name="cupo" value={nuevoEventoAnterior.cupo} onChange={handleInputChangeAnterior} placeholder="Cupo" type="number" min="1" required style={{padding:8, borderRadius:8}} />
              <input name="descripcion" value={nuevoEventoAnterior.descripcion} onChange={handleInputChangeAnterior} placeholder="Descripción" required style={{padding:8, borderRadius:8}} />
              <label style={{color:'#D4AF37', fontWeight:'bold'}}>Imagen principal (solo una imagen)</label>
              <input type="file" onChange={handleImagenPrincipalChange} accept="image/*" required style={{padding:8, borderRadius:8}} />
              {previewImagenPrincipal && (
                <img src={previewImagenPrincipal} alt="Previsualización" style={{width: '100%', maxWidth: 320, margin: '0 auto 10px auto', borderRadius: 12, boxShadow: '0 2px 12px #1E3A8A33'}} />
              )}
              <label style={{color:'#D4AF37', fontWeight:'bold'}}>Fotos (galería interna, puedes seleccionar varias imágenes)</label>
              <input type="file" multiple onChange={handleFotosChange} accept="image/*" style={{padding:8, borderRadius:8}} />
              {previewFotos.length > 0 && (
                <div style={{display:'flex', flexWrap:'wrap', gap:8, margin:'8px 0'}}>
                  {previewFotos.map((src, idx) => (
                    <img key={idx} src={src} alt={`Foto ${idx+1}`} style={{width:60, height:60, objectFit:'cover', borderRadius:8, boxShadow:'0 1px 6px #1E3A8A22'}} />
                  ))}
                </div>
              )}
              <label style={{color:'#D4AF37', fontWeight:'bold'}}>Videos (puedes seleccionar varios videos)</label>
              <input type="file" multiple onChange={handleVideosChange} accept="video/*" style={{padding:8, borderRadius:8}} />
              <label style={{color:'#D4AF37', fontWeight:'bold'}}>Presentaciones (puedes seleccionar varios archivos PDF, PPT, etc.)</label>
              <input type="file" multiple onChange={handlePresentacionesChange} accept=".pdf,.ppt,.pptx,.key,.odp" style={{padding:8, borderRadius:8}} />
              <div>
                <label style={{color:'#D4AF37', fontWeight:'bold'}}>URL de YouTube (opcional)</label>
                <input
                  type="text"
                  placeholder="Pega la URL de YouTube"
                  onChange={handleYouTubeUrlChange}
                  style={{padding:8, borderRadius:8}}
                />
                {nuevoEventoAnterior.videos.length > 0 && (
                  <div style={{marginTop:8}}>
                    <p>Videos agregados:</p>
                    <ul>
                      {nuevoEventoAnterior.videos.map((url, idx) => (
                        <li key={idx} style={{fontSize:'0.9rem', marginBottom:4}}>
                          {url}
                          <button
                            type="button"
                            onClick={() => setNuevoEventoAnterior(prev => ({
                              ...prev,
                              videos: prev.videos.filter((_, i) => i !== idx)
                            }))}
                            style={{marginLeft:8, color:'red'}}
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div style={{ marginTop: '20px' }}>
                <button type="submit" style={{ marginRight: '10px' }}>Guardar</button>
                <button type="button" onClick={() => setShowEventoPasadoModal(false)}>Cancelar</button>
          </div>
            </form>
          </div>
        </div>
      )}

      {/* Próximos Eventos */}
      <section className="upcoming-events" style={{margin:'0 auto 2.5rem auto', maxWidth:1200}}>
        <h2 className="hero-title" style={{fontFamily:'Orbitron', color:'#D4AF37', marginBottom:'1.5rem', fontSize:'1.7rem'}}>Próximos Eventos</h2>
        <div className="events-timeline grid-4">
          {eventosDinamicos.map(evento => (
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
                <div style={{display:'flex', gap:8, marginBottom:8}}>
                  <button onClick={() => handleEditarEvento(evento)} style={{background:'#2563EB', color:'white', border:'none', borderRadius:5, padding:'4px 10px', fontWeight:600}}>Editar</button>
                  <button onClick={() => handleEliminarEvento(evento, 'proximo')} style={{background:'red', color:'white', border:'none', borderRadius:5, padding:'4px 10px', fontWeight:600}}>Eliminar</button>
                </div>
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
          {eventosAnterioresDinamicos.map((evento) => (
            <div key={evento.id} className="card gallery-item" style={{padding:'1.2rem', display:'flex', flexDirection:'column', alignItems:'center', gap:'0.7rem', minHeight:320}}>
              {/* Imagen principal única */}
              {evento.imagenPrincipal && (
                <img src={evento.imagenPrincipal} alt={evento.titulo} style={{width:'100%', maxWidth:320, height:170, objectFit:'cover', borderRadius:18, boxShadow:'0 4px 24px 0 #1E3A8A33', marginBottom:8}} />
              )}
              {/* Galería interna de fotos */}
              {evento.fotos && evento.fotos.length > 0 && (
                <GaleriaFotosInterna fotos={evento.fotos} titulo={evento.titulo} />
              )}
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
              {isAdmin && (
                <div style={{display:'flex', gap:8, marginBottom:8}}>
                  <button onClick={() => handleEditarEventoAnterior(evento)} style={{background:'#2563EB', color:'white', border:'none', borderRadius:5, padding:'4px 10px', fontWeight:600}}>Editar</button>
                  <button onClick={() => handleEliminarEvento(evento, 'anterior')} style={{background:'red', color:'white', border:'none', borderRadius:5, padding:'4px 10px', fontWeight:600}}>Eliminar</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Unirse a la Comunidad */}
      <section className="join-community" style={{
        margin: '4rem auto',
        maxWidth: '1200px',
        padding: '3rem 2rem',
        background: 'linear-gradient(135deg, rgba(26,26,26,0.8), rgba(30,58,138,0.1))',
        borderRadius: '24px',
        border: '2px solid rgba(212, 175, 55, 0.3)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(12px)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Elementos decorativos */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0
        }}></div>

        <div className="join-content" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontFamily: 'Orbitron',
              color: '#D4AF37',
              fontSize: '2.5rem',
              margin: '0 0 1rem 0',
              fontWeight: 'bold',
              textShadow: '0 2px 8px rgba(212, 175, 55, 0.3)'
            }}>
              ¿Quieres ser parte de nuestra comunidad?
            </h2>
            <p style={{
              color: '#E0E0E0',
              fontSize: '1.2rem',
              margin: '0',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: '1.6'
            }}>
              Únete a nuestros canales y participa en nuestros eventos. Conecta con otros entusiastas de blockchain y criptomonedas.
            </p>
          </div>

          <div className="social-buttons" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {/* Discord */}
            <a href="https://discord.gg/Pmu4JQeNR6" 
               className="discord-btn" 
               target="_blank" 
               rel="noopener noreferrer"
               style={{
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 gap: '12px',
                 padding: '1.2rem 2rem',
                 background: 'linear-gradient(135deg, #5865F2, #4752C4)',
                 color: 'white',
                 textDecoration: 'none',
                 borderRadius: '16px',
                 fontWeight: 'bold',
                 fontSize: '1.1rem',
                 transition: 'all 0.3s ease',
                 boxShadow: '0 4px 16px rgba(88, 101, 242, 0.4)',
                 border: '2px solid rgba(255, 255, 255, 0.1)'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                 e.currentTarget.style.boxShadow = '0 8px 24px rgba(88, 101, 242, 0.6)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.transform = 'translateY(0) scale(1)';
                 e.currentTarget.style.boxShadow = '0 4px 16px rgba(88, 101, 242, 0.4)';
               }}
            >
              <i className="fab fa-discord" style={{ fontSize: '1.5rem' }}></i>
              <span>Unirse al Discord</span>
            </a>

            {/* Telegram */}
            <a href="https://t.me/+tPgjd4cOxG05NmVh" 
               className="telegram-btn" 
               target="_blank" 
               rel="noopener noreferrer"
               style={{
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 gap: '12px',
                 padding: '1.2rem 2rem',
                 background: 'linear-gradient(135deg, #0088CC, #0077B3)',
                 color: 'white',
                 textDecoration: 'none',
                 borderRadius: '16px',
                 fontWeight: 'bold',
                 fontSize: '1.1rem',
                 transition: 'all 0.3s ease',
                 boxShadow: '0 4px 16px rgba(0, 136, 204, 0.4)',
                 border: '2px solid rgba(255, 255, 255, 0.1)'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                 e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 136, 204, 0.6)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.transform = 'translateY(0) scale(1)';
                 e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 136, 204, 0.4)';
               }}
            >
              <i className="fab fa-telegram" style={{ fontSize: '1.5rem' }}></i>
              <span>Grupo de Telegram</span>
            </a>

            {/* WhatsApp */}
            <a href="https://wa.me/+525512345678" 
               className="whatsapp-btn" 
               target="_blank" 
               rel="noopener noreferrer"
               style={{
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 gap: '12px',
                 padding: '1.2rem 2rem',
                 background: 'linear-gradient(135deg, #25D366, #128C7E)',
                 color: 'white',
                 textDecoration: 'none',
                 borderRadius: '16px',
                 fontWeight: 'bold',
                 fontSize: '1.1rem',
                 transition: 'all 0.3s ease',
                 boxShadow: '0 4px 16px rgba(37, 211, 102, 0.4)',
                 border: '2px solid rgba(255, 255, 255, 0.1)'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                 e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 211, 102, 0.6)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.transform = 'translateY(0) scale(1)';
                 e.currentTarget.style.boxShadow = '0 4px 16px rgba(37, 211, 102, 0.4)';
               }}
            >
              <i className="fab fa-whatsapp" style={{ fontSize: '1.5rem' }}></i>
              <span>Grupo de WhatsApp</span>
            </a>

            {/* Twitter/X */}
            <a href="https://x.com/Cripto_UNAM" 
               className="twitter-btn" 
               target="_blank" 
               rel="noopener noreferrer"
               style={{
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 gap: '12px',
                 padding: '1.2rem 2rem',
                 background: 'linear-gradient(135deg, #1DA1F2, #0D8BD9)',
                 color: 'white',
                 textDecoration: 'none',
                 borderRadius: '16px',
                 fontWeight: 'bold',
                 fontSize: '1.1rem',
                 transition: 'all 0.3s ease',
                 boxShadow: '0 4px 16px rgba(29, 161, 242, 0.4)',
                 border: '2px solid rgba(255, 255, 255, 0.1)'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                 e.currentTarget.style.boxShadow = '0 8px 24px rgba(29, 161, 242, 0.6)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.transform = 'translateY(0) scale(1)';
                 e.currentTarget.style.boxShadow = '0 4px 16px rgba(29, 161, 242, 0.4)';
               }}
            >
              <i className="fab fa-twitter" style={{ fontSize: '1.5rem' }}></i>
              <span>Síguenos en X</span>
            </a>

            {/* Instagram */}
            <a href="https://instagram.com/criptounam" 
               className="instagram-btn" 
               target="_blank" 
               rel="noopener noreferrer"
               style={{
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 gap: '12px',
                 padding: '1.2rem 2rem',
                 background: 'linear-gradient(135deg, #E4405F, #C13584)',
                 color: 'white',
                 textDecoration: 'none',
                 borderRadius: '16px',
                 fontWeight: 'bold',
                 fontSize: '1.1rem',
                 transition: 'all 0.3s ease',
                 boxShadow: '0 4px 16px rgba(228, 64, 95, 0.4)',
                 border: '2px solid rgba(255, 255, 255, 0.1)'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                 e.currentTarget.style.boxShadow = '0 8px 24px rgba(228, 64, 95, 0.6)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.transform = 'translateY(0) scale(1)';
                 e.currentTarget.style.boxShadow = '0 4px 16px rgba(228, 64, 95, 0.4)';
               }}
            >
              <i className="fab fa-instagram" style={{ fontSize: '1.5rem' }}></i>
              <span>Síguenos en Instagram</span>
            </a>

            {/* LinkedIn */}
            <a href="https://linkedin.com/company/criptounam" 
               className="linkedin-btn" 
               target="_blank" 
               rel="noopener noreferrer"
               style={{
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 gap: '12px',
                 padding: '1.2rem 2rem',
                 background: 'linear-gradient(135deg, #0077B5, #005885)',
                 color: 'white',
                 textDecoration: 'none',
                 borderRadius: '16px',
                 fontWeight: 'bold',
                 fontSize: '1.1rem',
                 transition: 'all 0.3s ease',
                 boxShadow: '0 4px 16px rgba(0, 119, 181, 0.4)',
                 border: '2px solid rgba(255, 255, 255, 0.1)'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                 e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 119, 181, 0.6)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.transform = 'translateY(0) scale(1)';
                 e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 119, 181, 0.4)';
               }}
            >
              <i className="fab fa-linkedin" style={{ fontSize: '1.5rem' }}></i>
              <span>Síguenos en LinkedIn</span>
            </a>
          </div>

          {/* Información adicional */}
          <div style={{
            textAlign: 'center',
            marginTop: '3rem',
            padding: '2rem',
            background: 'rgba(212, 175, 55, 0.1)',
            borderRadius: '16px',
            border: '1px solid rgba(212, 175, 55, 0.2)'
          }}>
            <h3 style={{
              color: '#D4AF37',
              fontSize: '1.3rem',
              margin: '0 0 1rem 0',
              fontFamily: 'Orbitron'
            }}>
              ¿Por qué unirse a nuestra comunidad?
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginTop: '1rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <i className="fas fa-users" style={{ fontSize: '2rem', color: '#D4AF37', marginBottom: '0.5rem' }}></i>
                <p style={{ color: '#E0E0E0', margin: '0', fontSize: '0.9rem' }}>500+ Miembros Activos</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <i className="fas fa-calendar-check" style={{ fontSize: '2rem', color: '#D4AF37', marginBottom: '0.5rem' }}></i>
                <p style={{ color: '#E0E0E0', margin: '0', fontSize: '0.9rem' }}>Eventos Mensuales</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <i className="fas fa-graduation-cap" style={{ fontSize: '2rem', color: '#D4AF37', marginBottom: '0.5rem' }}></i>
                <p style={{ color: '#E0E0E0', margin: '0', fontSize: '0.9rem' }}>Cursos Gratuitos</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <i className="fas fa-network-wired" style={{ fontSize: '2rem', color: '#D4AF37', marginBottom: '0.5rem' }}></i>
                <p style={{ color: '#E0E0E0', margin: '0', fontSize: '0.9rem' }}>Networking Profesional</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Galería simple para imágenes principales

const GaleriaImagenesPrincipales = ({ imagenes, titulo }: { imagenes: string[], titulo: string }) => {
  const [indice, setIndice] = useState(0);
  if (!imagenes || imagenes.length === 0) return null;
  const siguiente = () => setIndice((prev) => (prev + 1) % imagenes.length);
  const anterior = () => setIndice((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  return (
    <div style={{position:'relative', width:'100%', maxWidth:320, marginBottom:8}}>
      <img src={imagenes[indice]} alt={titulo} style={{width:'100%', height:170, objectFit:'cover', borderRadius:18, boxShadow:'0 4px 24px 0 #1E3A8A33'}} />
      {imagenes.length > 1 && (
        <>
          <button onClick={anterior} style={{position:'absolute', left:8, top:'50%', transform:'translateY(-50%)', background:'#181A20cc', color:'#D4AF37', border:'none', borderRadius:12, padding:'2px 8px', cursor:'pointer'}}>‹</button>
          <button onClick={siguiente} style={{position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', background:'#181A20cc', color:'#D4AF37', border:'none', borderRadius:12, padding:'2px 8px', cursor:'pointer'}}>›</button>
        </>
      )}
      <div style={{display:'flex', justifyContent:'center', gap:4, marginTop:4}}>
        {imagenes.map((img, i) => (
          <span key={i} style={{width:8, height:8, borderRadius:'50%', background: i === indice ? '#D4AF37' : '#888', display:'inline-block'}}></span>
        ))}
      </div>
    </div>
  );
};

// Carrusel para galería interna de fotos
const GaleriaFotosInterna = ({ fotos, titulo }: { fotos: string[], titulo: string }) => {
  const [indice, setIndice] = useState(0);
  if (!fotos || fotos.length === 0) return null;
  const siguiente = () => setIndice((prev) => (prev + 1) % fotos.length);
  const anterior = () => setIndice((prev) => (prev - 1 + fotos.length) % fotos.length);
  return (
    <div style={{position:'relative', width:'100%', maxWidth:320, marginBottom:8}}>
      <img src={fotos[indice]} alt={titulo + ' galería'} style={{width:'100%', height:120, objectFit:'cover', borderRadius:12, boxShadow:'0 2px 12px 0 #1E3A8A33'}} />
      {fotos.length > 1 && (
        <>
          <button onClick={anterior} style={{position:'absolute', left:8, top:'50%', transform:'translateY(-50%)', background:'#181A20cc', color:'#D4AF37', border:'none', borderRadius:12, padding:'2px 8px', cursor:'pointer'}}>‹</button>
          <button onClick={siguiente} style={{position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', background:'#181A20cc', color:'#D4AF37', border:'none', borderRadius:12, padding:'2px 8px', cursor:'pointer'}}>›</button>
        </>
      )}
      <div style={{display:'flex', justifyContent:'center', gap:4, marginTop:4}}>
        {fotos.map((img, i) => (
          <span key={i} style={{width:8, height:8, borderRadius:'50%', background: i === indice ? '#D4AF37' : '#888', display:'inline-block'}}></span>
        ))}
      </div>
    </div>
  );
};

export default Comunidad 