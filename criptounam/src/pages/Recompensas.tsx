import React from 'react'
import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'
import SEOHead from '../components/SEOHead'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGraduationCap,
  faCalendarCheck,
  faCoins,
  faGift,
  faClipboardList,
  faArrowRight,
  faAward,
  faBolt,
  faTrophy,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons'
import ENV_CONFIG from '../config/env'
import PageHero from '../components/PageHero'
import PumaMissionsSection from '../components/Puma/PumaMissionsSection'
import PumaPausedBanner from '../components/Puma/PumaPausedBanner'
import { usePumaMissionsList } from '../hooks/usePumaMissions'
import { usePumaTokenBalance } from '../hooks/usePumaTokenBalance'
import '../styles/global.css'

const Recompensas: React.FC = () => {
  const { address } = useAccount()

  const { data: missions = [], isLoading: loadingMissions, refetch: refetchMissions } =
    usePumaMissionsList()

  const {
    formatted: balanceFormatted,
    tokenConfigured,
    onExpectedChain,
    expectedChainId,
    isLoading: balanceLoading,
  } = usePumaTokenBalance()

  const activeMissions = missions.filter((m) => m.active && Number(m.deadline) * 1000 > Date.now()).length

  const saldoHero =
    !tokenConfigured || !address
      ? '—'
      : balanceLoading
        ? '…'
        : !onExpectedChain
          ? 'Red incorrecta'
          : balanceFormatted

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
        style={{
          padding: '0.5rem clamp(0.5rem, 3vw, 1rem) 3rem',
        }}
      >
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <PumaPausedBanner />
        </div>

        {/* ============================================================
            HERO
            ============================================================ */}
        <PageHero
          icon={faCoins}
          iconColor="#F4D03F"
          iconGradient="linear-gradient(135deg, #F4D03F, #D4AF37 70%, #8b6e1d)"
          eyebrow="Recompensas"
          title="$PUMA"
          description="Gánalo en misiones, talleres y trabajo con embajadores. Úsalo para inscribirte a cursos y unlocks especiales."
          accentRgba="rgba(212,175,55,0.1)"
          stats={[
            {
              icon: faCoins,
              label: 'Tu saldo PUMA',
              value: saldoHero,
              color: '#F4D03F',
            },
            {
              icon: faBolt,
              label: 'Activas',
              value: String(activeMissions),
              color: '#4ade80',
            },
            {
              icon: faTrophy,
              label: 'Totales',
              value: String(missions.length),
              color: '#a78bfa',
            },
          ]}
          cta={{
            to: '/recompensas/misiones',
            label: 'Misiones y código de sesión',
            icon: faClipboardList,
            variant: 'gold',
          }}
        />

        {address && tokenConfigured && !onExpectedChain && (
          <div
            className="puma-alert puma-alert--warn"
            style={{ maxWidth: 960, margin: '0 auto 1.25rem' }}
          >
            <FontAwesomeIcon icon={faTriangleExclamation} style={{ marginTop: 3 }} />
            <span>
              Cambia tu wallet a Avalanche (chain {expectedChainId}) para ver el saldo real de PUMA y
              reclamar. El contrato está en{' '}
              <code style={{ color: '#fde68a' }}>{ENV_CONFIG.EXPLORER_URL}</code>.
            </span>
          </div>
        )}

        {/* ============================================================
            MISIONES — carrusel horizontal
            ============================================================ */}
        <section style={{ maxWidth: 1100, margin: '0 auto 2.5rem', padding: '0 0.25rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: '0.75rem',
              marginBottom: '0.85rem',
              padding: '0 0.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <FontAwesomeIcon
                icon={faGift}
                style={{ fontSize: '1.1rem', color: '#F4D03F' }}
              />
              <h2
                style={{
                  fontFamily: 'Orbitron',
                  color: '#fff',
                  fontSize: 'clamp(1.05rem, 3vw, 1.3rem)',
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                Misiones disponibles
              </h2>
            </div>
            <Link
              to="/recompensas/misiones"
              style={{
                color: '#D4AF37',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                whiteSpace: 'nowrap',
              }}
            >
              Ver todas
              <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '0.7rem' }} />
            </Link>
          </div>
          <p
            style={{
              color: '#94a3b8',
              fontSize: '0.88rem',
              margin: '0 0.25rem 0.85rem',
              lineHeight: 1.5,
            }}
          >
            Desliza para ver más. Cada wallet reclama una sola vez por misión.
          </p>
          <PumaMissionsSection
            missions={missions.slice(0, 6)}
            isLoading={loadingMissions}
            onTxConfirmed={() => refetchMissions()}
            tone="embajador"
            layout="carousel"
          />
        </section>

        {/* ============================================================
            NAVEGACIÓN A OTRAS SECCIONES
            ============================================================ */}
        <section style={{ maxWidth: 720, margin: '0 auto', padding: '0 0.25rem' }}>
          <div
            style={{
              color: '#94a3b8',
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 10,
              paddingLeft: 4,
            }}
          >
            Ir a otra sección
          </div>
          <nav
            style={{
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 14,
              overflow: 'hidden',
              border: '1px solid rgba(212,175,55,0.18)',
              background: 'rgba(20,20,30,0.55)',
            }}
          >
            {[
              {
                icon: faAward,
                title: 'Reclamar NFTs',
                text: 'POAPs, certificados y badges',
                to: '/claim',
                color: '#a78bfa',
              },
              {
                icon: faGraduationCap,
                title: 'Cursos',
                text: 'Catálogo y rutas de aprendizaje',
                to: '/cursos',
                color: '#4ecdc4',
              },
              {
                icon: faCalendarCheck,
                title: 'Eventos',
                text: 'Encuentros presenciales y online',
                to: '/eventos',
                color: '#60a5fa',
              },
            ].map((item, idx, arr) => (
              <Link
                key={item.title}
                to={item.to}
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '0.95rem 1rem',
                  borderBottom:
                    idx < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  transition: 'background 0.18s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,175,55,0.06)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: `${item.color}1f`,
                    border: `1px solid ${item.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FontAwesomeIcon icon={item.icon} style={{ color: item.color, fontSize: '0.95rem' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.2 }}>
                    {item.title}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: 2 }}>{item.text}</div>
                </div>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  style={{ color: '#94a3b8', fontSize: '0.85rem', flexShrink: 0 }}
                />
              </Link>
            ))}
          </nav>
        </section>
      </div>
    </>
  )
}

export default Recompensas
