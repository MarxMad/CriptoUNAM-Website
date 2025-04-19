import React, { useState, useEffect } from 'react'
import { useWallet } from '../context/WalletContext'
import { ethers } from 'ethers'

interface UserProfile {
  cursosCompletados: {
    id: number;
    titulo: string;
    fecha: string;
    progreso: number;
  }[];
  eventosAsistidos: {
    id: number;
    nombre: string;
    fecha: string;
    tipo: string;
  }[];
  certificaciones: {
    id: number;
    nombre: string;
    fecha: string;
    hash: string;
  }[];
  logros: {
    id: number;
    nombre: string;
    descripcion: string;
    icono: string;
    fecha: string;
    nivel: 'bronce' | 'plata' | 'oro';
  }[];
  nfts: {
    id: number;
    nombre: string;
    descripcion: string;
    imagen: string;
    tokenId: string;
    openseaLink: string;
  }[];
  transacciones: {
    hash: string;
    tipo: string;
    descripcion: string;
    fecha: string;
    cantidad: string;
  }[];
  settings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    showActivity: boolean;
  };
}

const Perfil = () => {
  const { walletAddress, isConnected } = useWallet()
  const [balance, setBalance] = useState('0')
  const [networkName, setNetworkName] = useState<string>('')
  const [userProfile, setUserProfile] = useState<UserProfile>({
    cursosCompletados: [],
    eventosAsistidos: [],
    certificaciones: [],
    logros: [],
    nfts: [],
    transacciones: [],
    settings: {
      emailNotifications: true,
      pushNotifications: true,
      showActivity: true
    }
  })
  const [loading, setLoading] = useState(true)

  const getBalance = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const balance = await provider.getBalance(walletAddress)
      setBalance(ethers.formatEther(balance))
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      if (!walletAddress) return

      try {
        setLoading(true)
        // Obtener nombre de la red
        const network = getNetworkName(isConnected)
        setNetworkName(network)

        // Simular obtención de datos del usuario
        // En producción, esto vendría de tu backend o smart contract
        const mockUserData: UserProfile = {
          cursosCompletados: [
            {
              id: 1,
              titulo: "Introducción a Blockchain",
              fecha: "2024-02-15",
              progreso: 100
            },
            {
              id: 2,
              titulo: "Smart Contracts con Solidity",
              fecha: "2024-03-01",
              progreso: 75
            }
          ],
          eventosAsistidos: [
            {
              id: 1,
              nombre: "Hackathon Web3 2024",
              fecha: "2024-03-15",
              tipo: "Presencial"
            },
            {
              id: 2,
              nombre: "DeFi Workshop",
              fecha: "2024-02-20",
              tipo: "Virtual"
            }
          ],
          certificaciones: [
            {
              id: 1,
              nombre: "Blockchain Developer Level 1",
              fecha: "2024-03-01",
              hash: "0x123..."
            }
          ],
          logros: [
            {
              id: 1,
              nombre: "Primer Curso Completado",
              descripcion: "Completaste tu primer curso",
              icono: "fa-certificate",
              fecha: "2024-02-15",
              nivel: 'bronce'
            },
            {
              id: 2,
              nombre: "Primer Evento Asistido",
              descripcion: "Asististe a tu primer evento",
              icono: "fa-calendar-alt",
              fecha: "2024-02-20",
              nivel: 'bronce'
            },
            {
              id: 3,
              nombre: "Primer Certificado Obtenido",
              descripcion: "Obtuviste tu primer certificado",
              icono: "fa-award",
              fecha: "2024-03-01",
              nivel: 'bronce'
            }
          ],
          nfts: [
            {
              id: 1,
              nombre: "NFT 1",
              descripcion: "Descripción del NFT 1",
              imagen: "https://example.com/nft1.jpg",
              tokenId: "0x123...",
              openseaLink: "https://opensea.io/asset/0x123..."
            },
            {
              id: 2,
              nombre: "NFT 2",
              descripcion: "Descripción del NFT 2",
              imagen: "https://example.com/nft2.jpg",
              tokenId: "0x456...",
              openseaLink: "https://opensea.io/asset/0x456..."
            }
          ],
          transacciones: [
            {
              hash: "0x123...",
              tipo: "envio",
              descripcion: "Transferencia a 0x123...",
              fecha: "2024-03-01",
              cantidad: "0.1"
            },
            {
              hash: "0x456...",
              tipo: "envio",
              descripcion: "Transferencia a 0x456...",
              fecha: "2024-03-02",
              cantidad: "0.05"
            }
          ],
          settings: {
            emailNotifications: true,
            pushNotifications: true,
            showActivity: true
          }
        }

        setUserProfile(mockUserData)
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [walletAddress, isConnected])

  const getNetworkName = (isConnected: boolean): string => {
    const networks: { [key: number]: string } = {
      1: 'Ethereum Mainnet',
      5: 'Goerli Testnet',
      137: 'Polygon Mainnet',
      80001: 'Mumbai Testnet',
      // Agregar más redes según necesites
    }
    return isConnected ? networks[isConnected] || `Chain ID: ${isConnected}` : 'No conectado'
  }

  if (!walletAddress) {
    return (
      <div className="profile-page">
        <div className="connect-prompt">
          <h2>Conecta tu Wallet</h2>
          <p>Para ver tu perfil, necesitas conectar tu wallet primero.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading">Cargando perfil...</div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Mi Perfil</h1>
        <div className="wallet-info">
          <div className="info-card">
            <h3>Dirección</h3>
            <p>{`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}</p>
          </div>
          <div className="info-card">
            <h3>Balance</h3>
            <p>{`${Number(balance).toFixed(4)} ETH`}</p>
          </div>
          <div className="info-card">
            <h3>Red</h3>
            <p>{networkName}</p>
          </div>
        </div>
      </div>

      <div className="profile-content">
        {/* Cursos Completados */}
        <section className="profile-section">
          <h2>Mis Cursos</h2>
          <div className="courses-grid">
            {userProfile.cursosCompletados.map(curso => (
              <div key={curso.id} className="course-card">
                <div className="course-progress">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${curso.progreso}%` }}
                  ></div>
                </div>
                <h3>{curso.titulo}</h3>
                <p>Completado: {curso.fecha}</p>
                <p className="progress-text">{curso.progreso}%</p>
              </div>
            ))}
          </div>
        </section>

        {/* Eventos Asistidos */}
        <section className="profile-section">
          <h2>Eventos Asistidos</h2>
          <div className="events-grid">
            {userProfile.eventosAsistidos.map(evento => (
              <div key={evento.id} className="event-card">
                <div className="event-type">{evento.tipo}</div>
                <h3>{evento.nombre}</h3>
                <p>{evento.fecha}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Certificaciones */}
        <section className="profile-section">
          <h2>Certificaciones</h2>
          <div className="certs-grid">
            {userProfile.certificaciones.map(cert => (
              <div key={cert.id} className="cert-card">
                <i className="fas fa-certificate"></i>
                <h3>{cert.nombre}</h3>
                <p>{cert.fecha}</p>
                <a 
                  href={`https://etherscan.io/tx/${cert.hash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="verify-link"
                >
                  Verificar en Blockchain
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Logros Desbloqueados */}
        <section className="profile-section">
          <h2>Logros Desbloqueados</h2>
          <div className="achievements-grid">
            {userProfile.logros.map(logro => (
              <div key={logro.id} className={`achievement-card ${logro.nivel}`}>
                <i className={`fas ${logro.icono}`}></i>
                <h3>{logro.nombre}</h3>
                <p>{logro.descripcion}</p>
                <span className="achievement-date">{logro.fecha}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Mis NFTs */}
        <section className="profile-section">
          <h2>Mis NFTs</h2>
          <div className="nfts-grid">
            {userProfile.nfts.map(nft => (
              <div key={nft.id} className="nft-card">
                <img src={nft.imagen} alt={nft.nombre} />
                <div className="nft-info">
                  <h3>{nft.nombre}</h3>
                  <p>{nft.descripcion}</p>
                  <div className="nft-details">
                    <span>Token ID: {nft.tokenId}</span>
                    <a href={nft.openseaLink} target="_blank" rel="noopener noreferrer">
                      Ver en OpenSea
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Historial de Transacciones */}
        <section className="profile-section">
          <h2>Historial de Transacciones</h2>
          <div className="transactions-list">
            {userProfile.transacciones.map(tx => (
              <div key={tx.hash} className="transaction-item">
                <div className="tx-type">
                  <i className={`fas ${tx.tipo === 'envio' ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
                </div>
                <div className="tx-info">
                  <h4>{tx.descripcion}</h4>
                  <p>{tx.fecha}</p>
                </div>
                <div className="tx-amount">
                  <span className={tx.tipo}>{tx.cantidad} ETH</span>
                  <a href={`https://etherscan.io/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer">
                    Ver en Etherscan
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Configuración */}
        <section className="profile-section">
          <h2>Configuración</h2>
          <div className="settings-grid">
            <div className="setting-card">
              <h3>Notificaciones</h3>
              <div className="setting-options">
                <label className="switch">
                  <input type="checkbox" checked={userProfile.settings.emailNotifications} />
                  <span className="slider"></span>
                  Notificaciones por Email
                </label>
                <label className="switch">
                  <input type="checkbox" checked={userProfile.settings.pushNotifications} />
                  <span className="slider"></span>
                  Notificaciones Push
                </label>
              </div>
            </div>
            <div className="setting-card">
              <h3>Privacidad</h3>
              <div className="setting-options">
                <label className="switch">
                  <input type="checkbox" checked={userProfile.settings.showActivity} />
                  <span className="slider"></span>
                  Mostrar Actividad Pública
                </label>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Perfil 