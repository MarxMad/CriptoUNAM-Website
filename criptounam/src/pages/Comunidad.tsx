import React, { useState, useEffect } from 'react'
import '../styles/global.css'
import { useWallet } from '../context/WalletContext'
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
  const ADMIN_WALLET = '0x04BEf5bF293BB01d4946dBCfaaeC9a5140316217'.toLowerCase();
  const isAdmin = isConnected && walletAddress.toLowerCase() === ADMIN_WALLET;

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
      const res = await axios.post('http://localhost:4000/evento', eventoData);
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

      const res = await axios.post('http://localhost:4000/evento', eventoData);
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
    try {
      await axios.delete(`http://localhost:4000/evento/${evento._id}`);
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

      {/* Próximos y Anteriores Eventos: Botones flotantes juntos */}
      {isAdmin && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          display: 'flex',
          gap: '12px',
          zIndex: 1100,
        }}>
          <button
            className="floating-button"
            onClick={() => setShowNuevoEventoModal(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#D4AF37',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Agregar Nuevo Evento
          </button>
          <button
            className="floating-button"
            onClick={() => setShowEventoPasadoModal(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#D4AF37',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Agregar Evento Anterior
          </button>
        </div>
      )}
      {/* Modales */}
      {showNuevoEventoModal && (
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
            <h2>Agregar Nuevo Evento</h2>
            <form onSubmit={editandoEvento ? handleGuardarEdicionEvento : handleAgregarEvento} style={{display:'flex', flexDirection:'column', gap:14}}>
              <input name="titulo" value={nuevoEvento.titulo} onChange={handleInputChange} placeholder="Título del evento" required style={{padding:8, borderRadius:8}} />
              <input name="fecha" value={nuevoEvento.fecha} onChange={handleInputChange} placeholder="Fecha (ej. 15 de Abril, 2024)" required style={{padding:8, borderRadius:8}} />
              <input name="hora" value={nuevoEvento.hora} onChange={handleInputChange} placeholder="Hora (ej. 16:00)" required style={{padding:8, borderRadius:8}} />
              <input name="lugar" value={nuevoEvento.lugar} onChange={handleInputChange} placeholder="Lugar" required style={{padding:8, borderRadius:8}} />
              <input name="cupo" value={nuevoEvento.cupo} onChange={handleInputChange} placeholder="Cupo" type="number" min="1" required style={{padding:8, borderRadius:8}} />
              <textarea name="descripcion" value={nuevoEvento.descripcion} onChange={handleInputChange} placeholder="Descripción del evento" required style={{padding:8, borderRadius:8}} />
              <label style={{color:'#D4AF37', fontWeight:'bold'}}>Imagen del evento</label>
              <input type="file" onChange={handleImagenEventoChange} accept="image/*" required style={{padding:8, borderRadius:8}} />
              {previewImagenEvento && (
                <img src={previewImagenEvento} alt="Previsualización" style={{width: '100%', maxWidth: 320, margin: '0 auto 10px auto', borderRadius: 12, boxShadow: '0 2px 12px #1E3A8A33'}} />
              )}
              <input name="registroLink" value={nuevoEvento.registroLink} onChange={handleInputChange} placeholder="Link de registro (opcional)" style={{padding:8, borderRadius:8}} />
              <div style={{ marginTop: '20px' }}>
                <button type="submit" style={{ marginRight: '10px' }}>Guardar</button>
                <button type="button" onClick={() => setShowNuevoEventoModal(false)}>Cancelar</button>
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