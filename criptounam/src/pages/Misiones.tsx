import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  useAccount,
  useChainId,
  useConfig,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { isAddress, parseEther, zeroAddress } from 'viem'
import SEOHead from '../components/SEOHead'
import PumaMissionsSection from '../components/Puma/PumaMissionsSection'
import PumaPausedBanner from '../components/Puma/PumaPausedBanner'
import PumaUserPanel from '../components/Puma/PumaUserPanel'
import ENV_CONFIG from '../config/env'
import { pumaTokenAbi } from '../constants/pumaTokenAbi'
import { PUMA_REWARD_MANAGER_ROLE } from '../constants/pumaRoles'
import { usePumaMissionsList, pumaTokenConfigured } from '../hooks/usePumaMissions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faCoins,
  faClipboardList,
  faBolt,
  faPaperPlane,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons'
import '../styles/global.css'

const tokenAddr = ENV_CONFIG.PUMA_TOKEN_ADDRESS as `0x${string}`

const Misiones: React.FC = () => {
  const { data: missions = [], isLoading, refetch } = usePumaMissionsList()
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const wagmiConfig = useConfig()
  const chain = wagmiConfig.chains.find((c) => c.id === chainId)

  const { data: hasRewardRole } = useReadContract({
    address: pumaTokenConfigured ? tokenAddr : undefined,
    abi: pumaTokenAbi,
    functionName: 'hasRole',
    args: address ? [PUMA_REWARD_MANAGER_ROLE, address] : undefined,
    query: { enabled: pumaTokenConfigured && !!address },
  })

  const [mintTo, setMintTo] = useState('')
  const [mintAmount, setMintAmount] = useState('50')
  const [mintReason, setMintReason] = useState('Recompensa CriptoUNAM')

  const { writeContract, data: txHash, isPending, error: mintError, reset } = useWriteContract()
  const { isLoading: confirmingMint, isSuccess: mintOk } = useWaitForTransactionReceipt({ hash: txHash })

  useEffect(() => {
    if (mintOk) reset()
  }, [mintOk, reset])

  const tokenOk = isAddress(tokenAddr) && tokenAddr !== zeroAddress
  const mintBusy = isPending || confirmingMint

  const submitMint = (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasRewardRole || !chain || !address || !isAddress(mintTo.trim())) return
    let amount: bigint
    try {
      amount = parseEther(mintAmount || '0')
    } catch {
      return
    }
    if (amount === 0n) return
    writeContract({
      address: tokenAddr,
      abi: pumaTokenAbi,
      functionName: 'mintReward',
      args: [mintTo.trim() as `0x${string}`, amount, mintReason.trim() || 'reward'],
      chain,
      account: address,
    })
  }

  const activeMissions = missions.filter(
    (m) => m.active && Number(m.deadline) * 1000 > Date.now()
  ).length

  return (
    <>
      <SEOHead
        title="Misiones PUMA - CriptoUNAM"
        description="Misiones PUMA CriptoUNAM: tu wallet, recompensas y reclamos en un solo lugar."
        image="/images/LogosCriptounam.svg"
        url="https://criptounam.xyz/recompensas/misiones"
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

        {/* breadcrumb */}
        <div style={{ maxWidth: 1100, margin: '0 auto 1rem' }} className="puma-fade-in">
          <Link to="/recompensas" className="puma-breadcrumb">
            <FontAwesomeIcon icon={faArrowLeft} />
            Recompensas
          </Link>
        </div>

        {/* ============================================================
            HERO
            ============================================================ */}
        <header
          className="puma-hero-bg"
          style={{
            maxWidth: 1100,
            margin: '0 auto 2rem',
            padding: '1.5rem 1rem 1rem',
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
              background: 'linear-gradient(135deg, #F4D03F, #D4AF37 70%, #b8962e)',
              boxShadow: '0 10px 30px rgba(212,175,55,0.4)',
              marginBottom: '1rem',
            }}
          >
            <FontAwesomeIcon icon={faClipboardList} style={{ color: '#0a0a0a', fontSize: '1.6rem' }} />
          </div>

          <h1
            className="puma-title-glow puma-fade-in-up"
            style={{
              fontSize: 'clamp(1.8rem, 5vw, 2.6rem)',
              marginBottom: '0.65rem',
              lineHeight: 1.2,
            }}
          >
            Misiones PUMA
          </h1>
          <p
            className="puma-fade-in-up"
            style={{
              color: '#cbd5e1',
              fontSize: 'clamp(0.98rem, 2.5vw, 1.1rem)',
              maxWidth: 720,
              margin: '0 auto',
              lineHeight: 1.65,
              animationDelay: '120ms',
            }}
          >
            Revisa tu progreso, reclama misiones activas y —si el equipo te dio rol— envía
            recompensas a otras wallets.
          </p>
        </header>

        {/* ============================================================
            STATS
            ============================================================ */}
        <section style={{ maxWidth: 1100, margin: '0 auto 1.5rem' }}>
          <div
            className="puma-stagger"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
              gap: '1rem',
            }}
          >
            <div className="puma-stat" style={{ '--i': 0 } as React.CSSProperties}>
              <FontAwesomeIcon icon={faBolt} className="puma-stat__icon" />
              <div className="puma-stat__label">Activas ahora</div>
              <div className="puma-stat__value">{activeMissions}</div>
              <div className="puma-stat__hint">Disponibles para reclamar</div>
            </div>
            <div className="puma-stat" style={{ '--i': 1 } as React.CSSProperties}>
              <FontAwesomeIcon icon={faClipboardList} className="puma-stat__icon" />
              <div className="puma-stat__label">Histórico</div>
              <div className="puma-stat__value">{missions.length}</div>
              <div className="puma-stat__hint">Misiones publicadas</div>
            </div>
            <div className="puma-stat" style={{ '--i': 2 } as React.CSSProperties}>
              <FontAwesomeIcon icon={faShieldHalved} className="puma-stat__icon" />
              <div className="puma-stat__label">Rol activo</div>
              <div className="puma-stat__value" style={{ fontSize: '1rem', textTransform: 'uppercase' }}>
                {hasRewardRole ? 'Reward Mgr' : isConnected ? 'Comunidad' : '—'}
              </div>
              <div className="puma-stat__hint">
                {hasRewardRole ? 'Puedes mintear recompensas' : 'Conecta tu wallet'}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            USER PANEL + GUIDE
            ============================================================ */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '1.25rem',
            maxWidth: 1100,
            margin: '0 auto 1.5rem',
            alignItems: 'start',
          }}
        >
          <div className="puma-fade-in-up">
            <PumaUserPanel />
          </div>
          <div className="puma-card puma-fade-in-up" style={{ animationDelay: '120ms' }}>
            <h3
              style={{
                color: '#fff',
                fontFamily: 'Orbitron',
                fontSize: '1.05rem',
                margin: '0 0 0.85rem',
              }}
            >
              Cómo usar esta página
            </h3>
            <ol
              style={{
                margin: 0,
                paddingLeft: '1.2rem',
                color: '#cbd5e1',
                lineHeight: 1.7,
                fontSize: '0.93rem',
              }}
            >
              <li style={{ marginBottom: '0.4rem' }}>
                <strong style={{ color: '#F4D03F' }}>Conecta</strong> tu wallet para ver saldo,
                nivel e historial.
              </li>
              <li style={{ marginBottom: '0.4rem' }}>
                <strong style={{ color: '#F4D03F' }}>Reclama</strong> cada misión activa una sola
                vez por wallet.
              </li>
              <li>
                Si tienes <code style={{ color: '#94a3b8' }}>REWARD_MANAGER_ROLE</code>, te aparece
                el formulario para enviar PUMA a otra wallet.
              </li>
            </ol>
          </div>
        </div>

        {/* ============================================================
            MINT BOX (solo con rol)
            ============================================================ */}
        {tokenOk && isConnected && hasRewardRole && (
          <div
            className="puma-card puma-card--rainbow puma-fade-in-up"
            style={{
              maxWidth: 1100,
              margin: '0 auto 1.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: '0.9rem',
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <FontAwesomeIcon icon={faCoins} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontFamily: 'Orbitron', color: '#fff', fontSize: '1.1rem', margin: 0 }}>
                  Enviar $PUMA (Reward Manager)
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>
                  Cada envío queda registrado on-chain con la nota que indiques.
                </p>
              </div>
            </div>
            <form onSubmit={submitMint}>
              <label className="puma-label">Wallet destino</label>
              <input
                className="puma-input"
                value={mintTo}
                onChange={(e) => setMintTo(e.target.value)}
                placeholder="0x…"
                style={{ marginBottom: '0.85rem' }}
              />
              <label className="puma-label">Cantidad (PUMA)</label>
              <input
                className="puma-input"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
                inputMode="decimal"
                style={{ marginBottom: '0.85rem' }}
              />
              <label className="puma-label">Nota (visible on-chain)</label>
              <input
                className="puma-input"
                value={mintReason}
                onChange={(e) => setMintReason(e.target.value)}
                style={{ marginBottom: '0.85rem' }}
              />
              <button type="submit" disabled={mintBusy} className="puma-btn puma-btn--blue">
                <FontAwesomeIcon icon={faPaperPlane} />
                {mintBusy ? 'Enviando…' : 'Enviar recompensa'}
              </button>
            </form>
            {mintError && (
              <p
                style={{
                  color: '#fca5a5',
                  fontSize: '0.88rem',
                  marginTop: '0.75rem',
                  wordBreak: 'break-word',
                }}
              >
                {mintError.message.slice(0, 260)}
              </p>
            )}
          </div>
        )}

        {/* ============================================================
            LISTA DE MISIONES
            ============================================================ */}
        <section
          className="puma-card puma-card--featured puma-fade-in-up"
          style={{
            maxWidth: 1100,
            margin: '0 auto',
          }}
        >
          <h2
            style={{
              fontFamily: 'Orbitron',
              color: '#fff',
              fontSize: 'clamp(1.1rem, 3.2vw, 1.4rem)',
              marginTop: 0,
              marginBottom: '0.65rem',
            }}
          >
            Misiones disponibles
          </h2>
          <p
            style={{
              color: '#94a3b8',
              lineHeight: 1.65,
              marginBottom: '1.25rem',
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
            }}
          >
            Las nuevas misiones aparecen cuando el equipo las publica. Si la red está en pausa, no
            podrás reclamar hasta que se levante.
          </p>
          {!pumaTokenConfigured && (
            <div className="puma-alert puma-alert--warn" style={{ marginBottom: '1rem' }}>
              <FontAwesomeIcon icon={faShieldHalved} style={{ marginTop: 3 }} />
              <span>En esta build aún no está enlazado el contrato PUMA.</span>
            </div>
          )}
          <PumaMissionsSection
            missions={missions}
            isLoading={isLoading}
            onTxConfirmed={() => refetch()}
            tone="embajador"
          />
        </section>
      </div>
    </>
  )
}

export default Misiones
