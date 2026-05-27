import React from 'react'
import { Link } from 'react-router-dom'
import { useAccount, useBalance } from 'wagmi'
import { isAddress, formatEther, zeroAddress } from 'viem'
import SEOHead from '../components/SEOHead'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGraduationCap,
  faCalendarCheck,
  faCoins,
  faGift,
  faClipboardList,
  faArrowRight,
  faUserGear,
  faWandMagicSparkles,
  faAward,
  faBolt,
  faTrophy,
} from '@fortawesome/free-solid-svg-icons'
import { useWallet } from '../context/WalletContext'
import { useAdmin } from '../hooks/useAdmin'
import ENV_CONFIG from '../config/env'
import PumaMissionsSection from '../components/Puma/PumaMissionsSection'
import PumaPausedBanner from '../components/Puma/PumaPausedBanner'
import { usePumaMissionsList, pumaTokenConfigured } from '../hooks/usePumaMissions'
import '../styles/global.css'

const tokenAddr = ENV_CONFIG.PUMA_TOKEN_ADDRESS as `0x${string}`
const tokenConfigured = isAddress(tokenAddr) && tokenAddr !== zeroAddress

const Recompensas: React.FC = () => {
  const { isConnected, walletAddress, connectWallet } = useWallet()
  const { address } = useAccount()
  const { isAdmin: showEquipoLink } = useAdmin()

  const { data: missions = [], isLoading: loadingMissions, refetch: refetchMissions } =
    usePumaMissionsList()

  const { data: balanceWei } = useBalance({
    address,
    token: tokenConfigured ? tokenAddr : undefined,
    query: { enabled: tokenConfigured && !!address },
  })

  const balanceFormatted = balanceWei ? Number(formatEther(balanceWei.value)).toFixed(2) : '0.00'
  const activeMissions = missions.filter((m) => m.active && Number(m.deadline) * 1000 > Date.now()).length

  return (
    <>
      <SEOHead
        title="Recompensas - CriptoUNAM"
        description="PUMA y recompensas CriptoUNAM: misiones, cursos y eventos."
        image="/images/LogosCriptounam.svg"
        url="https://criptounam.xyz/recompensas"
        type="website"
      />

      <div
        className="section"
        style={{
          minHeight: '100vh',
          paddingTop: '1.5rem',
          paddingBottom: '4rem',
          paddingLeft: 'clamp(0.75rem, 4vw, 1.25rem)',
          paddingRight: 'clamp(0.75rem, 4vw, 1.25rem)',
        }}
      >
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <PumaPausedBanner />
        </div>

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
            style={{ display: 'inline-flex', marginBottom: '1.25rem' }}
          >
            <div className="puma-coin puma-coin--lg puma-pulse-ring">P</div>
          </div>

          <h1
            className="puma-title-glow puma-fade-in-up"
            style={{
              fontSize: 'clamp(2rem, 5.5vw, 3rem)',
              marginBottom: '0.75rem',
              lineHeight: 1.15,
            }}
          >
            Recompensas $PUMA
          </h1>
          <p
            className="puma-fade-in-up"
            style={{
              color: '#cbd5e1',
              fontSize: 'clamp(1rem, 2.5vw, 1.12rem)',
              maxWidth: 720,
              margin: '0 auto 1.5rem',
              lineHeight: 1.65,
              animationDelay: '120ms',
            }}
          >
            Token de reconocimiento de la comunidad. Lo ganas con misiones, talleres y el trabajo con
            los embajadores, y lo usas para inscribirte a cursos y unlocks especiales.
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
            <Link to="/recompensas/misiones" className="puma-btn puma-btn--gold">
              <FontAwesomeIcon icon={faClipboardList} />
              Ver misiones
            </Link>
            <Link to="/claim" className="puma-btn puma-btn--ghost">
              <FontAwesomeIcon icon={faAward} />
              Reclamar NFTs
            </Link>
          </div>
        </header>

        {/* ============================================================
            STATS
            ============================================================ */}
        <section
          style={{ maxWidth: 1100, margin: '0 auto 2rem' }}
          className="puma-stagger"
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
              gap: '1rem',
            }}
          >
            <div className="puma-stat" style={{ '--i': 0 } as React.CSSProperties}>
              <FontAwesomeIcon icon={faCoins} className="puma-stat__icon" />
              <div className="puma-stat__label">Tu saldo</div>
              <div className="puma-stat__value">
                {tokenConfigured && address ? balanceFormatted : '—'}
              </div>
              <div className="puma-stat__hint">PUMA disponibles</div>
            </div>

            <div className="puma-stat" style={{ '--i': 1 } as React.CSSProperties}>
              <FontAwesomeIcon icon={faBolt} className="puma-stat__icon" />
              <div className="puma-stat__label">Misiones activas</div>
              <div className="puma-stat__value">{activeMissions}</div>
              <div className="puma-stat__hint">Reclama antes del deadline</div>
            </div>

            <div className="puma-stat" style={{ '--i': 2 } as React.CSSProperties}>
              <FontAwesomeIcon icon={faTrophy} className="puma-stat__icon" />
              <div className="puma-stat__label">Misiones totales</div>
              <div className="puma-stat__value">{missions.length}</div>
              <div className="puma-stat__hint">Históricas en el contrato</div>
            </div>
          </div>
        </section>

        {/* ============================================================
            TU WALLET
            ============================================================ */}
        <section style={{ maxWidth: 900, margin: '0 auto 2rem' }}>
          <div className="puma-card puma-card--featured puma-fade-in-up">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginBottom: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <div className="puma-coin">PU</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2
                  style={{
                    fontFamily: 'Orbitron',
                    color: '#fff',
                    fontSize: 'clamp(1.05rem, 3vw, 1.25rem)',
                    margin: 0,
                  }}
                >
                  Tu wallet PUMA
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '0.2rem 0 0' }}>
                  Conecta para ver saldo y reclamar recompensas
                </p>
              </div>
            </div>

            {isConnected && walletAddress ? (
              <p
                style={{
                  color: '#cbd5e1',
                  margin: 0,
                  wordBreak: 'break-all',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  background: 'rgba(0,0,0,0.35)',
                  padding: '0.75rem 0.9rem',
                  borderRadius: 12,
                  border: '1px solid rgba(212,175,55,0.18)',
                }}
              >
                {walletAddress}
              </p>
            ) : (
              <>
                <p style={{ color: '#aaa', marginBottom: '1rem', lineHeight: 1.55 }}>
                  Conecta tu wallet para ver tu saldo de $PUMA y participar en misiones.
                </p>
                <button
                  type="button"
                  className="puma-btn puma-btn--gold"
                  onClick={() => connectWallet()}
                >
                  <FontAwesomeIcon icon={faWandMagicSparkles} />
                  Conectar wallet
                </button>
              </>
            )}

            {pumaTokenConfigured && address && balanceWei && (
              <p
                style={{
                  color: '#F4D03F',
                  marginTop: '1.1rem',
                  marginBottom: 0,
                  fontSize: '1.1rem',
                  fontFamily: 'Orbitron',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <FontAwesomeIcon icon={faCoins} />
                {balanceFormatted} PUMA
              </p>
            )}
            {!pumaTokenConfigured && (
              <p style={{ color: '#888', marginTop: '1rem', marginBottom: 0, fontSize: '0.9rem' }}>
                Pronto conectaremos el contrato en esta red.
              </p>
            )}
            {pumaTokenConfigured && showEquipoLink && (
              <p style={{ marginTop: '1.1rem', marginBottom: 0 }}>
                <Link
                  to="/admin/puma"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    color: '#94a3b8',
                    fontWeight: 600,
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                  }}
                >
                  <FontAwesomeIcon icon={faUserGear} />
                  Acceso equipo (administración PUMA)
                </Link>
              </p>
            )}
          </div>
        </section>

        {/* ============================================================
            MISIONES RÁPIDAS
            ============================================================ */}
        <section style={{ maxWidth: 1000, margin: '0 auto 2.5rem' }}>
          <div className="puma-card puma-card--featured puma-card--shimmer puma-fade-in-up">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <FontAwesomeIcon
                icon={faGift}
                style={{ fontSize: 'clamp(1.35rem, 4vw, 1.75rem)', color: '#D4AF37' }}
              />
              <h2
                style={{
                  fontFamily: 'Orbitron',
                  color: '#fff',
                  fontSize: 'clamp(1.1rem, 3.2vw, 1.4rem)',
                  margin: 0,
                  flex: 1,
                  minWidth: 0,
                }}
              >
                Misiones disponibles
              </h2>
              <Link
                to="/recompensas/misiones"
                className="puma-chip puma-chip--gold"
                style={{ textDecoration: 'none' }}
              >
                Ver todas
                <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.7rem' }} />
              </Link>
            </div>
            <p
              style={{
                color: '#94a3b8',
                lineHeight: 1.65,
                marginBottom: '1.25rem',
                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
              }}
            >
              Reclama tu PUMA por sesiones de embajadores, talleres y misiones académicas. Cada
              wallet reclama una sola vez por misión.
            </p>
            <PumaMissionsSection
              missions={missions.slice(0, 3)}
              isLoading={loadingMissions}
              onTxConfirmed={() => refetchMissions()}
              tone="embajador"
            />
          </div>
        </section>

        {/* ============================================================
            ATAJOS DEL ECOSISTEMA
            ============================================================ */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 0.25rem' }}>
          <h2
            className="puma-fade-in-up"
            style={{
              fontFamily: 'Orbitron',
              color: '#D4AF37',
              fontSize: 'clamp(1.2rem, 3.5vw, 1.5rem)',
              textAlign: 'center',
              marginBottom: '1.5rem',
            }}
          >
            Más del ecosistema
          </h2>
          <div
            className="puma-stagger"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))',
              gap: '1.1rem',
            }}
          >
            {[
              {
                icon: faAward,
                title: 'Reclamar NFTs',
                text: 'POAPs, certificados de cursos y badges de embajadores.',
                to: '/claim',
                gradient: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
              },
              {
                icon: faGraduationCap,
                title: 'Cursos',
                text: 'Certificados y rutas de aprendizaje en la comunidad.',
                to: '/cursos',
                gradient: 'linear-gradient(135deg, #4ecdc4, #2dd4bf)',
              },
              {
                icon: faCalendarCheck,
                title: 'Eventos',
                text: 'Encuentros presenciales y en línea.',
                to: '/eventos',
                gradient: 'linear-gradient(135deg, #60a5fa, #2563eb)',
              },
            ].map((item, idx) => (
              <Link
                key={item.title}
                to={item.to}
                className="puma-card puma-card--shimmer"
                style={
                  {
                    textDecoration: 'none',
                    display: 'block',
                    '--i': idx,
                  } as React.CSSProperties
                }
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: item.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.85rem',
                    boxShadow: '0 8px 22px rgba(0,0,0,0.4)',
                  }}
                >
                  <FontAwesomeIcon icon={item.icon} style={{ color: '#fff', fontSize: '1.35rem' }} />
                </div>
                <h3 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '0.45rem' }}>{item.title}</h3>
                <p style={{ color: '#94a3b8', margin: 0, lineHeight: 1.55, fontSize: '0.9rem' }}>
                  {item.text}
                </p>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    color: '#D4AF37',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    marginTop: '0.85rem',
                  }}
                >
                  Ir
                  <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.7rem' }} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

export default Recompensas
