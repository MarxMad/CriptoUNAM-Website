import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { IMAGES } from '../constants/images'
import { handleRegistration, handleNewsletterSubscription } from '../api/telegram'
import { API_ENDPOINTS } from '../config/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faGraduationCap, 
  faUsers, 
  faCertificate, 
  faRocket, 
  faChartLine,
  faCode,
  faShieldAlt,
  faQuoteLeft,
  IconDefinition,
  faDatabase,
  faGlobe,
  faCheckCircle,
  faStar,
  faTrophy,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons'
import { faEthereum, faBitcoin } from '@fortawesome/free-brands-svg-icons'
import { 
  motion, 
  animate, 
  useMotionValue, 
  useTransform, 
  useAnimate,
  useScroll,
  MotionValue
} from 'framer-motion'
import Particles from 'react-tsparticles'
import { loadSlim } from 'tsparticles-slim'
import type { Engine } from 'tsparticles-engine'
import '../styles/global.css'

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Treemap,
  Tooltip as RechartsTooltip
} from 'recharts'
import axios from 'axios'
import TeamCard from '../components/TeamCard'
import ProjectCard from '../components/ProjectCard'
import ImageGallery from '../components/ImageGallery'
import StatsSection from '../components/StatsSection'
import InteractiveCTA from '../components/InteractiveCTA'
import CryptoActions from '../components/CryptoActions'

interface RegistrationForm {
  nombre: string
  apellidos: string
  edad: string
  carrera: string
  plantel: string
  numeroCuenta: string
  motivacion: string
  telegram: string
  twitter: string
  instagram: string
  linkedin: string
  facebook: string
}

// Tipos para los componentes
interface AnimatedNumberProps {
  to: number
  duration?: number
  style?: React.CSSProperties
}

interface TechCardProps {
  icon: IconDefinition
  title: string
  description: string
}

// Componente para animar números
const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ to, duration = 2, style = {} }) => {
  const count = useMotionValue(0)
  const rounded = useTransform(count, latest => Math.round(latest))
  useEffect(() => {
    const controls = animate(count, to, { duration })
    return () => controls.stop()
  }, [to, duration])
  return <motion.span style={style}>{rounded}</motion.span>
}

// Componente para tarjetas con efecto de color
const TechCard: React.FC<TechCardProps> = ({ icon, title, description }) => {
  const [scope, animate] = useAnimate()

  useEffect(() => {
    const animation = animate(
      scope.current,
      { 
        backgroundColor: [
          'rgba(30, 58, 138, 0.1)',
          'rgba(37, 99, 235, 0.1)',
          'rgba(30, 58, 138, 0.1)'
        ],
        borderColor: [
          'rgba(212, 175, 55, 0.2)',
          'rgba(212, 175, 55, 0.4)',
          'rgba(212, 175, 55, 0.2)'
        ]
      },
      {
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "linear",
      }
    )

    return () => animation.cancel()
  }, [])

  return (
    <motion.div 
      ref={scope}
      className="card" 
      style={{
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        transition: 'all 0.3s ease'
      }}
      whileHover={{ scale: 1.05 }}
    >
      <FontAwesomeIcon icon={icon} style={{color:'#D4AF37', fontSize:'2.2rem', marginBottom:12}} />
      <h3 style={{color:'#D4AF37', fontSize:'1.3rem', margin:0}}>{title}</h3>
      <p style={{margin:0}}>{description}</p>
    </motion.div>
  )
}

// Función para el efecto parallax
function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance])
}

// Componente para secciones con parallax
const ParallaxSection = ({ children, id }: { children: React.ReactNode, id: number }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref })
  const y = useParallax(scrollYProgress, 30)

  return (
    <motion.section 
      ref={ref}
      className="parallax-section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        style={{ y }} 
        className="section-content"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {children}
      </motion.div>
    </motion.section>
  )
}

// Componente para el contenido del Treemap
const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, name, medianFee, nTx } = props;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={`rgba(52, 211, 153, ${0.3 + 0.7 * Math.min(1, medianFee/100)})`} stroke="#2563EB" rx={6} />
      <text x={x + width/2} y={y + height/2 - 8} textAnchor="middle" fill="#fff" fontSize={14} fontWeight="bold">{name}</text>
      <text x={x + width/2} y={y + height/2 + 10} textAnchor="middle" fill="#D4AF37" fontSize={12}>{nTx} txs</text>
      <text x={x + width/2} y={y + height/2 + 26} textAnchor="middle" fill="#34d399" fontSize={11}>Fee mediana: {medianFee} sat/vB</text>
    </g>
  )
}

// Componente para el contenido del Treemap tipo goggles
const MempoolGogglesContent = (props: any) => {
  const { x, y, width, height, hash, fee, vsize, feePerVByte } = props;
  // Validación de datos
  if (!x || !y || !width || !height || !vsize || !fee || !hash || !feePerVByte) return null;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={getFeeColor(feePerVByte)} stroke="#2563EB" rx={3} />
      {width > 60 && height > 40 && (
        <>
          <text x={x + width/2} y={y + height/2 - 8} textAnchor="middle" fill="#fff" fontSize={10} fontWeight="bold">{feePerVByte} sat/vB</text>
          <text x={x + width/2} y={y + height/2 + 8} textAnchor="middle" fill="#D4AF37" fontSize={9}>{vsize} bytes</text>
        </>
      )}
    </g>
  )
}

// Tooltip personalizado para el treemap
const MempoolGogglesTooltip = ({ active, payload }: any) => {
  if (
    active &&
    payload &&
    payload.length &&
    payload[0].payload &&
    typeof payload[0].payload.hash === 'string' &&
    typeof payload[0].payload.fee === 'number' &&
    typeof payload[0].payload.vsize === 'number' &&
    typeof payload[0].payload.feePerVByte === 'number'
  ) {
    const tx = payload[0].payload
    return (
      <div style={{background:'#18181b', border:'1px solid #2563EB', borderRadius:8, padding:10, color:'#fff', fontSize:13}}>
        <div><b>Hash:</b> <span style={{fontSize:11}}>{tx.hash.slice(0,12)}...</span></div>
        <div><b>Fee:</b> {tx.fee} sats</div>
        <div><b>Tamaño:</b> {tx.vsize} bytes</div>
        <div><b>Fee/vByte:</b> {tx.feePerVByte} sat/vB</div>
      </div>
    )
  }
  return null
}

// Función para color según fee/vByte
const getFeeColor = (feePerVByte: number) => {
  if (feePerVByte < 5) return '#34d399'; // verde
  if (feePerVByte < 20) return '#fbbf24'; // amarillo
  return '#ef4444'; // rojo
}

// Generador de transacciones simuladas para el treemap
const generateFakeMempoolTxs = (n = 60) => {
  return Array.from({length: n}, (_, i) => {
    const vsize = Math.floor(Math.random() * 680) + 120;
    const fee = Math.floor(Math.random() * 19800) + 200;
    return {
      name: `fakehash${i}`,
      size: vsize,
      hash: `fakehash${i}`,
      fee,
      vsize,
      feePerVByte: Math.round(fee / vsize)
    }
  })
}

// Función para formatear números grandes
const formatMarketCap = (value: number) => {
  if (value >= 1e12) return (value/1e12).toFixed(2) + 'T';
  if (value >= 1e9) return (value/1e9).toFixed(2) + 'B';
  if (value >= 1e6) return (value/1e6).toFixed(2) + 'M';
  if (value >= 1e3) return (value/1e3).toFixed(2) + 'K';
  return value.toString();
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

const Home = () => {

  const [showForm, setShowForm] = useState(false)
  const [email, setEmail] = useState('')
  const [formData, setFormData] = useState<RegistrationForm>({
    nombre: '',
    apellidos: '',
    edad: '',
    carrera: '',
    plantel: '',
    numeroCuenta: '',
    motivacion: '',
    telegram: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    facebook: ''
  })
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [showNewsletterSuccess, setShowNewsletterSuccess] = useState(false)
  const [showNewsletterError, setShowNewsletterError] = useState(false)
  const [btcHistory, setBtcHistory] = useState<{ date: string, price: number }[]>([])
  const [marketCap, setMarketCap] = useState<{ date: string, cap: number }[]>([])
  const [hashrate, setHashrate] = useState<{ date: string, value: number }[]>([])
  const [contracts, setContracts] = useState<{ date: string, value: number }[]>([])
  const [mempoolBlocks, setMempoolBlocks] = useState<any[]>([])
  const [mempoolTxs, setMempoolTxs] = useState<any[]>([])
  const [showJoinForm, setShowJoinForm] = useState(false)
  const [btcDominance, setBtcDominance] = useState<{ date: string, dominance: number }[]>([])
  const [networkName, setNetworkName] = useState<string>('')
  const [networkLogo, setNetworkLogo] = useState<string>('')
  const [cursosHome, setCursosHome] = useState<any[]>([])
  const [eventosHome, setEventosHome] = useState<any[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.nombre || !formData.apellidos || !formData.edad || !formData.carrera || !formData.plantel || !formData.numeroCuenta || !formData.motivacion) {
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 5000);
      return;
    }

    try {
      // Asegurarnos de que todos los campos estén presentes
      const registrationData = {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        edad: formData.edad,
        carrera: formData.carrera,
        plantel: formData.plantel,
        numeroCuenta: formData.numeroCuenta,
        motivacion: formData.motivacion,
        telegram: formData.telegram || 'No proporcionado',
        twitter: formData.twitter || 'No proporcionado',
        instagram: formData.instagram || 'No proporcionado',
        linkedin: formData.linkedin || 'No proporcionado',
        facebook: formData.facebook || 'No proporcionado'
      };

      console.log('Enviando datos:', registrationData); // Para debugging

      const result = await handleRegistration(registrationData);
      
      if (result.success) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowForm(false);
          setFormData({
            nombre: '',
            apellidos: '',
            edad: '',
            carrera: '',
            plantel: '',
            numeroCuenta: '',
            motivacion: '',
            telegram: '',
            twitter: '',
            instagram: '',
            linkedin: '',
            facebook: ''
          });
        }, 700);

        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 5000);
      } else {
        console.error('Error en la respuesta:', result.message);
        setShowErrorMessage(true);
        setTimeout(() => {
          setShowErrorMessage(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Error al procesar el formulario:', error);
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 5000);
    }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setShowNewsletterError(true)
      setTimeout(() => setShowNewsletterError(false), 5000)
      return
    }
    
    try {
      // Enviar notificación a Telegram
      await handleNewsletterSubscription(email, 'home')
      
      setEmail('')
      setShowNewsletterSuccess(true)
      setTimeout(() => setShowNewsletterSuccess(false), 5000)
    } catch (error) {
      setShowNewsletterError(true)
      setTimeout(() => setShowNewsletterError(false), 5000)
    }
  }

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  const particlesOptions = {
    particles: {
      number: { value: 120, density: { enable: true, value_area: 400 } },
      color: { value: ['#D4AF37', '#1E3A8A', '#2563EB'] },
      shape: { type: 'circle' },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      move: {
        enable: true,
        speed: 4,
        direction: "none" as const,
        random: true,
        straight: false,
        outModes: { default: "out" as const }
      },
      links: { enable: true, distance: 100, color: '#D4AF37', opacity: 0.4, width: 1 }
    },
    interactivity: {
      events: { onHover: { enable: true, mode: 'repulse' } },
      modes: {
        repulse: { distance: 120, duration: 0.4 },
        grab: { distance: 120, links: { opacity: 0.8 } },
        parallax: { enable: true, force: 60, smooth: 20 }
      },
      detect_on: "window" as const
    },
    background: { color: { value: 'transparent' } }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  }

  // Carrusel de testimonios
  const testimonios = [
    {
      quote: 'CriptoUNAM me abrió las puertas al mundo de blockchain. Ahora trabajo en un proyecto DeFi.',
      name: 'María González',
      role: 'Desarrolladora Blockchain',
      img: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      quote: 'La comunidad y los recursos de CriptoUNAM son increíbles. Aprendí más de lo que esperaba.',
      name: 'Carlos Rodríguez',
      role: 'Analista de Criptomonedas',
      img: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      quote: 'Gracias a CriptoUNAM conseguí mi primer trabajo en Web3.',
      name: 'Ana Torres',
      role: 'Smart Contract Engineer',
      img: 'https://randomuser.me/api/portraits/women/65.jpg'
    }
  ]



  // Fetch histórico de BTC y market cap - Comentado por CORS
  useEffect(() => {
    // Datos de ejemplo para evitar errores de CORS
    const sampleData = [
      { date: 'Ene 1', price: 45000 },
      { date: 'Ene 15', price: 47000 },
      { date: 'Feb 1', price: 46000 },
      { date: 'Feb 15', price: 48000 },
      { date: 'Mar 1', price: 50000 }
    ]
    setBtcHistory(sampleData)
    setMarketCap(sampleData.map(d => ({ date: d.date, cap: d.price * 1000000 })))
  }, [])

  // Fetch hashrate histórico - Comentado por CORS
  useEffect(() => {
    // Datos de ejemplo para evitar errores de CORS
    const sampleHashrate = [
      { date: 'Ene 1', value: 450000000000000 },
      { date: 'Ene 15', value: 460000000000000 },
      { date: 'Feb 1', value: 470000000000000 },
      { date: 'Feb 15', value: 480000000000000 },
      { date: 'Mar 1', value: 490000000000000 }
    ]
    setHashrate(sampleHashrate)
  }, [])

  // Fetch contratos inteligentes Ethereum (simulado)
  useEffect(() => {
    // Simulación de datos: crecimiento lineal
    const base = 3000000
    const arr = Array.from({length: 30}, (_, i) => ({
      date: new Date(Date.now() - (29-i)*24*60*60*1000).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' }),
      value: base + i * 12000 + Math.floor(Math.random()*5000)
    }))
    setContracts(arr)
  }, [])

  useEffect(() => {
    // Datos de ejemplo para evitar errores de CORS
    setMempoolBlocks([])
  }, [])

  useEffect(() => {
    // Datos de ejemplo para evitar errores de CORS
    setMempoolTxs([])
  }, [])

  // Fetch dominancia de BTC - Comentado por CORS
  useEffect(() => {
    // Datos de ejemplo para evitar errores de CORS
    const sampleDominance = [
      { date: 'Ene 1', dominance: 42.5 },
      { date: 'Ene 15', dominance: 43.2 },
      { date: 'Feb 1', dominance: 41.8 },
      { date: 'Feb 15', dominance: 44.1 },
      { date: 'Mar 1', dominance: 43.7 }
    ]
    setBtcDominance(sampleDominance)
  }, [])

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

  // Ejemplo de cursos y eventos destacados (puedes reemplazar con fetch real)
  const cursosDestacados = [
    {
      titulo: 'Introducción a Blockchain',
      descripcion: 'Aprende los fundamentos de la tecnología blockchain y sus aplicaciones.',
      imagen: IMAGES.CURSOS?.BLOCKCHAIN_BASICS,
      link: '/cursos',
    },
    {
      titulo: 'Smart Contracts con Solidity',
      descripcion: 'Desarrolla contratos inteligentes en la red Ethereum.',
      imagen: IMAGES.CURSOS?.SMART_CONTRACTS,
      link: '/cursos',
    },
  ];
  const eventosProximos = [
    {
      titulo: 'Stellar DEFI',
      fecha: '28 Mayo 2025',
      lugar: 'Facultad de Economia',
      imagen: IMAGES.CURSOS?.BLOCKCHAIN_BASICS,
      link: '/comunidad',
    },
  ];

  // Datos del equipo
  const teamMembers = [
    // Founders
    {
      name: 'Gerardo Vela',
      role: 'Founder & CEO',
      description: 'Fundador y líder de CriptoUNAM. Experto en blockchain y criptomonedas.',
      image: '/images/Equipo/GerardoVela.jpg',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Fernanda Tello',
      role: 'Founder & COO',
      description: 'Co-fundadora y directora de operaciones. Especialista en estrategia y desarrollo.',
      image: '/images/Equipo/FernandaTello.jpg',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Daniel Kubs',
      role: 'Founder & CTO',
      description: 'Co-fundador y director técnico. Desarrollador blockchain y experto en DeFi.',
      image: '/images/Equipo/DanielKubs.jpg',
      linkedin: '#',
      github: '#'
    },
    {
      name: 'Adrian Armenta',
      role: 'Founder & CMO',
      description: 'Co-fundador y director de marketing. Experto en crecimiento de comunidades blockchain.',
      image: '/images/Equipo/AArmenta.png',
      linkedin: '#',
      twitter: '#'
    },
    // Embajadores
    {
      name: 'Tadeo Sepúlveda',
      role: 'Embajador CriptoUNAM',
      description: 'Embajador de la comunidad. Especialista en educación blockchain.',
      image: '/images/Equipo/TadeoSepulveda.png',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Benjamín Romero',
      role: 'Embajador CriptoUNAM',
      description: 'Embajador de la comunidad. Experto en desarrollo de aplicaciones descentralizadas.',
      image: '/images/Equipo/BenjaminRomero.png',
      linkedin: '#',
      github: '#'
    },
    {
      name: 'Andrés Rodríguez',
      role: 'Embajador CriptoUNAM',
      description: 'Embajador de la comunidad. Especialista en investigación blockchain.',
      image: '/images/Equipo/AndresRodriguez.jpg',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Adrián Martínez',
      role: 'Embajador CriptoUNAM',
      description: 'Embajador de la comunidad. Experto en protocolos de consenso.',
      image: '/images/Equipo/AdrianMartinez.png',
      linkedin: '#',
      github: '#'
    },
    {
      name: 'Linda',
      role: 'Embajadora CriptoUNAM',
      description: 'Embajadora de la comunidad. Especialista en UX/UI para aplicaciones blockchain.',
      image: '/images/Equipo/Linda.jpeg',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'David Ricardo',
      role: 'Embajador CriptoUNAM',
      description: 'Embajador de la comunidad. Experto en seguridad blockchain.',
      image: '/images/Equipo/DavidRicardo.jpeg',
      linkedin: '#',
      github: '#'
    },
    {
      name: 'Ian Hernández',
      role: 'Embajador CriptoUNAM',
      description: 'Embajador de la comunidad. Especialista en smart contracts.',
      image: '/images/Equipo/IanHernandes.jpg',
      linkedin: '#',
      twitter: '#'
    }
  ];

  // Proyectos destacados
  const projects = [
    {
      title: 'DeFi Protocol UNAM',
      description: 'Protocolo DeFi desarrollado por estudiantes para facilitar préstamos descentralizados en la comunidad universitaria.',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop',
      category: 'hackathon' as const,
      prize: '1er Lugar - Hackathon Blockchain 2024',
      team: ['Ana García', 'Carlos López', 'María Torres'],
      technologies: ['Solidity', 'React', 'Web3.js', 'IPFS'],
      link: 'https://defi-protocol-unam.vercel.app',
      github: 'https://github.com/criptounam/defi-protocol'
    },
    {
      title: 'NFT Marketplace UNAM',
      description: 'Marketplace de NFTs para la comunidad universitaria, permitiendo la creación y venta de arte digital.',
      image: 'https://images.unsplash.com/photo-1642790105077-0a0a4b0a0a0a?w=400&h=250&fit=crop',
      category: 'community' as const,
      team: ['Luis Martínez', 'Sofia Ramírez'],
      technologies: ['Next.js', 'Ethereum', 'OpenSea API', 'MetaMask'],
      link: 'https://nft-marketplace-unam.vercel.app',
      github: 'https://github.com/criptounam/nft-marketplace'
    },
    {
      title: 'Blockchain Voting System',
      description: 'Sistema de votación descentralizado para elecciones estudiantiles usando blockchain.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
      category: 'research' as const,
      team: ['Diego Herrera', 'Valentina Cruz', 'Roberto Silva'],
      technologies: ['Hyperledger Fabric', 'Node.js', 'React', 'Docker'],
      github: 'https://github.com/criptounam/voting-system'
    }
  ];

  // Galería de imágenes
  const galleryImages = [
    {
      id: '1',
      src: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop',
      alt: 'Hackathon Blockchain 2024',
      title: 'Hackathon Blockchain 2024',
      description: 'Estudiantes desarrollando proyectos innovadores',
      category: 'eventos'
    },
    {
      id: '2',
      src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
      alt: 'Conferencia CriptoUNAM',
      title: 'Conferencia Anual 2024',
      description: 'Expertos compartiendo conocimiento sobre blockchain',
      category: 'eventos'
    },
    {
      id: '3',
      src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
      alt: 'Workshop de Smart Contracts',
      title: 'Workshop Smart Contracts',
      description: 'Aprendiendo desarrollo de contratos inteligentes',
      category: 'talleres'
    },
    {
      id: '4',
      src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
      alt: 'Networking Event',
      title: 'Networking Event',
      description: 'Conectando con la comunidad blockchain',
      category: 'networking'
    },
    {
      id: '5',
      src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
      alt: 'Laboratorio de Blockchain',
      title: 'Laboratorio de Blockchain',
      description: 'Espacio de trabajo colaborativo',
      category: 'infraestructura'
    },
    {
      id: '6',
      src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      alt: 'Equipo CriptoUNAM',
      title: 'Equipo CriptoUNAM',
      description: 'Nuestro equipo trabajando en proyectos innovadores',
      category: 'equipo'
    }
  ];

  // Estadísticas
  const stats = [
    {
      icon: faUsers,
      value: '500+',
      label: 'Miembros Activos',
      description: 'Estudiantes y profesionales en blockchain',
      color: '#34D399'
    },
    {
      icon: faGraduationCap,
      value: '25+',
      label: 'Workshops Realizados',
      description: 'Talleres especializados en blockchain',
      color: '#3B82F6'
    },
    {
      icon: faTrophy,
      value: '10+',
      label: 'Hackathones Ganados',
      description: 'Competencias y premios obtenidos',
      color: '#F59E0B'
    },
    {
      icon: faCode,
      value: '30+',
      label: 'Proyectos Realizados',
      description: 'Aplicaciones y protocolos blockchain',
      color: '#8B5CF6'
    }
  ];

  useEffect(() => {
    const fetchCursosYEventos = async () => {
      try {
        const cursosRes = await axios.get<any[]>(API_ENDPOINTS.CURSOS);
        setCursosHome(Array.isArray(cursosRes.data) ? cursosRes.data.slice(0, 4) : []);
        const eventosRes = await axios.get<any[]>(API_ENDPOINTS.EVENTOS);
        setEventosHome(Array.isArray(eventosRes.data) ? eventosRes.data.filter((e:any)=>e.tipo==='proximo').slice(0, 4) : []);
      } catch (e) {
        setCursosHome([]);
        setEventosHome([]);
      }
    };
    fetchCursosYEventos();
  }, []);

  return (
    <div className="home-page">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="particles-container"
      />



      {/* Hero principal */}
      <section className="section" style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'70vh', textAlign:'center', paddingTop:60}}>
        <img src={IMAGES?.LOGO} alt="CriptoUNAM" className="logo-hero" style={{marginBottom:24}} />
        <h1 style={{fontFamily:'Orbitron', fontSize:'3rem', color:'#D4AF37', marginBottom:16, lineHeight:'1.2'}}>
          Bienvenido a CriptoUNAM
        </h1>
        <p style={{color:'#E0E0E0', fontSize:'1.3rem', marginBottom:32, maxWidth:'800px', lineHeight:'1.6'}}>
          La comunidad universitaria líder en blockchain, criptomonedas y Web3 en México. 
          Formamos la próxima generación de desarrolladores e innovadores en tecnología descentralizada.
        </p>
        <div style={{display:'flex', gap:'16px', flexWrap:'wrap', justifyContent:'center'}}>
          <Link to="/cursos" className="primary-button" style={{fontSize:'1.1rem', borderRadius:18, padding:'0.8rem 2.2rem'}}>
            Explora los cursos
          </Link>
          <Link to="/comunidad" className="primary-button" style={{fontSize:'1.1rem', borderRadius:18, padding:'0.8rem 2.2rem', background:'rgba(37, 99, 235, 0.8)', border:'1px solid #2563EB'}}>
            Únete a la comunidad
          </Link>
        </div>
      </section>

      {/* ¿Por qué CriptoUNAM? */}
      <section className="section" style={{background:'rgba(26,26,26,0.7)', borderRadius:18, maxWidth:900, margin:'0 auto 2.5rem auto', boxShadow:'0 4px 24px #1E3A8A22'}}>
        <h2 className="hero-title" style={{fontFamily:'Orbitron', color:'#D4AF37', fontSize:'1.7rem', marginBottom:'1.5rem'}}>¿Por qué CriptoUNAM?</h2>
        <div className="grid-4" style={{gap:'2rem'}}>
          <TechCard icon={faUsers} title="+500 Miembros" description="Comunidad activa y colaborativa de estudiantes y entusiastas." />
          <TechCard icon={faGraduationCap} title="Cursos Gratuitos" description="Aprende sobre blockchain, DeFi, NFTs y más, sin costo." />
          <TechCard icon={faCertificate} title="Certificados NFT" description="Obtén certificados digitales únicos por tu aprendizaje." />
          <TechCard icon={faRocket} title="Eventos y Talleres" description="Participa en eventos, hackathons y talleres exclusivos." />
        </div>
      </section>

      {/* Estadísticas */}
      <StatsSection
        title="Nuestros Logros"
        description="Cifras que demuestran el impacto y crecimiento de nuestra comunidad"
        stats={stats}
      />

      {/* Equipo */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto 3rem auto',
        padding: '0 20px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{
            fontFamily: 'Orbitron',
            color: '#D4AF37',
            fontSize: '2.5rem',
            marginBottom: '1rem'
          }}>
            Nuestro Equipo
          </h2>
          <p style={{
            color: '#E0E0E0',
            fontSize: '1.2rem',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            Conoce a los expertos y líderes que hacen posible CriptoUNAM
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {teamMembers.map((member, index) => (
            <TeamCard key={index} member={member} />
          ))}
        </div>
      </section>

      {/* Proyectos Destacados */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto 3rem auto',
        padding: '0 20px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{
            fontFamily: 'Orbitron',
            color: '#D4AF37',
            fontSize: '2.5rem',
            marginBottom: '1rem'
          }}>
            Proyectos Destacados
          </h2>
          <p style={{
            color: '#E0E0E0',
            fontSize: '1.2rem',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            Innovación y desarrollo blockchain creado por nuestra comunidad
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </section>

      {/* Galería de Imágenes */}
      <ImageGallery
        images={galleryImages}
        title="Nuestra Comunidad en Acción"
        description="Momentos especiales, eventos y actividades que definen nuestra comunidad"
      />

      {/* Cursos destacados reales */}
      {cursosHome.length > 0 && (
        <section className="section" style={{maxWidth:1200, margin:'0 auto 2.5rem auto'}}>
          <h2 className="hero-title" style={{fontFamily:'Orbitron', color:'#D4AF37', fontSize:'1.5rem', marginBottom:'1.2rem'}}>Cursos Destacados</h2>
          <div className="grid-4" style={{gap:'2rem'}}>
            {cursosHome.map((curso, idx) => (
              <div key={curso._id || idx} className="card" style={{textAlign:'center', minHeight:260, display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                <img src={curso.imagen} alt={curso.titulo} style={{width:'100%', maxWidth:180, margin:'0 auto 1rem auto', borderRadius:12, boxShadow:'0 2px 12px #1E3A8A33'}} />
                <h3 style={{fontFamily:'Orbitron', color:'#D4AF37', fontSize:'1.1rem', margin:'0 0 0.5rem 0'}}>{curso.titulo}</h3>
                <p style={{color:'#E0E0E0', fontSize:'1rem', marginBottom:12}}>{curso.descripcion}</p>
                <Link to={`/registro-curso/${curso._id}`} className="primary-button" style={{fontSize:'1rem', borderRadius:16, padding:'0.5rem 1.2rem'}}>Ver curso</Link>
              </div>
            ))}
        </div>
      </section>
      )}

      {/* Próximos eventos reales */}
      {eventosHome.length > 0 && (
        <section className="section" style={{maxWidth:1200, margin:'0 auto 2.5rem auto'}}>
          <h2 className="hero-title" style={{fontFamily:'Orbitron', color:'#D4AF37', fontSize:'1.5rem', marginBottom:'1.2rem'}}>Próximos Eventos</h2>
          <div className="grid-4" style={{gap:'2rem'}}>
            {eventosHome.map((evento, idx) => (
              <div key={evento._id || idx} className="card" style={{textAlign:'center', minHeight:220, display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                <img src={evento.imagen} alt={evento.titulo} style={{width:'100%', maxWidth:180, margin:'0 auto 1rem auto', borderRadius:12, boxShadow:'0 2px 12px #1E3A8A33'}} />
                <h3 style={{fontFamily:'Orbitron', color:'#D4AF37', fontSize:'1.1rem', margin:'0 0 0.5rem 0'}}>{evento.titulo}</h3>
                <p style={{color:'#E0E0E0', fontSize:'1rem', marginBottom:8}}>{evento.fecha} - {evento.lugar}</p>
                {evento.registroLink && <a href={evento.registroLink} target="_blank" rel="noopener noreferrer" className="primary-button" style={{fontSize:'1rem', borderRadius:16, padding:'0.5rem 1.2rem'}}>Ver evento</a>}
          </div>
            ))}
        </div>
      </section>
      )}

      

    {/* VIDEO SECTION */}
    <section className="section" style={{paddingTop:0}}>
      <h2 className="text-center" style={{marginBottom: '2rem'}}>Conoce Más Sobre Blockchain</h2>
        <div className="video-container">
            <iframe
          width="100%"
          height="500"
          src="https://www.youtube.com/embed/your-video-id"
          title="Blockchain Explained"
          frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
          style={{
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(212, 175, 55, 0.2)'
          }}
        />
          </div>
    </section>

    {/* BLOCKCHAIN TECH */}
    <section className="section" style={{paddingTop:0}}>
      <h2 className="text-center" style={{marginBottom: '2rem'}}>Tecnologías Blockchain</h2>
      <div className="grid-4">
        {[
          { icon: faEthereum, title: 'Ethereum', description: 'Plataforma líder para contratos inteligentes y aplicaciones descentralizadas.' },
          { icon: faBitcoin, title: 'Bitcoin', description: 'La primera y más grande criptomoneda, fundamento de la tecnología blockchain.' },
          { icon: faCode, title: 'Solidity', description: 'Lenguaje de programación para desarrollar contratos inteligentes en Ethereum.' },
          { icon: faShieldAlt, title: 'Seguridad', description: 'Principios de criptografía y seguridad en el desarrollo blockchain.' },
          { icon: faDatabase, title: 'Bases de Datos Distribuidas', description: 'Estructuras de datos descentralizadas para almacenar información de forma segura.' },
          { icon: faGlobe, title: 'Web3', description: 'La nueva generación de la web basada en descentralización y blockchain.' }
        ].map((tech, i) => (
          <TechCard key={i} {...tech} />
        ))}
        </div>
      </section>

  {/* LEARNING PATH */}
  <section className="section" style={{paddingTop:0}}>
    <h2 className="text-center" style={{marginBottom: '2rem'}}>Tu Camino de Aprendizaje</h2>
    <div className="learning-path-grid">
      {[
        { number: 1, title: 'Fundamentos', description: 'Blockchain, Bitcoin, Ethereum y conceptos básicos' },
        { number: 2, title: 'Desarrollo', description: 'Smart Contracts, DApps y desarrollo Web3' },
        { number: 3, title: 'Especialización', description: 'DeFi, NFTs, DAOs y más' }
      ].map((step, i) => (
        <motion.div key={i} className="card" variants={itemVariants} initial="hidden" whileInView="visible" viewport={{once:true}} whileHover={{scale:1.05}}>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              backdropFilter: 'blur(10px)',
              color: '#D4AF37',
              fontWeight: 700,
              fontSize: '1.2rem',
              position: 'relative',
            }}
          >
            {step.number}
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.2, type: 'spring', stiffness: 200 }}
              style={{
                position: 'absolute',
                right: -12,
                bottom: -12,
                color: '#4ade80',
                fontSize: 28,
                filter: 'drop-shadow(0 0 6px #4ade80cc)',
              }}
            >
              <FontAwesomeIcon icon={faCheckCircle} />
            </motion.span>
            </div>
          <h3 style={{color:'#D4AF37', fontSize:'1.3rem', margin:0}}>{step.title}</h3>
          <p style={{margin:0}}>{step.description}</p>
        </motion.div>
      ))}
        </div>
      </section>

  {/* PARTNERS - Ticker */}
  <section className="section" style={{paddingTop:0}}>
    <h2 className="text-center" style={{marginBottom: '2rem'}}>Nuestros Aliados</h2>
    <div className="ticker-container">
      <div className="ticker-track">
        {[
          { img: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png', alt: 'JavaScript' },
          { img: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Python_logo.png', alt: 'Python' },
          { img: 'https://upload.wikimedia.org/wikipedia/commons/1/18/C_Programming_Language.svg', alt: 'C' },
          { img: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png', alt: 'JavaScript' },
          { img: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Python_logo.png', alt: 'Python' },
          { img: 'https://upload.wikimedia.org/wikipedia/commons/1/18/C_Programming_Language.svg', alt: 'C' },
        ].map((p, i) => (
          <div key={i} className="ticker-item card">
            <img src={p.img} alt={p.alt} style={{maxWidth:100, maxHeight:60, objectFit:'contain'}} />
          </div>
        ))}
          </div>
        </div>
      </section>


      {/* Sección de On-Ramp */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto 3rem auto',
        padding: '0 20px'
      }}>
        <div style={{
          background: 'rgba(26, 26, 26, 0.8)',
          borderRadius: '20px',
          padding: '3rem',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          backdropFilter: 'blur(10px)',
          textAlign: 'center'
        }}>
          <CryptoActions 
            layout="horizontal" 
            showLabels={true}
          />
        </div>
      </section>

      {/* Sección Interactiva Final */}
      <InteractiveCTA
        title="¡Únete a la Revolución Blockchain!"
        description="Forma parte de la comunidad universitaria más innovadora de México. Aprende, desarrolla y crea el futuro de la Web3 junto a nosotros."
      />

    <style>{`
      html {
        scroll-behavior: smooth;
        scroll-snap-type: y proximity;
      }

      .parallax-section {
        min-height: 100vh;
        scroll-snap-align: start;
        scroll-snap-stop: always;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        overflow: hidden;
        padding: 2rem 0;
        scroll-margin-top: 0;
      }

      .section-content {
        width: 100%;
        max-width: 1400px;
        margin: 0 auto;
        padding: 3rem;
        position: relative;
        z-index: 1;
        background: rgba(10, 10, 10, 0.3);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        border: 1px solid rgba(212, 175, 55, 0.1);
        transform: translateZ(0);
        will-change: transform;
        min-height: 80vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      /* Ajustes para el scroll suave */
      @media (prefers-reduced-motion: no-preference) {
        html {
          scroll-behavior: smooth;
        }
      }

      /* Ajustes específicos para trackpad */
      @media (hover: none) and (pointer: coarse) {
        .parallax-section {
          scroll-snap-type: y mandatory;
        }
      }

      /* Ajustes para mouse/trackpad */
      @media (hover: hover) and (pointer: fine) {
        .parallax-section {
          scroll-snap-type: y proximity;
        }
      }

      .video-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1rem;
        width: 100%;
      }

      .video-container iframe {
        width: 100%;
        height: 70vh;
        min-height: 500px;
      }

      .graphs-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
        gap: 2rem;
        width: 100%;
        margin: 0 auto;
        padding: 1rem;
      }

      .graph-card {
        background: rgba(10, 10, 10, 0.3);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        border: 1px solid rgba(212, 175, 55, 0.1);
        padding: 2rem;
        transition: transform 0.3s ease;
        height: 100%;
        min-height: 400px;
        display: flex;
        flex-direction: column;
        justify-content: stretch;
      }

      .graph-card h3 {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
        padding: 1rem;
      }

      .graph-card .recharts-wrapper {
        height: 100% !important;
        width: 100% !important;
        min-width: 0;
        padding: 1rem;
      }

      .progress-bar {
        position: fixed;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, #D4AF37, #2563EB);
        bottom: 0;
        transform-origin: 0%;
        z-index: 1000;
        opacity: 0.8;
      }

      /* Ajustes para el grid de stats */
      .grid {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
        gap: 3rem !important;
        width: 100%;
      }

      /* Ajustes para el grid de features */
      .grid-4 {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
        gap: 3rem !important;
        width: 100%;
      }

      /* Ajustes para el grid de blockchain tech */
      .blockchain-tech-grid {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
        gap: 3rem !important;
        width: 100%;
      }

      .ticker-container {
        width: 100%;
        overflow: hidden;
        position: relative;
        margin: 0 auto;
        padding: 1.5rem 0;
        background: rgba(10, 10, 10, 0.2);
        border-radius: 20px;
        box-shadow: 0 4px 24px rgba(30,58,138,0.08);
      }
      .ticker-track {
        display: flex;
        width: max-content;
        animation: ticker 18s linear infinite;
      }
      .ticker-container:hover .ticker-track {
        animation-play-state: paused;
      }
      .ticker-item {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 180px;
        margin: 0 2rem;
        background: rgba(30,58,138,0.10);
        border: 1px solid rgba(212, 175, 55, 0.10);
        border-radius: 16px;
        box-shadow: 0 2px 12px #1E3A8A22;
        padding: 1rem 2rem;
        transition: transform 0.2s;
      }
      .ticker-item img {
        filter: drop-shadow(0 2px 8px #1E3A8A33);
      }
      @keyframes ticker {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      @media (max-width: 900px) {
        .parallax-section {
          min-height: 70vh;
          padding: 1.2rem 0;
        }
        .section-content {
          padding: 1.2rem;
          min-height: 60vh;
        }
        .graphs-container {
          grid-template-columns: 1fr;
          gap: 1.2rem;
          padding: 0.5rem;
        }
        .graph-card {
          min-height: 320px;
          padding: 0;
          overflow-x: auto;
          display: flex;
          flex-direction: column;
          justify-content: stretch;
        }
        .graph-card h3 {
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }
        .graph-card .recharts-wrapper {
          height: 100% !important;
          width: 100% !important;
          min-width: 0;
        }
      }
      @media (max-width: 600px) {
        .parallax-section {
          min-height: 50vh;
          padding: 0.5rem 0;
        }
        .section-content {
          padding: 0.5rem;
          min-height: 40vh;
        }
        .graph-card {
          min-height: 220px;
          padding: 0;
          overflow-x: auto;
          display: flex;
          flex-direction: column;
          justify-content: stretch;
        }
        .graph-card h3 {
          font-size: 1rem;
        }
        .graph-card .recharts-wrapper {
          height: 100% !important;
          width: 100% !important;
          min-width: 0;
        }
      }
      .learning-path-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 3rem;
        max-width: 900px;
        margin: 0 auto;
      }
      @media (max-width: 900px) {
        .learning-path-grid {
          grid-template-columns: 1fr;
          gap: 2rem;
        }
      }
      .testimonios-carousel-container-wide {
        max-width: 1400px;
        width: 100%;
        margin: 0 auto;
      }
      .testimonio-card-wide {
        max-width: 900px !important;
        min-width: 500px;
        min-height: 420px;
      }
      @media (max-width: 1200px) {
        .testimonios-carousel-container-wide {
          max-width: 98vw;
        }
        .testimonio-card-wide {
          max-width: 98vw !important;
          min-width: unset;
          padding: 2rem 0.5rem;
        }
      }
      @media (max-width: 700px) {
        .testimonio-card-wide {
          padding: 1.2rem 0.2rem;
          min-height: 320px;
        }
      }
      .glow-button:hover {
        box-shadow: 0 0 32px 8px #D4AF37cc, 0 0 48px 16px #2563EB99;
        background: linear-gradient(90deg, #1E3A8A 60%, #D4AF37 100%);
        color: #fff;
      }
    `}</style>
    </div>
  )
}

export default Home 