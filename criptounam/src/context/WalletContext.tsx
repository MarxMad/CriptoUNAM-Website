import React, { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'

interface WalletContextType {
  account: string | null
  chainId: number | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

const WalletContext = createContext<WalletContextType>({
  account: null,
  chainId: null,
  connectWallet: async () => {},
  disconnectWallet: () => {}
})

export const useWallet = () => useContext(WalletContext)

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)

  useEffect(() => {
    // Verificar si hay una wallet conectada al cargar
    checkConnection()

    // Escuchar cambios de cuenta
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [])

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const accounts = await provider.listAccounts()
        if (accounts.length > 0) {
          setAccount(accounts[0])
          const network = await provider.getNetwork()
          setChainId(network.chainId)
        }
      } catch (error) {
        console.error('Error al verificar conexión:', error)
      }
    }
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) {
      setAccount(accounts[0])
    } else {
      setAccount(null)
    }
  }

  const handleChainChanged = (chainId: string) => {
    setChainId(parseInt(chainId, 16))
  }

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const accounts = await provider.send('eth_requestAccounts', [])
        setAccount(accounts[0])
        const network = await provider.getNetwork()
        setChainId(network.chainId)
      } catch (error) {
        console.error('Error al conectar wallet:', error)
      }
    } else {
      alert('Por favor instala MetaMask!')
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
    setChainId(null)
  }

  return (
    <WalletContext.Provider value={{ account, chainId, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  )
} 