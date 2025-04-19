import { useState } from 'react'
import { IMAGES } from '../constants/images'

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
    duracion: '6 semanas',
    imagen: IMAGES.CURSOS.BLOCKCHAIN_BASICS,
    descripcion: 'Aprende los fundamentos de la tecnología blockchain y sus aplicaciones.',
    instructor: 'Dr. Juan Pérez',
    precio: 0,
    estudiantes: 1200,
    rating: 4.8,
    categorias: ['Blockchain', 'Tecnología', 'Fundamentos']
  },
  {
    id: '2',
    titulo: 'Smart Contracts con Solidity',
    nivel: 'Intermedio',
    duracion: '8 semanas',
    imagen: IMAGES.CURSOS.SMART_CONTRACTS,
    descripcion: 'Desarrolla contratos inteligentes en la red Ethereum.',
    instructor: 'Ing. María González',
    precio: 0,
    estudiantes: 800,
    rating: 4.9,
    categorias: ['Ethereum', 'Desarrollo', 'Smart Contracts']
  },
  {
    id: '3',
    titulo: 'DeFi y Finanzas Descentralizadas',
    nivel: 'Avanzado',
    duracion: '10 semanas',
    imagen: IMAGES.CURSOS.DEFI,
    descripcion: 'Explora el mundo de las finanzas descentralizadas y sus protocolos.',
    instructor: 'Mtro. Carlos Ruiz',
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
  const [filtrosExpandidos, setFiltrosExpandidos] = useState(false)

  const cursosFiltrados = cursosData.filter(curso => {
    const cumpleFiltroNivel = filtroNivel === 'todos' || curso.nivel.toLowerCase() === filtroNivel
    const cumpleBusqueda = curso.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                          curso.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    const cumpleCategoria = categoriaSeleccionada === 'todas' || 
                           curso.categorias.includes(categoriaSeleccionada)
    
    return cumpleFiltroNivel && cumpleBusqueda && cumpleCategoria
  })

  return (
    <div className="cursos-container">
      {/* Barra lateral de filtros */}
      <aside className={`filtros-sidebar ${filtrosExpandidos ? 'expanded' : ''}`}>
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
          <h3>Nivel</h3>
          <div className="filter-options">
            <button 
              className={`filter-btn ${filtroNivel === 'todos' ? 'active' : ''}`}
              onClick={() => setFiltroNivel('todos')}
              aria-pressed={filtroNivel === 'todos'}
            >
              Todos los niveles
            </button>
            <button 
              className={`filter-btn ${filtroNivel === 'principiante' ? 'active' : ''}`}
              onClick={() => setFiltroNivel('principiante')}
              aria-pressed={filtroNivel === 'principiante'}
            >
              Principiante
            </button>
            <button 
              className={`filter-btn ${filtroNivel === 'intermedio' ? 'active' : ''}`}
              onClick={() => setFiltroNivel('intermedio')}
              aria-pressed={filtroNivel === 'intermedio'}
            >
              Intermedio
            </button>
            <button 
              className={`filter-btn ${filtroNivel === 'avanzado' ? 'active' : ''}`}
              onClick={() => setFiltroNivel('avanzado')}
              aria-pressed={filtroNivel === 'avanzado'}
            >
              Avanzado
            </button>
          </div>
        </div>

        <div className="filter-section">
          <h3>Categorías</h3>
          <div className="filter-options">
            {['todas', 'Blockchain', 'Ethereum', 'DeFi', 'Smart Contracts'].map(cat => (
              <button
                key={cat}
                className={`filter-btn ${categoriaSeleccionada === cat ? 'active' : ''}`}
                onClick={() => setCategoriaSeleccionada(cat)}
                aria-pressed={categoriaSeleccionada === cat}
              >
                {cat === 'todas' ? 'Todas las categorías' : cat}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Grid de cursos */}
      <main className="cursos-grid">
        {cursosFiltrados.map(curso => (
          <div key={curso.id} className="curso-card">
            <div className="curso-imagen">
              <img src={curso.imagen} alt={curso.titulo} />
              <span className={`nivel-badge ${curso.nivel.toLowerCase()}`}>
                {curso.nivel}
              </span>
            </div>
            <div className="curso-content">
              <h3>{curso.titulo}</h3>
              <p className="instructor">Por {curso.instructor}</p>
              <p className="descripcion">{curso.descripcion}</p>
              <div className="curso-meta">
                <span className="duracion">
                  <i className="fas fa-clock"></i> {curso.duracion}
                </span>
                <span className="estudiantes">
                  <i className="fas fa-users"></i> {curso.estudiantes} estudiantes
                </span>
              </div>
              <div className="curso-footer">
                <div className="rating">
                  <span className="stars">{'★'.repeat(Math.floor(curso.rating))}</span>
                  <span className="rating-number">{curso.rating}</span>
                </div>
                <button className="inscribirse-btn">
                  Inscribirse
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}

export default Cursos 