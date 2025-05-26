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

const Navbar = () => {
  const { disconnect } = useDisconnect()
  const { address, isConnected } = useAccount()
  const { data: ensName } = useEnsName({ address, chainId: 1 })
  const { open } = useAppKit()
  const appKitAccount = useAppKitAccount()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    console.log('AppKit Account:', appKitAccount)
    console.log('Wagmi Account:', { address, isConnected })
  }, [appKitAccount, address, isConnected])

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
          <>
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
            <button className="secondary-button" onClick={() => disconnect()}>Desconectar</button>
            <Link to="/perfil" className="text-primary-gold" onClick={closeMenu}>Perfil</Link>
          </>
        )
      }
    }

    // Si es una wallet
    if (address) {
      return (
        <>
          <span className="text-primary-gold" style={{fontWeight:600}}>
            {ensName || formatAddress(address)}
          </span>
          <button className="secondary-button" onClick={() => disconnect()}>Desconectar</button>
          <Link to="/perfil" className="text-primary-gold" onClick={closeMenu}>Perfil</Link>
        </>
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
          <div style={{marginTop:'1rem'}}>
            {isConnected ? (
              renderUserInfo()
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