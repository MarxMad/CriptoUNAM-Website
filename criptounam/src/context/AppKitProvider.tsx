import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { arbitrum, mainnet } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Obtén el projectId desde las variables de entorno
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID?.trim()

console.log('Variables de entorno:', {
  VITE_WALLET_CONNECT_PROJECT_ID: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
  projectId: projectId,
  NODE_ENV: import.meta.env.NODE_ENV
})

if (!projectId) {
  console.error('VITE_WALLET_CONNECT_PROJECT_ID no está definido')
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

// 5. Inicializa AppKit con configuración simplificada
createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, arbitrum],
  projectId,
  metadata,
  themeMode: 'dark',
  features: {
    analytics: true,
    email: true,
    socials: ['google', 'discord', 'github'],
    emailShowWallets: true
  }
})

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
} 