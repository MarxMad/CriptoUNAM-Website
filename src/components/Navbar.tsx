import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAccount, useDisconnect, useEnsName } from 'wagmi'
import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import '../styles/global.css'

interface SocialProfile {
  picture?: string;
  name?: string;
  email?: string;
}

const NETWORKS: Record<number, { name: string; logo: string }> = {
  1: { name: 'Ethereum', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026' },
  5: { name: 'Goerli', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026' },
  11155111: { name: 'Sepolia', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026' },
  137: { name: 'Polygon', logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png?v=026' },
  80001: { name: 'Polygon Mumbai', logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png?v=026' },
  56: { name: 'Binance Smart Chain', logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png?v=026' },
  97: { name: 'BSC Testnet', logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png?v=026' },
  42161: { name: 'Arbitrum One', logo: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png?v=026' },
  10: { name: 'Optimism', logo: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png?v=026' },
  43114: { name: 'Avalanche C-Chain', logo: 'https://cryptologos.cc/logos/avalanche-avax-logo.png?v=026' },
}

const getChainId = () => {
  if (window && (window as any).ethereum && (window as any).ethereum.networkVersion) {
    return parseInt((window as any).ethereum.networkVersion)
  }
  return undefined
}

const Navbar = () => {
  const { disconnect } = useDisconnect()
  const { address, isConnected } = useAccount()
  const { data: ensName } = useEnsName({ address, chainId: 1 })
  const { open } = useAppKit()
  const appKitAccount = useAppKitAccount()
  const [menuOpen, setMenuOpen] = useState(false)
  const [networkName, setNetworkName] = useState<string>('')
  const [networkLogo, setNetworkLogo] = useState<string>('')

  useEffect(() => {
    console.log('AppKit Account:', appKitAccount)
    console.log('Wagmi Account:', { address, isConnected })
  }, [appKitAccount, address, isConnected])

  useEffect(() => {
    const updateNetwork = () => {
      const chainId = getChainId()
      if (chainId && NETWORKS[chainId]) {
        setNetworkName(NETWORKS[chainId].name)
        setNetworkLogo(NETWORKS[chainId].logo)
      } else if (chainId) {
        setNetworkName(`Chain ID: ${chainId}`)
        setNetworkLogo('')
      } else {
        setNetworkName('Desconocida')
        setNetworkLogo('')
      }
    }
    updateNetwork()
    if (window && (window as any).ethereum) {
      (window as any).ethereum.on('chainChanged', updateNetwork)
      return () => {
        (window as any).ethereum.removeListener('chainChanged', updateNetwork)
      }
    }
  }, [])

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  const handleLogin = async () => {
    try {
      await open()
    } catch (error) {
      console.error('Error al abrir el modal:', error)
    }
  }

  const handleHamburger = () => setMenuOpen(!menuOpen)
  const closeMenu = () => setMenuOpen(false)

  const renderUserInfo = () => {
    console.log('Rendering user info with account:', appKitAccount)
    
    // Verificar si es una cuenta social
    const isSocialAccount = appKitAccount && 'authMethod' in appKitAccount && appKitAccount.authMethod === 'google'
    console.log('Is social account:', isSocialAccount)

    if (isSocialAccount) {
      // Intentar obtener el perfil social
      const socialData = (appKitAccount as any).socialData
      console.log('Social data:', socialData)

      if (socialData) {
        return (
          <div className="wallet-info-container">
            <div className="flex items-center gap-2">
              {socialData.picture && (
                <img 
                  src={socialData.picture} 
                  alt={socialData.name || 'Usuario'} 
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-primary-gold">{socialData.name || 'Usuario'}</span>
            </div>
            <div className="wallet-buttons">
              <button className="secondary-button" onClick={() => disconnect()}>Desconectar</button>
              <Link to="/perfil" className="text-primary-gold" onClick={closeMenu}>Perfil</Link>
            </div>
          </div>
        )
      }
    }

    // Si es una wallet
    if (address) {
      return (
        <div className="wallet-info-container">
          <span className="text-primary-gold" style={{fontWeight:600}}>
            {ensName || formatAddress(address)}
          </span>
          <div className="wallet-buttons">
            <button className="secondary-button" onClick={() => disconnect()}>Desconectar</button>
            <Link to="/perfil" className="text-primary-gold" onClick={closeMenu}>Perfil</Link>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <nav className="navbar tech-navbar">
      <div className="navbar-content">
        <Link to="/" className="text-primary-gold" style={{fontWeight:700, fontSize:'1.3rem', fontFamily:'Orbitron', letterSpacing:'1px'}}>CriptoUNAM</Link>
        <div className={`navbar-links${menuOpen ? ' open' : ''}`} onClick={closeMenu}>
          <Link to="/" className="nav-link-tech">Home</Link>
          <Link to="/cursos" className="nav-link-tech">Cursos</Link>
          <Link to="/comunidad" className="nav-link-tech">Comunidad</Link>
          <Link to="/newsletter" className="nav-link-tech">Newsletter</Link>
          <div className="wallet-section">
            {isConnected ? (
              <>
                <div className="network-info" style={{display:'flex', alignItems:'center', gap:8, marginBottom:6}}>
                  {networkLogo && <img src={networkLogo} alt={networkName} style={{height:20, width:20, borderRadius:'50%', background:'#fff'}} />}
                  <span style={{color:'#D4AF37', fontWeight:600, fontSize:'1rem'}}>{networkName}</span>
                </div>
                {renderUserInfo()}
              </>
            ) : (
              <button className="primary-button login-mini" onClick={handleLogin}>
                Iniciar sesión / Conectar Wallet
              </button>
            )}
          </div>
        </div>
        <div className={`hamburger${menuOpen ? ' open' : ''}`} onClick={handleHamburger}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 