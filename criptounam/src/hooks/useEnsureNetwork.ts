import { useCallback } from 'react'
import { useChainId, useSwitchChain } from 'wagmi'
import { useAppKitNetwork } from '@reown/appkit/react'
import { avalanche, avalancheFuji } from '@reown/appkit/networks'
import ENV_CONFIG from '../config/env'

const NETWORK_BY_ID = {
  43113: avalancheFuji,
  43114: avalanche,
} as const

export function useEnsureNetwork() {
  const targetChainId = ENV_CONFIG.CHAIN_ID
  const wagmiChainId = useChainId()
  const { chainId: appkitChainId, switchNetwork } = useAppKitNetwork()
  const { switchChainAsync } = useSwitchChain()

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

    let success = false;

    // 1) Intento con AppKit
    if (targetNetwork && switchNetwork) {
      try {
        await switchNetwork(targetNetwork)
        success = true;
      } catch (err) {
        console.warn('AppKit switchNetwork failed:', err)
      }
    }

    // 2) Fallback con wagmi si AppKit falló
    if (!success) {
      try {
        await switchChainAsync({ chainId: targetChainId })
        success = true;
      } catch (err) {
        console.warn('Wagmi switchChainAsync failed:', err)
        return false; // Si ambos fallan, no podemos continuar
      }
    }

    // Pequeña espera para que el provider propague el cambio de red
    await new Promise((r) => setTimeout(r, 500))

    return true
  }, [currentChainId, targetChainId, switchNetwork, switchChainAsync])

  return { ensure, wrongNetwork, currentChainId, targetChainId }
}
