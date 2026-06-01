import { useQuery } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { readContract } from 'wagmi/actions'
import type { Config } from '@wagmi/core'
import ENV_CONFIG from '../config/env'
import { pumaTokenAbi } from '../constants/pumaTokenAbi'
import { pumaTokenConfigured } from './usePumaMissions'
import { formatPumaAmount } from '../utils/pumaFormat'

const tokenAddr = ENV_CONFIG.PUMA_TOKEN_ADDRESS as `0x${string}`
export const expectedPumaChainId = ENV_CONFIG.CHAIN_ID

const rc = readContract as (config: Config, params: Record<string, unknown>) => Promise<unknown>

export function pumaBalanceQueryKey(address?: string) {
  return ['pumaBalance', tokenAddr, address ?? '', expectedPumaChainId] as const
}

/** Saldo ERC-20 PUMA en la red configurada (VITE_CHAIN_ID), no la red equivocada del wallet. */
export function usePumaTokenBalance() {
  const { address } = useAccount()
  const walletChainId = useChainId()
  const config = useConfig()
  const onExpectedChain = walletChainId === expectedPumaChainId

  const query = useQuery({
    queryKey: pumaBalanceQueryKey(address),
    queryFn: async (): Promise<bigint | null> => {
      if (!pumaTokenConfigured || !address) return null
      return (await rc(config, {
        address: tokenAddr,
        abi: pumaTokenAbi,
        functionName: 'balanceOf',
        args: [address],
        chainId: expectedPumaChainId,
      })) as bigint
    },
    enabled: pumaTokenConfigured && !!address,
    staleTime: 8_000,
    refetchInterval: 15_000,
  })

  const balanceWei = query.data ?? undefined

  return {
    balanceWei,
    formatted: formatPumaAmount(balanceWei ?? null),
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
    onExpectedChain,
    expectedChainId: expectedPumaChainId,
    walletChainId,
    tokenConfigured: pumaTokenConfigured,
  }
}
