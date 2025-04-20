import React, { createContext, useContext, useState, useEffect } from 'react'

interface WalletContextType {
  walletAddress: string
  isConnected: boolean
  error?: string | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

const WalletContext = createContext<WalletContextType>({
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isConnected: false,
  walletAddress: ''
})

export const useWallet = () => useContext(WalletContext)

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

    // Escuchar cambios en la cuenta
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
        setWalletAddress(accounts[0])
        setIsConnected(true)
        setError(null)
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
    <WalletContext.Provider value={{ walletAddress, isConnected, error, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  )
} 