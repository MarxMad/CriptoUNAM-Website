import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { cursosData, type Curso } from '../constants/cursosData'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faBook, faCode, faRocket } from '@fortawesome/free-solid-svg-icons'
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
    <>
      <style>{`
        .cursos-layout {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          flex-wrap: wrap;
        }
        
        .filtros-sidebar {
          min-width: 220px;
          max-width: 280px;
          position: sticky;
          top: 90px;
          height: fit-content;
          z-index: 2;
          background: rgba(26,26,26,0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(212,175,55,0.4);
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          border-radius: 20px;
          padding: 1.5rem;
        }

        .cursos-grid {
          flex: 1;
          min-width: 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.75rem;
        }

        @media (max-width: 768px) {
          .cursos-layout {
            flex-direction: column;
            padding: 0 1rem;
          }
          
          .filtros-sidebar {
            width: 100%;
            max-width: none;
            position: relative;
            top: 0;
            min-width: auto;
          }

          .cursos-grid {
            width: 100%;
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <div className="cursos-page section" style={{ minHeight: '100vh', paddingTop: '2rem' }}>
        <header className="cursos-header" style={{ textAlign: 'center', marginBottom: '2.5rem', padding: '0 1rem' }}>
          <h1 className="hero-title" style={{ fontFamily: 'Orbitron', color: '#D4AF37', marginBottom: '0.5rem', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', lineHeight: 1.2 }}>
            Cursos CriptoUNAM
          </h1>
          <p style={{ color: '#E0E0E0', fontSize: '1.1rem', maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>
            Aprende blockchain, smart contracts y DeFi con contenido creado por la comunidad.
          </p>
        </header>

        {/* Tu Camino de Aprendizaje */}
        <section style={{ maxWidth: 1000, margin: '0 auto 3rem auto', padding: '0 1rem' }}>
          <h2 style={{ fontFamily: 'Orbitron', color: '#D4AF37', fontSize: '1.8rem', textAlign: 'center', marginBottom: '2rem' }}>
            Tu Camino de Aprendizaje
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            maxWidth: 900,
            margin: '0 auto'
          }}>
            {[
              { number: 1, title: 'Fundamentos', description: 'Blockchain, Bitcoin, Ethereum y conceptos básicos', icon: faBook, color: '#4ecdc4' },
              { number: 2, title: 'Desarrollo', description: 'Smart Contracts, DApps y desarrollo Web3', icon: faCode, color: '#D4AF37' },
              { number: 3, title: 'Especialización', description: 'DeFi, NFTs, DAOs y más', icon: faRocket, color: '#8B5CF6' }
            ].map((step, i) => (
              <div key={i} className="card" style={{
                background: 'rgba(26,26,26,0.85)',
                borderRadius: 20,
                padding: '2rem',
                border: '1px solid rgba(212,175,55,0.3)',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.borderColor = step.color
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'
              }}
              >
                <div style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: `rgba(${step.color === '#4ecdc4' ? '78, 205, 196' : step.color === '#D4AF37' ? '212, 175, 55' : '139, 92, 246'}, 0.15)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                  border: `2px solid ${step.color}`,
                  position: 'relative'
                }}>
                  <FontAwesomeIcon icon={step.icon} style={{ color: step.color, fontSize: '1.5rem' }} />
                  <span style={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    background: '#D4AF37',
                    color: '#000',
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.8rem'
                  }}>
                    {step.number}
                  </span>
                </div>
                <h3 style={{ color: '#D4AF37', fontSize: '1.3rem', marginBottom: '0.5rem' }}>{step.title}</h3>
                <p style={{ color: '#aaa', margin: 0, lineHeight: 1.5 }}>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="cursos-layout">
          {/* Sidebar filtros */}
          <aside className="filtros-sidebar">
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
            {/* ... rest of sidebar content */}
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem' }}>
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
                      fontSize: '0.9rem'
                    }}
                  >
                    {cat === 'todas' ? 'Todas' : cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Grid de cursos */}
          <main className="cursos-grid">
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
                    minHeight: 'auto',
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
                  <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                    <img
                      src={curso.imagen}
                      alt={curso.titulo}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        left: 'auto',
                        background: 'rgba(0,0,0,0.8)',
                        color: '#F4D03F',
                        borderRadius: 8,
                        padding: '0.2rem 0.6rem',
                        fontWeight: 700,
                        fontFamily: 'Orbitron',
                        fontSize: '0.8rem',
                        border: '1px solid #F4D03F'
                      }}
                    >
                      {curso.nivel}
                    </span>
                  </div>
                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h2 style={{ fontFamily: 'Orbitron', color: '#D4AF37', fontSize: '1.2rem', margin: 0, lineHeight: 1.3 }}>
                      {curso.titulo}
                    </h2>
                    <p style={{ color: '#93C5FD', fontWeight: 600, margin: 0, fontSize: '0.9rem' }}>{curso.instructor}</p>
                    <p style={{ margin: 0, color: '#bbb', fontSize: '0.9rem', lineHeight: 1.5, flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {curso.descripcion}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#9CA3AF', marginTop: 'auto' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <i className="fas fa-clock" /> {curso.duracion}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <i className="fas fa-users" /> {curso.estudiantes}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', gap: '0.75rem' }}>
                      <span style={{ color: '#F4D03F', fontWeight: 700 }}>
                        ★ {curso.rating}
                      </span>
                      <Link
                        to={`/registro-curso/${curso.id}`}
                        className="primary-button"
                        style={{
                          fontSize: '0.9rem',
                          padding: '0.5rem 1rem',
                          borderRadius: 10,
                          fontWeight: 700,
                          textDecoration: 'none',
                          width: '100%',
                          textAlign: 'center'
                        }}
                      >
                        Ver Curso
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            )}
          </main>
        </div>
      </div>
    </>
  )
}

export default Cursos
