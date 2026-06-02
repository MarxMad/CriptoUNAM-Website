import { useCallback } from 'react'
import { useChainId, useSwitchChain } from 'wagmi'
import ENV_CONFIG from '../config/env'

export function useEnsureNetwork() {
  const targetChainId = ENV_CONFIG.CHAIN_ID
  const wagmiChainId = useChainId()
  const { switchChainAsync } = useSwitchChain()

  const currentChainId = wagmiChainId

  const wrongNetwork = currentChainId !== targetChainId

  const ensure = useCallback(async (): Promise<boolean> => {
    if (currentChainId === targetChainId) return true

    // Usamos wagmi directamente para evitar conflictos con AppKit
    try {
      await switchChainAsync({ chainId: targetChainId })
    } catch (err) {
      console.warn('Wagmi switchChainAsync failed:', err)
      return false;
    }

    // Pequeña espera para que el provider propague el cambio de red
    await new Promise((r) => setTimeout(r, 500))

    return true
  }, [currentChainId, targetChainId, switchChainAsync])

  return { ensure, wrongNetwork, currentChainId, targetChainId }
}
