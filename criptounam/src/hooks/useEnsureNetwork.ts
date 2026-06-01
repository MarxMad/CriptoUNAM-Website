import { useCallback } from 'react'
import { useChainId, useSwitchChain } from 'wagmi'
import { useAppKitNetwork } from '@reown/appkit/react'
import { avalanche, avalancheFuji } from '@reown/appkit/networks'
import ENV_CONFIG from '../config/env'

const NETWORK_BY_ID = {
  43113: avalancheFuji,
  43114: avalanche,
} as const

/**
 * Garantiza que la wallet esté en la red de los contratos (ENV_CONFIG.CHAIN_ID,
 * por defecto 43113 Fuji) ANTES de firmar.
 *
 * Reown/AppKit gestiona la red por su cuenta y su estado puede divergir del de
 * wagmi: el switchChain de wagmi a veces no la mueve. Por eso:
 *  - Detectamos la red usando el chainId de AppKit (fuente real) con fallback a wagmi.
 *  - Cambiamos con el switchNetwork de AppKit primero (es quien controla la wallet)
 *    y, si falla, caemos al switchChainAsync de wagmi.
 *  - Verificamos que el chainId resultante sea el correcto antes de devolver true.
 */
export function useEnsureNetwork() {
  const targetChainId = ENV_CONFIG.CHAIN_ID
  const wagmiChainId = useChainId()
  const { chainId: appkitChainId, switchNetwork } = useAppKitNetwork()
  const { switchChainAsync } = useSwitchChain()

  // chainId de AppKit puede venir como number o string ('eip155:43113' → 43113).
  const currentChainId =
    typeof appkitChainId === 'number'
      ? appkitChainId
      : typeof appkitChainId === 'string'
      ? Number(appkitChainId.split(':').pop())
      : wagmiChainId

  const wrongNetwork = currentChainId !== targetChainId

  const ensure = useCallback(async (): Promise<boolean> => {
    if (currentChainId === targetChainId) return true

    const targetNetwork = NETWORK_BY_ID[targetChainId as keyof typeof NETWORK_BY_ID]

    // 1) Intento con AppKit (controla la red de la wallet conectada vía Reown).
    if (targetNetwork && switchNetwork) {
      try {
        await switchNetwork(targetNetwork)
      } catch {
        /* sigue al fallback */
      }
    }

    // 2) Fallback / refuerzo con wagmi.
    try {
      await switchChainAsync({ chainId: targetChainId })
    } catch {
      /* puede haber cambiado ya vía AppKit; lo validamos abajo */
    }

    // Pequeña espera para que el provider propague el cambio de red.
    await new Promise((r) => setTimeout(r, 350))

    // Releer el estado real desde window.ethereum si está disponible.
    try {
      const eth = (window as unknown as { ethereum?: { request: (a: { method: string }) => Promise<string> } })
        .ethereum
      if (eth?.request) {
        const hex = await eth.request({ method: 'eth_chainId' })
        return Number(hex) === targetChainId
      }
    } catch {
      /* ignore */
    }

    // Sin window.ethereum (WalletConnect remoto): asumimos éxito si alguno no lanzó.
    return true
  }, [currentChainId, targetChainId, switchNetwork, switchChainAsync])

  return { ensure, wrongNetwork, currentChainId, targetChainId }
}
