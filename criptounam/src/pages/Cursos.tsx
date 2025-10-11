import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IMAGES } from '../constants/images'
import '../styles/global.css'
import { useWallet } from '../context/WalletContext'
import { useAdmin } from '../hooks/useAdmin'
import { cursosApi, Curso } from '../config/supabaseApi'

// Mover cursosData y la interfaz Curso a src/constants/cursosData.ts

interface Leccion {
  titulo: string;
  video: string; // Puede ser URL de IPFS o YouTube
  descripcion: string;
  videoFile?: File | null; // Archivo temporal antes de subir
}

// Usamos la interfaz Curso de Supabase, pero agregamos campos adicionales para el frontend
interface CursoCompleto extends Curso {
  estudiantes?: number;
  rating?: number;
  categorias?: string[];
  requisitos?: string;
  lecciones?: Leccion[];
}

interface BackendPinataResponse {
  ipfsUrl: string;
}

const Cursos = () => {
  const [filtroNivel, setFiltroNivel] = useState<string>('todos')
  const [busqueda, setBusqueda] = useState('')
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('todas')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [cursos, setCursos] = useState<CursoCompleto[]>([])
  const { walletAddress, isConnected } = useWallet();
  const { isAdmin, canCreateCourse, canDeleteCourse } = useAdmin();

  // Estado para el modal de cursos
  const [showCursosModal, setShowCursosModal] = useState(false);
  const [nuevoCurso, setNuevoCurso] = useState({
    titulo: '',
    nivel: 'Principiante',
    duracion: '',
    descripcion: '',
    instructor: '',
    precio: 0,
    categorias: [] as string[],
    requisitos: '',
    lecciones: [] as Leccion[],
    fechaInicio: '',
    fechaFin: '',
    cupo: 0,
  });
  const [imagenCursoFile, setImagenCursoFile] = useState<File | null>(null);
  const [previewImagenCurso, setPreviewImagenCurso] = useState<string | null>(null);

  const [leccionActual, setLeccionActual] = useState({
    titulo: '',
    video: '',
    descripcion: '',
    videoFile: null as File | null,
  });

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const cursosData = await cursosApi.getAll();
        // Convertir a CursoCompleto agregando campos por defecto
        const cursosCompletos: CursoCompleto[] = cursosData.map(curso => ({
          ...curso,
          estudiantes: 0,
          rating: 5.0,
          categorias: ['Blockchain'],
          requisitos: 'Conocimientos básicos de programación',
          lecciones: []
        }));
        setCursos(cursosCompletos);
      } catch (error) {
        console.error('Error al cargar cursos:', error);
      }
    };
    fetchCursos();
  }, []);

  // Verificar si se debe abrir el modal desde URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shouldOpenModal = urlParams.get('openModal');
    
    if (shouldOpenModal === 'true') {
      console.log('📚 Cursos: Abriendo modal desde URL');
      setShowCursosModal(true);
      // Limpiar el parámetro de la URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  // Listener para el botón de admin
  useEffect(() => {
    const handleOpenCursosModal = () => {
      console.log('📚 Cursos: Abriendo modal desde botón admin');
      setShowCursosModal(true);
    };

    window.addEventListener('openCursosModal', handleOpenCursosModal);
    
    return () => {
      window.removeEventListener('openCursosModal', handleOpenCursosModal);
    };
  }, []);

  const cursosFiltrados = cursos.filter(curso => {
    const cumpleFiltroNivel = filtroNivel === 'todos' || curso.nivel?.toLowerCase() === filtroNivel
    const cumpleBusqueda = curso.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
                          curso.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
    const cumpleCategoria = categoriaSeleccionada === 'todas' || 
                           (curso.categorias && curso.categorias.includes(categoriaSeleccionada))
    return cumpleFiltroNivel && cumpleBusqueda && cumpleCategoria
  })

  const handleInputChangeCurso = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === 'precio') {
      setNuevoCurso({ ...nuevoCurso, [name]: Math.max(0, Number(value)) });
    } else {
      setNuevoCurso({ ...nuevoCurso, [name]: value });
    }
  };

  const handleImagenCursoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagenCursoFile(file);
      setPreviewImagenCurso(URL.createObjectURL(file));
    }
  };

  const handleSubmitCurso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreateCourse) {
      alert('No tienes permisos para crear cursos');
      return;
    }
    if (!imagenCursoFile) {
      alert('Por favor selecciona una imagen para el curso');
      return;
    }

    try {
      // Subir imagen del curso usando Supabase
      const imagenUrl = await cursosApi.uploadCourseImage(imagenCursoFile);

      // Crear el curso usando Supabase
      const cursoData: Omit<Curso, 'id' | 'creadoEn'> = {
        titulo: nuevoCurso.titulo,
        descripcion: nuevoCurso.descripcion,
        duracion: nuevoCurso.duracion,
        nivel: nuevoCurso.nivel,
        instructor: nuevoCurso.instructor,
        imagen: imagenUrl,
        precio: nuevoCurso.precio,
        fechaInicio: nuevoCurso.fechaInicio,
        fechaFin: nuevoCurso.fechaFin,
        cupo: nuevoCurso.cupo
      };

      const cursoCreado = await cursosApi.create(cursoData);
      
      // Agregar el curso a la lista local
      const cursoCompleto: CursoCompleto = {
        ...cursoCreado,
        estudiantes: 0,
        rating: 5.0,
        categorias: ['Blockchain'],
        requisitos: 'Conocimientos básicos de programación',
        lecciones: []
      };
      
      setCursos([cursoCompleto, ...cursos]);
      setShowCursosModal(false);
      setNuevoCurso({
        titulo: '',
        nivel: 'Principiante',
        duracion: '',
        descripcion: '',
        instructor: '',
        precio: 0,
        categorias: [],
        requisitos: '',
        lecciones: [],
        fechaInicio: '',
        fechaFin: '',
        cupo: 0,
      });
      setImagenCursoFile(null);
      setPreviewImagenCurso(null);
    } catch (error) {
      console.error('Error al subir el curso:', error);
    }
  };

  const handleAgregarLeccion = () => {
    if (!leccionActual.titulo || !leccionActual.descripcion || (!leccionActual.video && !leccionActual.videoFile)) {
      alert('Por favor completa todos los campos de la lección');
      return;
    }

    setNuevoCurso(prev => ({
      ...prev,
      lecciones: [...prev.lecciones, {
        titulo: leccionActual.titulo,
        video: leccionActual.video || '', // URL de YouTube o IPFS
        descripcion: leccionActual.descripcion,
        videoFile: leccionActual.videoFile, // Archivo de video si se subió uno
      }]
    }));

    setLeccionActual({
      titulo: '',
      video: '',
      descripcion: '',
      videoFile: null,
    });
  };

  const handleEliminarCurso = async (id: string) => {
    if (!window.confirm('¿Seguro que quieres eliminar este curso?')) return;
    if (!canDeleteCourse) {
      alert('No tienes permisos para eliminar cursos');
      return;
    }
    try {
      await cursosApi.delete(id);
      setCursos(cursos.filter((c: any) => c.id !== id));
    } catch (error) {
      console.error('Error al eliminar el curso:', error);
      alert('Error al eliminar el curso');
    }
  };

  return (
    <div className="section" style={{minHeight:'100vh', display:'flex', flexDirection:'column', paddingTop: '2rem'}}>
      <h1 className="hero-title" style={{textAlign:'center', marginBottom:'2rem'}}>Cursos CriptoUNAM</h1>
      <div className="cursos-layout" style={{display:'flex', gap:'2rem', alignItems:'flex-start', width:'100%', maxWidth:1200, margin:'0 auto'}}>
        {/* Sidebar filtros glass */}
        <aside className={`filtros-sidebar card`} style={{minWidth:220, maxWidth:280, position:'sticky', top:90, height:'fit-content', zIndex:2, background:'rgba(26,26,26,0.7)', backdropFilter:'blur(12px)', border:'1.5px solid #D4AF37', boxShadow:'0 4px 24px rgba(30,58,138,0.08)'}}>
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar cursos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar cursos"
          />
        </div>
        <div className="filter-section">
            <h3 style={{fontFamily:'Orbitron'}}>Nivel</h3>
            <div className="filter-options" style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
              {['todos','principiante','intermedio','avanzado'].map(nivel => (
            <button 
                  key={nivel}
                  className={`filter-btn ${filtroNivel === nivel ? 'active' : ''}`}
                  onClick={() => setFiltroNivel(nivel)}
                  aria-pressed={filtroNivel === nivel}
                  style={{fontWeight:600, borderRadius:20, background:filtroNivel===nivel?'linear-gradient(45deg,#D4AF37,#2563EB)':'rgba(26,26,26,0.5)', color:filtroNivel===nivel?'#0A0A0A':'#D4AF37', border:'none', padding:'0.5rem 1.2rem'}}
            >
                  {nivel==='todos'?'Todos los niveles':nivel.charAt(0).toUpperCase()+nivel.slice(1)}
            </button>
              ))}
            </div>
          </div>
        <div className="filter-section">
            <h3 style={{fontFamily:'Orbitron'}}>Categorías</h3>
            <div className="filter-options" style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
            {['todas', 'Blockchain', 'Ethereum', 'DeFi', 'Smart Contracts'].map(cat => (
              <button
                key={cat}
                className={`filter-btn ${categoriaSeleccionada === cat ? 'active' : ''}`}
                onClick={() => setCategoriaSeleccionada(cat)}
                aria-pressed={categoriaSeleccionada === cat}
                  style={{fontWeight:600, borderRadius:20, background:categoriaSeleccionada===cat?'linear-gradient(45deg,#D4AF37,#2563EB)':'rgba(26,26,26,0.5)', color:categoriaSeleccionada===cat?'#0A0A0A':'#D4AF37', border:'none', padding:'0.5rem 1.2rem'}}
              >
                  {cat==='todas'?'Todas las categorías':cat}
              </button>
            ))}
          </div>
        </div>
      </aside>
        {/* Grid de cursos glass */}
        <main className="cursos-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:'2rem', width:'100%'}}>
        {cursosFiltrados.map((curso: any) => (
            <div key={curso._id} className="card curso-card" style={{padding:'2.2rem 1.5rem 1.7rem 1.5rem', position:'relative', overflow:'hidden', minHeight:440, display:'flex', flexDirection:'column', justifyContent:'flex-start', gap:'1.1rem'}}>
              <div className="curso-imagen" style={{position:'relative', marginBottom:'1.2rem'}}>
                <img src={curso.imagen} alt={curso.titulo} style={{width:'100%', height:170, objectFit:'cover', borderRadius:18, boxShadow:'0 4px 24px 0 #1E3A8A33'}} />
                <span className={`nivel-badge ${curso.nivel.toLowerCase()}`} style={{position:'absolute', top:16, left:16, background:'linear-gradient(45deg,#D4AF37,#2563EB)', color:'#0A0A0A', borderRadius:16, padding:'0.3rem 1.1rem', fontWeight:700, fontFamily:'Orbitron', fontSize:'1rem', boxShadow:'0 2px 8px #1E3A8A22', zIndex:2, letterSpacing:'0.5px'}}>
                {curso.nivel}
              </span>
            </div>
              <div className="curso-content" style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'flex-start', gap:'0.7rem'}}>
                <h3 style={{fontFamily:'Orbitron', color:'#D4AF37', fontSize:'1.35rem', margin:'0 0 0.2rem 0', lineHeight:'1.2'}}> {curso.titulo} </h3>
                <p className="instructor" style={{color:'#2563EB', fontWeight:600, margin:'0 0 0.2rem 0', fontSize:'1.05rem', lineHeight:'1.2'}}>Por {curso.instructor}</p>
                <p className="descripcion" style={{margin:'0 0 0.2rem 0', color:'#E0E0E0', fontSize:'1rem', lineHeight:'1.5'}}> {curso.descripcion} </p>
                <div className="curso-meta" style={{display:'flex', gap:'1.2rem', margin:'0.3rem 0 0.2rem 0', fontSize:'0.98rem'}}>
                  <span className="duracion" style={{display:'flex', alignItems:'center', gap:4}}>
                  <i className="fas fa-clock"></i> {curso.duracion}
                </span>
                  <span className="estudiantes" style={{display:'flex', alignItems:'center', gap:4}}>
                  <i className="fas fa-users"></i> {curso.estudiantes} estudiantes
                </span>
              </div>
                <div className="curso-footer" style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'1.2rem', gap:'1rem'}}>
                  <div className="rating" style={{color:'#D4AF37', fontWeight:700, fontFamily:'Orbitron', display:'flex', alignItems:'center', gap:'0.3rem'}}>
                    <span className="stars" style={{fontSize:'1.1rem'}}>{'★'.repeat(Math.floor(curso.rating))}</span>
                    <span className="rating-number" style={{marginLeft:2, fontSize:'1rem'}}>{curso.rating}</span>
                </div>
                  <Link to={`/registro-curso/${curso._id}`} className="primary-button" style={{fontSize:'1rem', padding:'0.6rem 1.5rem', borderRadius:20, fontWeight:700, letterSpacing:'1px'}}>Inscribirse</Link>
                  {isAdmin && (
                    <button onClick={() => handleEliminarCurso(curso._id)} style={{background:'red', color:'white', border:'none', borderRadius:5, padding:'4px 10px', fontWeight:600}}>Eliminar</button>
                  )}
              </div>
            </div>
          </div>
        ))}
              </main>
        </div>
        {showCursosModal && (
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
                    Agregar Nuevo Curso
                  </h2>
                  <button
                    onClick={() => setShowCursosModal(false)}
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
                <form onSubmit={handleSubmitCurso} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  flex: 1,
                  overflowY: 'auto'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ color: '#333', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      Título *
                    </label>
                    <input
                      type="text"
                      name="titulo"
                      value={nuevoCurso.titulo}
                      onChange={handleInputChangeCurso}
                      placeholder="Título del curso"
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
                      Nivel *
                    </label>
                    <select
                      name="nivel"
                      value={nuevoCurso.nivel}
                      onChange={handleInputChangeCurso}
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
                    >
                      <option value="Principiante">Principiante</option>
                      <option value="Intermedio">Intermedio</option>
                      <option value="Avanzado">Avanzado</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ color: '#333', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      Duración *
                    </label>
                    <input
                      type="text"
                      name="duracion"
                      value={nuevoCurso.duracion}
                      onChange={handleInputChangeCurso}
                      placeholder="ej. 4 semanas"
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
                      value={nuevoCurso.descripcion}
                      onChange={handleInputChangeCurso}
                      placeholder="Descripción del curso..."
                      required
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border: '2px solid #e0e0e0',
                        fontSize: '1rem',
                        minHeight: '80px',
                        resize: 'vertical',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                      onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ color: '#333', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      Instructor *
                    </label>
                    <input
                      type="text"
                      name="instructor"
                      value={nuevoCurso.instructor}
                      onChange={handleInputChangeCurso}
                      placeholder="Nombre del instructor"
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
                      Precio *
                    </label>
                    <input
                      type="number"
                      name="precio"
                      value={nuevoCurso.precio}
                      onChange={handleInputChangeCurso}
                      min="0"
                      placeholder="0"
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
                      Categorías
                    </label>
                    <input
                      type="text"
                      name="categorias"
                      value={nuevoCurso.categorias.join(', ')}
                      onChange={(e) => setNuevoCurso(prev => ({
                        ...prev,
                        categorias: e.target.value.split(',').map(c => c.trim()).filter(Boolean)
                      }))}
                      placeholder="Blockchain, Ethereum, DeFi"
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
                      Requisitos
                    </label>
                    <textarea
                      name="requisitos"
                      value={nuevoCurso.requisitos}
                      onChange={handleInputChangeCurso}
                      placeholder="Requisitos previos..."
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border: '2px solid #e0e0e0',
                        fontSize: '1rem',
                        minHeight: '80px',
                        resize: 'vertical',
                        transition: 'all 0.3s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                      onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ color: '#D4AF37', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      Imagen del curso *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImagenCursoChange}
                      required
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border: '2px solid #e0e0e0',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
                      }}
                    />
                    {previewImagenCurso && (
                      <img
                        src={previewImagenCurso}
                        alt="Preview"
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

                  {/* Sección de Lecciones */}
                  <div style={{ 
                    borderTop: '1px solid #e0e0e0', 
                    paddingTop: '16px',
                    marginTop: '8px'
                  }}>
                    <h3 style={{ 
                      color: '#D4AF37', 
                      margin: '0 0 16px 0',
                      fontSize: '1.2rem',
                      fontWeight: 'bold'
                    }}>
                      Lecciones
                    </h3>
                    <div style={{ marginBottom: '16px' }}>
                      <input
                        type="text"
                        placeholder="Título de la lección"
                        value={leccionActual.titulo}
                        onChange={(e) => setLeccionActual(prev => ({ ...prev, titulo: e.target.value }))}
                        style={{
                          padding: '12px',
                          borderRadius: '8px',
                          border: '2px solid #e0e0e0',
                          fontSize: '1rem',
                          marginBottom: '8px',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                      />
                      <textarea
                        placeholder="Descripción de la lección"
                        value={leccionActual.descripcion}
                        onChange={(e) => setLeccionActual(prev => ({ ...prev, descripcion: e.target.value }))}
                        style={{
                          padding: '12px',
                          borderRadius: '8px',
                          border: '2px solid #e0e0e0',
                          fontSize: '1rem',
                          marginBottom: '8px',
                          minHeight: '60px',
                          resize: 'vertical',
                          transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                        onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                      />
                      <div style={{ marginBottom: '8px' }}>
                        <label style={{ color: '#333', fontWeight: 'bold', fontSize: '0.9rem', display: 'block', marginBottom: '4px' }}>
                          Video (URL de YouTube o archivo)
                        </label>
                        <input
                          type="text"
                          placeholder="URL de YouTube"
                          value={leccionActual.video}
                          onChange={(e) => setLeccionActual(prev => ({ ...prev, video: e.target.value }))}
                          style={{
                            padding: '12px',
                            borderRadius: '8px',
                            border: '2px solid #e0e0e0',
                            fontSize: '1rem',
                            marginBottom: '8px',
                            transition: 'all 0.3s ease'
                          }}
                          onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                          onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        />
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setLeccionActual(prev => ({ ...prev, videoFile: e.target.files![0] }));
                            }
                          }}
                          style={{
                            padding: '12px',
                            borderRadius: '8px',
                            border: '2px solid #e0e0e0',
                            fontSize: '1rem',
                            transition: 'all 0.3s ease'
                          }}
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={handleAgregarLeccion}
                        style={{
                          background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                          color: '#000',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        Agregar Lección
                      </button>
                    </div>
                    {nuevoCurso.lecciones.length > 0 && (
                      <div>
                        <h4 style={{ color: '#333', margin: '0 0 8px 0', fontSize: '1rem' }}>
                          Lecciones agregadas:
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                          {nuevoCurso.lecciones.map((leccion, idx) => (
                            <li key={idx} style={{ marginBottom: '4px', color: '#333' }}>
                              {leccion.titulo}
                              <button
                                type="button"
                                onClick={() => setNuevoCurso(prev => ({
                                  ...prev,
                                  lecciones: prev.lecciones.filter((_, i) => i !== idx)
                                }))}
                                style={{
                                  marginLeft: '8px',
                                  color: 'red',
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  fontSize: '1.2rem',
                                  fontWeight: 'bold'
                                }}
                              >
                                ×
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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
                      Guardar Curso
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowCursosModal(false)}
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
      </div>
  )
}

export default Cursos 