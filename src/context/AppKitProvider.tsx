import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import { arbitrum, mainnet } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Obtén el projectId desde las variables de entorno
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID

// 2. Metadata opcional
const metadata = {
  name: 'CriptoUNAM',
  description: 'Plataforma educativa Web3',
  url: 'https://criptounam.com',
  icons: ['https://criptounam.com/favicon.png']
}

// 3. Redes soportadas
const networks = [mainnet, arbitrum]

// 4. Adapter de wagmi
const wagmiAdapter = new WagmiAdapter({
  networks: networks as any, // Temporal fix para el tipo
  projectId,
  ssr: true
})

// 5. Inicializa AppKit
createAppKit({
  adapters: [wagmiAdapter],
  networks: networks as any, // Temporal fix para el tipo
  projectId,
  metadata,
  features: {
    analytics: true // Opcional
  }
})

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
} 