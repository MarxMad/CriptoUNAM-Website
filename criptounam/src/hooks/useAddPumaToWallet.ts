import { useCallback, useState } from 'react'
import ENV_CONFIG from '../config/env'
import { pumaTokenConfigured } from './usePumaMissions'
import { useEnsureNetwork } from './useEnsureNetwork'

export type AddPumaStatus = 'idle' | 'pending' | 'success' | 'error' | 'unsupported'

const PUMA_SYMBOL = 'PUMA'
const WATCH_ASSET_TIMEOUT_MS = 20000

type EthereumProvider = {
  request: (args: { method: string; params?: unknown }) => Promise<unknown>
}

function getEthereum(): EthereumProvider | undefined {
  if (typeof window === 'undefined') return undefined
  return (window as Window & { ethereum?: EthereumProvider }).ethereum
}

/**
 * Pide a la wallet agregar $PUMA (EIP-747 wallet_watchAsset).
 * No requiere gas; el usuario puede rechazar en el popup.
 */
export function useAddPumaToWallet() {
  const [status, setStatus] = useState<AddPumaStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { ensure } = useEnsureNetwork()

  const addToken = useCallback(async (): Promise<boolean> => {
    if (!pumaTokenConfigured) {
      setStatus('error')
      setErrorMessage('Contrato PUMA no configurado en esta app.')
      return false
    }

    const provider = getEthereum()
    if (!provider?.request) {
      setStatus('unsupported')
      setErrorMessage('Tu wallet no permite agregar tokens desde el navegador.')
      return false
    }

    setStatus('pending')
    setErrorMessage(null)

    try {
      // IMPORTANTE: MetaMask/Rabby solo completan `wallet_watchAsset`
      // para la red activa; si no coincide, puede quedar "en negro".
      await ensure()

      const added = await Promise.race([
        provider.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: ENV_CONFIG.PUMA_TOKEN_ADDRESS,
              symbol: PUMA_SYMBOL,
              decimals: ENV_CONFIG.PUMA_TOKEN_DECIMALS,
              // `image` es opcional; a veces romper la URL del ícono
              // hace que el popup no se renderice bien.
            },
          },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Tiempo de espera agotado al agregar el token.')), WATCH_ASSET_TIMEOUT_MS),
        ),
      ])

      if (added === false) {
        setStatus('idle')
        return false
      }

      setStatus('success')
      return true
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      const rejected =
        /reject|denied|cancel|declined|user refused/i.test(msg) ||
        (typeof err === 'object' &&
          err !== null &&
          'code' in err &&
          (err as { code: number }).code === 4001)

      if (rejected) {
        setStatus('idle')
        setErrorMessage(null)
        return false
      }

      setStatus('error')
      setErrorMessage(msg.slice(0, 160))
      return false
    }
  }, [ensure])

  const reset = useCallback(() => {
    setStatus('idle')
    setErrorMessage(null)
  }, [])

  return {
    addToken,
    reset,
    status,
    errorMessage,
    tokenConfigured: pumaTokenConfigured,
  }
}
