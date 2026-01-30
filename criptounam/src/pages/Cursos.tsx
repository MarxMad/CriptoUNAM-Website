import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { cursosData, type Curso } from '../constants/cursosData'
import '../styles/global.css'

const NIVELES = ['todos', 'principiante', 'intermedio', 'avanzado'] as const
const CATEGORIAS_LIST = ['todas', 'Blockchain', 'Ethereum', 'DeFi', 'Smart Contracts', 'Tecnología', 'Fundamentos', 'Desarrollo', 'Finanzas', 'Trading']

const Cursos = () => {
  const [filtroNivel, setFiltroNivel] = useState<string>('todos')
  const [busqueda, setBusqueda] = useState('')
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('todas')

  const cursosFiltrados = useMemo(() => {
    return cursosData.filter((curso) => {
      const cumpleNivel = filtroNivel === 'todos' || curso.nivel?.toLowerCase() === filtroNivel
      const cumpleBusqueda =
        curso.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
        curso.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
        curso.instructor?.toLowerCase().includes(busqueda.toLowerCase())
      const cumpleCategoria =
        categoriaSeleccionada === 'todas' ||
        (curso.categorias && curso.categorias.some((c) => c.toLowerCase() === categoriaSeleccionada.toLowerCase()))
      return cumpleNivel && cumpleBusqueda && cumpleCategoria
    })
  }, [filtroNivel, busqueda, categoriaSeleccionada])

  return (
    <div className="cursos-page section" style={{ minHeight: '100vh', paddingTop: '2rem' }}>
      <header className="cursos-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 className="hero-title" style={{ fontFamily: 'Orbitron', color: '#D4AF37', marginBottom: '0.5rem', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>
          Cursos CriptoUNAM
        </h1>
        <p style={{ color: '#E0E0E0', fontSize: '1.1rem', maxWidth: 560, margin: '0 auto' }}>
          Aprende blockchain, smart contracts y DeFi con contenido creado por la comunidad.
        </p>
      </header>

      <div className="cursos-layout" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', width: '100%', maxWidth: 1200, margin: '0 auto', flexWrap: 'wrap' }}>
        {/* Sidebar filtros */}
        <aside
          className="filtros-sidebar card"
          style={{
            minWidth: 220,
            maxWidth: 280,
            position: 'sticky',
            top: 90,
            height: 'fit-content',
            zIndex: 2,
            background: 'rgba(26,26,26,0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(212,175,55,0.4)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            borderRadius: 20,
            padding: '1.5rem',
          }}
        >
          <div className="search-box" style={{ marginBottom: '1.25rem' }}>
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              aria-label="Buscar cursos"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 12,
                border: '1px solid rgba(212,175,55,0.3)',
                background: 'rgba(10,10,10,0.5)',
                color: '#E0E0E0',
                fontSize: '1rem',
              }}
            />
          </div>
          <div className="filter-section" style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontFamily: 'Orbitron', color: '#D4AF37', fontSize: '1rem', marginBottom: '0.75rem' }}>Nivel</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {NIVELES.map((nivel) => (
                <button
                  key={nivel}
                  type="button"
                  className={`filter-btn ${filtroNivel === nivel ? 'active' : ''}`}
                  onClick={() => setFiltroNivel(nivel)}
                  aria-pressed={filtroNivel === nivel}
                  style={{
                    fontWeight: 600,
                    borderRadius: 12,
                    background: filtroNivel === nivel ? 'linear-gradient(135deg, #D4AF37, #F4D03F)' : 'rgba(26,26,26,0.6)',
                    color: filtroNivel === nivel ? '#0A0A0A' : '#D4AF37',
                    border: `1px solid ${filtroNivel === nivel ? '#D4AF37' : 'rgba(212,175,55,0.3)'}`,
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {nivel === 'todos' ? 'Todos los niveles' : nivel.charAt(0).toUpperCase() + nivel.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-section">
            <h3 style={{ fontFamily: 'Orbitron', color: '#D4AF37', fontSize: '1rem', marginBottom: '0.75rem' }}>Categorías</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {CATEGORIAS_LIST.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoriaSeleccionada(cat)}
                  aria-pressed={categoriaSeleccionada === cat}
                  style={{
                    fontWeight: 600,
                    borderRadius: 12,
                    background: categoriaSeleccionada === cat ? 'linear-gradient(135deg, #D4AF37, #F4D03F)' : 'rgba(26,26,26,0.6)',
                    color: categoriaSeleccionada === cat ? '#0A0A0A' : '#D4AF37',
                    border: `1px solid ${categoriaSeleccionada === cat ? '#D4AF37' : 'rgba(212,175,55,0.3)'}`,
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {cat === 'todas' ? 'Todas' : cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Grid de cursos */}
        <main className="cursos-grid" style={{ flex: 1, minWidth: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem' }}>
          {cursosFiltrados.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#E0E0E0' }}>
              No hay cursos que coincidan con los filtros. Prueba cambiar nivel o categoría.
            </div>
          ) : (
            cursosFiltrados.map((curso: Curso) => (
              <article
                key={curso.id}
                className="curso-card card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  minHeight: 420,
                  display: 'flex',
                  flexDirection: 'column',
                  maxWidth: 'none',
                  background: 'rgba(26,26,26,0.85)',
                  border: '1px solid rgba(212,175,55,0.35)',
                  borderRadius: 20,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                }}
              >
                <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden' }}>
                  <img
                    src={curso.imagen}
                    alt={curso.titulo}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      background: 'linear-gradient(135deg, #D4AF37, #F4D03F)',
                      color: '#0A0A0A',
                      borderRadius: 12,
                      padding: '0.25rem 0.75rem',
                      fontWeight: 700,
                      fontFamily: 'Orbitron',
                      fontSize: '0.85rem',
                    }}
                  >
                    {curso.nivel}
                  </span>
                </div>
                <div style={{ padding: '1.25rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <h2 style={{ fontFamily: 'Orbitron', color: '#D4AF37', fontSize: '1.25rem', margin: 0, lineHeight: 1.3 }}>
                    {curso.titulo}
                  </h2>
                  <p style={{ color: '#93C5FD', fontWeight: 600, margin: 0, fontSize: '0.95rem' }}>Por {curso.instructor}</p>
                  <p style={{ margin: 0, color: '#E0E0E0', fontSize: '0.95rem', lineHeight: 1.5, flex: 1 }}>
                    {curso.descripcion}
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#9CA3AF' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <i className="fas fa-clock" /> {curso.duracion}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <i className="fas fa-users" /> {curso.estudiantes} estudiantes
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', gap: '0.75rem' }}>
                    <span style={{ color: '#D4AF37', fontWeight: 700, fontFamily: 'Orbitron' }}>
                      {'★'.repeat(Math.floor(curso.rating))} {curso.rating}
                    </span>
                    <Link
                      to={`/registro-curso/${curso.id}`}
                      className="primary-button"
                      style={{
                        fontSize: '0.95rem',
                        padding: '0.6rem 1.25rem',
                        borderRadius: 14,
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                        textDecoration: 'none',
                      }}
                    >
                      Inscribirse
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </main>
      </div>
    </div>
  )
}

export default Cursos
