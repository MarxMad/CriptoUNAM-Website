import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider, createStorage } from 'wagmi'
import { avalanche, avalancheFuji } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import ENV_CONFIG from '../config/env'

const queryClient = new QueryClient()

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '4d100a6eb76b812745208d28235dd59c'

const metadata = {
  name: 'CriptoUNAM',
  description: 'Plataforma educativa Web3 de la UNAM',
  url: 'https://criptounam.xyz',
  icons: ['https://criptounam.xyz/favicon.png']
}

// Fuente única de verdad: ENV_CONFIG.CHAIN_ID (default 43113 Fuji). Antes este
// archivo tenía su propio default 43114, así que si faltaba VITE_CHAIN_ID (p. ej.
// en Vercel) AppKit registraba mainnet mientras el resto de la app usaba Fuji:
// los popups salían en C-Chain y el switchChain a Fuji fallaba.
const chainId = ENV_CONFIG.CHAIN_ID
const primaryNetwork = chainId === 43113 ? avalancheFuji : avalanche
// Registramos ambas redes Avalanche (la primaria primero) para que switchChain
// siempre tenga la red destino disponible aunque la wallet esté en la otra.
const secondaryNetwork = chainId === 43113 ? avalanche : avalancheFuji
const networks = [primaryNetwork, secondaryNetwork] as [typeof primaryNetwork, typeof secondaryNetwork]

// ssr: false porque es SPA Vite (sin server-rendering). Con ssr: true wagmi
// no auto-reconecta al refrescar. storage explícito en localStorage para
// persistir el último connector entre refreshes y pestañas.
const wagmiAdapter = new WagmiAdapter({
  networks: [...networks],
  projectId,
  ssr: false,
  storage: createStorage({
    storage: typeof window !== 'undefined' ? window.localStorage : undefined as any,
    key: 'criptounam.wagmi'
  })
})

createAppKit({
  adapters: [wagmiAdapter],
  networks: [...networks],
  defaultNetwork: primaryNetwork,
  projectId,
  metadata,
  features: {
    onramp: true,
    swaps: true,
    analytics: true,
    email: true,
    socials: ['google', 'github', 'discord'],
    emailShowWallets: true
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-color-mix': '#D4AF37',
    '--w3m-color-mix-strength': 40
  }
})

// reconnectOnMount={true} fuerza a wagmi a rehidratar la última sesión guardada
// en localStorage (key 'criptounam.wagmi') al cargar/refrescar la página, en vez
// de quedarse desconectado y volver a pedir conexión/firma.
export function AppKitProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} reconnectOnMount={true}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
