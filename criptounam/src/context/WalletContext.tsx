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
    console.log('Enviando notificación a Telegram:', { address, provider });
    
    // Verificar si las variables de entorno están configuradas
    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
    
    if (!botToken || botToken === 'REPLACE_WITH_YOUR_BOT_TOKEN' || !chatId || chatId === 'REPLACE_WITH_YOUR_CHAT_ID') {
      console.warn('Variables de entorno de Telegram no configuradas correctamente');
      return;
    }
    
    await handleWalletNotification(address, provider)
    console.log('Notificación enviada exitosamente');
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
  console.log('WalletProvider montado');
  
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
    if (isConnected && walletAddress && !notifiedAddresses.current.has(walletAddress)) {
      console.log('Wallet conectada:', { walletAddress, isConnected, connector });
      
      const providerName = getProviderName(connector);

        // Registrar la nueva wallet conectada
        const newWallet: ConnectedWallet = {
        address: walletAddress,
          timestamp: new Date().toISOString(),
        provider: providerName
        }

      console.log('Nueva wallet a registrar:', newWallet);

        const updatedWallets = [...connectedWallets, newWallet]
        setConnectedWallets(updatedWallets)
        localStorage.setItem('connectedWallets', JSON.stringify(updatedWallets))

        // Enviar notificación a Telegram
      console.log('Intentando enviar notificación a Telegram...');
      sendTelegramNotification(walletAddress, providerName)
      
      // Marcar esta wallet como notificada
      notifiedAddresses.current.add(walletAddress)
    }
  }, [isConnected, walletAddress, connector, connectedWallets])

  const connectWallet = async () => {
    try {
      console.log('Iniciando conexión de wallet...');
      const connector = connectors[0]
      if (connector) {
        console.log('Conector encontrado:', connector.name);
        await connect({ connector })
        setError(null)
      } else {
        console.error('No se encontró el conector');
        setError('No se encontró MetaMask')
      }
    } catch (err) {
      console.error('Error en connectWallet:', err);
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