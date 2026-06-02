import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus, faCheck } from '@fortawesome/free-solid-svg-icons'
import { useAddPumaToWallet } from '../../hooks/useAddPumaToWallet'

type Props = {
  compact?: boolean
  disabled?: boolean
  style?: React.CSSProperties
  className?: string
}

/**
 * Abre el popup de la wallet para importar $PUMA (ERC-20 en la red configurada).
 */
const AddPumaToWalletButton: React.FC<Props> = ({
  compact = false,
  disabled = false,
  style,
  className = 'puma-btn puma-btn--ghost',
}) => {
  const { addToken, status, errorMessage, tokenConfigured } = useAddPumaToWallet()

  if (!tokenConfigured) return null

  const busy = status === 'pending'
  const done = status === 'success'

  const label = done
    ? 'PUMA agregado'
    : busy
      ? 'Abriendo wallet…'
      : compact
        ? 'Agregar $PUMA'
        : 'Agregar $PUMA a la wallet'

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
      <button
        type="button"
        className={className}
        disabled={disabled || busy || done}
        onClick={() => void addToken()}
        title="Importa el token PUMA en MetaMask, Rabby u otra wallet compatible"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          justifyContent: 'center',
          ...style,
        }}
      >
        <FontAwesomeIcon icon={done ? faCheck : faCirclePlus} />
        {label}
      </button>
      {errorMessage && status === 'error' && (
        <span style={{ color: '#f87171', fontSize: '0.78rem', lineHeight: 1.35 }}>{errorMessage}</span>
      )}
    </div>
  )
}

export default AddPumaToWalletButton
