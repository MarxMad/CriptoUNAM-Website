import { useState, useEffect } from 'react'
import { useAccount, useBalance, useContractRead } from 'wagmi'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import OnRampButton from '../components/OnRampButton'
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
  faEyeSlash,
  faCoins,
  faCopy,
  faCheck,
  faUser,
  faChartLine,
  faCog,
  faHistory,
  faAward,
  faGamepad,
  faBookOpen,
  faGem,
  faFire,
  faShield,
  faLink,
  faExternalLinkAlt,
  faEdit
} from '@fortawesome/free-solid-svg-icons'
import { formatEther } from 'viem'
import '../styles/global.css'

// ABI para el contrato de certificados
const CERTIFICATE_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserCertificates",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  }
]

// ABI para el contrato de cursos
const COURSE_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserCourses",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  }
]

interface UserProfile {
  cursosCompletados: {
    id: number;
    titulo: string;
    fecha: string;
    progreso: number;
    certificadoHash?: string;
    categoria: string;
    nivel: 'principiante' | 'intermedio' | 'avanzado';
  }[];
  eventosAsistidos: {
    id: number;
    nombre: string;
    fecha: string;
    tipo: string;
    asistenciaVerificada: boolean;
  }[];
  certificaciones: {
    id: number;
    nombre: string;
    fecha: string;
    hash: string;
    red: string;
    verificada: boolean;
  }[];
  logros: {
    id: number;
    nombre: string;
    descripcion: string;
    icono: string;
    fecha: string;
    nivel: 'bronce' | 'plata' | 'oro';
    progreso: number;
    completado: boolean;
  }[];
  nfts: {
    id: number;
    nombre: string;
    descripcion: string;
    imagen: string;
    tokenId: string;
    openseaLink: string;
    rareza: string;
  }[];
  transacciones: {
    hash: string;
    tipo: string;
    descripcion: string;
    fecha: string;
    cantidad: string;
    estado: 'completada' | 'pendiente' | 'fallida';
  }[];
  actividad: {
    id: number;
    tipo: 'curso' | 'certificacion' | 'evento' | 'logro' | 'nft';
    titulo: string;
    descripcion: string;
    fecha: string;
    icono: string;
  }[];
  settings: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    showActivity: boolean;
    profileVisibility: 'publico' | 'privado' | 'amigos';
  };
  stats: {
    totalCursos: number;
    horasEstudio: number;
    certificacionesObtenidas: number;
    eventosAsistidos: number;
    nftsColeccionados: number;
    puntosExperiencia: number;
    racha: number;
    nivel: number;
  };
}

const NETWORKS: Record<number, { name: string; logo: string; color: string }> = {
  1: { name: 'Ethereum', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026', color: '#627EEA' },
  5: { name: 'Goerli', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026', color: '#627EEA' },
  11155111: { name: 'Sepolia', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026', color: '#627EEA' },
  137: { name: 'Polygon', logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png?v=026', color: '#8247E5' },
  80001: { name: 'Polygon Mumbai', logo: 'https://cryptologos.cc/logos/polygon-matic-logo.png?v=026', color: '#8247E5' },
  56: { name: 'Binance Smart Chain', logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png?v=026', color: '#F3BA2F' },
  97: { name: 'BSC Testnet', logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png?v=026', color: '#F3BA2F' },
  42161: { name: 'Arbitrum One', logo: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png?v=026', color: '#28A0F0' },
  10: { name: 'Optimism', logo: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png?v=026', color: '#FF0420' },
  43114: { name: 'Avalanche C-Chain', logo: 'https://cryptologos.cc/logos/avalanche-avax-logo.png?v=026', color: '#E84142' },
}

const getChainId = () => {
  if (window && (window as any).ethereum && (window as any).ethereum.networkVersion) {
    return parseInt((window as any).ethereum.networkVersion)
  }
  return undefined
}

// Función para generar avatar basado en address
const generateAvatar = (address: string) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']
  const hash = address.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  return colors[Math.abs(hash) % colors.length]
}

// Datos de ejemplo mejorados
const generateMockData = (address: string): UserProfile => ({
  cursosCompletados: [
    {
      id: 1,
      titulo: "Fundamentos de Blockchain",
      fecha: "2024-03-15",
      progreso: 100,
      certificadoHash: "0x123...abc",
      categoria: "Blockchain Básico",
      nivel: 'principiante'
    },
    {
      id: 2,
      titulo: "Desarrollo Smart Contracts",
      fecha: "2024-04-20",
      progreso: 85,
      categoria: "Desarrollo",
      nivel: 'intermedio'
    },
    {
      id: 3,
      titulo: "DeFi Avanzado",
      fecha: "2024-05-10",
      progreso: 60,
      categoria: "Finanzas Descentralizadas",
      nivel: 'avanzado'
    }
  ],
  eventosAsistidos: [
    {
      id: 1,
      nombre: "CriptoUNAM Summit 2024",
      fecha: "2024-06-15",
      tipo: "Conferencia",
      asistenciaVerificada: true
    },
    {
      id: 2,
      nombre: "Hackathon Blockchain México",
      fecha: "2024-07-01",
      tipo: "Hackathon",
      asistenciaVerificada: true
    }
  ],
  certificaciones: [
    {
      id: 1,
      nombre: "Certified Blockchain Developer",
      fecha: "2024-03-20",
      hash: "0x456...def",
      red: "Polygon",
      verificada: true
    }
  ],
  logros: [
    {
      id: 1,
      nombre: "Primer Curso Completado",
      descripcion: "Completa tu primer curso en la plataforma",
      icono: "graduation-cap",
      fecha: "2024-03-15",
      nivel: 'bronce',
      progreso: 100,
      completado: true
    },
    {
      id: 2,
      nombre: "Explorador Blockchain",
      descripcion: "Completa 5 cursos diferentes",
      icono: "compass",
      fecha: "2024-05-10",
      nivel: 'plata',
      progreso: 60,
      completado: false
    },
    {
      id: 3,
      nombre: "Maestro Cripto",
      descripcion: "Obtén 10 certificaciones",
      icono: "crown",
      fecha: "",
      nivel: 'oro',
      progreso: 10,
      completado: false
    }
  ],
  nfts: [
    {
      id: 1,
      nombre: "CriptoUNAM Genesis",
      descripcion: "NFT conmemorativo del primer evento",
      imagen: "/images/nft-placeholder.png",
      tokenId: "001",
      openseaLink: "#",
      rareza: "Legendary"
    }
  ],
  transacciones: [
    {
      hash: "0x789...ghi",
      tipo: "Certificación",
      descripcion: "Certificado Blockchain Developer",
      fecha: "2024-03-20",
      cantidad: "0.01 ETH",
      estado: 'completada'
    }
  ],
  actividad: [
    {
      id: 1,
      tipo: 'curso',
      titulo: "Nuevo curso completado",
      descripcion: "Fundamentos de Blockchain",
      fecha: "2024-03-15",
      icono: "graduation-cap"
    },
    {
      id: 2,
      tipo: 'certificacion',
      titulo: "Certificación obtenida",
      descripcion: "Certified Blockchain Developer",
      fecha: "2024-03-20",
      icono: "certificate"
    }
  ],
  settings: {
    emailNotifications: true,
    pushNotifications: true,
    showActivity: true,
    profileVisibility: 'publico'
  },
  stats: {
    totalCursos: 3,
    horasEstudio: 45,
    certificacionesObtenidas: 1,
    eventosAsistidos: 2,
    nftsColeccionados: 1,
    puntosExperiencia: 1250,
    racha: 7,
    nivel: 3
  }
})

const Perfil = () => {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })
  
  const [networkName, setNetworkName] = useState<string>('')
  const [networkLogo, setNetworkLogo] = useState<string>('')
  const [networkColor, setNetworkColor] = useState<string>('#D4AF37')
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cursos' | 'certificaciones' | 'nfts' | 'logros' | 'actividad' | 'configuracion'>('dashboard')
  const [isEditing, setIsEditing] = useState(false)

  // Leer certificados del contrato
  const { data: certificates } = useContractRead({
    address: '0x...', // Dirección del contrato de certificados
    abi: CERTIFICATE_ABI,
    functionName: 'getUserCertificates',
    args: [address],
  })

  // Leer cursos del contrato
  const { data: courses } = useContractRead({
    address: '0x...', // Dirección del contrato de cursos
    abi: COURSE_ABI,
    functionName: 'getUserCourses',
    args: [address],
  })

  useEffect(() => {
    const fetchUserData = async () => {
      if (!address) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        // Deducir nombre de la red por chainId
        const chainId = getChainId()
        if (chainId && NETWORKS[chainId]) {
          setNetworkName(NETWORKS[chainId].name)
          setNetworkLogo(NETWORKS[chainId].logo)
          setNetworkColor(NETWORKS[chainId].color)
        } else {
          setNetworkName('Desconocida')
          setNetworkLogo('')
          setNetworkColor('#D4AF37')
        }

        // Por ahora usamos datos mock, después se conectará a la blockchain
        const userData = generateMockData(address)
        setUserProfile(userData)

      } catch (error) {
        console.error('Error al cargar datos del usuario:', error)
        setUserProfile(generateMockData(address))
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [address, certificates, courses])

  // Actualiza red y logo al cambiar de red
  useEffect(() => {
    const updateNetwork = () => {
      const chainId = getChainId()
      if (chainId && NETWORKS[chainId]) {
        setNetworkName(NETWORKS[chainId].name)
        setNetworkLogo(NETWORKS[chainId].logo)
        setNetworkColor(NETWORKS[chainId].color)
      } else if (chainId) {
        setNetworkName(`Chain ID: ${chainId}`)
        setNetworkLogo('')
        setNetworkColor('#D4AF37')
      } else {
        setNetworkName('Desconocida')
        setNetworkLogo('')
        setNetworkColor('#D4AF37')
      }
    }
    updateNetwork()
    if (window && (window as any).ethereum) {
      (window as any).ethereum.on('chainChanged', updateNetwork)
      return () => {
        (window as any).ethereum.removeListener('chainChanged', updateNetwork)
      }
    }
  }, [address])

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const renderDashboard = () => (
    <div className="dashboard-content">
      {/* Estadísticas principales */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
            <FontAwesomeIcon icon={faGraduationCap} />
          </div>
          <div className="stat-content">
            <h3>{userProfile?.stats.totalCursos}</h3>
            <p>Cursos Completados</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
            <FontAwesomeIcon icon={faCertificate} />
          </div>
          <div className="stat-content">
            <h3>{userProfile?.stats.certificacionesObtenidas}</h3>
            <p>Certificaciones</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
            <FontAwesomeIcon icon={faFire} />
          </div>
          <div className="stat-content">
            <h3>{userProfile?.stats.racha}</h3>
            <p>Días de Racha</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon" style={{background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'}}>
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <div className="stat-content">
            <h3>{userProfile?.stats.puntosExperiencia}</h3>
            <p>Puntos XP</p>
          </div>
        </div>
      </div>

      {/* Progreso de nivel */}
      <div className="level-progress card">
        <h3>
          <FontAwesomeIcon icon={faShield} />
          Nivel {userProfile?.stats.nivel}
        </h3>
        <div className="level-bar">
          <div 
            className="level-fill" 
            style={{width: `${((userProfile?.stats.puntosExperiencia || 0) % 500) / 5}%`}}
          ></div>
        </div>
        <p>{userProfile?.stats.puntosExperiencia} / {(userProfile?.stats.nivel || 1) * 500} XP para el siguiente nivel</p>
      </div>

      {/* Logros recientes */}
      <div className="recent-achievements card">
        <h3>
          <FontAwesomeIcon icon={faTrophy} />
          Logros Recientes
        </h3>
        <div className="achievements-list">
          {userProfile?.logros.filter(logro => logro.completado).slice(0, 3).map(logro => (
            <div key={logro.id} className="achievement-item">
              <div className={`achievement-badge ${logro.nivel}`}>
                <FontAwesomeIcon icon={faAward} />
              </div>
              <div className="achievement-info">
                <h4>{logro.nombre}</h4>
                <p>{logro.descripcion}</p>
                <span className="achievement-date">{new Date(logro.fecha).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderCursos = () => (
    <div className="courses-content">
      <div className="courses-header">
        <h3>
          <FontAwesomeIcon icon={faBookOpen} />
          Mis Cursos ({userProfile?.cursosCompletados.length})
        </h3>
      </div>
      <div className="courses-grid">
        {userProfile?.cursosCompletados.map(curso => (
          <div key={curso.id} className="course-card-modern">
            <div className="course-header">
              <div className={`course-level ${curso.nivel}`}>
                {curso.nivel}
              </div>
              <div className="course-category">{curso.categoria}</div>
            </div>
            <div className="course-content">
              <h4>{curso.titulo}</h4>
              <div className="course-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{width: `${curso.progreso}%`}}
                  ></div>
                </div>
                <span className="progress-text">{curso.progreso}%</span>
              </div>
              <div className="course-footer">
                <span className="course-date">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  {new Date(curso.fecha).toLocaleDateString()}
                </span>
                {curso.certificadoHash && (
                  <button className="certificate-btn">
                    <FontAwesomeIcon icon={faCertificate} />
                    Certificado
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderCertificaciones = () => (
    <div className="certificates-content">
      <div className="certificates-header">
        <h3>
          <FontAwesomeIcon icon={faCertificate} />
          Certificaciones Verificadas ({userProfile?.certificaciones.length})
        </h3>
      </div>
      <div className="certificates-grid">
        {userProfile?.certificaciones.map(cert => (
          <div key={cert.id} className="certificate-card-modern">
            <div className="certificate-status">
              {cert.verificada ? (
                <span className="verified">
                  <FontAwesomeIcon icon={faCheck} />
                  Verificada
                </span>
              ) : (
                <span className="pending">
                  <FontAwesomeIcon icon={faHistory} />
                  Pendiente
                </span>
              )}
            </div>
            <div className="certificate-content">
              <h4>{cert.nombre}</h4>
              <div className="certificate-details">
                <p>
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  {new Date(cert.fecha).toLocaleDateString()}
                </p>
                <p>
                  <FontAwesomeIcon icon={faNetworkWired} />
                  {cert.red}
                </p>
              </div>
              <div className="certificate-actions">
                <button 
                  className="view-blockchain-btn"
                  onClick={() => window.open(`https://polygonscan.com/tx/${cert.hash}`, '_blank')}
                >
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                  Ver en Blockchain
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderNFTs = () => (
    <div className="nfts-content">
      <div className="nfts-header">
        <h3>
          <FontAwesomeIcon icon={faGem} />
          Mi Colección NFT ({userProfile?.nfts.length})
        </h3>
      </div>
      <div className="nfts-grid">
        {userProfile?.nfts.map(nft => (
          <div key={nft.id} className="nft-card-modern">
            <div className="nft-image">
              <img src={nft.imagen} alt={nft.nombre} />
              <div className="nft-rarity">{nft.rareza}</div>
            </div>
            <div className="nft-content">
              <h4>{nft.nombre}</h4>
              <p>{nft.descripcion}</p>
              <div className="nft-id">Token ID: #{nft.tokenId}</div>
              <button 
                className="opensea-btn"
                onClick={() => window.open(nft.openseaLink, '_blank')}
              >
                <FontAwesomeIcon icon={faExternalLinkAlt} />
                Ver en OpenSea
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderLogros = () => (
    <div className="achievements-content">
      <div className="achievements-header">
        <h3>
          <FontAwesomeIcon icon={faTrophy} />
          Logros y Insignias
        </h3>
      </div>
      <div className="achievements-grid">
        {userProfile?.logros.map(logro => (
          <div key={logro.id} className={`achievement-card ${logro.completado ? 'completed' : 'incomplete'}`}>
            <div className={`achievement-icon ${logro.nivel}`}>
              <FontAwesomeIcon icon={faAward} />
            </div>
            <div className="achievement-content">
              <h4>{logro.nombre}</h4>
              <p>{logro.descripcion}</p>
              {!logro.completado && (
                <div className="achievement-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${logro.progreso}%`}}
                    ></div>
                  </div>
                  <span>{logro.progreso}%</span>
                </div>
              )}
              {logro.completado && (
                <div className="achievement-date">
                  Desbloqueado el {new Date(logro.fecha).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderActividad = () => (
    <div className="activity-content">
      <div className="activity-header">
        <h3>
          <FontAwesomeIcon icon={faHistory} />
          Actividad Reciente
        </h3>
      </div>
      <div className="activity-timeline">
        {userProfile?.actividad.map(actividad => (
          <div key={actividad.id} className="activity-item">
            <div className={`activity-icon ${actividad.tipo}`}>
              <FontAwesomeIcon icon={faGraduationCap} />
            </div>
            <div className="activity-content">
              <h4>{actividad.titulo}</h4>
              <p>{actividad.descripcion}</p>
              <span className="activity-date">
                {new Date(actividad.fecha).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderConfiguracion = () => (
    <div className="settings-content">
      <div className="settings-header">
        <h3>
          <FontAwesomeIcon icon={faCog} />
          Configuración de Perfil
        </h3>
      </div>
      <div className="settings-sections">
        <div className="settings-section card">
          <h4>Notificaciones</h4>
          <div className="settings-options">
            <div className="setting-item">
              <label>
                <input 
                  type="checkbox" 
                  checked={userProfile?.settings.emailNotifications} 
                  onChange={() => {}}
                />
                <span>Notificaciones por email</span>
              </label>
            </div>
            <div className="setting-item">
              <label>
                <input 
                  type="checkbox" 
                  checked={userProfile?.settings.pushNotifications} 
                  onChange={() => {}}
                />
                <span>Notificaciones push</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="settings-section card">
          <h4>Privacidad</h4>
          <div className="settings-options">
            <div className="setting-item">
              <label>Visibilidad del perfil</label>
              <select value={userProfile?.settings.profileVisibility} onChange={() => {}}>
                <option value="publico">Público</option>
                <option value="privado">Privado</option>
                <option value="amigos">Solo amigos</option>
              </select>
            </div>
            <div className="setting-item">
              <label>
                <input 
                  type="checkbox" 
                  checked={userProfile?.settings.showActivity} 
                  onChange={() => {}}
                />
                <span>Mostrar actividad reciente</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (!isConnected || !address) {
    return (
      <div className="profile-page">
        <div className="connect-prompt card">
          <div className="connect-icon">
            <FontAwesomeIcon icon={faWallet} />
          </div>
          <h2>Conecta tu Wallet</h2>
          <p>Para acceder a tu perfil personalizado y ver tus logros, necesitas conectar tu wallet Web3.</p>
          <div className="connect-features">
            <div className="feature">
              <FontAwesomeIcon icon={faShield} />
              <span>Seguro y privado</span>
            </div>
            <div className="feature">
              <FontAwesomeIcon icon={faGraduationCap} />
              <span>Cursos y certificaciones</span>
            </div>
            <div className="feature">
              <FontAwesomeIcon icon={faTrophy} />
              <span>Logros y recompensas</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-modern">
          <div className="loading-spinner-modern"></div>
          <h3>Cargando tu perfil...</h3>
          <p>Obteniendo datos de la blockchain</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page-modern">
      {/* Header del perfil */}
      <div className="profile-header-modern">
        <div className="profile-hero">
          <div className="profile-avatar">
            <div 
              className="avatar-circle"
              style={{
                background: `linear-gradient(135deg, ${generateAvatar(address)} 0%, ${networkColor} 100%)`
              }}
            >
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div className="avatar-level">
              Nivel {userProfile?.stats.nivel}
            </div>
          </div>
          
          <div className="profile-info">
            <div className="profile-main">
              <h1>Mi Perfil CriptoUNAM</h1>
              <div className="wallet-address">
                <FontAwesomeIcon icon={faWallet} />
                <span>{formatAddress(address)}</span>
                <button
                  className="copy-btn-modern"
                  onClick={copyAddress}
                  title="Copiar dirección completa"
                >
                  <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                </button>
              </div>
            </div>
            
            <div className="profile-network">
              <div className="network-info">
                {networkLogo && (
                  <img src={networkLogo} alt={networkName} className="network-logo" />
                )}
                <span>{networkName}</span>
              </div>
              {balance && (
                <div className="balance-info">
                  <FontAwesomeIcon icon={faCoins} />
                  <span>{parseFloat(formatEther(balance.value)).toFixed(4)} {balance.symbol}</span>
                </div>
              )}
              
              {/* Botón de On-Ramp para comprar criptomonedas */}
              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
                <OnRampButton variant="primary" size="md" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación por tabs */}
      <div className="profile-nav">
        <button 
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <FontAwesomeIcon icon={faChartLine} />
          Dashboard
        </button>
        <button 
          className={`nav-tab ${activeTab === 'cursos' ? 'active' : ''}`}
          onClick={() => setActiveTab('cursos')}
        >
          <FontAwesomeIcon icon={faBookOpen} />
          Cursos
        </button>
        <button 
          className={`nav-tab ${activeTab === 'certificaciones' ? 'active' : ''}`}
          onClick={() => setActiveTab('certificaciones')}
        >
          <FontAwesomeIcon icon={faCertificate} />
          Certificaciones
        </button>
        <button 
          className={`nav-tab ${activeTab === 'nfts' ? 'active' : ''}`}
          onClick={() => setActiveTab('nfts')}
        >
          <FontAwesomeIcon icon={faGem} />
          NFTs
        </button>
        <button 
          className={`nav-tab ${activeTab === 'logros' ? 'active' : ''}`}
          onClick={() => setActiveTab('logros')}
        >
          <FontAwesomeIcon icon={faTrophy} />
          Logros
        </button>
        <button 
          className={`nav-tab ${activeTab === 'actividad' ? 'active' : ''}`}
          onClick={() => setActiveTab('actividad')}
        >
          <FontAwesomeIcon icon={faHistory} />
          Actividad
        </button>
        <button 
          className={`nav-tab ${activeTab === 'configuracion' ? 'active' : ''}`}
          onClick={() => setActiveTab('configuracion')}
        >
          <FontAwesomeIcon icon={faCog} />
          Configuración
        </button>
      </div>

      {/* Contenido de las tabs */}
      <div className="profile-content-modern">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'cursos' && renderCursos()}
        {activeTab === 'certificaciones' && renderCertificaciones()}
        {activeTab === 'nfts' && renderNFTs()}
        {activeTab === 'logros' && renderLogros()}
        {activeTab === 'actividad' && renderActividad()}
        {activeTab === 'configuracion' && renderConfiguracion()}
      </div>
    </div>
  )
}

export default Perfil 