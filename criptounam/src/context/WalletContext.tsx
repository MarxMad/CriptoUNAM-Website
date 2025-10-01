import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { handleWalletNotification } from '../api/telegram'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

interface ConnectedWallet {
  address: string
  timestamp: string
  provider: string
}

interface WalletContextType {
  walletAddress: string
  isConnected: boolean
  error?: string | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  connectedWallets: ConnectedWallet[]
}

const WalletContext = createContext<WalletContextType>({
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isConnected: false,
  walletAddress: '',
  connectedWallets: []
})

export const useWallet = () => useContext(WalletContext)

const sendTelegramNotification = async (address: string, provider: string) => {
  try {
    console.log('🔐 Enviando notificación de wallet:', { address, provider });
    const result = await handleWalletNotification(address, provider)
    console.log('📱 Resultado de notificación:', result);
    if (!result.success) {
      console.error('Error al enviar notificación:', result.message);
    }
  } catch (error) {
    console.error('Error al enviar notificación a Telegram:', error)
  }
}

const getProviderName = (connector: any) => {
  if (!connector) return 'Unknown';
  
  // Para Web3Modal y EIP6963
  if (connector.id === 'walletConnect') return 'WalletConnect';
  if (connector.id === 'coinbaseWallet') return 'Coinbase Wallet';
  if (connector.id === 'metaMask') return 'MetaMask';
  if (connector.id === 'injected') return 'Browser Wallet';
  if (connector.id === 'eip6963') {
    // Intentar obtener el nombre real del proveedor
    const provider = connector.provider;
    if (provider?.isMetaMask) return 'MetaMask';
    if (provider?.isCoinbaseWallet) return 'Coinbase Wallet';
    if (provider?.isTrust) return 'Trust Wallet';
    if (provider?.isBraveWallet) return 'Brave Wallet';
    return provider?.name || 'Browser Wallet';
  }
  
  return connector.name || 'Unknown';
}

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const [error, setError] = useState<string | null>(null)
  const [connectedWallets, setConnectedWallets] = useState<ConnectedWallet[]>([])
  const notifiedAddresses = useRef<Set<string>>(new Set())

  const { address: walletAddress, isConnected, connector } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  // Efecto para cargar wallets guardadas
  useEffect(() => {
    const savedWallets = localStorage.getItem('connectedWallets')
    if (savedWallets) {
      const parsedWallets = JSON.parse(savedWallets)
      setConnectedWallets(parsedWallets)
      // Marcar las wallets existentes como notificadas
      parsedWallets.forEach((wallet: ConnectedWallet) => {
        notifiedAddresses.current.add(wallet.address)
      })
    }
  }, [])

  // Efecto para manejar nuevas conexiones
  useEffect(() => {
    console.log('🔄 WalletContext useEffect:', { isConnected, walletAddress, hasNotified: notifiedAddresses.current.has(walletAddress) });
    
    if (isConnected && walletAddress && !notifiedAddresses.current.has(walletAddress)) {
      console.log('✅ Nueva wallet detectada, procesando...');
      const providerName = getProviderName(connector);
      console.log('🔧 Provider detectado:', providerName);

      // Registrar la nueva wallet conectada
      const newWallet: ConnectedWallet = {
        address: walletAddress,
        timestamp: new Date().toISOString(),
        provider: providerName
      }

      // Actualizar el estado de wallets conectadas
      setConnectedWallets(prevWallets => {
        const updatedWallets = [...prevWallets, newWallet]
        localStorage.setItem('connectedWallets', JSON.stringify(updatedWallets))
        console.log('💾 Wallets guardadas en localStorage:', updatedWallets);
        return updatedWallets
      })

      // Enviar notificación a Telegram
      sendTelegramNotification(walletAddress, providerName)
      
      // Marcar esta wallet como notificada
      notifiedAddresses.current.add(walletAddress)
      console.log('✅ Wallet marcada como notificada');
    }
  }, [isConnected, walletAddress, connector])

  const connectWallet = async () => {
    try {
      const connector = connectors[0]
      if (connector) {
        await connect({ connector })
        setError(null)
      } else {
        setError('No se encontró MetaMask')
      }
    } catch (err) {
      setError('Error al conectar la wallet')
    }
  }

  const disconnectWallet = () => {
    disconnect()
    setError(null)
  }

  return (
    <WalletContext.Provider value={{ 
      walletAddress: walletAddress || '', 
      isConnected, 
      error, 
      connectWallet, 
      disconnectWallet,
      connectedWallets 
    }}>
      {children}
    </WalletContext.Provider>
  )
} 