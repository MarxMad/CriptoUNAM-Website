import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IMAGES } from '../constants/images'
import '../styles/global.css'

interface Curso {
  id: string
  titulo: string
  nivel: 'Principiante' | 'Intermedio' | 'Avanzado'
  duracion: string
  imagen: string
  descripcion: string
  instructor: string
  precio: number
  estudiantes: number
  rating: number
  categorias: string[]
}

const cursosData: Curso[] = [
  {
    id: '1',
    titulo: 'Introducción a Blockchain',
    nivel: 'Principiante',
    duracion: '2 semanas',
    imagen: IMAGES.CURSOS.BLOCKCHAIN_BASICS,
    descripcion: 'Aprende los fundamentos de la tecnología blockchain y sus aplicaciones.',
    instructor: 'Gerardo Pedrizco Vela',
    precio: 0,
    estudiantes: 1200,
    rating: 4.8,
    categorias: ['Blockchain', 'Tecnología', 'Fundamentos']
  },
  {
    id: '2',
    titulo: 'Smart Contracts con Solidity',
    nivel: 'Intermedio',
    duracion: '4 semanas',
    imagen: IMAGES.CURSOS.SMART_CONTRACTS,
    descripcion: 'Desarrolla contratos inteligentes en la red Ethereum.',
    instructor: 'Adrian Armenta Sequeira',
    precio: 0,
    estudiantes: 800,
    rating: 4.9,
    categorias: ['Ethereum', 'Desarrollo', 'Smart Contracts']
  },
  {
    id: '3',
    titulo: 'DeFi y Finanzas Descentralizadas',
    nivel: 'Avanzado',
    duracion: '2 semanas',
    imagen: IMAGES.CURSOS.DEFI,
    descripcion: 'Explora el mundo de las finanzas descentralizadas y sus protocolos.',
    instructor: 'Fernanda Tello Arzate',
    precio: 0,
    estudiantes: 600,
    rating: 4.7,
    categorias: ['DeFi', 'Finanzas', 'Trading']
  },
  {
    id: '3',
    titulo: 'DeFi y Finanzas Descentralizadas',
    nivel: 'Avanzado',
    duracion: '2 semanas',
    imagen: IMAGES.CURSOS.DEFI,
    descripcion: 'Explora el mundo de las finanzas descentralizadas y sus protocolos.',
    instructor: 'Fernanda Tello Arzate',
    precio: 0,
    estudiantes: 600,
    rating: 4.7,
    categorias: ['DeFi', 'Finanzas', 'Trading']
  }
]

const Cursos = () => {
  const [filtroNivel, setFiltroNivel] = useState<string>('todos')
  const [busqueda, setBusqueda] = useState('')
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('todas')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const cursosFiltrados = cursosData.filter(curso => {
    const cumpleFiltroNivel = filtroNivel === 'todos' || curso.nivel.toLowerCase() === filtroNivel
    const cumpleBusqueda = curso.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                          curso.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    const cumpleCategoria = categoriaSeleccionada === 'todas' || 
                           curso.categorias.includes(categoriaSeleccionada)
    return cumpleFiltroNivel && cumpleBusqueda && cumpleCategoria
  })

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
                  <Link to={`/curso/${curso.id}/registro`} className="primary-button" style={{fontSize:'1rem', padding:'0.6rem 1.5rem', borderRadius:20, fontWeight:700, letterSpacing:'1px'}}>Inscribirse</Link>
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  )
}

export default Cursos 