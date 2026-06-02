import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { cursosData, type Curso } from '../constants/cursosData'
import PageHero from '../components/PageHero'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBook,
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


const normalizeText = (text?: string) => {
  if (!text) return ''
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

const Cursos = () => {
  const [filtroNivel, setFiltroNivel] = useState<string>('todos')
  const [busqueda, setBusqueda] = useState('')
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('todas')

  const cursosFiltrados = useMemo(() => {
    const busquedaNorm = normalizeText(busqueda);
    return cursosData.filter((curso) => {
      const cumpleNivel = filtroNivel === 'todos' || curso.nivel?.toLowerCase() === filtroNivel
      const cumpleBusqueda =
        !busquedaNorm ||
        normalizeText(curso.titulo).includes(busquedaNorm) ||
        normalizeText(curso.descripcion).includes(busquedaNorm)
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
          width: 100%;
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        .cursos-toolbar {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
          margin-bottom: 1.5rem;
        }
        .cursos-toolbar__row {
          display: flex;
          gap: 0.6rem;
          align-items: center;
          flex-wrap: wrap;
        }
        .cursos-search {
          position: relative;
          flex: 1 1 240px;
          min-width: 200px;
        }
        .cursos-chips {
          display: flex;
          gap: 0.4rem;
          overflow-x: auto;
          padding: 2px 0;
          scrollbar-width: thin;
          -webkit-overflow-scrolling: touch;
        }
        .cursos-chips::-webkit-scrollbar { height: 4px; }
        .cursos-chips::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.3); border-radius: 4px; }
        .cursos-chip {
          flex-shrink: 0;
          padding: 0.4rem 0.85rem;
          border-radius: 999px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          font-family: inherit;
        }
        .cursos-chip--lvl {
          background: rgba(255,255,255,0.04);
          color: #cbd5e1;
          border: 1px solid rgba(212,175,55,0.18);
        }
        .cursos-chip--lvl.is-active {
          background: linear-gradient(135deg, #F4D03F, #D4AF37);
          color: #0a0a0a;
          border-color: #F4D03F;
        }
        .cursos-chip--cat {
          background: rgba(212,175,55,0.08);
          color: #D4AF37;
          border: 1px solid rgba(212,175,55,0.25);
        }
        .cursos-chip--cat.is-active {
          background: linear-gradient(135deg, #F4D03F, #D4AF37);
          color: #0a0a0a;
          border-color: #F4D03F;
        }
        .cursos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.25rem;
        }
        @media (max-width: 480px) {
          .cursos-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div style={{ padding: '0.5rem 0 3rem' }}>
        {/* ============================================================
            HERO
            ============================================================ */}
        <PageHero
          icon={faGraduationCap}
          iconColor="#a78bfa"
          iconGradient="linear-gradient(135deg, #a78bfa, #7c3aed)"
          eyebrow="Catálogo"
          title="Cursos CriptoUNAM"
          description={
            <>
              Aprende blockchain con contenido de la comunidad. Cada curso te da una{' '}
              <strong style={{ color: '#F4D03F' }}>credencial NFT soulbound</strong> on-chain.
            </>
          }
          accentRgba="rgba(124,58,237,0.1)"
          stats={[
            { icon: faBook, label: 'Cursos', value: totalCursos, color: '#a78bfa' },
            { icon: faGift, label: 'Gratis', value: cursosGratis, color: '#4ade80' },
            { icon: faCoins, label: 'En $PUMA', value: cursosPago, color: '#F4D03F' },
          ]}
          cta={{
            to: '/claim',
            label: 'Mis certificaciones',
            icon: faAward,
            variant: 'ghost',
          }}
        />

        {/* ============================================================
            FILTROS + GRID
            ============================================================ */}
        <div className="cursos-layout">
          {/* Toolbar de filtros — compacta y horizontal */}
          <div className="cursos-toolbar puma-fade-in-up">
            <div className="cursos-toolbar__row">
              <div className="cursos-search">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    fontSize: '0.85rem',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type="text"
                  placeholder="Buscar cursos…"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  aria-label="Buscar cursos"
                  className="puma-input"
                  style={{ paddingLeft: 40, marginBottom: 0, height: 40 }}
                />
              </div>
              <div className="cursos-chips" role="tablist" aria-label="Filtro por nivel">
                {NIVELES.map((nivel) => {
                  const active = filtroNivel === nivel
                  return (
                    <button
                      key={nivel}
                      type="button"
                      onClick={() => setFiltroNivel(nivel)}
                      aria-pressed={active}
                      className={`cursos-chip cursos-chip--lvl ${active ? 'is-active' : ''}`}
                    >
                      {nivel === 'todos'
                        ? 'Todos'
                        : nivel.charAt(0).toUpperCase() + nivel.slice(1)}
                    </button>
                  )
                })}
              </div>
              {(busqueda || filtroNivel !== 'todos' || categoriaSeleccionada !== 'todas') && (
                <button
                  type="button"
                  onClick={() => {
                    setBusqueda('')
                    setFiltroNivel('todos')
                    setCategoriaSeleccionada('todas')
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    whiteSpace: 'nowrap',
                    fontFamily: 'inherit',
                  }}
                >
                  Limpiar
                </button>
              )}
            </div>
            <div
              className="cursos-chips"
              role="tablist"
              aria-label="Filtro por categoría"
              style={{ paddingBottom: 2 }}
            >
              <FontAwesomeIcon
                icon={faFilter}
                style={{ color: '#94a3b8', fontSize: '0.78rem', marginRight: 4, alignSelf: 'center' }}
              />
              {CATEGORIAS_LIST.map((cat) => {
                const active = categoriaSeleccionada === cat
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoriaSeleccionada(cat)}
                    aria-pressed={active}
                    className={`cursos-chip cursos-chip--cat ${active ? 'is-active' : ''}`}
                  >
                    {cat === 'todas' ? 'Todas' : cat}
                  </button>
                )
              })}
            </div>
          </div>

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
                          {curso.precioPuma?.toLocaleString('en-US')} $PUMA
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
