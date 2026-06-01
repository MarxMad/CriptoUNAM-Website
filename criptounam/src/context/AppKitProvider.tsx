import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider, createStorage } from 'wagmi'
import { avalanche, avalancheFuji } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

const queryClient = new QueryClient()

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '4d100a6eb76b812745208d28235dd59c'

const metadata = {
  name: 'CriptoUNAM',
  description: 'Plataforma educativa Web3 de la UNAM',
  url: 'https://criptounam.xyz',
  icons: ['https://criptounam.xyz/favicon.png']
}

// Selección de red por VITE_CHAIN_ID. Default 43114 (C-Chain mainnet).
// Usar 43113 en .env.local para apuntar a Fuji y probar contra los contratos
// de testnet sin tocar este archivo.
const chainId = Number(import.meta.env.VITE_CHAIN_ID || 43114)
const primaryNetwork = chainId === 43113 ? avalancheFuji : avalanche
const networks = [primaryNetwork] as const

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
