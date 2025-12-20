import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faCamera } from '@fortawesome/free-solid-svg-icons'
import SEOHead from '../components/SEOHead'
import '../styles/global.css'

const YearInReview: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = 18

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextSlide()
      } else if (e.key === 'ArrowLeft') {
        prevSlide()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const progress = ((currentSlide + 1) / totalSlides) * 100

  return (
    <>
      <SEOHead 
        title="CriptoUNAM Executive Recap 2024-2025"
        description="Resumen ejecutivo del año 2024-2025 de CriptoUNAM"
      />
      <div className="year-review-container">
        <style>{`
          :root {
            --unam-blue: #002B7A;
            --unam-gold: #D4AF37;
            --bg-dark: #0a0a0c;
            --card-bg: rgba(255, 255, 255, 0.03);
            --transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          }

          .year-review-container {
            background-color: var(--bg-dark);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            color: #fff;
            overflow: hidden;
            height: 100vh;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 9999;
          }

          .year-review-container * {
            box-sizing: border-box;
          }

          .presentation {
            width: 100vw;
            height: 100vh;
            position: relative;
          }

          .slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 60px;
            opacity: 0;
            pointer-events: none;
            transform: translateY(20px);
            transition: var(--transition);
            z-index: 1;
          }

          .slide.active {
            opacity: 1;
            pointer-events: all;
            transform: translateY(0);
            z-index: 10;
          }

          .slide-title {
            font-family: 'Urbanist', 'Orbitron', sans-serif;
            font-size: 56px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: -2px;
            margin-bottom: 20px;
            text-align: center;
            line-height: 1;
          }

          .slide-subtitle {
            font-size: 20px;
            color: var(--unam-gold);
            text-transform: uppercase;
            letter-spacing: 4px;
            margin-bottom: 40px;
            font-weight: 600;
          }

          .content-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            width: 100%;
            max-width: 1100px;
            align-items: center;
          }

          .card {
            background: var(--card-bg);
            border: 1px solid rgba(255,255,255,0.1);
            padding: 40px;
            border-radius: 24px;
            backdrop-filter: blur(10px);
          }

          .logo-main {
            height: 180px;
            margin-bottom: 30px;
            filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.3));
          }

          .floating-logo {
            position: absolute;
            top: 40px;
            left: 40px;
            height: 50px;
            z-index: 100;
            opacity: 0.6;
          }

          .month-badge {
            background: var(--unam-gold);
            color: #000;
            padding: 5px 15px;
            border-radius: 4px;
            font-weight: 900;
            font-size: 14px;
            margin-bottom: 15px;
            display: inline-block;
          }

          .stats-huge {
            font-size: 140px;
            font-weight: 900;
            color: var(--unam-gold);
            line-height: 1;
            font-family: 'Urbanist', 'Orbitron', sans-serif;
          }

          .project-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            width: 100%;
            max-width: 1200px;
          }

          .project-tile {
            background: rgba(255,255,255,0.05);
            padding: 25px;
            border-radius: 16px;
            border-top: 4px solid var(--unam-gold);
          }

          .project-tile h3 {
            font-size: 22px;
            margin-bottom: 10px;
            color: var(--unam-gold);
          }

          .project-tile p {
            font-size: 14px;
            opacity: 0.8;
            line-height: 1.4;
          }

          .team-section {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
            width: 100%;
            max-width: 1000px;
          }

          .team-member {
            text-align: center;
          }

          .team-member h4 {
            color: var(--unam-gold);
            font-size: 18px;
            margin-bottom: 5px;
          }

          .team-member p {
            font-size: 14px;
            opacity: 0.7;
          }

          .controls {
            position: absolute;
            bottom: 40px;
            display: flex;
            align-items: center;
            gap: 20px;
            z-index: 100;
          }

          .nav-btn {
            background: rgba(255,255,255,0.1);
            border: none;
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            transition: 0.3s;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .nav-btn:hover {
            background: var(--unam-gold);
            color: black;
          }

          .progress-bar {
            width: 300px;
            height: 4px;
            background: rgba(255,255,255,0.1);
            border-radius: 2px;
            position: relative;
          }

          .progress-fill {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            background: var(--unam-gold);
            transition: 0.3s;
          }

          .bg-glow {
            position: absolute;
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgba(0, 43, 122, 0.2) 0%, transparent 70%);
            border-radius: 50%;
            z-index: 0;
            pointer-events: none;
          }

          .image-placeholder {
            width: 100%;
            height: 350px;
            background: #111;
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border: 1px dashed rgba(255,255,255,0.2);
            color: rgba(255,255,255,0.3);
          }

          .image-placeholder svg {
            font-size: 48px;
            margin-bottom: 10px;
          }

          @media (max-width: 768px) {
            .slide {
              padding: 30px 20px;
            }

            .slide-title {
              font-size: 36px;
            }

            .content-grid {
              grid-template-columns: 1fr;
              gap: 20px;
            }

            .project-grid {
              grid-template-columns: 1fr;
            }

            .team-section {
              grid-template-columns: 1fr;
            }

            .stats-huge {
              font-size: 80px;
            }

            .progress-bar {
              width: 150px;
            }
          }
        `}</style>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;700;900&family=Inter:wght@300;400;600&display=swap" rel="stylesheet" />

        <img 
          src="/images/LogosCriptounamBlanco.svg" 
          className="floating-logo" 
          alt="CriptoUNAM" 
        />

        <div className="bg-glow" style={{ top: '-200px', left: '-200px' }}></div>
        <div className="bg-glow" style={{ bottom: '-200px', right: '-200px' }}></div>

        <div className="presentation">
          {/* SLIDE 1: PORTADA */}
          <div className={`slide ${currentSlide === 0 ? 'active' : ''}`}>
            <img 
              src="/images/LogosCriptounamBlanco.svg" 
              className="logo-main" 
              alt="CriptoUNAM" 
            />
            <h1 className="slide-title" style={{ fontSize: '90px' }}>
              YEAR IN <span style={{ color: 'var(--unam-gold)' }}>REVIEW</span>
            </h1>
            <p className="slide-subtitle">2024 — 2025 | Executive Summary</p>
            <p style={{ opacity: 0.6 }}>Presiona las flechas o usa el teclado para navegar</p>
          </div>

          {/* SLIDE 2: IMPACTO EN CIFRAS */}
          <div className={`slide ${currentSlide === 1 ? 'active' : ''}`}>
            <h2 className="slide-title">
              IMPACTO EN <span style={{ color: 'var(--unam-gold)' }}>CIFRAS</span>
            </h2>
            <div className="content-grid">
              <div style={{ textAlign: 'center' }}>
                <div className="stats-huge">$65K+</div>
                <p className="slide-subtitle">USD Generados en Premios</p>
              </div>
              <div className="card">
                <p style={{ marginBottom: '20px' }}><strong>7 Hackathons</strong> Atendidos</p>
                <p style={{ marginBottom: '20px' }}><strong>12 Tracks</strong> Ganados</p>
                <p style={{ marginBottom: '20px' }}><strong>+500 Miembros</strong> en la comunidad</p>
                <p><strong>100%</strong> de compromiso con la educación</p>
              </div>
            </div>
          </div>

          {/* SLIDES MENSUALES (3-14) */}
          <div className={`slide ${currentSlide === 2 ? 'active' : ''}`}>
            <div className="month-badge">ENERO</div>
            <h2 className="slide-title">
              Planeación <span style={{ color: 'var(--unam-gold)' }}>Estratégica</span>
            </h2>
            <div className="content-grid">
              <div className="card">
                <p>Definición del Roadmap Anual. Establecimiento de gobernanza interna y diseño de identidad visual para redes sociales.</p>
              </div>
              <div className="image-placeholder">
                <FontAwesomeIcon icon={faCamera} />
                <p>[Imagen: Planeación Q1]</p>
              </div>
            </div>
          </div>

          <div className={`slide ${currentSlide === 3 ? 'active' : ''}`}>
            <div className="month-badge">FEBRERO</div>
            <h2 className="slide-title">
              Lanzamiento <span style={{ color: 'var(--unam-gold)' }}>Educativo</span>
            </h2>
            <div className="content-grid">
              <div className="image-placeholder">
                <FontAwesomeIcon icon={faCamera} />
                <p>[Imagen: Lanzamiento Newsletter]</p>
              </div>
              <div className="card">
                <p>Lanzamiento oficial del Newsletter CriptoUNAM. Alcanzamos los primeros 200 suscriptores interesados en tecnología L2.</p>
              </div>
            </div>
          </div>

          <div className={`slide ${currentSlide === 4 ? 'active' : ''}`}>
            <div className="month-badge">MARZO</div>
            <h2 className="slide-title">
              Bitcoin Day <span style={{ color: 'var(--unam-gold)' }}>UNAM</span>
            </h2>
            <div className="content-grid">
              <div className="card">
                <p>Evento masivo en la Facultad de Ingeniería. Onboarding de más de 300 estudiantes a la red Ethereum.</p>
              </div>
              <div className="image-placeholder">
                <FontAwesomeIcon icon={faCamera} />
                <p>[Imagen: Auditorio Ingeniería]</p>
              </div>
            </div>
          </div>

          <div className={`slide ${currentSlide === 5 ? 'active' : ''}`}>
            <div className="month-badge">ABRIL</div>
            <h2 className="slide-title">
              Expansión <span style={{ color: 'var(--unam-gold)' }}>Interuniversitaria</span>
            </h2>
            <div className="content-grid">
              <div className="image-placeholder">
                <FontAwesomeIcon icon={faCamera} />
                <p>[Imagen: Alianzas ITAM/IPN]</p>
              </div>
              <div className="card">
                <p>Alianzas con ITAM e IPN. Participación como Community Partners en BlockchainCoin, liderando el diálogo académico.</p>
              </div>
            </div>
          </div>

          <div className={`slide ${currentSlide === 6 ? 'active' : ''}`}>
            <div className="month-badge">MAYO</div>
            <h2 className="slide-title">
              Base Batch <span style={{ color: 'var(--unam-gold)' }}>LatAm</span>
            </h2>
            <div className="content-grid">
              <div className="card">
                <p><strong>CampusCoin</strong> seleccionado como finalista. Además, celebramos el Bitcoin Pizza Day con una gran convocatoria en Ingeniería.</p>
              </div>
              <div className="image-placeholder">
                <FontAwesomeIcon icon={faCamera} />
                <p>[Imagen: Pizza Day / CampusCoin]</p>
              </div>
            </div>
          </div>

          <div className={`slide ${currentSlide === 7 ? 'active' : ''}`}>
            <div className="month-badge">JUNIO</div>
            <h2 className="slide-title">
              ETH <span style={{ color: 'var(--unam-gold)' }}>Mérida</span>
            </h2>
            <div className="content-grid">
              <div className="image-placeholder">
                <FontAwesomeIcon icon={faCamera} />
                <p>[Imagen: CriptoUNAM en Mérida]</p>
              </div>
              <div className="card">
                <p>Participación destacada en ETH Mérida. Networking con protocolos globales para traer recursos a la comunidad local.</p>
              </div>
            </div>
          </div>

          <div className={`slide ${currentSlide === 8 ? 'active' : ''}`}>
            <div className="month-badge">JULIO</div>
            <h2 className="slide-title">
              Summer <span style={{ color: 'var(--unam-gold)' }}>Builders</span>
            </h2>
            <div className="content-grid">
              <div className="card">
                <p>Mes de inmersión técnica intensiva en Rust y Solidity. Preparación de los equipos para la temporada de hackathons.</p>
              </div>
              <div className="image-placeholder">
                <FontAwesomeIcon icon={faCamera} />
                <p>[Imagen: Sesiones de Código]</p>
              </div>
            </div>
          </div>

          <div className={`slide ${currentSlide === 9 ? 'active' : ''}`}>
            <div className="month-badge">AGOSTO</div>
            <h2 className="slide-title">
              Bitso Win & <span style={{ color: 'var(--unam-gold)' }}>Unlock</span>
            </h2>
            <div className="content-grid">
              <div className="image-placeholder">
                <FontAwesomeIcon icon={faCamera} />
                <p>[Imagen: Ganadores Bitso / Unlock]</p>
              </div>
              <div className="card">
                <p>Ganadores del Bitso Hackathon con <strong>La Kiniela</strong>. Apoyo organizacional en Unlock Summit Zacatlán.</p>
              </div>
            </div>
          </div>

          <div className={`slide ${currentSlide === 10 ? 'active' : ''}`}>
            <div className="month-badge">SEPTIEMBRE</div>
            <h2 className="slide-title">
              Meridian <span style={{ color: 'var(--unam-gold)' }}>Rio</span>
            </h2>
            <div className="content-grid">
              <div className="card">
                <p>CriptoUNAM en Río de Janeiro para Stellar Meridian. Desarrollo de Soroswap en Telegram y semifinalistas en CoreDAO.</p>
              </div>
              <div className="image-placeholder">
                <FontAwesomeIcon icon={faCamera} />
                <p>[Imagen: Rio Meridian]</p>
              </div>
            </div>
          </div>

          <div className={`slide ${currentSlide === 11 ? 'active' : ''}`}>
            <div className="month-badge">OCTUBRE</div>
            <h2 className="slide-title">
              Starknet re&#123;solve&#125; & <span style={{ color: 'var(--unam-gold)' }}>Islas</span>
            </h2>
            <div className="content-grid">
              <div className="image-placeholder">
                <FontAwesomeIcon icon={faCamera} />
                <p>[Imagen: Feria Comunidades UNAM]</p>
              </div>
              <div className="card">
                <p>Ganadores Starknet re&#123;solve&#125; (NearMint). Impacto masivo en la Feria de Comunidades de la UNAM en Las Islas.</p>
              </div>
            </div>
          </div>

          <div className={`slide ${currentSlide === 12 ? 'active' : ''}`}>
            <div className="month-badge">NOVIEMBRE</div>
            <h2 className="slide-title">
              Hazaña en <span style={{ color: 'var(--unam-gold)' }}>Monterrey</span>
            </h2>
            <div className="content-grid">
              <div className="card">
                <p><strong>Verifica.xyz</strong> gana 3 Tracks en ETH México Monterrey. Gerry imparte taller de VibeCoding Sold-Out.</p>
              </div>
              <div className="image-placeholder">
                <FontAwesomeIcon icon={faCamera} />
                <p>[Imagen: Ganadores ETH MTY]</p>
              </div>
            </div>
          </div>

          <div className={`slide ${currentSlide === 13 ? 'active' : ''}`}>
            <div className="month-badge">DICIEMBRE</div>
            <h2 className="slide-title">
              Cierre & <span style={{ color: 'var(--unam-gold)' }}>Localism</span>
            </h2>
            <div className="content-grid">
              <div className="image-placeholder">
                <FontAwesomeIcon icon={faCamera} />
                <p>[Imagen: Recap Anual]</p>
              </div>
              <div className="card">
                <p>Recap anual y selección oficial para el Localism Fund. Preparación de la agenda de Mini-Hackathons 2026.</p>
              </div>
            </div>
          </div>

          {/* SLIDE 15: HALL OF FAME (PROYECTOS) */}
          <div className={`slide ${currentSlide === 14 ? 'active' : ''}`}>
            <h2 className="slide-title">
              HALL OF <span style={{ color: 'var(--unam-gold)' }}>FAME</span>
            </h2>
            <p className="slide-subtitle">Soluciones On-Chain de Alto Nivel</p>
            <div className="project-grid">
              <div className="project-tile">
                <h3>Verifica.xyz</h3>
                <p>Transparencia institucional con ENS. Ganador de 3 tracks en ETH México Monterrey.</p>
              </div>
              <div className="project-tile">
                <h3>La Kiniela</h3>
                <p>Predicciones descentralizadas en Arbitrum. Ganadores del Bitso Hackathon 2025.</p>
              </div>
              <div className="project-tile">
                <h3>NearMint</h3>
                <p>Protección de coleccionables físicos en Starknet. Ganador de Starknet re&#123;solve&#125;.</p>
              </div>
              <div className="project-tile">
                <h3>CampusCoin</h3>
                <p>Gestión de gastos académicos on-chain. Finalista en Base Batch LatAm.</p>
              </div>
              <div className="project-tile">
                <h3>UnBoX</h3>
                <p>Tokenización de streetwear y art toys en Solana. Pitched en Solana Founders House.</p>
              </div>
              <div className="project-tile">
                <h3>CoreWeave</h3>
                <p>Agentes inteligentes para lanzamiento de tokens. Semifinalistas en CoreDAO.</p>
              </div>
            </div>
          </div>

          {/* SLIDE 17: EL DREAM TEAM */}
          <div className={`slide ${currentSlide === 15 ? 'active' : ''}`}>
            <h2 className="slide-title">
              EL <span style={{ color: 'var(--unam-gold)' }}>DREAM TEAM</span>
            </h2>
            <div className="team-section">
              <div className="team-member">
                <h4>Fernanda Tello</h4>
                <p>Project Manager</p>
              </div>
              <div className="team-member">
                <h4>Adrián Armenta</h4>
                <p>CTO & Workshop Lead</p>
              </div>
              <div className="team-member">
                <h4>Andrés Rodríguez</h4>
                <p>Technical Lead</p>
              </div>
              <div className="team-member">
                <h4>Gerry</h4>
                <p>UI/UX & VibeCoding</p>
              </div>
              <div className="team-member">
                <h4>Ian & Elías</h4>
                <p>Smart Contract Builders</p>
              </div>
              <div className="team-member">
                <h4>Nayeli & Kubs</h4>
                <p>Operations & Logistics</p>
              </div>
            </div>
            <div className="card" style={{ marginTop: '40px', padding: '20px', fontSize: '16px', textAlign: 'center', borderColor: 'var(--unam-gold)' }}>
              Agradecimiento especial a Daniel y a todos los voluntarios que sudaron la camiseta.
            </div>
          </div>

          {/* SLIDE 18: VISIÓN 2026 */}
          <div className={`slide ${currentSlide === 16 ? 'active' : ''}`}>
            <h2 className="slide-title">
              MISIÓN <span style={{ color: 'var(--unam-gold)' }}>2026</span>
            </h2>
            <div className="content-grid">
              <div className="card">
                <h3 style={{ color: 'var(--unam-gold)', marginBottom: '15px' }}>Localism Fund</h3>
                <p>Escalaremos los Mini-Hackathons dentro de Ciudad Universitaria para que el talento local tenga incentivos de construcción directa.</p>
              </div>
              <div className="card">
                <h3 style={{ color: 'var(--unam-gold)', marginBottom: '15px' }}>Escalabilidad</h3>
                <p>Establecer el primer laboratorio físico de desarrollo Web3 en la Facultad de Ingeniería para incubar proyectos nativos UNAM.</p>
              </div>
            </div>
          </div>

          {/* SLIDE 19: GRACIAS */}
          <div className={`slide ${currentSlide === 17 ? 'active' : ''}`}>
            <h1 className="slide-title" style={{ fontSize: '100px' }}>GRACIAS</h1>
            <p className="slide-subtitle" style={{ color: 'white', fontSize: '24px' }}>
              ¡NOS VEMOS EN EL CÓDIGO!
            </p>
            <div style={{ display: 'flex', gap: '40px', marginTop: '50px', opacity: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
              <span>Arbitrum</span> • <span>Scroll</span> • <span>ENS</span> • <span>Eth 5 de Mayo</span> • <span>Frutero Club</span>
            </div>
          </div>

          {/* CONTROLES */}
          <div className="controls">
            <button className="nav-btn" onClick={prevSlide}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <button className="nav-btn" onClick={nextSlide}>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default YearInReview

