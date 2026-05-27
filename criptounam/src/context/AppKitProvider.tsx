import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { arbitrum, mainnet, polygon, base, optimism } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Obtén el projectId desde las variables de entorno
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '4d100a6eb76b812745208d28235dd59c'

// 2. Metadata correcta según los ejemplos de Reown
const metadata = {
  name: 'CriptoUNAM',
  description: 'Plataforma educativa Web3 de la UNAM',
  url: 'https://criptounam.xyz',
  icons: ['https://criptounam.xyz/favicon.png']
}

// 3. Redes soportadas. Arbitrum One es la red primaria donde viven
//    PUMAToken y CriptoUNAMBadges. Mantengo mainnet para fallback de
//    wallets que no han añadido Arbitrum, y otras L2 como referencia.
const networks = [arbitrum, mainnet, base, optimism, polygon]

// 4. Adapter de wagmi — Arbitrum primero = red por defecto al conectar
const wagmiAdapter = new WagmiAdapter({
  networks: [arbitrum, mainnet],
  projectId,
  ssr: true
})

// 5. Inicializa AppKit con configuración completa incluyendo On-Ramp y Swaps
createAppKit({
  adapters: [wagmiAdapter],
  networks: [arbitrum, mainnet],
  defaultNetwork: arbitrum,
  projectId,
  metadata,
  features: {
    onramp: true, // Habilitar On-Ramp para comprar criptomonedas
    swaps: true, // Habilitar Swaps para intercambiar tokens
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

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
} 