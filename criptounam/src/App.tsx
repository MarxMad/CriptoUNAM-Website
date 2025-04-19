import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'
import Cursos from './pages/Cursos'
import Comunidad from './pages/Comunidad'
import Home from './pages/Home'
import Perfil from './pages/Perfil'
import Newsletter from './pages/Newsletter'
import NewsletterEntry from './pages/NewsletterEntry'
import { WalletProvider, useWallet } from './context/WalletContext'
import { ThemeProvider } from './context/ThemeContext'
import ThemeToggle from './components/ThemeToggle'
import './App.css'
import RegistroCurso from './pages/RegistroCurso'

function AppContent() {
  const { walletAddress, isConnected, connectWallet, disconnectWallet } = useWallet()
  const [showWalletOptions, setShowWalletOptions] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')

  const showTemporaryNotification = (message: string) => {
    setNotificationMessage(message)
    setShowNotification(true)
    setTimeout(() => {
      setShowNotification(false)
    }, 3000)
  }

  const handleConnectWallet = async (provider: string) => {
    try {
      await connectWallet(provider)
      setShowWalletOptions(false)
      showTemporaryNotification('¡Wallet conectada exitosamente!')
    } catch (error) {
      console.error('Error al conectar wallet:', error)
      showTemporaryNotification('Error al conectar wallet')
    }
  }

  const handleDisconnectWallet = () => {
    disconnectWallet()
    showTemporaryNotification('Wallet desconectada')
  }

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <Link to="/" className="logo-link">
            <img src="/images/LogosCriptounam3.svg" alt="CriptoUNAM Logo" className="logo" />
          </Link>
          <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Inicio</Link>
            <Link to="/cursos" onClick={() => setIsMobileMenuOpen(false)}>Cursos</Link>
            <Link to="/comunidad" onClick={() => setIsMobileMenuOpen(false)}>Comunidad</Link>
            <Link to="/newsletter" onClick={() => setIsMobileMenuOpen(false)}>Newsletter</Link>
            <Link to="/perfil" onClick={() => setIsMobileMenuOpen(false)}>Mi Perfil</Link>
            <div className="wallet-container">
              {isConnected ? (
                <div className="wallet-connected">
                  <button 
                    className="connect-wallet-btn connected"
                    onClick={() => setShowWalletOptions(!showWalletOptions)}
                  >
                    <i className="fas fa-wallet"></i>
                    {formatAddress(walletAddress)}
                  </button>
                  {showWalletOptions && (
                    <div className="wallet-options">
                      <p className="wallet-address">
                        Conectado: {formatAddress(walletAddress)}
                      </p>
                      <button onClick={handleDisconnectWallet}>
                        <i className="fas fa-sign-out-alt"></i>
                        Desconectar Wallet
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button 
                    className="connect-wallet-btn"
                    onClick={() => setShowWalletOptions(!showWalletOptions)}
                  >
                    <i className="fas fa-wallet"></i>
                    Conectar Wallet
                  </button>
                  {showWalletOptions && (
                    <div className="wallet-options">
                      <button onClick={() => handleConnectWallet('metamask')}>
                        <img src="/metamask-logo.png" alt="MetaMask" />
                        MetaMask
                      </button>
                      <button onClick={() => handleConnectWallet('coinbase')}>
                        <img src="/coinbase-logo.png" alt="Coinbase" />
                        Coinbase Wallet
                      </button>
                      <button onClick={() => handleConnectWallet('walletconnect')}>
                        <img src="/walletconnect-logo.png" alt="WalletConnect" />
                        WalletConnect
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <ThemeToggle />
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>
        </nav>

        {/* Notification Popup */}
        {showNotification && (
          <div className="notification-popup">
            {notificationMessage}
          </div>
        )}

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/comunidad" element={<Comunidad />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/newsletter" element={<Newsletter />} />
            <Route path="/newsletter/:id" element={<NewsletterEntry />} />
            <Route path="/curso/:id/registro" element={<RegistroCurso />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

function App() {
  return (
    <ThemeProvider>
      <WalletProvider>
        <AppContent />
      </WalletProvider>
    </ThemeProvider>
  )
}

export default App
