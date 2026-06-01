import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFaucetDrip, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import ENV_CONFIG from '../../config/env'

/**
 * Botón al faucet de gas gratis. Solo tiene sentido en testnet: si la app está
 * configurada en Fuji (43113) enlaza al faucet oficial de Avalanche; en mainnet
 * no se renderiza (no hay faucet de AVAX real).
 */
const FAUCETS: Record<number, { label: string; url: string }> = {
  43113: { label: 'Faucet Avalanche Fuji', url: 'https://faucet.avax.network/' },
}

type Props = {
  /** Texto compacto (solo ícono + label corta) para barras estrechas. */
  compact?: boolean
  style?: React.CSSProperties
}

const FaucetButton: React.FC<Props> = ({ compact = false, style }) => {
  const faucet = FAUCETS[ENV_CONFIG.CHAIN_ID]
  if (!faucet) return null

  return (
    <a
      href={faucet.url}
      target="_blank"
      rel="noreferrer"
      className="puma-btn puma-btn--ghost"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'center',
        textDecoration: 'none',
        ...style,
      }}
      title="Consigue AVAX de prueba gratis para pagar el gas en Fuji"
    >
      <FontAwesomeIcon icon={faFaucetDrip} />
      {compact ? 'Gas gratis' : 'Conseguir AVAX gratis (gas)'}
      <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: '0.7rem', opacity: 0.8 }} />
    </a>
  )
}

export default FaucetButton
