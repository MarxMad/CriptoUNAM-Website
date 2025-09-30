import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAccount, useDisconnect, useEnsName, useEnsAvatar, useBalance } from 'wagmi'
import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import '../styles/global.css'
import { useAdmin } from '../hooks/useAdmin'
import { API_ENDPOINTS } from '../config/api'
import { 
  faBell, 
  faHome, 
  faGraduationCap, 
  faUsers, 
  faEnvelope, 
  faGamepad,
  faTimes,
  faWallet,
  faPlus,
  faNewspaper,
  faCalendarPlus
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface SocialProfile {
  picture?: string;
  name?: string;
  email?: string;
}

// Tipo para notificaciones
interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
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
  const location = useLocation()
  const { disconnect } = useDisconnect()
  const { address, isConnected } = useAccount()
  const { data: ensName } = useEnsName({ address, chainId: 1 })
  const { data: ensAvatar } = useEnsAvatar(ensName ? { name: ensName } : { name: undefined })
  const { data: balanceData } = useBalance({ address: address as `0x${string}` | undefined })
  const { open } = useAppKit()
  const appKitAccount = useAppKitAccount()
  const { isAdmin, canCreateCourse, canCreateNewsletter, canCreateEvent } = useAdmin()
  const [networkName, setNetworkName] = useState<string>('')
  const [networkLogo, setNetworkLogo] = useState<string>('')
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  
  // Estados para notificaciones
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [panelNotif, setPanelNotif] = useState(false)
  const noLeidas = notificaciones.filter(n=>!n.leida).length
  const marcarLeida = (id: string) => setNotificaciones(nots => nots.map(n => n.id === id ? { ...n, leida: true } : n))

  // Estados para wallet panel
  const [walletPanelOpen, setWalletPanelOpen] = useState(false)

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    fetch(API_ENDPOINTS.NOTIFICACIONES)
      .then(res => res.json())
      .then(data => {
        setNotificaciones(data.map((n: any) => ({ ...n, leida: false })));
      })
      .catch(err => console.error('Error al cargar notificaciones:', err));
  }, []);

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  const handleLogin = async () => {
    try {
      await open()
    } catch (error) {
      console.error('Error al abrir el modal:', error)
    }
  }

  // Datos de navegación con iconos
  const navigationItems = [
    { path: '/', icon: faHome, label: 'Home' },
    { path: '/cursos', icon: faGraduationCap, label: 'Cursos' },
    { path: '/comunidad', icon: faUsers, label: 'Comunidad' },
    { path: '/newsletter', icon: faEnvelope, label: 'Newsletter' },
    { path: '/juegos', icon: faGamepad, label: 'Juegos' },
  ]

  const isActiveRoute = (path: string) => {
    return location.pathname === path
  }

  return (
    <>
      {/* Barra Superior - Logo, Notificaciones y Wallet */}
      <header 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '70px',
          background: 'rgba(20,20,30,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
        }}
      >
        {/* Logo */}
        <Link 
          to="/" 
          style={{
            color: '#D4AF37',
            fontWeight: 700,
            fontSize: isMobile ? '1.3rem' : '1.5rem',
            fontFamily: 'Orbitron',
            letterSpacing: '1px',
            textDecoration: 'none'
          }}
        >
          CriptoUNAM
        </Link>

        {/* Botones de la derecha */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Notificaciones */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setPanelNotif(!panelNotif)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                padding: '8px',
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => (e.target as HTMLButtonElement).style.background = 'rgba(212, 175, 55, 0.1)'}
              onMouseLeave={(e) => (e.target as HTMLButtonElement).style.background = 'none'}
            >
              <FontAwesomeIcon 
                icon={faBell} 
                style={{
                  fontSize: '1.3rem',
                  color: '#D4AF37'
                }} 
              />
              {noLeidas > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '12px',
                  height: '12px',
                  background: '#ff4444',
                  borderRadius: '50%',
                  border: '2px solid #18181b'
                }} />
              )}
            </button>

            {/* Panel de notificaciones */}
            {panelNotif && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                marginTop: '8px',
                background: '#18181b',
                border: '1.5px solid #D4AF37',
                borderRadius: '12px',
                minWidth: '300px',
                maxWidth: '350px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                padding: '1.2rem',
                zIndex: 2000
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ color: '#D4AF37', margin: 0, fontWeight: 700, fontSize: '1.1rem' }}>
                    Notificaciones
                  </h4>
                  <button 
                    onClick={() => setPanelNotif(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#D4AF37',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      padding: '4px'
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                
                {notificaciones.length === 0 ? (
                  <div style={{ color: '#aaa', textAlign: 'center', padding: '1rem' }}>
                    No hay notificaciones.
                  </div>
                ) : (
                  notificaciones.map(n => (
                    <div 
                      key={n.id} 
                      style={{
                        marginBottom: '12px',
                        background: n.leida ? '#23233a' : 'rgba(30, 58, 138, 0.15)',
                        borderRadius: '8px',
                        padding: '0.8rem',
                        border: n.leida ? 'none' : '1px solid rgba(212, 175, 55, 0.2)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <div style={{ fontWeight: 700, color: '#D4AF37', fontSize: '1rem' }}>
                          {n.titulo}
                        </div>
                        {!n.leida && (
                          <button 
                            onClick={() => marcarLeida(n.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#34d399',
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              cursor: 'pointer'
                            }}
                          >
                            Marcar leída
                          </button>
                        )}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '4px' }}>
                        {n.mensaje}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                        {n.fecha}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Wallet y Botones de Admin */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isConnected ? (
              <button
                onClick={() => setWalletPanelOpen(!walletPanelOpen)}
                style={{
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid #D4AF37',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  color: '#D4AF37',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  position: 'relative'
                }}
              >
                <FontAwesomeIcon icon={faWallet} />
                {!isMobile && (ensName || (address ? formatAddress(address) : ''))}
                {isAdmin && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                    color: '#000',
                    fontSize: '8px',
                    fontWeight: 'bold',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    border: '1px solid #000'
                  }}>
                    ADMIN
                  </span>
                )}
              </button>
            ) : (
              <button 
                onClick={handleLogin}
                style={{
                  background: 'linear-gradient(135deg, #D4AF37, #F4C842)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: '#000',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FontAwesomeIcon icon={faWallet} />
                {!isMobile && 'Conectar'}
              </button>
            )}

            {/* Botones de Admin */}
            {isAdmin && isConnected && (
              <div style={{ display: 'flex', gap: '6px' }}>
                {/* Botón para Cursos */}
                {canCreateCourse && (
                  <button
                    onClick={() => {
                      const event = new CustomEvent('openCursosModal');
                      window.dispatchEvent(event);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                      border: 'none',
                      borderRadius: '6px',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(212, 175, 55, 0.4)',
                      fontSize: '12px',
                      color: '#000',
                      fontWeight: 'bold'
                    }}
                    title="Agregar Curso"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                )}
                
                {/* Botón para Newsletter */}
                {canCreateNewsletter && (
                  <button
                    onClick={() => {
                      const event = new CustomEvent('openNewsletterModal');
                      window.dispatchEvent(event);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                      border: 'none',
                      borderRadius: '6px',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(212, 175, 55, 0.4)',
                      fontSize: '12px',
                      color: '#000',
                      fontWeight: 'bold'
                    }}
                    title="Agregar Entrada"
                  >
                    <FontAwesomeIcon icon={faNewspaper} />
                  </button>
                )}
                
                {/* Botón para Comunidad */}
                {canCreateEvent && (
                  <button
                    onClick={() => {
                      const event = new CustomEvent('openComunidadModal');
                      window.dispatchEvent(event);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                      border: 'none',
                      borderRadius: '6px',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(212, 175, 55, 0.4)',
                      fontSize: '12px',
                      color: '#000',
                      fontWeight: 'bold'
                    }}
                    title="Agregar Evento"
                  >
                    <FontAwesomeIcon icon={faCalendarPlus} />
                  </button>
                )}
              </div>
            )}
          </div>

            {/* Panel de wallet */}
            {walletPanelOpen && isConnected && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                marginTop: '8px',
                background: '#18181b',
                border: '1.5px solid #D4AF37',
                borderRadius: '12px',
                minWidth: '250px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                padding: '1.2rem',
                zIndex: 2000
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ color: '#D4AF37', margin: 0, fontWeight: 700 }}>Wallet</h4>
                  <button 
                    onClick={() => setWalletPanelOpen(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#D4AF37',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      padding: '4px'
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <appkit-account-button balance="show" />
                </div>
                
                <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                  <Link 
                    to="/perfil" 
                    onClick={() => setWalletPanelOpen(false)}
                    style={{
                      background: '#2563EB',
                      color: '#fff',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      textAlign: 'center',
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}
                  >
                    Ver Perfil
                  </Link>
                  <button 
                    onClick={() => {
                      disconnect()
                      setWalletPanelOpen(false)
                    }}
                    style={{
                      background: 'none',
                      color: '#D4AF37',
                      border: '1px solid #D4AF37',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}
                  >
                    Desconectar
                  </button>
                </div>
              </div>
            )}
          </div>
      </header>

      {/* Menú Inferior - Navegación principal */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '75px',
          background: 'rgba(20,20,30,0.95)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(212, 175, 55, 0.3)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 1rem',
          boxShadow: '0 -2px 12px rgba(0,0,0,0.1)'
        }}
      >
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '8px 12px',
              borderRadius: '12px',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              background: isActiveRoute(item.path) 
                ? 'rgba(212, 175, 55, 0.15)' 
                : 'transparent',
              border: isActiveRoute(item.path) 
                ? '1px solid rgba(212, 175, 55, 0.3)' 
                : '1px solid transparent',
              minWidth: '60px'
            }}
          >
            <FontAwesomeIcon 
              icon={item.icon}
              style={{
                fontSize: '1.4rem',
                color: isActiveRoute(item.path) ? '#D4AF37' : '#888',
                transition: 'all 0.3s ease'
              }}
            />
            <span
              style={{
                fontSize: '0.75rem',
                color: isActiveRoute(item.path) ? '#D4AF37' : '#888',
                fontWeight: isActiveRoute(item.path) ? 600 : 400,
                transition: 'all 0.3s ease'
              }}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Espaciado para el contenido */}
      <div style={{ paddingTop: '70px', paddingBottom: '75px' }} />
    </>
  )
}

export default Navbar 