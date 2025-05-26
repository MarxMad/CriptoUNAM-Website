import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IMAGES } from '../constants/images'
import axios from 'axios'
import '../styles/global.css'
import { useWallet } from '../context/WalletContext'

// Mover cursosData y la interfaz Curso a src/constants/cursosData.ts

interface Leccion {
  titulo: string;
  video: string;
  descripcion: string;
}

interface CursoBackend {
  _id?: string;
  titulo: string;
  nivel: string;
  duracion: string;
  imagen: string;
  descripcion: string;
  instructor: string;
  precio: number;
  estudiantes: number;
  rating: number;
  categorias: string[];
  requisitos?: string;
  lecciones?: Leccion[];
  creadoEn?: string;
}

interface BackendPinataResponse {
  ipfsUrl: string;
}

const Cursos = () => {
  const [filtroNivel, setFiltroNivel] = useState<string>('todos')
  const [busqueda, setBusqueda] = useState('')
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('todas')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [cursos, setCursos] = useState<any[]>([])
  const { walletAddress, isConnected } = useWallet();
  const ADMIN_WALLET = '0x04BEf5bF293BB01d4946dBCfaaeC9a5140316217'.toLowerCase();
  const isAdmin = isConnected && walletAddress.toLowerCase() === ADMIN_WALLET;

  // Estado para el modal de cursos
  const [showCursosModal, setShowCursosModal] = useState(false);
  const [nuevoCurso, setNuevoCurso] = useState({
    titulo: '',
    descripcion: '',
    fecha: '',
    cupo: '',
    imagenPrincipal: '',
    instructor: '',
    tags: '', // string separada por comas
  });
  const [imagenCursoFile, setImagenCursoFile] = useState<File | null>(null);
  const [previewImagenCurso, setPreviewImagenCurso] = useState<string | null>(null);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const res = await axios.get<CursoBackend[]>('http://localhost:4000/cursos');
        setCursos(res.data);
      } catch (error) {
        console.error('Error al cargar cursos:', error);
      }
    };
    fetchCursos();
  }, []);

  const cursosFiltrados = cursos.filter(curso => {
    const cumpleFiltroNivel = filtroNivel === 'todos' || curso.nivel.toLowerCase() === filtroNivel
    const cumpleBusqueda = curso.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                          curso.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    const cumpleCategoria = categoriaSeleccionada === 'todas' || 
                           (curso.categorias && curso.categorias.includes(categoriaSeleccionada))
    return cumpleFiltroNivel && cumpleBusqueda && cumpleCategoria
  })

  const handleInputChangeCurso = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNuevoCurso({ ...nuevoCurso, [e.target.name]: e.target.value });
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
    if (!imagenCursoFile) {
      alert('Por favor selecciona una imagen para el curso');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', imagenCursoFile);
      const response = await axios.post<BackendPinataResponse>('http://localhost:4000/upload', formData);
      const ipfsUrl = response.data.ipfsUrl;
      const cursoData = {
        ...nuevoCurso,
        imagenPrincipal: ipfsUrl,
        instructor: nuevoCurso.instructor,
        categorias: nuevoCurso.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      await axios.post('http://localhost:4000/api/cursos', cursoData);
      setShowCursosModal(false);
      setNuevoCurso({
        titulo: '',
        descripcion: '',
        fecha: '',
        cupo: '',
        imagenPrincipal: '',
        instructor: '',
        tags: '',
      });
      setImagenCursoFile(null);
      setPreviewImagenCurso(null);
    } catch (error) {
      console.error('Error al subir el curso:', error);
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
        {cursosFiltrados.map(curso => (
            <div key={curso.id} className="card curso-card" style={{padding:'2.2rem 1.5rem 1.7rem 1.5rem', position:'relative', overflow:'hidden', minHeight:440, display:'flex', flexDirection:'column', justifyContent:'flex-start', gap:'1.1rem'}}>
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
                  <Link to={`/registro-curso/${curso.id}`} className="primary-button" style={{fontSize:'1rem', padding:'0.6rem 1.5rem', borderRadius:20, fontWeight:700, letterSpacing:'1px'}}>Inscribirse</Link>
              </div>
            </div>
          </div>
        ))}
      </main>
      </div>
      {isAdmin && (
        <>
          <button
            className="floating-button"
            onClick={() => setShowCursosModal(true)}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              padding: '10px 20px',
              backgroundColor: '#D4AF37',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Agregar Curso
          </button>
          {showCursosModal && (
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
              zIndex: 1000,
            }}>
              <div className="modal-content" style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                width: '90%',
                maxWidth: '500px',
                maxHeight: '90vh',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
              }}>
                <h2>Agregar Nuevo Curso</h2>
                <form onSubmit={handleSubmitCurso} style={{display:'flex', flexDirection:'column', gap:14}}>
                  <div>
                    <label>Título:</label>
                    <input
                      type="text"
                      name="titulo"
                      value={nuevoCurso.titulo}
                      onChange={handleInputChangeCurso}
                      required
                    />
                  </div>
                  <div>
                    <label>Descripción:</label>
                    <textarea
                      name="descripcion"
                      value={nuevoCurso.descripcion}
                      onChange={handleInputChangeCurso}
                      required
                    />
                  </div>
                  <div>
                    <label>Fecha:</label>
                    <input
                      type="date"
                      name="fecha"
                      value={nuevoCurso.fecha}
                      onChange={handleInputChangeCurso}
                      required
                    />
                  </div>
                  <div>
                    <label>Cupo:</label>
                    <input
                      type="number"
                      name="cupo"
                      value={nuevoCurso.cupo}
                      onChange={handleInputChangeCurso}
                      required
                    />
                  </div>
                  <div>
                    <label>Instructor:</label>
                    <input
                      type="text"
                      name="instructor"
                      value={nuevoCurso.instructor}
                      onChange={handleInputChangeCurso}
                      required
                    />
                  </div>
                  <div>
                    <label>Tags (separados por coma):</label>
                    <input
                      type="text"
                      name="tags"
                      value={nuevoCurso.tags}
                      onChange={handleInputChangeCurso}
                      placeholder="Blockchain, Ethereum, DeFi"
                    />
                  </div>
                  <div>
                    <label>Imagen:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImagenCursoChange}
                      required
                    />
                    {previewImagenCurso && (
                      <img
                        src={previewImagenCurso}
                        alt="Preview"
                        style={{ maxWidth: '100%', marginTop: '10px' }}
                      />
                    )}
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <button type="submit" style={{ marginRight: '10px' }}>Guardar</button>
                    <button type="button" onClick={() => setShowCursosModal(false)}>Cancelar</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Cursos 