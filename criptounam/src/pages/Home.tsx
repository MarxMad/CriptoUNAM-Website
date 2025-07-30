import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { IMAGES } from '../constants/images'
import { handleRegistration, handleNewsletterSubscription } from '../api/telegram'
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
  faStar
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
    // Simulación de éxito
        setEmail('')
        setShowNewsletterSuccess(true)
        setTimeout(() => setShowNewsletterSuccess(false), 5000)
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



  // Fetch histórico de BTC y market cap
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Precio histórico BTC
        const btcRes = await axios.get('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30')
        const btcData = btcRes.data as any
        const btcPrices = btcData.prices.map((p: [number, number]) => ({
          date: new Date(p[0]).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' }),
          price: p[1]
        }))
        setBtcHistory(btcPrices)
        // Market cap global
        const mcRes = await axios.get('https://api.coingecko.com/api/v3/global')
        // CoinGecko no da histórico global, así que usamos el market cap de BTC como aproximación
        const mcPrices = btcData.market_caps.map((p: [number, number]) => ({
          date: new Date(p[0]).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' }),
          cap: p[1]
        }))
        setMarketCap(mcPrices)
      } catch (e) {}
    }
    fetchHistory()
  }, [])

  // Fetch hashrate histórico (Blockchain.com API)
  useEffect(() => {
    const fetchHashrate = async () => {
      try {
        const res = await axios.get('https://api.blockchain.info/charts/hash-rate?timespan=30days&format=json')
        const hashData = res.data as any
        const data = hashData.values.map((v: { x: number, y: number }) => ({
          date: new Date(v.x * 1000).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' }),
          value: v.y
        }))
        setHashrate(data)
      } catch (e) {}
    }
    fetchHashrate()
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
    const fetchMempoolBlocks = async () => {
      try {
        const res = await axios.get('https://mempool.space/api/mempool/blocks')
        setMempoolBlocks(res.data as any[])
      } catch (e) {}
    }
    fetchMempoolBlocks()
  }, [])

  useEffect(() => {
    const fetchMempoolTxs = async () => {
      try {
        // Solo traemos las primeras 500 transacciones para no saturar el navegador
        const res = await axios.get('https://mempool.space/api/mempool/recent')
        setMempoolTxs((res.data as any[]).slice(0, 500))
      } catch (e) {}
    }
    fetchMempoolTxs()
  }, [])

  // Fetch dominancia de BTC (CoinGecko)
  useEffect(() => {
    const fetchDominance = async () => {
      try {
        const res = await axios.get('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30')
        const btcData = res.data as any
        const totalMarketCap = await axios.get('https://api.coingecko.com/api/v3/global')
        const totalCap = (totalMarketCap.data as any).data.total_market_cap.usd
        
        // Calculamos la dominancia histórica usando el market cap de BTC y el total
        const dominanceArr = btcData.market_caps.map((p: [number, number]) => ({
          date: new Date(p[0]).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' }),
          dominance: (p[1] / totalCap) * 100
        }))
        setBtcDominance(dominanceArr)
      } catch (e) {
        console.error('Error fetching BTC dominance:', e)
      }
    }
    fetchDominance()
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

  useEffect(() => {
    const fetchCursosYEventos = async () => {
      try {
        const cursosRes = await axios.get<any[]>('http://localhost:4000/cursos');
        setCursosHome(Array.isArray(cursosRes.data) ? cursosRes.data.slice(0, 4) : []);
        const eventosRes = await axios.get<any[]>('http://localhost:4000/eventos');
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
      <section className="section" style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', textAlign:'center', paddingTop:60}}>
        <img src={IMAGES?.LOGO} alt="CriptoUNAM" className="logo-hero" style={{marginBottom:24}} />
        <h1 style={{fontFamily:'Orbitron', fontSize:'2.5rem', color:'#D4AF37', marginBottom:12}}>Bienvenido a CriptoUNAM</h1>
        <p style={{color:'#E0E0E0', fontSize:'1.2rem', marginBottom:24}}>La comunidad universitaria líder en blockchain, criptomonedas y Web3 en México.</p>
        <Link to="/cursos" className="primary-button" style={{fontSize:'1.1rem', borderRadius:18, padding:'0.8rem 2.2rem'}}>Explora los cursos</Link>
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

      {/* GRÁFICAS Y TENDENCIAS */}
      <section className="section" style={{paddingTop:0}}>
        <h2 className="text-center" style={{marginBottom: '2rem'}}>Tendencias en Blockchain</h2>
        <div className="graphs-container">
          <div className="graph-card">
            <h3 style={{color:'#D4AF37', marginBottom:'1rem'}}>Precio de Bitcoin (BTC) - Últimos 30 días</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={btcHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#D4AF37" minTickGap={10} />
                <YAxis stroke="#D4AF37" domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.8)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="price" stroke="#D4AF37" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <a href="https://www.coingecko.com/es/monedas/bitcoin" target="_blank" rel="noopener noreferrer" style={{fontSize:'0.95rem', color:'#2563EB', textDecoration:'underline', display:'block', marginTop:8, textAlign:'center', width:'100%'}}>Fuente: CoinGecko</a>
          </div>
          <div className="graph-card">
            <h3 style={{color:'#D4AF37', marginBottom:'1rem'}}>Mempool Goggles (Treemap de transacciones)</h3>
            <ResponsiveContainer width="100%" height={300} style={{marginBottom: '2rem'}}>
              {mempoolTxs.filter(tx => tx && typeof tx.vsize === 'number' && typeof tx.fee === 'number' && typeof tx.hash === 'string' && tx.vsize > 0 && tx.fee >= 0).length === 0 ? (
                <Treemap
                  data={generateFakeMempoolTxs()}
                  dataKey="size"
                  nameKey="name"
                  stroke="#2563EB"
                  aspectRatio={4/1}
                  content={<MempoolGogglesContent />}
                >
                  <RechartsTooltip content={<MempoolGogglesTooltip />} />
                </Treemap>
              ) : (
                <Treemap
                  data={mempoolTxs
                    .filter(tx => tx && typeof tx.vsize === 'number' && typeof tx.fee === 'number' && typeof tx.hash === 'string' && tx.vsize > 0 && tx.fee >= 0)
                    .map((tx) => ({
                      name: tx.hash,
                      size: tx.vsize,
                      hash: tx.hash,
                      fee: tx.fee,
                      vsize: tx.vsize,
                      feePerVByte: Math.round(tx.fee / tx.vsize)
                    }))}
                  dataKey="size"
                  nameKey="name"
                  stroke="#2563EB"
                  aspectRatio={4/1}
                  content={<MempoolGogglesContent />}
                >
                  <RechartsTooltip content={<MempoolGogglesTooltip />} />
                </Treemap>
              )}
            </ResponsiveContainer>
            <a href="https://mempool.space/es/goggles" target="_blank" rel="noopener noreferrer" style={{fontSize:'0.95rem', color:'#2563EB', textDecoration:'underline', display:'block', marginTop:8, textAlign:'center', width:'100%'}}>Fuente: mempool.space</a>
          </div>
          <div className="graph-card">
            <h3 style={{color:'#2563EB', marginBottom:'1rem'}}>Capitalización de mercado de criptomonedas (USD)</h3>
            <ResponsiveContainer width="100%" height={340}>
              <AreaChart data={marketCap} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCapBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#2563EB" minTickGap={10} />
                <YAxis stroke="#2563EB" domain={['auto', 'auto']} tickFormatter={formatMarketCap} ticks={marketCap.length > 0 ? [marketCap[0].cap, marketCap[Math.floor(marketCap.length/2)].cap, marketCap[marketCap.length-1].cap] : undefined} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.8)', border: '1px solid #2563EB', borderRadius: '8px' }} formatter={v => formatMarketCap(Number(v))} />
                <Area type="monotone" dataKey="cap" stroke="#2563EB" fillOpacity={1} fill="url(#colorCapBlue)" />
              </AreaChart>
            </ResponsiveContainer>
            <a href="https://www.coingecko.com/es/global-charts" target="_blank" rel="noopener noreferrer" style={{fontSize:'0.95rem', color:'#2563EB', textDecoration:'underline', display:'block', marginTop:8, textAlign:'center', width:'100%'}}>Fuente: CoinGecko</a>
          </div>
          <div className="graph-card">
            <h3 style={{color:'#2563EB', marginBottom:'1rem'}}>Dominancia de Bitcoin en el mercado (%)</h3>
            <ResponsiveContainer width="100%" height={340}>
              <AreaChart data={btcDominance} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDominance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#2563EB" minTickGap={10} />
                <YAxis stroke="#2563EB" domain={['auto', 'auto']} tickFormatter={v => v + '%'} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.8)', border: '1px solid #2563EB', borderRadius: '8px' }} formatter={v => v + '%'} />
                <Area type="monotone" dataKey="dominance" stroke="#2563EB" fillOpacity={1} fill="url(#colorDominance)" />
              </AreaChart>
            </ResponsiveContainer>
            <a href="https://www.coingecko.com/es/global-charts" target="_blank" rel="noopener noreferrer" style={{fontSize:'0.95rem', color:'#2563EB', textDecoration:'underline', display:'block', marginTop:8, textAlign:'center', width:'100%'}}>Fuente: CoinGecko</a>
        </div>
          </div>
      </section>

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