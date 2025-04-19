import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'
import Cursos from './pages/Cursos'
import Comunidad from './pages/Comunidad'
import Home from './pages/Home'
import Perfil from './pages/Perfil'
import Newsletter from './pages/Newsletter'
import NewsletterEntry from './pages/NewsletterEntry'
import { WalletProvider } from './context/WalletContext'
import { ThemeProvider } from './context/ThemeContext'
import ThemeToggle from './components/ThemeToggle'
import './App.css'
import RegistroCurso from './pages/RegistroCurso'

function App() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
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

  const connectWallet = async (provider: string) => {
    try {
      let ethereum;
      
      switch(provider) {
        case 'metamask':
          ethereum = (window as any).ethereum;
          if (!ethereum) {
            showTemporaryNotification('Por favor instala MetaMask!')
            return;
          }
          break;
        case 'coinbase':
          ethereum = (window as any).coinbaseWalletExtension;
          if (!ethereum) {
            showTemporaryNotification('Por favor instala Coinbase Wallet!')
            return;
          }
          break;
        case 'walletconnect':
          // Implementar WalletConnect
          break;
      }

      if (ethereum) {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
        setShowWalletOptions(false);
        showTemporaryNotification('¡Wallet conectada exitosamente!')
      }
    } catch (error) {
      console.error('Error al conectar wallet:', error);
      showTemporaryNotification('Error al conectar wallet')
    }
  }

  const disconnectWallet = () => {
    setWalletConnected(false)
    setWalletAddress('')
    showTemporaryNotification('Wallet desconectada')
  }

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

  return (
    <ThemeProvider>
      <WalletProvider>
        <Router>
          <div className="App">
            <nav className="navbar">
              <Link to="/" className="logo-link">
                <img src="src/assets/images/LogosCriptounam3.svg" alt="CriptoUNAM Logo" className="logo" />
              </Link>
              <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
                <Link to="/">Inicio</Link>
                <Link to="/cursos">Cursos</Link>
                <Link to="/comunidad">Comunidad</Link>
                <Link to="/newsletter">Newsletter</Link>
                <Link to="/perfil">Mi Perfil</Link>
                <div className="wallet-container">
                  {walletConnected ? (
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
                          <button onClick={disconnectWallet}>
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
                          <button onClick={() => connectWallet('metamask')}>
                            <img src="/metamask-logo.png" alt="MetaMask" />
                            MetaMask
                          </button>
                          <button onClick={() => connectWallet('coinbase')}>
                            <img src="/coinbase-logo.png" alt="Coinbase" />
                            Coinbase Wallet
                          </button>
                          <button onClick={() => connectWallet('walletconnect')}>
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
      </WalletProvider>
    </ThemeProvider>
  )
}

export default App
