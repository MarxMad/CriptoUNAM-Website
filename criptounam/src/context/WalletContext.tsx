import React, { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'

interface WalletContextType {
  connectWallet: (provider: string) => Promise<void>
  disconnectWallet: () => void
  isConnected: boolean
  walletAddress: string
}

const WalletContext = createContext<WalletContextType>({
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isConnected: false,
  walletAddress: ''
})

export const useWallet = () => useContext(WalletContext)

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum)
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

  const connectWallet = async (provider: string) => {
    try {
      let ethereum;
      
      switch(provider) {
        case 'metamask':
          ethereum = (window as any).ethereum;
          if (!ethereum) {
            throw new Error('MetaMask no está instalado');
          }
          break;
        case 'coinbase':
          ethereum = (window as any).coinbaseWalletExtension;
          if (!ethereum) {
            throw new Error('Coinbase Wallet no está instalado');
          }
          break;
        case 'walletconnect':
          // Implementar WalletConnect
          break;
      }

      if (ethereum) {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error al conectar wallet:', error);
      throw error;
    }
  }

  const disconnectWallet = () => {
    setWalletAddress('')
    setIsConnected(false)
  }

  return (
    <WalletContext.Provider value={{ connectWallet, disconnectWallet, isConnected, walletAddress }}>
      {children}
    </WalletContext.Provider>
  )
} 