import { useState, useEffect } from 'react'
import { useAccount, useBalance, useContractRead } from 'wagmi'
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
  faEyeSlash,
  faCoins,
  faCopy,
  faCheck
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

const Perfil = () => {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })
  
  const [networkName, setNetworkName] = useState<string>('')
  const [networkLogo, setNetworkLogo] = useState<string>('')
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
  const [copied, setCopied] = useState(false)

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
        if (chainId) {
          setNetworkName(NETWORKS[chainId].name)
          setNetworkLogo(NETWORKS[chainId].logo)
        } else {
          setNetworkName('Desconocida')
          setNetworkLogo('')
        }

        // Obtener datos reales de la blockchain
        const userData: UserProfile = {
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
        }

        // Procesar certificados de la blockchain
        if (Array.isArray(certificates)) {
          userData.certificaciones = certificates.map((cert: any) => ({
            id: cert.toNumber(),
            nombre: `Certificado #${cert.toNumber()}`,
            fecha: new Date().toISOString(),
            hash: cert.toString(),
            red: networkName
          }))
        }

        // Procesar cursos de la blockchain
        if (Array.isArray(courses)) {
          userData.cursosCompletados = courses.map((course: any) => ({
            id: course.toNumber(),
            titulo: `Curso #${course.toNumber()}`,
            fecha: new Date().toISOString(),
            progreso: 100
          }))
        }

        // Obtener NFTs del usuario (ejemplo con OpenSea API)
        try {
          const nftsResponse = await fetch(
            `https://api.opensea.io/api/v1/assets?owner=${address}&order_direction=desc&offset=0&limit=20`
          )
          const nftsData = await nftsResponse.json()
          if (nftsData.assets && Array.isArray(nftsData.assets)) {
            userData.nfts = nftsData.assets.map((nft: any) => ({
              id: nft.id,
              nombre: nft.name,
              descripcion: nft.description,
              imagen: nft.image_url,
              tokenId: nft.token_id,
              openseaLink: nft.permalink
            }))
          }
        } catch (error) {
          console.error('Error al obtener NFTs:', error)
        }

        setUserProfile(userData)
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error)
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
  }, [address])

  if (!isConnected || !address) {
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
        <div className="profile-wallet-info">
          <h2>
            <FontAwesomeIcon icon={faWallet} />
            <span style={{wordBreak:'break-all'}}>{address}</span>
            <button
              className="copy-btn"
              style={{marginLeft:'1rem', background:'none', border:'none', cursor:'pointer', color:'var(--primary-gold)', fontSize:'1.1rem'}}
              onClick={() => {
                navigator.clipboard.writeText(address || '')
                setCopied(true)
                setTimeout(() => setCopied(false), 1200)
              }}
              title="Copiar dirección"
            >
              <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
            </button>
          </h2>
          <p>
            <FontAwesomeIcon icon={faNetworkWired} />{' '}
            {networkLogo && <img src={networkLogo} alt={networkName} style={{height:24, width:24, verticalAlign:'middle', marginRight:8, borderRadius:'50%', background:'#fff'}} />}
            {networkName}
          </p>
          {balance && (
            <p>
              <FontAwesomeIcon icon={faCoins} /> Balance: {formatEther(balance.value)} {balance.symbol}
            </p>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h3><FontAwesomeIcon icon={faGraduationCap} /> Cursos Completados</h3>
          {userProfile.cursosCompletados.length > 0 ? (
            <div className="courses-grid">
              {userProfile.cursosCompletados.map(curso => (
                <div key={curso.id} className="course-card">
                  <h4>{curso.titulo}</h4>
                  <p>Fecha: {new Date(curso.fecha).toLocaleDateString()}</p>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${curso.progreso}%`}}
                    ></div>
                  </div>
                  <p>Progreso: {curso.progreso}%</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No has completado ningún curso aún.</p>
          )}
        </div>

        <div className="profile-section">
          <h3><FontAwesomeIcon icon={faCertificate} /> Certificaciones</h3>
          {userProfile.certificaciones.length > 0 ? (
            <div className="certificates-grid">
              {userProfile.certificaciones.map(cert => (
                <div key={cert.id} className="certificate-card">
                  <h4>{cert.nombre}</h4>
                  <p>Fecha: {new Date(cert.fecha).toLocaleDateString()}</p>
                  <p>Red: {cert.red}</p>
                  <a 
                    href={`https://polygonscan.com/tx/${cert.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver en Explorer
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p>No tienes certificaciones aún.</p>
          )}
        </div>

        <div className="profile-section">
          <h3><FontAwesomeIcon icon={faTrophy} /> NFTs</h3>
          {userProfile.nfts.length > 0 ? (
            <div className="nfts-grid">
              {userProfile.nfts.map(nft => (
                <div key={nft.id} className="nft-card">
                  <img src={nft.imagen} alt={nft.nombre} />
                  <h4>{nft.nombre}</h4>
                  <p>{nft.descripcion}</p>
                  <a 
                    href={nft.openseaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver en OpenSea
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p>No tienes NFTs aún.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Perfil 