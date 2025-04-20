import { useState, useEffect } from 'react'
import { useWallet } from '../context/WalletContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faWallet, 
  faNetworkWired,
  faGraduationCap, 
  faCalendarAlt, 
  faCertificate, 
  faTrophy,
  faBell,
  faBellSlash,
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons'
import '../styles/Perfil.css'

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
  const { walletAddress } = useWallet()
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

  useEffect(() => {
    const fetchUserData = async () => {
      if (!walletAddress) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        // Obtener nombre de la red
        const network = getNetworkName()
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
  }, [walletAddress])

  const getNetworkName = (): string => {
    const networks: { [key: number]: string } = {
      1: 'Ethereum Mainnet',
      5: 'Goerli Testnet',
      137: 'Polygon Mainnet',
      80001: 'Mumbai Testnet',
    }
    return networks[1] || `Chain ID: 1`
  }

  if (!walletAddress) {
    return (
      <div className="profile-page">
        <div className="connect-prompt">
          <h2>Conecta tu Wallet</h2>
          <p>Para ver tu perfil, necesitas conectar tu wallet primero.</p>
          <p>Usa el botón de conexión en la barra de navegación para conectar tu wallet.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Cargando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="header-content">
          <h1>Mi Perfil</h1>
        </div>
        <div className="wallet-info">
          <div className="info-card">
            <FontAwesomeIcon icon={faWallet} className="info-icon" />
            <h3>Dirección</h3>
            <p>{`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}</p>
          </div>
          <div className="info-card">
            <FontAwesomeIcon icon={faNetworkWired} className="info-icon" />
            <h3>Red</h3>
            <p>{networkName}</p>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="activity-stats">
        <div className="stat-card">
          <FontAwesomeIcon icon={faGraduationCap} className="stat-icon" />
          <div className="stat-number">{userProfile.cursosCompletados.length}</div>
          <div className="stat-label">Cursos Completados</div>
        </div>
        <div className="stat-card">
          <FontAwesomeIcon icon={faCalendarAlt} className="stat-icon" />
          <div className="stat-number">{userProfile.eventosAsistidos.length}</div>
          <div className="stat-label">Eventos Asistidos</div>
        </div>
        <div className="stat-card">
          <FontAwesomeIcon icon={faCertificate} className="stat-icon" />
          <div className="stat-number">{userProfile.certificaciones.length}</div>
          <div className="stat-label">Certificaciones</div>
        </div>
        <div className="stat-card">
          <FontAwesomeIcon icon={faTrophy} className="stat-icon" />
          <div className="stat-number">{userProfile.logros.length}</div>
          <div className="stat-label">Logros</div>
        </div>
      </div>

      <div className="profile-content">
        {/* Cursos Completados */}
        <section className="profile-section">
          <h2><FontAwesomeIcon icon={faGraduationCap} /> Mis Cursos</h2>
          <div className="courses-grid">
            {userProfile.cursosCompletados.map(curso => (
              <div key={curso.id} className="course-card">
                <div className="course-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress" 
                      style={{ width: `${curso.progreso}%` }}
                    >
                      {curso.progreso}%
                    </div>
                  </div>
                </div>
                <h3>{curso.titulo}</h3>
                <p className="course-date">
                  <FontAwesomeIcon icon={faCalendarAlt} /> {curso.fecha}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Eventos Asistidos */}
        <section className="profile-section">
          <h2><FontAwesomeIcon icon={faCalendarAlt} /> Eventos Asistidos</h2>
          <div className="events-grid">
            {userProfile.eventosAsistidos.map(evento => (
              <div key={evento.id} className="event-card">
                <h3>{evento.nombre}</h3>
                <p className="event-date">
                  <FontAwesomeIcon icon={faCalendarAlt} /> {evento.fecha}
                </p>
                <p className="event-type">
                  <FontAwesomeIcon icon={faNetworkWired} /> {evento.tipo}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Certificaciones */}
        <section className="profile-section">
          <h2><FontAwesomeIcon icon={faCertificate} /> Certificaciones</h2>
          <div className="certs-grid">
            {userProfile.certificaciones.map(cert => (
              <div key={cert.id} className="cert-card">
                <h3>{cert.nombre}</h3>
                <p className="cert-date">
                  <FontAwesomeIcon icon={faCalendarAlt} /> {cert.fecha}
                </p>
                <p className="cert-hash">
                  <FontAwesomeIcon icon={faNetworkWired} /> {cert.hash}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Configuración */}
        <section className="profile-section">
          <h2>Configuración</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <FontAwesomeIcon icon={userProfile.settings.emailNotifications ? faBell : faBellSlash} />
              <span>Notificaciones por Email</span>
              <button 
                className={`toggle-btn ${userProfile.settings.emailNotifications ? 'active' : ''}`}
                onClick={() => setUserProfile(prev => ({
                  ...prev,
                  settings: {
                    ...prev.settings,
                    emailNotifications: !prev.settings.emailNotifications
                  }
                }))}
              >
                {userProfile.settings.emailNotifications ? 'Activado' : 'Desactivado'}
              </button>
            </div>
            <div className="setting-item">
              <FontAwesomeIcon icon={userProfile.settings.pushNotifications ? faBell : faBellSlash} />
              <span>Notificaciones Push</span>
              <button 
                className={`toggle-btn ${userProfile.settings.pushNotifications ? 'active' : ''}`}
                onClick={() => setUserProfile(prev => ({
                  ...prev,
                  settings: {
                    ...prev.settings,
                    pushNotifications: !prev.settings.pushNotifications
                  }
                }))}
              >
                {userProfile.settings.pushNotifications ? 'Activado' : 'Desactivado'}
              </button>
            </div>
            <div className="setting-item">
              <FontAwesomeIcon icon={userProfile.settings.showActivity ? faEye : faEyeSlash} />
              <span>Mostrar Actividad</span>
              <button 
                className={`toggle-btn ${userProfile.settings.showActivity ? 'active' : ''}`}
                onClick={() => setUserProfile(prev => ({
                  ...prev,
                  settings: {
                    ...prev.settings,
                    showActivity: !prev.settings.showActivity
                  }
                }))}
              >
                {userProfile.settings.showActivity ? 'Activado' : 'Desactivado'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Perfil 