import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faExternalLinkAlt, faCode, faUsers, faTrophy } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import SEOHead from '../components/SEOHead'
import '../styles/global.css'

const ProyectosDestacados = () => {
  // Datos de proyectos destacados
  const proyectos = [
    {
      id: 1,
      nombre: 'Utonoma',
      descripcion: 'Plataforma descentralizada para la gestión de identidades digitales universitarias, permitiendo a los estudiantes tener control total sobre sus credenciales académicas.',
      tecnologias: ['Solidity', 'React', 'IPFS', 'Web3'],
      imagen: '/images/Proyectos/utonoma.jpg',
      github: 'https://github.com/criptounam/utonoma',
      demo: 'https://utonoma.xyz',
      equipo: ['Gerardo Vela', 'Fernanda Tello', 'Daniel Cruz'],
      premios: ['1er lugar Hackathon UNAM 2024', 'Mejor uso de Blockchain'],
      categoria: 'Identidad Digital'
    },
    {
      id: 2,
      nombre: 'CU-Shop',
      descripcion: 'Marketplace descentralizado para la comunidad universitaria, donde los estudiantes pueden comprar y vender productos usando criptomonedas de forma segura.',
      tecnologias: ['Ethereum', 'Next.js', 'MetaMask', 'OpenZeppelin'],
      imagen: '/images/Proyectos/cu-shop.jpg',
      github: 'https://github.com/criptounam/cu-shop',
      demo: 'https://cu-shop.xyz',
      equipo: ['Adrian Armenta', 'Tadeo Sepúlveda'],
      premios: ['2do lugar ETH Mexico 2024'],
      categoria: 'E-commerce'
    },
    {
      id: 3,
      nombre: 'La Kiniela',
      descripcion: 'Sistema de apuestas descentralizado para eventos deportivos universitarios, utilizando smart contracts para garantizar transparencia y justicia.',
      tecnologias: ['Polygon', 'Vue.js', 'Chainlink', 'The Graph'],
      imagen: '/images/Proyectos/la-kiniela.jpg',
      github: 'https://github.com/criptounam/la-kiniela',
      demo: 'https://la-kiniela.xyz',
      equipo: ['Benjamín Romero', 'Andrés Rodríguez'],
      premios: ['3er lugar Polygon Hackathon'],
      categoria: 'DeFi'
    },
    {
      id: 4,
      nombre: 'PumaPay',
      descripcion: 'Sistema de pagos universitarios basado en blockchain, permitiendo transacciones instantáneas y seguras dentro del campus.',
      tecnologias: ['Binance Smart Chain', 'React Native', 'Web3.js'],
      imagen: '/images/Proyectos/pumapay.jpg',
      github: 'https://github.com/criptounam/pumapay',
      demo: 'https://pumapay.xyz',
      equipo: ['Adrián Martínez', 'Linda'],
      premios: ['Mejor innovación financiera'],
      categoria: 'Fintech'
    },
    {
      id: 5,
      nombre: 'My DentalVault',
      descripcion: 'Plataforma para el almacenamiento seguro de historiales dentales usando blockchain, garantizando privacidad y acceso controlado.',
      tecnologias: ['Ethereum', 'React', 'IPFS', 'ENS'],
      imagen: '/images/Proyectos/dentalvault.jpg',
      github: 'https://github.com/criptounam/dentalvault',
      demo: 'https://dentalvault.xyz',
      equipo: ['David Ricardo', 'Ian Hernández'],
      premios: ['1er lugar HealthTech Hackathon'],
      categoria: 'Salud'
    },
    {
      id: 6,
      nombre: 'UniFood',
      descripcion: 'Red de distribución de alimentos universitarios usando blockchain para rastrear la cadena de suministro y garantizar calidad.',
      tecnologias: ['Hyperledger', 'Node.js', 'MongoDB'],
      imagen: '/images/Proyectos/unifood.jpg',
      github: 'https://github.com/criptounam/unifood',
      demo: 'https://unifood.xyz',
      equipo: ['Gerardo Vela', 'Fernanda Tello'],
      premios: ['Mejor impacto social'],
      categoria: 'Logística'
    },
    {
      id: 7,
      nombre: 'LatamCoins',
      descripcion: 'Exchange descentralizado especializado en criptomonedas latinoamericanas, promoviendo la inclusión financiera en la región.',
      tecnologias: ['Ethereum', 'Solidity', 'React', 'Web3'],
      imagen: '/images/Proyectos/latamcoins.jpg',
      github: 'https://github.com/criptounam/latamcoins',
      demo: 'https://latamcoins.xyz',
      equipo: ['Daniel Cruz', 'Adrian Armenta'],
      premios: ['2do lugar Latam DeFi Summit'],
      categoria: 'Exchange'
    },
    {
      id: 8,
      nombre: 'SkillHubID',
      descripcion: 'Plataforma de certificación de habilidades profesionales usando NFTs, creando un sistema de credenciales verificables.',
      tecnologias: ['Polygon', 'IPFS', 'React', 'Web3'],
      imagen: '/images/Proyectos/skillhub.jpg',
      github: 'https://github.com/criptounam/skillhub',
      demo: 'https://skillhub.xyz',
      equipo: ['Tadeo Sepúlveda', 'Benjamín Romero'],
      premios: ['Mejor uso de NFTs'],
      categoria: 'Educación'
    },
    {
      id: 9,
      nombre: 'ZenTrade',
      descripcion: 'Bot de trading automatizado para criptomonedas con estrategias basadas en machine learning y análisis técnico.',
      tecnologias: ['Python', 'TensorFlow', 'Web3', 'APIs'],
      imagen: '/images/Proyectos/zentrade.jpg',
      github: 'https://github.com/criptounam/zentrade',
      demo: 'https://zentrade.xyz',
      equipo: ['Andrés Rodríguez', 'Adrián Martínez'],
      premios: ['Mejor algoritmo de trading'],
      categoria: 'Trading'
    },
    {
      id: 10,
      nombre: 'PumaAgentAI',
      descripcion: 'Asistente virtual para estudiantes universitarios basado en IA, integrando blockchain para verificar identidad y proporcionar servicios personalizados.',
      tecnologias: ['OpenAI', 'Ethereum', 'React', 'Node.js'],
      imagen: '/images/Proyectos/pumaagent.jpg',
      github: 'https://github.com/criptounam/pumaagent',
      demo: 'https://pumaagent.xyz',
      equipo: ['Linda', 'David Ricardo'],
      premios: ['Innovación en IA'],
      categoria: 'IA'
    },
    {
      id: 11,
      nombre: 'CoreWeavesAgent',
      descripcion: 'Plataforma de computación distribuida que permite a los estudiantes alquilar recursos computacionales usando criptomonedas.',
      tecnologias: ['Ethereum', 'Docker', 'Kubernetes', 'Web3'],
      imagen: '/images/Proyectos/coreweaves.jpg',
      github: 'https://github.com/criptounam/coreweaves',
      demo: 'https://coreweaves.xyz',
      equipo: ['Ian Hernández', 'Gerardo Vela'],
      premios: ['Mejor infraestructura'],
      categoria: 'Computación'
    },
    {
      id: 12,
      nombre: 'Mundial-Buzz',
      descripcion: 'Plataforma de predicciones deportivas descentralizada para eventos mundiales, con premios en criptomonedas.',
      tecnologias: ['Polygon', 'React', 'Chainlink', 'Web3'],
      imagen: '/images/Proyectos/mundialbuzz.jpg',
      github: 'https://github.com/criptounam/mundialbuzz',
      demo: 'https://mundialbuzz.xyz',
      equipo: ['Fernanda Tello', 'Daniel Cruz'],
      premios: ['Mejor gamificación'],
      categoria: 'Gaming'
    }
  ]

  return (
    <>
      <SEOHead 
        title="Proyectos Destacados - CriptoUNAM"
        description="Descubre los proyectos blockchain más innovadores desarrollados por la comunidad CriptoUNAM. Desde DeFi hasta IA, exploramos el futuro de la tecnología descentralizada."
        image="https://criptounam.xyz/images/LogosCriptounam.svg"
        url="https://criptounam.xyz/proyectos"
        type="website"
      />
      <div className="section" style={{minHeight:'100vh', paddingTop:'2rem'}}>
        <div style={{maxWidth:'1200px', margin:'0 auto', padding:'0 20px'}}>
          {/* Header */}
          <div style={{textAlign:'center', marginBottom:'3rem'}}>
            <Link to="/" style={{display:'inline-flex', alignItems:'center', gap:'0.5rem', color:'#D4AF37', textDecoration:'none', marginBottom:'1rem'}}>
              <FontAwesomeIcon icon={faArrowLeft} />
              Volver al Inicio
            </Link>
            <h1 style={{fontFamily:'Orbitron', color:'#D4AF37', fontSize:'2.5rem', marginBottom:'1rem'}}>
              Proyectos Destacados
            </h1>
            <p style={{color:'#E0E0E0', fontSize:'1.2rem', maxWidth:'600px', margin:'0 auto'}}>
              Explora los proyectos blockchain más innovadores desarrollados por nuestra comunidad
            </p>
          </div>

          {/* Grid de proyectos */}
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fit, minmax(350px, 1fr))',
            gap:'2rem',
            marginBottom:'3rem'
          }}>
            {proyectos.map((proyecto) => (
              <div key={proyecto.id} style={{
                background:'rgba(26,26,26,0.9)',
                borderRadius:'20px',
                padding:'2rem',
                border:'1px solid rgba(212,175,55,0.3)',
                boxShadow:'0 8px 32px rgba(0,0,0,0.3)',
                transition:'all 0.3s ease',
                cursor:'pointer'
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
              }}>
                {/* Imagen del proyecto */}
                <div style={{
                  width:'100%',
                  height:'200px',
                  background:'linear-gradient(135deg, #D4AF37, #2563EB)',
                  borderRadius:'12px',
                  marginBottom:'1.5rem',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  fontSize:'3rem',
                  color:'white'
                }}>
                  <FontAwesomeIcon icon={faCode} />
                </div>

                {/* Información del proyecto */}
                <div style={{marginBottom:'1.5rem'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem'}}>
                    <h3 style={{fontFamily:'Orbitron', color:'#D4AF37', fontSize:'1.3rem', margin:0}}>
                      {proyecto.nombre}
                    </h3>
                    <span style={{
                      background:'rgba(212,175,55,0.2)',
                      color:'#D4AF37',
                      padding:'0.2rem 0.6rem',
                      borderRadius:'12px',
                      fontSize:'0.8rem',
                      fontWeight:600
                    }}>
                      {proyecto.categoria}
                    </span>
                  </div>
                  <p style={{color:'#E0E0E0', lineHeight:'1.6', margin:'0 0 1rem 0'}}>
                    {proyecto.descripcion}
                  </p>
                </div>

                {/* Tecnologías */}
                <div style={{marginBottom:'1.5rem'}}>
                  <h4 style={{color:'#D4AF37', fontSize:'0.9rem', margin:'0 0 0.5rem 0', fontWeight:600}}>
                    Tecnologías:
                  </h4>
                  <div style={{display:'flex', flexWrap:'wrap', gap:'0.5rem'}}>
                    {proyecto.tecnologias.map((tech, index) => (
                      <span key={index} style={{
                        background:'rgba(37,99,235,0.2)',
                        color:'#60A5FA',
                        padding:'0.3rem 0.8rem',
                        borderRadius:'16px',
                        fontSize:'0.8rem',
                        fontWeight:500
                      }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Equipo */}
                <div style={{marginBottom:'1.5rem'}}>
                  <h4 style={{color:'#D4AF37', fontSize:'0.9rem', margin:'0 0 0.5rem 0', fontWeight:600}}>
                    <FontAwesomeIcon icon={faUsers} style={{marginRight:'0.5rem'}} />
                    Equipo:
                  </h4>
                  <p style={{color:'#E0E0E0', fontSize:'0.9rem', margin:0}}>
                    {proyecto.equipo.join(', ')}
                  </p>
                </div>

                {/* Premios */}
                {proyecto.premios.length > 0 && (
                  <div style={{marginBottom:'1.5rem'}}>
                    <h4 style={{color:'#D4AF37', fontSize:'0.9rem', margin:'0 0 0.5rem 0', fontWeight:600}}>
                      <FontAwesomeIcon icon={faTrophy} style={{marginRight:'0.5rem'}} />
                      Premios:
                    </h4>
                    <div style={{display:'flex', flexDirection:'column', gap:'0.3rem'}}>
                      {proyecto.premios.map((premio, index) => (
                        <span key={index} style={{
                          background:'rgba(245,158,11,0.2)',
                          color:'#FBBF24',
                          padding:'0.3rem 0.6rem',
                          borderRadius:'8px',
                          fontSize:'0.8rem',
                          fontWeight:500
                        }}>
                          {premio}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                <div style={{display:'flex', gap:'1rem', justifyContent:'center'}}>
                  {proyecto.github && (
                    <a 
                      href={proyecto.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        display:'flex',
                        alignItems:'center',
                        gap:'0.5rem',
                        background:'rgba(26,26,26,0.8)',
                        color:'#E0E0E0',
                        padding:'0.8rem 1.5rem',
                        borderRadius:'12px',
                        textDecoration:'none',
                        border:'1px solid rgba(212,175,55,0.3)',
                        transition:'all 0.3s ease',
                        fontWeight:600
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#D4AF37'
                        e.currentTarget.style.color = '#0A0A0A'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(26,26,26,0.8)'
                        e.currentTarget.style.color = '#E0E0E0'
                      }}
                    >
                      <FontAwesomeIcon icon={faGithub} />
                      GitHub
                    </a>
                  )}
                  {proyecto.demo && (
                    <a 
                      href={proyecto.demo} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        display:'flex',
                        alignItems:'center',
                        gap:'0.5rem',
                        background:'linear-gradient(45deg, #D4AF37, #2563EB)',
                        color:'#0A0A0A',
                        padding:'0.8rem 1.5rem',
                        borderRadius:'12px',
                        textDecoration:'none',
                        transition:'all 0.3s ease',
                        fontWeight:600
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                    >
                      <FontAwesomeIcon icon={faExternalLinkAlt} />
                      Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div style={{
            textAlign:'center',
            background:'rgba(26,26,26,0.8)',
            borderRadius:'20px',
            padding:'3rem',
            border:'1px solid rgba(212,175,55,0.3)',
            marginTop:'3rem'
          }}>
            <h2 style={{fontFamily:'Orbitron', color:'#D4AF37', fontSize:'2rem', marginBottom:'1rem'}}>
              ¿Tienes un proyecto?
            </h2>
            <p style={{color:'#E0E0E0', fontSize:'1.1rem', marginBottom:'2rem'}}>
              Únete a nuestra comunidad y desarrolla el próximo proyecto blockchain innovador
            </p>
            <Link 
              to="/comunidad" 
              style={{
                display:'inline-flex',
                alignItems:'center',
                gap:'0.5rem',
                background:'linear-gradient(45deg, #D4AF37, #2563EB)',
                color:'#0A0A0A',
                padding:'1rem 2rem',
                borderRadius:'12px',
                textDecoration:'none',
                fontWeight:600,
                fontSize:'1.1rem',
                transition:'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              Únete a la Comunidad
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProyectosDestacados
