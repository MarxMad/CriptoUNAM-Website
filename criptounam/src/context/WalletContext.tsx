import React, { createContext, useContext, useState, useEffect } from 'react'
import { handleWalletNotification } from '../api/telegram'

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
    await handleWalletNotification(address, provider)
  } catch (error) {
    console.error('Error al enviar notificación a Telegram:', error)
  }
}

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectedWallets, setConnectedWallets] = useState<ConnectedWallet[]>([])

  useEffect(() => {
    // Cargar wallets conectadas del localStorage
    const savedWallets = localStorage.getItem('connectedWallets')
    if (savedWallets) {
      setConnectedWallets(JSON.parse(savedWallets))
    }
  }, [])

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' })
          if (accounts.length > 0) {
            setWalletAddress(accounts[0])
            setIsConnected(true)
          }
        } catch (error) {
          console.error('Error al verificar la conexión:', error)
        }
      }
    }

    checkWalletConnection()

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          setWalletAddress(accounts[0])
          setIsConnected(true)
        }
      })
    }
  }, [])

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const address = accounts[0]
        setWalletAddress(address)
        setIsConnected(true)
        setError(null)

        // Registrar la nueva wallet conectada
        const newWallet: ConnectedWallet = {
          address,
          timestamp: new Date().toISOString(),
          provider: 'MetaMask' // Podemos detectar el proveedor específico aquí
        }

        const updatedWallets = [...connectedWallets, newWallet]
        setConnectedWallets(updatedWallets)
        localStorage.setItem('connectedWallets', JSON.stringify(updatedWallets))

        // Enviar notificación a Telegram
        await sendTelegramNotification(address, 'MetaMask')
      } else {
        setError('Por favor instala MetaMask')
      }
    } catch (err) {
      setError('Error al conectar la wallet')
      console.error(err)
    }
  }

  const disconnectWallet = () => {
    setWalletAddress('')
    setIsConnected(false)
    setError(null)
  }

  return (
    <WalletContext.Provider value={{ 
      walletAddress, 
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