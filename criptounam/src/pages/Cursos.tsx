import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { cursosData, type Curso } from '../constants/cursosData'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBook,
  faCode,
  faRocket,
  faGraduationCap,
  faClock,
  faUsers,
  faStar,
  faCoins,
  faAward,
  faArrowRight,
  faFilter,
  faMagnifyingGlass,
  faGift,
} from '@fortawesome/free-solid-svg-icons'
import '../styles/global.css'

const NIVELES = ['todos', 'principiante', 'intermedio', 'avanzado'] as const
const CATEGORIAS_LIST = [
  'todas',
  'Blockchain',
  'Ethereum',
  'L2',
  'Arbitrum',
  'Solana',
  'Avalanche',
  'Stellar',
  'Sui',
  'Soroban',
  'Subnets',
  'Rollups',
  'DeFi',
  'Smart Contracts',
  'Rust',
  'Move',
  'APIs',
  'Bitso',
  'Etherfuse',
  'Stablecoins',
  'CETES',
  'México',
  'Criptografía',
  'Seguridad',
  'Arquitectura',
  'Backend',
  'Indexers',
  'Oráculos',
  'Claude',
  'IA',
  'Anthropic',
  'Vibecoding',
  'Productividad',
  'Marketing',
  'Growth',
  'Comunidad',
  'Negocio',
  'Modelos de negocio',
  'Estrategia',
  'Tokenomics',
  'Economía',
  'Diseño',
  'UX',
  'Producto',
  'Figma',
  'Canva',
  'Tecnología',
  'Fundamentos',
  'Desarrollo',
  'Finanzas',
  'Trading',
]

const Cursos = () => {
  const [filtroNivel, setFiltroNivel] = useState<string>('todos')
  const [busqueda, setBusqueda] = useState('')
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('todas')

  const cursosFiltrados = useMemo(() => {
    return cursosData.filter((curso) => {
      const cumpleNivel = filtroNivel === 'todos' || curso.nivel?.toLowerCase() === filtroNivel
      const cumpleBusqueda =
        curso.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
        curso.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
      const cumpleCategoria =
        categoriaSeleccionada === 'todas' ||
        (curso.categorias && curso.categorias.some((c) => c.toLowerCase() === categoriaSeleccionada.toLowerCase()))
      return cumpleNivel && cumpleBusqueda && cumpleCategoria
    })
  }, [filtroNivel, busqueda, categoriaSeleccionada])

  const totalCursos = cursosData.length
  const cursosGratis = cursosData.filter((c) => !c.precioPuma || c.precioPuma === 0).length
  const cursosPago = totalCursos - cursosGratis

  const nivelGradient: Record<string, string> = {
    Principiante: 'linear-gradient(135deg, #4ade80, #16a34a)',
    Intermedio: 'linear-gradient(135deg, #f59e0b, #d97706)',
    Avanzado: 'linear-gradient(135deg, #ef4444, #b91c1c)',
  }

  return (
    <>
      <style>{`
        .cursos-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2rem;
          align-items: flex-start;
          width: 100%;
          max-width: 1300px;
          margin: 0 auto;
        }
        .filtros-sidebar {
          position: sticky;
          top: 90px;
          height: fit-content;
          z-index: 2;
        }
        .cursos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
          gap: 1.5rem;
        }
        @media (max-width: 880px) {
          .cursos-layout { grid-template-columns: 1fr; padding: 0 1rem; }
          .filtros-sidebar { position: relative; top: 0; }
          .cursos-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="section" style={{ minHeight: '100vh', paddingTop: '1.5rem' }}>
        {/* ============================================================
            HERO
            ============================================================ */}
        <header
          className="puma-hero-bg"
          style={{
            maxWidth: 1100,
            margin: '0 auto 2.5rem',
            padding: '2.5rem 1rem 1.5rem',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <div className="puma-hero-grid" />

          <div
            className="puma-pop-in"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: 18,
              background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
              boxShadow: '0 12px 30px rgba(124,58,237,0.4)',
              marginBottom: '1.25rem',
            }}
          >
            <FontAwesomeIcon icon={faGraduationCap} style={{ color: '#fff', fontSize: '1.7rem' }} />
          </div>

          <h1
            className="puma-title-glow puma-fade-in-up"
            style={{
              fontSize: 'clamp(2rem, 5.5vw, 3rem)',
              marginBottom: '0.75rem',
              lineHeight: 1.15,
            }}
          >
            Cursos CriptoUNAM
          </h1>
          <p
            className="puma-fade-in-up"
            style={{
              color: '#cbd5e1',
              fontSize: 'clamp(1rem, 2.5vw, 1.12rem)',
              maxWidth: 720,
              margin: '0 auto 1.25rem',
              lineHeight: 1.65,
              animationDelay: '120ms',
            }}
          >
            Aprende blockchain, smart contracts y DeFi con contenido creado por la comunidad. Al
            terminar cada curso obtienes una <strong style={{ color: '#F4D03F' }}>credencial NFT
            soulbound</strong> verificable on-chain.
          </p>

          <div
            className="puma-fade-in-up"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              justifyContent: 'center',
              animationDelay: '220ms',
            }}
          >
            <Link to="/recompensas" className="puma-btn puma-btn--gold">
              <FontAwesomeIcon icon={faGift} />
              Recompensas $PUMA
            </Link>
            <Link to="/claim" className="puma-btn puma-btn--ghost">
              <FontAwesomeIcon icon={faAward} />
              Mi colección NFT
            </Link>
          </div>
        </header>

        {/* ============================================================
            STATS
            ============================================================ */}
        <section
          className="puma-stagger"
          style={{
            maxWidth: 1100,
            margin: '0 auto 2.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
            gap: '1rem',
            padding: '0 1rem',
          }}
        >
          <div className="puma-stat" style={{ '--i': 0 } as React.CSSProperties}>
            <FontAwesomeIcon icon={faBook} className="puma-stat__icon" />
            <div className="puma-stat__label">Total cursos</div>
            <div className="puma-stat__value">{totalCursos}</div>
            <div className="puma-stat__hint">en el catálogo</div>
          </div>
          <div className="puma-stat" style={{ '--i': 1 } as React.CSSProperties}>
            <FontAwesomeIcon icon={faGift} className="puma-stat__icon" />
            <div className="puma-stat__label">Gratuitos</div>
            <div className="puma-stat__value">{cursosGratis}</div>
            <div className="puma-stat__hint">sólo firma de wallet</div>
          </div>
          <div className="puma-stat" style={{ '--i': 2 } as React.CSSProperties}>
            <FontAwesomeIcon icon={faCoins} className="puma-stat__icon" />
            <div className="puma-stat__label">En $PUMA</div>
            <div className="puma-stat__value">{cursosPago}</div>
            <div className="puma-stat__hint">pago con token</div>
          </div>
        </section>

        {/* ============================================================
            CAMINO DE APRENDIZAJE
            ============================================================ */}
        <section style={{ maxWidth: 1000, margin: '0 auto 3rem', padding: '0 1rem' }}>
          <h2
            className="puma-fade-in-up"
            style={{
              fontFamily: 'Orbitron',
              color: '#D4AF37',
              fontSize: 'clamp(1.3rem, 3.5vw, 1.6rem)',
              textAlign: 'center',
              marginBottom: '1.5rem',
            }}
          >
            Tu camino de aprendizaje
          </h2>
          <div
            className="puma-stagger"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
              gap: '1.25rem',
            }}
          >
            {[
              {
                number: 1,
                title: 'Fundamentos',
                description: 'Blockchain, Bitcoin, Ethereum y conceptos básicos',
                icon: faBook,
                gradient: 'linear-gradient(135deg, #4ecdc4, #2dd4bf)',
              },
              {
                number: 2,
                title: 'Desarrollo',
                description: 'Smart Contracts, DApps y desarrollo Web3',
                icon: faCode,
                gradient: 'linear-gradient(135deg, #F4D03F, #D4AF37)',
              },
              {
                number: 3,
                title: 'Especialización',
                description: 'DeFi, NFTs, DAOs y trading avanzado',
                icon: faRocket,
                gradient: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
              },
            ].map((step, i) => (
              <div
                key={i}
                className="puma-card puma-card--shimmer"
                style={
                  {
                    '--i': i,
                    textAlign: 'center',
                    padding: '1.5rem 1.25rem',
                  } as React.CSSProperties
                }
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: step.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    position: 'relative',
                    boxShadow: '0 10px 28px rgba(0,0,0,0.4)',
                  }}
                >
                  <FontAwesomeIcon icon={step.icon} style={{ color: '#fff', fontSize: '1.4rem' }} />
                  <span
                    style={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: '#0a0a0a',
                      color: '#F4D03F',
                      border: '2px solid #F4D03F',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      fontFamily: 'Orbitron',
                    }}
                  >
                    {step.number}
                  </span>
                </div>
                <h3
                  style={{
                    color: '#fff',
                    fontFamily: 'Orbitron',
                    fontSize: '1.1rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ color: '#94a3b8', margin: 0, lineHeight: 1.55, fontSize: '0.92rem' }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            FILTROS + GRID
            ============================================================ */}
        <div className="cursos-layout">
          <aside className="filtros-sidebar puma-fade-in-up">
            <div className="puma-card" style={{ padding: '1.25rem' }}>
              <h3
                style={{
                  fontFamily: 'Orbitron',
                  color: '#D4AF37',
                  fontSize: '0.95rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <FontAwesomeIcon icon={faFilter} />
                Filtros
              </h3>

              <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    fontSize: '0.85rem',
                  }}
                />
                <input
                  type="text"
                  placeholder="Buscar cursos…"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  aria-label="Buscar cursos"
                  className="puma-input"
                  style={{ paddingLeft: 36, marginBottom: 0 }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <h4
                  style={{
                    color: '#94a3b8',
                    fontSize: '0.78rem',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    marginBottom: '0.65rem',
                  }}
                >
                  Nivel
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {NIVELES.map((nivel) => {
                    const active = filtroNivel === nivel
                    return (
                      <button
                        key={nivel}
                        type="button"
                        onClick={() => setFiltroNivel(nivel)}
                        aria-pressed={active}
                        style={{
                          fontWeight: 600,
                          borderRadius: 10,
                          background: active
                            ? 'linear-gradient(135deg, #F4D03F, #D4AF37)'
                            : 'rgba(255,255,255,0.03)',
                          color: active ? '#0a0a0a' : '#cbd5e1',
                          border: `1px solid ${active ? '#F4D03F' : 'rgba(212,175,55,0.18)'}`,
                          padding: '0.5rem 0.85rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: '0.88rem',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {nivel === 'todos'
                          ? 'Todos los niveles'
                          : nivel.charAt(0).toUpperCase() + nivel.slice(1)}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <h4
                  style={{
                    color: '#94a3b8',
                    fontSize: '0.78rem',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    marginBottom: '0.65rem',
                  }}
                >
                  Categorías
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {CATEGORIAS_LIST.map((cat) => {
                    const active = categoriaSeleccionada === cat
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategoriaSeleccionada(cat)}
                        aria-pressed={active}
                        style={{
                          fontWeight: 600,
                          borderRadius: 999,
                          background: active
                            ? 'linear-gradient(135deg, #F4D03F, #D4AF37)'
                            : 'rgba(212,175,55,0.08)',
                          color: active ? '#0a0a0a' : '#D4AF37',
                          border: `1px solid ${active ? '#F4D03F' : 'rgba(212,175,55,0.25)'}`,
                          padding: '0.35rem 0.8rem',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {cat === 'todas' ? 'Todas' : cat}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </aside>

          <main className="cursos-grid puma-stagger">
            {cursosFiltrados.length === 0 ? (
              <div
                className="puma-card"
                style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '2.5rem 1.5rem',
                  color: '#94a3b8',
                }}
              >
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  style={{ fontSize: '2rem', color: '#D4AF37', marginBottom: '0.75rem' }}
                />
                <p style={{ margin: 0 }}>
                  No hay cursos que coincidan. Prueba cambiar nivel o categoría.
                </p>
              </div>
            ) : (
              cursosFiltrados.map((curso: Curso, idx) => {
                const tienePuma = !!curso.precioPuma && curso.precioPuma > 0
                return (
                  <article
                    key={curso.id}
                    className="puma-card puma-card--shimmer"
                    style={
                      {
                        '--i': idx,
                        padding: 0,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                      } as React.CSSProperties
                    }
                  >
                    <div style={{ position: 'relative', aspectRatio: '16 / 9', overflow: 'hidden' }}>
                      <img
                        src={curso.imagen}
                        alt={curso.titulo}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.4s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      />
                      {/* gradient overlay */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)',
                          pointerEvents: 'none',
                        }}
                      />
                      {/* level chip */}
                      <span
                        style={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          background: nivelGradient[curso.nivel] || nivelGradient.Principiante,
                          color: '#fff',
                          padding: '0.3rem 0.7rem',
                          borderRadius: 999,
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          fontFamily: 'Orbitron',
                          letterSpacing: 0.5,
                          boxShadow: '0 4px 14px rgba(0,0,0,0.45)',
                        }}
                      >
                        {curso.nivel}
                      </span>
                      {/* puma chip */}
                      {tienePuma && (
                        <span
                          style={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            background: 'linear-gradient(135deg, #F4D03F, #D4AF37)',
                            color: '#0a0a0a',
                            padding: '0.3rem 0.7rem',
                            borderRadius: 999,
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            fontFamily: 'Orbitron',
                            boxShadow: '0 4px 14px rgba(212,175,55,0.4)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <FontAwesomeIcon icon={faCoins} style={{ fontSize: '0.72rem' }} />
                          {curso.precioPuma} PUMA
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        padding: '1.1rem 1.15rem',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.6rem',
                      }}
                    >
                      <h2
                        style={{
                          fontFamily: 'Orbitron',
                          color: '#fff',
                          fontSize: '1.05rem',
                          margin: 0,
                          lineHeight: 1.3,
                        }}
                      >
                        {curso.titulo}
                      </h2>
                      <p
                        style={{
                          margin: 0,
                          color: '#94a3b8',
                          fontSize: '0.88rem',
                          lineHeight: 1.55,
                          flex: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {curso.descripcion}
                      </p>

                      {/* meta */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.85rem',
                          fontSize: '0.78rem',
                          color: '#94a3b8',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <FontAwesomeIcon icon={faClock} />
                          {curso.duracion}
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <FontAwesomeIcon icon={faUsers} />
                          {curso.estudiantes}
                        </span>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            color: '#F4D03F',
                            fontWeight: 600,
                          }}
                        >
                          <FontAwesomeIcon icon={faStar} />
                          {curso.rating}
                        </span>
                      </div>

                      {/* NFT chip */}
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                        <span className="puma-chip puma-chip--amber" style={{ fontSize: '0.7rem' }}>
                          <FontAwesomeIcon icon={faAward} />
                          NFT al completar
                        </span>
                      </div>

                      <Link
                        to={`/registro-curso/${curso.id}`}
                        className="puma-btn puma-btn--gold"
                        style={{
                          marginTop: '0.8rem',
                          width: '100%',
                          justifyContent: 'center',
                          padding: '0.65rem 1rem',
                          fontSize: '0.92rem',
                        }}
                      >
                        Ver curso
                        <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.72rem' }} />
                      </Link>
                    </div>
                  </article>
                )
              })
            )}
          </main>
        </div>
      </div>
    </>
  )
}

export default Cursos
