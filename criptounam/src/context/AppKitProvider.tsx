import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { arbitrum, mainnet } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Obtén el projectId desde las variables de entorno
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID?.trim()

if (!projectId) {
  throw new Error('VITE_WALLET_CONNECT_PROJECT_ID no está definido en el archivo .env')
}

console.log('Project ID cargado:', projectId ? 'Sí ✅' : 'No ❌')

// 2. Metadata opcional
const metadata = {
  name: 'CriptoUNAM',
  description: 'Plataforma educativa Web3',
  url: 'https://criptounam.xyz',
  icons: ['https://criptounam.xyz/favicon.png']
}

// 3. Redes soportadas
const networks = [mainnet, arbitrum] as const

// 4. Adapter de wagmi
const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, arbitrum],
  projectId,
  ssr: true
})

// 5. Inicializa AppKit con configuración mejorada
createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, arbitrum],
  projectId,
  metadata,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-font-family': 'Inter, system-ui, sans-serif',
    '--w3m-accent': '#D4AF37',
    '--w3m-color-mix': '#D4AF37',
    '--w3m-color-mix-strength': 20,
    '--w3m-border-radius-master': '12px'
  },
  features: {
    analytics: true,
    email: false,
    socials: [],
    emailShowWallets: true
  },
  enableEIP6963: true,
  enableCoinbase: true
})

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
} 