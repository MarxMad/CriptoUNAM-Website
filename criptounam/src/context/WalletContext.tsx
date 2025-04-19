import React, { createContext, useContext, useState } from 'react'
import { ethers } from 'ethers'

interface WalletContextType {
  connectWallet: () => Promise<void>
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

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        setWalletAddress(address)
        setIsConnected(true)
      } else {
        console.error('MetaMask no está instalado')
      }
    } catch (error) {
      console.error('Error al conectar la wallet:', error)
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