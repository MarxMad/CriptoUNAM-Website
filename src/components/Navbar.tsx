import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAccount, useDisconnect, useEnsName, useEnsAvatar, useBalance } from 'wagmi'
import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import '../styles/global.css'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
  const { data: ensAvatar } = useEnsAvatar(ensName ? { name: ensName } : { name: undefined })
  const { data: balanceData } = useBalance({ address: address as `0x${string}` | undefined, watch: true })
  const { open } = useAppKit()
  const appKitAccount = useAppKitAccount()
  const [menuOpen, setMenuOpen] = useState(false)
  const [networkName, setNetworkName] = useState<string>('')
  const [networkLogo, setNetworkLogo] = useState<string>('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900)
  // Estado de notificaciones globales (fetch real al backend)
  const [notificaciones, setNotificaciones] = useState([])
  const [panelNotif, setPanelNotif] = useState(false)
  const noLeidas = notificaciones.filter(n=>!n.leida).length
  const marcarLeida = (id) => setNotificaciones(nots => nots.map(n => n.id === id ? { ...n, leida: true } : n))

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
      setIsMobile(window.innerWidth <= 900)
      if (window.innerWidth > 900) setSidebarOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    fetch('http://localhost:4000/notificaciones')
      .then(res => res.json())
      .then(data => {
        // Inicializar todas como no leídas en el frontend (por ahora)
        setNotificaciones(data.map(n => ({ ...n, leida: false })));
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
    <>
      {/* Botón hamburguesa solo en móvil */}
      {isMobile && !sidebarOpen && (
        <button
          className="sidebar-hamburger"
          style={{
            position: 'fixed',
            top: 18,
            left: 18,
            zIndex: 1300,
            background: 'rgba(20,20,30,0.92)',
            border: '2px solid #D4AF37',
            borderRadius: 8,
            padding: '8px 12px',
            boxShadow: '0 2px 12px #00000033',
          }}
          onClick={() => setSidebarOpen(true)}
        >
          <span style={{display:'block', width:24, height:3, background:'#D4AF37', marginBottom:5, borderRadius:2}}></span>
          <span style={{display:'block', width:24, height:3, background:'#D4AF37', marginBottom:5, borderRadius:2}}></span>
          <span style={{display:'block', width:24, height:3, background:'#D4AF37', borderRadius:2}}></span>
        </button>
      )}
      {/* Sidebar responsive */}
      <nav
        className="sidebar-navbar"
        style={{
          position: 'fixed',
          left: isMobile ? (sidebarOpen ? 0 : -320) : 0,
          top: 0,
          bottom: 0,
          width: 300,
          background: 'rgba(20,20,30,0.92)',
          backdropFilter: 'blur(12px)',
          borderRight: '2px solid #D4AF37',
          zIndex: 1200,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '100vh',
          boxShadow: '4px 0 24px #00000022',
          transition: 'left 0.3s',
        }}
      >
        {/* Botón cerrar en móvil */}
        {isMobile && sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            style={{position:'absolute', top:18, right:18, background:'none', border:'none', color:'#D4AF37', fontSize:32, zIndex:1301, cursor:'pointer', padding:0, lineHeight:1}}
            aria-label="Cerrar menú"
          >×</button>
        )}
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:32, padding:'3.5rem 0 1.5rem 0', position:'relative'}}>
          <div style={{display:'flex', alignItems:'center', gap:16, width:'100%', justifyContent:'center', position:'relative'}}>
            <Link to="/" className="text-primary-gold" style={{fontWeight:700, fontSize:'1.5rem', fontFamily:'Orbitron', letterSpacing:'1px', marginBottom:24}}>CriptoUNAM</Link>
            {/* Campana de notificaciones */}
            <button onClick={()=>setPanelNotif(v=>!v)} style={{background:'none', border:'none', position:'relative', cursor:'pointer', marginBottom:18, marginLeft:4}} aria-label="Notificaciones">
              <FontAwesomeIcon icon={faBell} style={{fontSize:'1.5rem', color:'#D4AF37'}} />
              {noLeidas > 0 && <span style={{position:'absolute', top:2, right:2, width:12, height:12, background:'#ff4444', borderRadius:'50%', border:'2px solid #18181b', display:'block'}}></span>}
            </button>
            {/* Panel de notificaciones */}
            {panelNotif && (
              <div style={{position:'absolute', left:'110%', top:0, background:'#18181b', color:'#fff', border:'1.5px solid #D4AF37', borderRadius:12, minWidth:260, maxWidth:340, boxShadow:'0 4px 24px #00000044', zIndex:2000, padding:'1.2rem 1rem', textAlign:'left'}}>
                <h4 style={{color:'#D4AF37', marginBottom:10, fontWeight:700, fontSize:'1.1rem'}}>Notificaciones</h4>
                {notificaciones.length === 0 && <div style={{color:'#aaa'}}>No hay notificaciones.</div>}
                {notificaciones.map(n=>(
                  <div key={n.id} style={{marginBottom:16, background:n.leida?'#23233a':'#1E3A8A22', borderRadius:8, padding:'0.7rem 0.8rem'}}>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, marginBottom:2}}>
                      <div style={{fontWeight:700, color:'#D4AF37', fontSize:'1.02rem'}}>{n.titulo}</div>
                      {!n.leida && <button onClick={()=>marcarLeida(n.id)} style={{background:'none', border:'none', color:'#34d399', fontWeight:700, fontSize:'0.95rem', cursor:'pointer', marginLeft:8}}>Marcar leída</button>}
                    </div>
                    <div style={{fontSize:'0.98rem', marginBottom:4}}>{n.mensaje}</div>
                    <div style={{fontSize:'0.85rem', color:'#aaa'}}>{n.fecha}</div>
                  </div>
                ))}
                <button onClick={()=>setPanelNotif(false)} style={{marginTop:8, background:'none', border:'none', color:'#D4AF37', fontWeight:700, cursor:'pointer', fontSize:'1rem'}}>Cerrar</button>
              </div>
            )}
          </div>
          <div className="sidebar-links" style={{display:'flex', flexDirection:'column', gap:18, width:'100%', alignItems:'center'}}>
            <Link to="/" className="nav-link-tech" style={{width:'90%', textAlign:'left', padding:'0.7rem 1.2rem', borderRadius:12}}>Home</Link>
            <Link to="/cursos" className="nav-link-tech" style={{width:'90%', textAlign:'left', padding:'0.7rem 1.2rem', borderRadius:12}}>Cursos</Link>
            <Link to="/comunidad" className="nav-link-tech" style={{width:'90%', textAlign:'left', padding:'0.7rem 1.2rem', borderRadius:12}}>Comunidad</Link>
            <Link to="/newsletter" className="nav-link-tech" style={{width:'90%', textAlign:'left', padding:'0.7rem 1.2rem', borderRadius:12}}>Newsletter</Link>
            <Link to="/juegos" className="nav-link">Juegos</Link>
          </div>
        </div>
        <div style={{padding:'2.2rem 0 2.2rem 0', display:'flex', flexDirection:'column', alignItems:'center', gap:24}}>
          <div className="wallet-section" style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center'}}>
            {isConnected ? (
              <div className="wallet-info-container" style={{display:'flex', flexDirection:'column', alignItems:'center', gap:12, background:'rgba(30,42,138,0.10)', borderRadius:14, padding:'1.2rem 1.2rem', boxShadow:'0 2px 8px #1E3A8A22', width:'100%', maxWidth:260}}>
                <appkit-account-button balance="show" />
                <div style={{display:'flex', gap:10, marginTop:6}}>
                  <Link to="/perfil" className="primary-button" style={{padding:'0.3rem 1.1rem', borderRadius:8, fontSize:'0.98rem', fontWeight:600, background:'#2563EB', color:'#fff', border:'none'}}>Perfil</Link>
                  <button className="secondary-button" onClick={() => disconnect()} style={{padding:'0.3rem 1.1rem', borderRadius:8, fontSize:'0.98rem', fontWeight:600, background:'#18181b', color:'#D4AF37', border:'1.5px solid #D4AF37'}}>Desconectar</button>
                </div>
              </div>
            ) : (
              <button className="primary-button login-mini" onClick={handleLogin} style={{width:'90%', maxWidth:240, minWidth:180, padding:'0.7rem 1.2rem', borderRadius:'2rem', fontWeight:700, fontSize:'1.05rem', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', boxSizing:'border-box'}}>
                Iniciar sesión / Conectar Wallet
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar 