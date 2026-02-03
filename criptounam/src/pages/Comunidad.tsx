import React, { useState } from 'react'
import '../styles/global.css'
import SEOHead from '../components/SEOHead'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord, faTwitter, faTelegram, faGithub } from '@fortawesome/free-brands-svg-icons'
import { faUsers, faHandshake, faBolt, faChevronDown, faChevronUp, faTrophy, faRocket, faCamera, faExternalLinkAlt, faCode } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

// Datos de imágenes por mes
const MESES_2025 = [
  { mes: 'ENERO', titulo: 'Hackathon De VARA en ITAM', carpeta: 'ENERO_CRIPTOUNAM' },
  { mes: 'FEBRERO', titulo: 'Eventos en Economía UNAM', carpeta: 'FEBRERO_CRIPTOUNAM' },
  { mes: 'MARZO', titulo: 'Argentina, Bootcamps y Workshops', carpeta: 'MARZO_CRIPTOUNAM' },
  { mes: 'ABRIL', titulo: 'Expansión Interuniversitaria', carpeta: 'ABRIL_CRIPTOUNAM' },
  { mes: 'MAYO', titulo: 'Hackathones LatAm', carpeta: 'MAYO_CRIPTOUNAM' },
  { mes: 'JUNIO', titulo: 'Nouns, Diputados y Demo Day BaseBatch', carpeta: 'JUNIO_CRIPTOUNAM' },
  { mes: 'JULIO', titulo: 'Summer Builders', carpeta: 'JULIO_CRIPTOUNAM' },
  { mes: 'AGOSTO', titulo: 'Bitso Win, ETH Global NYC & Monad', carpeta: 'AGOSTO_CRIPTOUNAM' },
  { mes: 'SEPTIEMBRE', titulo: 'Meridian Rio & CU Islas', carpeta: 'SEPTIEMBRE_CRIPTOUNAM' },
  { mes: 'OCTUBRE', titulo: 'BASE, Starknet, Solana & ETH México', carpeta: 'OCTUBRE_CRIPTOUNAM' },
  { mes: 'NOVIEMBRE', titulo: 'Devconnect, Foro Blockchain & ETH Global Argentina', carpeta: 'NOVIEMBRE_CRIPTOUNAM' },
  { mes: 'DICIEMBRE', titulo: 'Cierre de Año', carpeta: 'DICIEMBRE_CRIPTOUNAM' },
]

// Imágenes por mes (solo JPG/PNG compatibles)
const IMAGENES_POR_MES: Record<string, string[]> = {
  ENERO: ['65abfefe-90b1-4122-985a-0b02dd95833e.JPG', 'IMG_1021.jpg', 'IMG_1054.jpg', 'IMG_1061.jpg', 'IMG_1064.jpg', 'IMG_1065.jpg'],
  FEBRERO: ['305D7F65-74C4-412C-B606-11154F7D2FE6 2.JPG', '3ECEA6CC-BED8-4421-BBA2-BF6BC6669922.JPG', '77bb370d-c32f-42f8-aa79-87d47929b239.JPG', 'B1F27CE8-9CBC-4D5D-9431-9EF3B19986DA.JPG', 'camphoto_1903590565.JPG', 'IMG_1370.jpg', 'IMG_1379.jpg', 'IMG_1486.PNG', 'IMG_1509.jpg', 'IMG_1650.jpg', 'IMG_1740.jpg'],
  MARZO: ['16EF3BED-A9CC-4B2C-8A91-4003EBC49487.JPG', '784BBF1F-045F-41FC-A49C-DE177B0C5003.JPG', 'A7CBB16B-FD9E-44A6-9DEE-AA596EE15697.JPG', 'IMG_1801.jpg', 'IMG_1877.jpg', 'IMG_1946.JPG', 'IMG_1947.JPG', 'IMG_2016.jpg', 'IMG_2548.PNG'],
  ABRIL: ['c3eb8977-2bc8-457f-a87f-b7f17d6ed967.JPG', 'IMG_3036.JPG', 'IMG_3052.JPG', 'IMG_3329.PNG', 'IMG_2955.jpg', 'IMG_2958.jpg', 'IMG_3002.jpg', 'IMG_3043.jpg'],
  MAYO: ['0c04b7d6-0cf1-43b4-9506-c8318a4af1ea 2.JPG', '4f3ba804-7c7d-4bb0-96de-6d912d5b6a4d 2.JPG', '5c7e70e9-fd07-4f7d-99a0-e1bcc1eab3bf 2.JPG', 'IMG_3560 2.JPG', 'IMG_3722 2.JPG', 'IMG_3725 2.JPG', 'IMG_3763 2.JPG'],
  JUNIO: ['55A059F5-EDEE-4124-A622-D429C35A23FE.JPG', '7556f6fe-e87c-4a43-b8bf-879035a20da2.JPG', 'a1a2c0db-d26b-42ed-aa03-7a95aceb3b18.JPG', 'IMG_4187.PNG', 'IMG_4260.jpg', 'IMG_4437.jpg', 'IMG_4458.PNG', 'IMG_4493.JPG'],
  JULIO: ['IMG_4561.JPG', 'IMG_4712.JPG', 'IMG_4688.PNG', 'IMG_4606.jpg', 'IMG_4610.jpg', 'IMG_4641.jpg', 'IMG_4662.jpg', 'IMG_4677.jpg'],
  AGOSTO: ['camphoto_1804928587.JPG', 'IMG_5429.JPG', 'IMG_5515.JPG', 'IMG_5516.JPG', 'IMG_5525.JPG', 'IMG_5117.jpg', 'IMG_5195.jpg', 'IMG_5214.jpg'],
  SEPTIEMBRE: ['camphoto_33463914 3.JPG', 'camphoto_959030623 3.JPG', 'IMG_5753 3.jpg', 'IMG_5847 3.JPG', 'IMG_5922.jpg', 'IMG_5977.jpg', 'IMG_6014.jpg', 'IMG_6042.jpg'],
  OCTUBRE: ['57b46d46-8f91-44c5-b7f6-868620625819.JPG', 'IMG_6727.JPG', 'IMG_6799.PNG', 'IMG_6805.PNG', 'IMG_6914.PNG', 'IMG_6983 2.JPG', 'photo_2025-12-20 13.30.49.jpeg', 'photo_2025-12-20 13.30.51.jpeg'],
  NOVIEMBRE: ['007f7872bdaaf1719ef62595f2f2bd39 2.JPG', 'IMG_7079 2.JPG', 'IMG_7283 2.JPG', 'IMG_7509 2.PNG', 'IMG_7595 2.PNG', 'IMG_7596 2.PNG', 'IMG_7598 2.PNG', 'photo_2025-12-20 13.33.26.jpeg', 'photo_2025-12-20 13.33.29.jpeg'],
  DICIEMBRE: ['IMG_8034.JPG', 'IMG_8062.PNG', 'IMG_8088.PNG', 'IMG_8129.PNG', 'IMG_8164.JPG', 'IMG_8049.jpg', 'IMG_8156.jpg'],
}

// Proyectos y Hackathones combinados con formato visual
const PROYECTOS_HACKATHONES = [
  {
    nombre: 'Utonoma',
    descripcion: 'Plataforma de videos descentralizada construida con Solidity para la distribución de contenido educativo.',
    imagen: '/images/Proyectos/Utonoma.png',
    tecnologias: ['Solidity', 'React', 'Web3.js', 'IPFS'],
    premio: 'Proyecto Destacado - Hackathon Blockchain 2024',
    premioUSD: 0,
    categoria: 'hackathon'
  },
  {
    nombre: 'Verifica.xyz',
    descripcion: 'Transparencia institucional con ENS. Ganador de 3 tracks en ETH México Monterrey.',
    imagen: '/images/Proyectos/Verifica.png',
    tecnologias: ['Ethereum', 'ENS', 'React', 'Solidity'],
    premio: 'ETH Mexico Monterrey - 3 Tracks',
    premioUSD: 1500,
    categoria: 'hackathon'
  },
  {
    nombre: 'La Kiniela',
    descripcion: 'Mercado de predicciones mexicano construido en Arbitrum con Solidity para apuestas deportivas.',
    imagen: '/images/Proyectos/LaKiniela.png',
    tecnologias: ['Arbitrum', 'Solidity', 'React', 'Chainlink'],
    premio: 'Bitso Hackathon',
    premioUSD: 1500,
    categoria: 'hackathon'
  },
  {
    nombre: 'PumaPay',
    descripcion: 'Wallet universitaria para pagos diarios en cafeterías usando MXNB, Bitso y Juno.',
    imagen: '/images/Proyectos/PumaPay.png',
    tecnologias: ['MXNB', 'Bitso', 'Juno', 'React Native'],
    premio: null,
    premioUSD: 0,
    categoria: 'community'
  },
  {
    nombre: 'CU-Shop',
    descripcion: 'Marketplace sobre blockchain para estudiantes universitarios construido en Base con Solidity.',
    imagen: '/images/Proyectos/CU-Shop.png',
    tecnologias: ['Base', 'Solidity', 'React', 'Web3.js'],
    premio: null,
    premioUSD: 0,
    categoria: 'community'
  },
  {
    nombre: 'EVVM Scanner',
    descripcion: 'Escáner de vulnerabilidades para contratos inteligentes. Ganador en ETH Global Argentina.',
    imagen: '/images/Proyectos/EVVMScanner.png',
    tecnologias: ['Ethereum', 'Solidity', 'Python', 'React'],
    premio: 'ETH Global Argentina',
    premioUSD: 1375,
    categoria: 'hackathon'
  },
  {
    nombre: 'UniFood',
    descripcion: 'Sistema de distribución de becas para alimentación construido en ZKsync.',
    imagen: '/images/Proyectos/UniFood.png',
    tecnologias: ['ZKsync', 'Solidity', 'React', 'Zero-Knowledge'],
    premio: 'ETHCDMX',
    premioUSD: 500,
    categoria: 'hackathon'
  },
  {
    nombre: 'CampusCoin',
    descripcion: 'Token universitario para incentivos y gobernanza en comunidades educativas.',
    imagen: '/images/Proyectos/CampusCoin.png',
    tecnologias: ['Base', 'Solidity', 'React', 'The Graph'],
    premio: 'BaseBatch Latam 001',
    premioUSD: 1250,
    categoria: 'hackathon'
  },
  {
    nombre: 'My DentalVault',
    descripcion: 'Sistema de registro dental de tratamientos e historia médica construido en Polkadot.',
    imagen: '/images/Proyectos/MyDentalVault.png',
    tecnologias: ['Polkadot', 'Substrate', 'React', 'IPFS'],
    premio: 'Polkadot Hackathon',
    premioUSD: 200,
    categoria: 'hackathon'
  },
  {
    nombre: 'EnerPay',
    descripcion: 'Sistema de pagos para servicios de energía usando blockchain.',
    imagen: '/images/Proyectos/EnerPay.png',
    tecnologias: ['Ethereum', 'Solidity', 'React', 'Chainlink'],
    premio: 'Bitso Hackathon',
    premioUSD: 1000,
    categoria: 'hackathon'
  },
  {
    nombre: 'NearMint',
    descripcion: 'Plataforma de minting de NFTs en la red NEAR Protocol.',
    imagen: '/images/Proyectos/NearMint.png',
    tecnologias: ['NEAR', 'Rust', 'React', 'IPFS'],
    premio: 'Starknet Resolve',
    premioUSD: 600,
    categoria: 'hackathon'
  },
  {
    nombre: 'Unbox',
    descripcion: 'Tokenización de streetwear y art toys en Solana.',
    imagen: '/images/Proyectos/Unbox.png',
    tecnologias: ['Solana', 'Rust', 'React', 'Anchor'],
    premio: 'Solana Shipyard',
    premioUSD: 150,
    categoria: 'hackathon'
  },
  {
    nombre: 'UNAM DAO',
    descripcion: 'Organización autónoma descentralizada para la comunidad universitaria.',
    imagen: '/images/Proyectos/UNAMDAO.png',
    tecnologias: ['Avalanche', 'Solidity', 'React', 'Snapshot'],
    premio: 'Sherry (AVAX)',
    premioUSD: 300,
    categoria: 'hackathon'
  },
  {
    nombre: 'SkillHub ID',
    descripcion: 'Sistema de certificación a través de la comunidad construido en Stellar.',
    imagen: '/images/Proyectos/SkillHubID.png',
    tecnologias: ['Stellar', 'JavaScript', 'React', 'Soroswap'],
    premio: 'Stellar Mexico',
    premioUSD: 100,
    categoria: 'hackathon'
  },
  {
    nombre: 'Premio.xyz',
    descripcion: 'Plataforma de sorteos y premios descentralizados en Celo.',
    imagen: '/images/Proyectos/Premio.png',
    tecnologias: ['Celo', 'Solidity', 'React', 'Web3.js'],
    premio: 'Celo Proof of Ship',
    premioUSD: 40,
    categoria: 'hackathon'
  },
  {
    nombre: 'Mundial-Buzz',
    descripcion: 'Sistema de apuestas para el mundial 2026 desarrollado en EthGlobal NYC.',
    imagen: '/images/Proyectos/MundialBuzz.png',
    tecnologias: ['Ethereum', 'Solidity', 'React', 'The Graph'],
    premio: 'EthGlobal NYC 2024',
    premioUSD: 0,
    categoria: 'hackathon'
  },
  {
    nombre: 'PumaAgentAI',
    descripcion: 'Agente de inteligencia artificial para asistencia estudiantil y gestión universitaria.',
    imagen: '/images/Proyectos/PumaAgentAI.png',
    tecnologias: ['AI', 'Machine Learning', 'Python', 'OpenAI'],
    premio: null,
    premioUSD: 0,
    categoria: 'research'
  },
  {
    nombre: 'CoreWeavesAgent',
    descripcion: 'TokenLauncher sobre CoreDAO para la creación y gestión de tokens comunitarios.',
    imagen: '/images/Proyectos/CoreWeavesAgent.png',
    tecnologias: ['CoreDAO', 'Solidity', 'React', 'Web3.js'],
    premio: 'CoreDAO Hackathon 2024',
    premioUSD: 0,
    categoria: 'hackathon'
  },
]

// Calcular total de premios
const totalPremiosUSD = PROYECTOS_HACKATHONES.reduce((acc, p) => acc + p.premioUSD, 0)

// Fotos de 2024 (carpeta Comunidad)
const FOTOS_2024 = [
  { src: '/images/Comunidad/_DSC0027 (1).jpg', titulo: 'Hackathon Blockchain 2024', descripcion: 'Estudiantes desarrollando proyectos innovadores' },
  { src: '/images/Comunidad/_DSC0151.jpg', titulo: 'Conferencia Anual 2024', descripcion: 'Expertos compartiendo conocimiento sobre blockchain' },
  { src: '/images/Comunidad/_DSC0051.jpg', titulo: 'Workshop Smart Contracts', descripcion: 'Aprendiendo desarrollo de contratos inteligentes' },
  { src: '/images/Comunidad/_DSC0278 (1).jpg', titulo: 'Networking Event', descripcion: 'Conectando con la comunidad blockchain' },
  { src: '/images/Comunidad/_DSC0118 (1).jpg', titulo: 'Laboratorio de Blockchain', descripcion: 'Espacio de trabajo colaborativo' },
  { src: '/images/Comunidad/_DSC0158 (1).jpg', titulo: 'Equipo CriptoUNAM', descripcion: 'Nuestro equipo trabajando en proyectos' },
  { src: '/images/Comunidad/_DSC0083 (1).jpg', titulo: 'Sesión de Mentoría', descripcion: 'Guiando a nuevos miembros de la comunidad' },
  { src: '/images/Comunidad/_DSC0129.jpg', titulo: 'Demo Day 2024', descripcion: 'Presentación de proyectos finales' },
  { src: '/images/Comunidad/_DSC0166.jpg', titulo: 'Taller Práctico', descripcion: 'Manos a la obra con blockchain' },
  { src: '/images/Comunidad/_DSC0175.jpg', titulo: 'Comunidad Reunida', descripcion: 'Evento de cierre 2024' },
  { src: '/images/Comunidad/FI-Billetera.jpg', titulo: 'Taller Mi Primer Wallet', descripcion: 'Facultad de Ingeniería' },
  { src: '/images/Comunidad/Workshop.jpg', titulo: 'Workshop DeFi', descripcion: 'Fundamentos de finanzas descentralizadas' },
]

// Componente de galería de mes
const GaleriaMes: React.FC<{ mes: string; carpeta: string }> = ({ mes, carpeta }) => {
  const imagenes = IMAGENES_POR_MES[mes] || []
  
  if (imagenes.length === 0) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        color: '#888',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: 12
      }}>
        <FontAwesomeIcon icon={faCamera} style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
        <p>No hay imágenes disponibles</p>
      </div>
    )
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '1rem'
    }}>
      {imagenes.slice(0, 8).map((img, idx) => (
        <div key={idx} style={{
          borderRadius: 12,
          overflow: 'hidden',
          border: '2px solid rgba(212,175,55,0.3)',
          transition: 'all 0.3s ease'
        }}>
          <img
            src={`/images/${carpeta}/${encodeURIComponent(img)}`}
            alt={`${mes} - ${idx + 1}`}
            loading="lazy"
            style={{
              width: '100%',
              height: '180px',
              objectFit: 'cover',
              display: 'block'
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>
      ))}
    </div>
  )
}

// Componente de sección de mes colapsable
const SeccionMes: React.FC<{ mesData: typeof MESES_2025[0]; defaultOpen?: boolean }> = ({ mesData, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div style={{
      background: 'rgba(26,26,26,0.8)',
      borderRadius: 16,
      border: '1px solid rgba(212,175,55,0.2)',
      overflow: 'hidden',
      marginBottom: '1rem'
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#fff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{
            background: '#D4AF37',
            color: '#000',
            padding: '0.3rem 0.8rem',
            borderRadius: 6,
            fontWeight: 'bold',
            fontSize: '0.85rem'
          }}>
            {mesData.mes}
          </span>
          <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>{mesData.titulo}</span>
        </div>
        <FontAwesomeIcon 
          icon={isOpen ? faChevronUp : faChevronDown} 
          style={{ color: '#D4AF37' }} 
        />
      </button>
      
      {isOpen && (
        <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
          <GaleriaMes mes={mesData.mes} carpeta={mesData.carpeta} />
        </div>
      )}
    </div>
  )
}

const Comunidad = () => {
  return (
    <>
      <SEOHead
        title="Comunidad - CriptoUNAM"
        description="Únete a la comunidad de estudiantes y entusiastas de blockchain en la UNAM. Descubre todo lo que logramos en 2025."
        image="/images/LogosCriptounam.svg"
        url="https://criptounam.xyz/comunidad"
        type="website"
      />

      <div className="section" style={{ minHeight: '100vh', paddingTop: '2rem', paddingBottom: '4rem' }}>

        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 className="hero-title" style={{ fontFamily: 'Orbitron', color: '#D4AF37', marginBottom: '1rem', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Nuestra Comunidad
          </h1>
          <p style={{ color: '#E0E0E0', fontSize: '1.2rem', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
            Somos una red de estudiantes, desarrolladores y apasionados por la tecnología blockchain construyendo el futuro descentralizado.
          </p>
        </header>

        {/* Sección 1: Canales de Conexión */}
        <section style={{ maxWidth: 1200, margin: '0 auto 5rem auto', padding: '0 20px' }}>
          <h2 style={{ fontFamily: 'Orbitron', color: '#fff', fontSize: '2rem', textAlign: 'center', marginBottom: '3rem' }}>
            Conéctate con Nosotros
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <a href="https://discord.gg/criptounam" target="_blank" rel="noreferrer" className="card" style={{
              textDecoration: 'none', textAlign: 'center', padding: '2.5rem',
              background: 'linear-gradient(145deg, rgba(88, 101, 242, 0.1), rgba(88, 101, 242, 0.05))',
              border: '1px solid rgba(88, 101, 242, 0.3)', transition: 'transform 0.2s'
            }}>
              <FontAwesomeIcon icon={faDiscord} style={{ fontSize: '3rem', color: '#5865F2', marginBottom: '1.5rem' }} />
              <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Discord</h3>
              <p style={{ color: '#aaa' }}>El corazón de nuestra comunidad. Charlas diarias, soporte y networking.</p>
            </a>

            <a href="https://twitter.com/criptounam" target="_blank" rel="noreferrer" className="card" style={{
              textDecoration: 'none', textAlign: 'center', padding: '2.5rem',
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
              border: '1px solid rgba(255, 255, 255, 0.2)', transition: 'transform 0.2s'
            }}>
              <FontAwesomeIcon icon={faTwitter} style={{ fontSize: '3rem', color: '#fff', marginBottom: '1.5rem' }} />
              <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Twitter / X</h3>
              <p style={{ color: '#aaa' }}>Mantente al día con las últimas noticias, anuncios y spaces.</p>
            </a>

            <a href="https://t.me/criptounam" target="_blank" rel="noreferrer" className="card" style={{
              textDecoration: 'none', textAlign: 'center', padding: '2.5rem',
              background: 'linear-gradient(145deg, rgba(36, 161, 222, 0.1), rgba(36, 161, 222, 0.05))',
              border: '1px solid rgba(36, 161, 222, 0.3)', transition: 'transform 0.2s'
            }}>
              <FontAwesomeIcon icon={faTelegram} style={{ fontSize: '3rem', color: '#24A1DE', marginBottom: '1.5rem' }} />
              <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Telegram</h3>
              <p style={{ color: '#aaa' }}>Anuncios rápidos y coordinación directa.</p>
            </a>
          </div>
        </section>

        {/* Sección 2: Roles y Participación */}
        <section style={{ maxWidth: 1000, margin: '0 auto 5rem auto', padding: '0 20px' }}>
          <div style={{ background: 'rgba(26,26,26,0.8)', borderRadius: 24, padding: '3rem', border: '1px solid rgba(212,175,55,0.15)' }}>
            <h2 style={{ fontFamily: 'Orbitron', color: '#D4AF37', fontSize: '2rem', textAlign: 'center', marginBottom: '3rem' }}>
              ¿Cómo puedes participar?
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 60, height: 60, background: 'rgba(212,175,55,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                  <FontAwesomeIcon icon={faUsers} style={{ color: '#D4AF37', fontSize: '1.5rem' }} />
                </div>
                <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '1rem' }}>Miembro</h3>
                <p style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  Asiste a eventos, únete al Discord y aprende con nuestros recursos gratuitos.
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 60, height: 60, background: 'rgba(78, 205, 196, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                  <FontAwesomeIcon icon={faHandshake} style={{ color: '#4ecdc4', fontSize: '1.5rem' }} />
                </div>
                <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '1rem' }}>Contribuidor</h3>
                <p style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  Ayuda a organizar eventos, crea contenido o contribuye código a nuestros proyectos.
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 60, height: 60, background: 'rgba(244, 208, 63, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                  <FontAwesomeIcon icon={faBolt} style={{ color: '#F4D03F', fontSize: '1.5rem' }} />
                </div>
                <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '1rem' }}>Core Team</h3>
                <p style={{ color: '#aaa', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  Lidera iniciativas y representa a CriptoUNAM en el ecosistema global.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección 3: CriptoUNAM 2025 - Recap */}
        <section style={{ maxWidth: 1200, margin: '0 auto 5rem auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: 'Orbitron', color: '#D4AF37', fontSize: '2.5rem', marginBottom: '1rem' }}>
              CriptoUNAM 2025
            </h2>
            <p style={{ color: '#E0E0E0', fontSize: '1.2rem', maxWidth: 600, margin: '0 auto' }}>
              Un año de hackathones, eventos, viajes y mucho código. Explora mes a mes todo lo que logramos.
            </p>
          </div>

          {/* Galería por meses */}
          <div>
            {MESES_2025.map((mesData, idx) => (
              <SeccionMes key={mesData.mes} mesData={mesData} defaultOpen={idx === 0} />
            ))}
          </div>
        </section>

        {/* Sección 4: CriptoUNAM 2024 */}
        <section style={{ maxWidth: 1200, margin: '0 auto 5rem auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Orbitron', color: '#fff', fontSize: '2rem', marginBottom: '0.5rem' }}>
              CriptoUNAM 2024
            </h2>
            <p style={{ color: '#888', fontSize: '1rem' }}>
              Donde todo comenzó - nuestros primeros eventos y talleres
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {FOTOS_2024.map((foto, idx) => (
              <div key={idx} style={{
                borderRadius: 16,
                overflow: 'hidden',
                background: 'rgba(26,26,26,0.8)',
                border: '1px solid rgba(212,175,55,0.2)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#D4AF37'
                e.currentTarget.style.transform = 'translateY(-5px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
              >
                <img
                  src={foto.src}
                  alt={foto.titulo}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
                <div style={{ padding: '1rem' }}>
                  <h4 style={{ color: '#D4AF37', fontSize: '1rem', marginBottom: '0.3rem' }}>
                    {foto.titulo}
                  </h4>
                  <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>
                    {foto.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sección 5: Proyectos y Hackathones Ganados */}
        <section style={{ maxWidth: 1200, margin: '0 auto 5rem auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <FontAwesomeIcon icon={faTrophy} style={{ fontSize: '2.5rem', color: '#D4AF37' }} />
              <h2 style={{ fontFamily: 'Orbitron', color: '#D4AF37', fontSize: '2.5rem', margin: 0 }}>
                Proyectos y Hackathones
              </h2>
            </div>
            <p style={{ color: '#E0E0E0', fontSize: '1.2rem', maxWidth: 700, margin: '0 auto 1.5rem auto' }}>
              Innovación y desarrollo blockchain creado por nuestra comunidad
            </p>
            
            {/* Badge de premios totales */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.8rem',
              background: 'rgba(212,175,55,0.15)',
              padding: '1rem 2rem',
              borderRadius: 16,
              border: '2px solid rgba(212,175,55,0.4)'
            }}>
              <FontAwesomeIcon icon={faTrophy} style={{ color: '#D4AF37', fontSize: '1.5rem' }} />
              <div style={{ textAlign: 'left' }}>
                <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>Total en premios ganados</p>
                <p style={{ fontFamily: 'Orbitron', color: '#D4AF37', fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>
                  ${totalPremiosUSD.toLocaleString()} USD
                </p>
              </div>
            </div>
          </div>

          {/* Grid de proyectos */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            {PROYECTOS_HACKATHONES.slice(0, 9).map((proyecto, idx) => (
              <article key={idx} style={{
                background: 'rgba(26,26,26,0.9)',
                borderRadius: 20,
                overflow: 'hidden',
                border: '1px solid rgba(212,175,55,0.3)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.borderColor = '#D4AF37'
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(212,175,55,0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)'
              }}
              >
                {/* Imagen del proyecto */}
                <div style={{
                  height: 180,
                  background: 'linear-gradient(135deg, #D4AF37, #2563EB)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <img
                    src={proyecto.imagen}
                    alt={proyecto.nombre}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                  {/* Fallback icon if no image */}
                  <FontAwesomeIcon icon={faCode} style={{
                    position: 'absolute',
                    fontSize: '3rem',
                    color: 'rgba(255,255,255,0.3)',
                    zIndex: 0
                  }} />
                  
                  {/* Badge de premio */}
                  {proyecto.premioUSD > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      background: 'rgba(0,0,0,0.85)',
                      color: '#4ecdc4',
                      padding: '0.4rem 0.8rem',
                      borderRadius: 8,
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      border: '1px solid #4ecdc4',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}>
                      <FontAwesomeIcon icon={faTrophy} style={{ fontSize: '0.75rem' }} />
                      ${proyecto.premioUSD} USD
                    </div>
                  )}
                </div>

                {/* Contenido */}
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontFamily: 'Orbitron', color: '#D4AF37', fontSize: '1.3rem', margin: 0 }}>
                      {proyecto.nombre}
                    </h3>
                  </div>
                  
                  {proyecto.premio && (
                    <span style={{
                      background: 'rgba(245,158,11,0.2)',
                      color: '#FBBF24',
                      padding: '0.3rem 0.6rem',
                      borderRadius: 8,
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      marginBottom: '0.75rem',
                      alignSelf: 'flex-start'
                    }}>
                      {proyecto.premio}
                    </span>
                  )}
                  
                  <p style={{ color: '#E0E0E0', lineHeight: 1.6, margin: '0 0 1rem 0', flex: 1 }}>
                    {proyecto.descripcion}
                  </p>

                  {/* Tecnologías */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {proyecto.tecnologias.slice(0, 4).map((tech, techIdx) => (
                      <span key={techIdx} style={{
                        background: 'rgba(37,99,235,0.2)',
                        color: '#60A5FA',
                        padding: '0.25rem 0.6rem',
                        borderRadius: 12,
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Botón ver todos */}
          <div style={{ textAlign: 'center' }}>
            <Link 
              to="/proyectos" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'linear-gradient(45deg, #D4AF37, #2563EB)',
                color: '#0A0A0A',
                padding: '1rem 2rem',
                borderRadius: 12,
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1.1rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              Ver Todos los Proyectos ({PROYECTOS_HACKATHONES.length})
              <FontAwesomeIcon icon={faRocket} />
            </Link>
          </div>
        </section>

        {/* Sección 7: Lo que viene para 2026 */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(0,0,0,0.5))',
            borderRadius: 24,
            padding: '3rem',
            border: '2px solid rgba(212,175,55,0.3)',
            textAlign: 'center'
          }}>
            <FontAwesomeIcon icon={faRocket} style={{ fontSize: '3rem', color: '#D4AF37', marginBottom: '1rem' }} />
            <h2 style={{ fontFamily: 'Orbitron', color: '#D4AF37', fontSize: '2rem', marginBottom: '1.5rem' }}>
              Lo que viene para 2026
            </h2>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem',
              marginTop: '2rem'
            }}>
              {['Hackathon UNAM', 'Bootcamps', 'Incubación de Proyectos', 'Go To Markets', 'Onboarding Estudiantes', 'CriptoUNAM DAO'].map((item, idx) => (
                <span key={idx} style={{
                  background: 'rgba(212,175,55,0.15)',
                  color: '#D4AF37',
                  padding: '0.8rem 1.5rem',
                  borderRadius: 12,
                  fontWeight: 600,
                  border: '1px solid rgba(212,175,55,0.3)'
                }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  )
}

export default Comunidad
