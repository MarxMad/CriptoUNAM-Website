import React, { useEffect, useState } from 'react'
import {
  useAccount,
  useChainId,
  useConfig,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { formatEther, parseEther } from 'viem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCoins,
  faCheck,
  faShieldHalved,
  faGraduationCap,
  faExternalLinkAlt,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons'
import ENV_CONFIG from '../../config/env'
import { pumaTokenAbi } from '../../constants/pumaTokenAbi'
import {
  PUMA_TOKEN_ADDRESS,
  pumaPaymentConfigured,
  usePumaAllowance,
  usePumaBalance,
} from '../../hooks/usePumaPayment'
import { useWallet } from '../../context/WalletContext'

const explorerBase = ENV_CONFIG.EXPLORER_URL || 'https://etherscan.io'
const paymentEndpoint = ENV_CONFIG.COURSE_PAYMENT_ENDPOINT

type ConfirmStatus =
  | { state: 'idle' }
  | { state: 'submitting' }
  | { state: 'done'; txHash?: `0x${string}` }
  | { state: 'failed'; message: string }

type Props = {
  cursoId: string
  cursoTitulo: string
  precioPuma: number
  isBusy?: boolean
  /** Se llama cuando el pago queda confirmado y se puede continuar con la inscripción. */
  onPaid: () => Promise<void> | void
}

const CoursePumaPayment: React.FC<Props> = ({
  cursoId,
  cursoTitulo,
  precioPuma,
  isBusy,
  onPaid,
}) => {
  const { isConnected, connectWallet } = useWallet()
  const { address } = useAccount()
  const chainId = useChainId()
  const wagmiConfig = useConfig()
  const chain = wagmiConfig.chains.find((c) => c.id === chainId)

  const precioWei = parseEther(String(precioPuma))

  const { data: allowance = 0n, refetch: refetchAllowance } = usePumaAllowance(address)
  const { data: balance = 0n, refetch: refetchBalance } = usePumaBalance(address)

  const allowanceBig = allowance as bigint
  const balanceBig = balance as bigint
  const enoughAllowance = allowanceBig >= precioWei
  const enoughBalance = balanceBig >= precioWei

  const { writeContract, data: txHash, isPending, error: writeError, reset } = useWriteContract()
  const { isLoading: confirming, isSuccess: txOk } = useWaitForTransactionReceipt({ hash: txHash })

  const [confirm, setConfirm] = useState<ConfirmStatus>({ state: 'idle' })

  useEffect(() => {
    if (txOk) {
      refetchAllowance()
      refetchBalance()
      reset()
    }
  }, [txOk, refetchAllowance, refetchBalance, reset])

  const approve = () => {
    if (!chain || !address) return
    writeContract({
      address: PUMA_TOKEN_ADDRESS,
      abi: pumaTokenAbi,
      functionName: 'approve',
      args: [PUMA_TOKEN_ADDRESS, precioWei],
      chain,
      account: address,
    })
  }

  const requestPaymentConfirmation = async () => {
    if (!address) return
    if (!paymentEndpoint) {
      // Sin backend configurado, asumimos pago manual por staff
      setConfirm({
        state: 'failed',
        message:
          'Aún no configuramos el confirmador automático. Comparte tu wallet con el equipo para que registren el pago.',
      })
      return
    }
    setConfirm({ state: 'submitting' })
    try {
      const res = await fetch(paymentEndpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          wallet: address,
          cursoId,
          amount: precioPuma,
          reason: `Pago curso ${cursoId}`,
        }),
      })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || `Error ${res.status}`)
      }
      const data = (await res.json()) as { txHash?: `0x${string}` }
      setConfirm({ state: 'done', txHash: data.txHash })
      refetchAllowance()
      refetchBalance()
      await onPaid()
    } catch (err) {
      setConfirm({
        state: 'failed',
        message: err instanceof Error ? err.message : 'No pudimos confirmar el pago.',
      })
    }
  }

  /* ============================================================ */
  if (!pumaPaymentConfigured) {
    return (
      <div className="puma-alert puma-alert--warn">
        <FontAwesomeIcon icon={faShieldHalved} style={{ marginTop: 3 }} />
        <span>
          Este curso cuesta {precioPuma} $PUMA, pero el contrato del token aún no está enlazado en
          esta red.
        </span>
      </div>
    )
  }

  return (
    <div
      className="puma-card puma-card--featured puma-card--shimmer puma-fade-in-up"
      style={{ maxWidth: 520, margin: '0 auto', textAlign: 'left' }}
    >
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
              fontSize: 'clamp(1.05rem, 3vw, 1.2rem)',
              margin: 0,
            }}
          >
            Inscripción con $PUMA
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>
            {cursoTitulo}
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.85rem',
          marginBottom: '1.1rem',
        }}
      >
        <div
          style={{
            background: 'rgba(0,0,0,0.35)',
            padding: '0.75rem 0.9rem',
            borderRadius: 12,
            border: '1px solid rgba(212,175,55,0.2)',
          }}
        >
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>
            Precio
          </div>
          <div
            style={{
              color: '#F4D03F',
              fontFamily: 'Orbitron',
              fontSize: '1.25rem',
              fontWeight: 700,
              marginTop: 4,
            }}
          >
            {precioPuma} PUMA
          </div>
        </div>
        <div
          style={{
            background: 'rgba(0,0,0,0.35)',
            padding: '0.75rem 0.9rem',
            borderRadius: 12,
            border: '1px solid rgba(212,175,55,0.2)',
          }}
        >
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>
            Tu saldo
          </div>
          <div
            style={{
              color: enoughBalance ? '#86efac' : '#fca5a5',
              fontFamily: 'Orbitron',
              fontSize: '1.25rem',
              fontWeight: 700,
              marginTop: 4,
            }}
          >
            {address ? Number(formatEther(balanceBig)).toFixed(2) : '—'}
          </div>
        </div>
      </div>

      {!isConnected && (
        <>
          <p style={{ color: '#cbd5e1', lineHeight: 1.55, marginBottom: '1rem' }}>
            Conecta tu wallet para pagar con $PUMA.
          </p>
          <button type="button" className="puma-btn puma-btn--gold" onClick={() => connectWallet()}>
            <FontAwesomeIcon icon={faWandMagicSparkles} />
            Conectar wallet
          </button>
        </>
      )}

      {isConnected && !enoughBalance && (
        <div className="puma-alert puma-alert--warn" style={{ marginBottom: '0.85rem' }}>
          <FontAwesomeIcon icon={faShieldHalved} style={{ marginTop: 3 }} />
          <span>
            Te faltan {(precioPuma - Number(formatEther(balanceBig))).toFixed(2)} PUMA. Reclama
            misiones o pide a un embajador que te apoye.
          </span>
        </div>
      )}

      {isConnected && enoughBalance && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* Step 1 — approve */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '0.85rem 1rem',
              borderRadius: 12,
              border: '1px solid',
              borderColor: enoughAllowance ? 'rgba(74,222,128,0.45)' : 'rgba(212,175,55,0.35)',
              background: enoughAllowance
                ? 'rgba(20,83,45,0.18)'
                : 'rgba(212,175,55,0.06)',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: enoughAllowance ? '#4ade80' : 'rgba(212,175,55,0.4)',
                color: '#0a0a0a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {enoughAllowance ? <FontAwesomeIcon icon={faCheck} /> : '1'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>
                Autoriza al contrato PUMA
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.45 }}>
                {enoughAllowance
                  ? `Autorizado: ${Number(formatEther(allowanceBig)).toFixed(2)} PUMA`
                  : 'Firma una transacción approve() — gratis si tu red tiene fees bajas.'}
              </div>
            </div>
            {!enoughAllowance && (
              <button
                type="button"
                className="puma-btn puma-btn--gold"
                onClick={approve}
                disabled={isPending || confirming || isBusy}
                style={{ padding: '0.55rem 1rem', fontSize: '0.88rem', whiteSpace: 'nowrap' }}
              >
                {isPending || confirming ? 'Firmando…' : 'Aprobar'}
              </button>
            )}
          </div>

          {/* Step 2 — confirm payment */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '0.85rem 1rem',
              borderRadius: 12,
              border: '1px solid',
              borderColor:
                confirm.state === 'done'
                  ? 'rgba(74,222,128,0.45)'
                  : enoughAllowance
                  ? 'rgba(96,165,250,0.45)'
                  : 'rgba(120,120,120,0.3)',
              background:
                confirm.state === 'done'
                  ? 'rgba(20,83,45,0.18)'
                  : enoughAllowance
                  ? 'rgba(37,99,235,0.12)'
                  : 'rgba(0,0,0,0.25)',
              opacity: enoughAllowance ? 1 : 0.55,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background:
                  confirm.state === 'done' ? '#4ade80' : enoughAllowance ? '#60a5fa' : '#555',
                color: '#0a0a0a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {confirm.state === 'done' ? <FontAwesomeIcon icon={faCheck} /> : '2'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>
                Confirma el pago
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.45 }}>
                {confirm.state === 'done'
                  ? 'Pago confirmado en cadena.'
                  : 'El equipo ejecuta burnReward() y queda como pago registrado.'}
              </div>
            </div>
            {enoughAllowance && confirm.state !== 'done' && (
              <button
                type="button"
                className="puma-btn puma-btn--blue"
                onClick={requestPaymentConfirmation}
                disabled={confirm.state === 'submitting' || isBusy}
                style={{ padding: '0.55rem 1rem', fontSize: '0.88rem', whiteSpace: 'nowrap' }}
              >
                <FontAwesomeIcon icon={faCoins} />
                {confirm.state === 'submitting' ? 'Procesando…' : 'Pagar'}
              </button>
            )}
          </div>

          {confirm.state === 'done' && (
            <div
              className="puma-alert puma-alert--success puma-pop-in"
              style={{ flexDirection: 'column', alignItems: 'flex-start' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <FontAwesomeIcon icon={faGraduationCap} style={{ marginTop: 3 }} />
                <strong>¡Inscripción pagada con $PUMA!</strong>
              </div>
              {confirm.txHash && (
                <a
                  href={`${explorerBase}/tx/${confirm.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    color: '#86efac',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    marginTop: '0.4rem',
                  }}
                >
                  Ver transacción
                  <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: '0.72rem' }} />
                </a>
              )}
            </div>
          )}

          {confirm.state === 'failed' && (
            <div className="puma-alert puma-alert--error">
              <FontAwesomeIcon icon={faShieldHalved} style={{ marginTop: 3 }} />
              <span style={{ wordBreak: 'break-word' }}>{confirm.message}</span>
            </div>
          )}

          {writeError && (
            <div className="puma-alert puma-alert--error">
              <span style={{ wordBreak: 'break-word' }}>{writeError.message.slice(0, 220)}</span>
            </div>
          )}
        </div>
      )}

      <p style={{ color: '#777', fontSize: '0.78rem', marginTop: '1rem', marginBottom: 0, lineHeight: 1.5 }}>
        El flujo usa <code>approve()</code> + <code>burnReward()</code>: tu PUMA se quema como pago
        del curso. La inscripción queda activa después de la confirmación.
      </p>
    </div>
  )
}

export default CoursePumaPayment
