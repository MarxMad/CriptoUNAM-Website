import React, { useState, useCallback } from 'react'
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
  faQuoteLeft
} from '@fortawesome/free-solid-svg-icons'
import { faEthereum, faBitcoin } from '@fortawesome/free-brands-svg-icons'
import { motion } from 'framer-motion'
import Particles from 'react-tsparticles'
import { loadSlim } from 'tsparticles-slim'
import type { Engine } from 'tsparticles-engine'
import '../styles/global.css'

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
      number: { value: 50, density: { enable: true, value_area: 800 } },
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
      links: { enable: true, distance: 150, color: '#D4AF37', opacity: 0.4, width: 1 }
    },
    interactivity: {
      events: { onHover: { enable: true, mode: 'grab' } },
      modes: { grab: { distance: 140, links: { opacity: 0.8 } } }
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

  return (
    <div className="home-page">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        className="particles-container"
      />

      {/* HERO */}
      <section className="section hero-section" style={{paddingTop: '6rem', paddingBottom: '3rem', textAlign: 'center'}}>
        <img 
          src="/images/5.png" 
          alt="Logo CriptoUNAM" 
          className="logo-hero"
          style={{maxWidth: '160px', width: '60vw', margin: '0 auto 1.5rem auto', display: 'block'}}
        />
        <h1 className="hero-title">Bienvenido a CriptoUNAM</h1>
        <p className="hero-subtitle">La comunidad universitaria de blockchain, criptomonedas y tecnología descentralizada</p>
        <motion.button className="primary-button" whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={()=>setShowForm(true)}>Únete Ahora</motion.button>
      </section>

      {/* MODAL FORMULARIO REGISTRO */}
      {showForm && (
        <motion.div className="modal-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{zIndex:1000}}>
          <motion.div className="modal-content card" initial={{scale:0.8, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.8, opacity:0}} transition={{duration:0.3}} style={{maxWidth:500, margin:'auto', position:'relative'}}>
            <button className="close-button" onClick={()=>setShowForm(false)} style={{position:'absolute', top:10, right:16, background:'none', border:'none', color:'#D4AF37', fontSize:24, cursor:'pointer'}}>×</button>
            <h2 style={{marginBottom:16}}>Registro en CriptoUNAM</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Nombre*</label><input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required /></div>
              <div className="form-group"><label>Apellidos*</label><input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} required /></div>
              <div className="form-group"><label>Edad*</label><input type="number" name="edad" value={formData.edad} onChange={handleChange} required min="15" max="99" /></div>
              <div className="form-group"><label>Carrera*</label><input type="text" name="carrera" value={formData.carrera} onChange={handleChange} required /></div>
              <div className="form-group"><label>Plantel*</label><input type="text" name="plantel" value={formData.plantel} onChange={handleChange} required /></div>
              <div className="form-group"><label>Número de Cuenta*</label><input type="text" name="numeroCuenta" value={formData.numeroCuenta} onChange={handleChange} required pattern="\d{9}" title="El número de cuenta debe tener 9 dígitos" /></div>
              <div className="form-group"><label>¿Por qué quieres formar parte de CriptoUNAM?*</label><textarea name="motivacion" value={formData.motivacion} onChange={handleChange} required rows={3} /></div>
              <div className="form-group"><label>Usuario de Telegram*</label><input type="text" name="telegram" value={formData.telegram} onChange={handleChange} required placeholder="@usuario" /></div>
              <div className="form-group"><label>Redes Sociales</label>
                <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:'1rem'}}>
                  <input type="text" name="instagram" placeholder="Instagram" value={formData.instagram} onChange={handleChange} />
                  <input type="text" name="linkedin" placeholder="LinkedIn" value={formData.linkedin} onChange={handleChange} />
                  <input type="text" name="facebook" placeholder="Facebook" value={formData.facebook} onChange={handleChange} />
                  <input type="text" name="twitter" placeholder="Twitter" value={formData.twitter} onChange={handleChange} />
            </div>
              </div>
              <button type="submit" className="primary-button" style={{width:'100%', marginTop:12}}>Enviar Registro</button>
            </form>
            {showSuccessMessage && <p style={{color:'#D4AF37', marginTop:8}}>¡Registro exitoso! Te contactaremos pronto.</p>}
            {showErrorMessage && <p style={{color:'#ff4444', marginTop:8}}>Hubo un error. Por favor, intenta de nuevo.</p>}
          </motion.div>
        </motion.div>
      )}

      {/* STATS */}
      <section className="section" style={{paddingTop:0}}>
        <h2 className="text-center" style={{marginBottom: '2rem'}}>Nuestros Números</h2>
        <div className="grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', maxWidth: 900, margin: '0 auto'}}>
          {[
            { icon: faUsers, number: '5000+', text: 'Miembros' },
            { icon: faGraduationCap, number: '50+', text: 'Cursos' },
            { icon: faCertificate, number: '1000+', text: 'Certificados' }
          ].map((stat, i) => (
            <motion.div key={i} className="card" variants={itemVariants} initial="hidden" whileInView="visible" viewport={{once:true}} whileHover={{scale:1.05}}>
              <FontAwesomeIcon icon={stat.icon} style={{color:'#D4AF37', fontSize:'2.2rem', marginBottom:12}} />
              <h3 style={{color:'#D4AF37', fontSize:'2rem', margin:0}}>{stat.number}</h3>
              <p style={{margin:0}}>{stat.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" style={{paddingTop:0}}>
        <h2 className="text-center" style={{marginBottom: '2rem'}}>¿Por qué CriptoUNAM?</h2>
        <div className="grid-4">
          {[
            { icon: faRocket, title: 'Innovación', text: 'Aprende las últimas tecnologías blockchain' },
            { icon: faChartLine, title: 'Mercado', text: 'Conoce las tendencias del mercado crypto' },
            { icon: faCode, title: 'Desarrollo', text: 'Desarrolla tus propios proyectos blockchain' },
            { icon: faShieldAlt, title: 'Seguridad', text: 'Aprende sobre seguridad en blockchain' }
          ].map((feature, i) => (
            <motion.div key={i} className="card" variants={itemVariants} initial="hidden" whileInView="visible" viewport={{once:true}} whileHover={{scale:1.05}}>
              <FontAwesomeIcon icon={feature.icon} style={{color:'#D4AF37', fontSize:'2.2rem', marginBottom:12}} />
              <h3 style={{color:'#D4AF37', fontSize:'1.3rem', margin:0}}>{feature.title}</h3>
              <p style={{margin:0}}>{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="section" style={{paddingTop:0}}>
        <div className="flex flex-center">
          <motion.div className="card" style={{maxWidth: 600, width:'100%'}} initial="hidden" whileInView="visible" viewport={{once:true}}>
            <h2 style={{marginBottom:8}}>Mantente Informado</h2>
            <p style={{marginBottom:16}}>Suscríbete a nuestro newsletter para recibir las últimas noticias y actualizaciones</p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-1" style={{alignItems:'center'}}>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Tu correo electrónico" required style={{flex:1}} />
              <motion.button type="submit" className="primary-button" whileHover={{scale:1.05}} whileTap={{scale:0.95}}>Suscribirse</motion.button>
            </form>
            {showNewsletterSuccess && <p style={{color:'#D4AF37', marginTop:8}}>¡Gracias por suscribirte!</p>}
            {showNewsletterError && <p style={{color:'#ff4444', marginTop:8}}>Hubo un error. Por favor, intenta de nuevo.</p>}
          </motion.div>
        </div>
      </section>

      {/* LEARNING PATH */}
      <section className="section" style={{paddingTop:0}}>
        <h2 className="text-center" style={{marginBottom: '2rem'}}>Tu Camino de Aprendizaje</h2>
        <div className="grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', maxWidth: 900, margin: '0 auto'}}>
          {[
            { number: 1, title: 'Fundamentos', description: 'Blockchain, Bitcoin, Ethereum y conceptos básicos' },
            { number: 2, title: 'Desarrollo', description: 'Smart Contracts, DApps y desarrollo Web3' },
            { number: 3, title: 'Especialización', description: 'DeFi, NFTs, DAOs y más' }
          ].map((step, i) => (
            <motion.div key={i} className="card" variants={itemVariants} initial="hidden" whileInView="visible" viewport={{once:true}} whileHover={{scale:1.05}}>
              <div style={{width:40, height:40, borderRadius:'50%', background:'#D4AF37', color:'#0A0A0A', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'1.2rem', margin:'0 auto 1rem auto'}}>{step.number}</div>
              <h3 style={{color:'#D4AF37', fontSize:'1.3rem', margin:0}}>{step.title}</h3>
              <p style={{margin:0}}>{step.description}</p>
            </motion.div>
          ))}
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
            { icon: faShieldAlt, title: 'Seguridad', description: 'Principios de criptografía y seguridad en el desarrollo blockchain.' }
          ].map((tech, i) => (
            <motion.div key={i} className="card" variants={itemVariants} initial="hidden" whileInView="visible" viewport={{once:true}} whileHover={{scale:1.05}}>
              <FontAwesomeIcon icon={tech.icon} style={{color:'#D4AF37', fontSize:'2.2rem', marginBottom:12}} />
              <h3 style={{color:'#D4AF37', fontSize:'1.3rem', margin:0}}>{tech.title}</h3>
              <p style={{margin:0}}>{tech.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="section" style={{paddingTop:0}}>
        <h2 className="text-center" style={{marginBottom: '2rem'}}>Lo Que Dicen Nuestros Estudiantes</h2>
        <div className="grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', maxWidth: 900, margin: '0 auto'}}>
          {[
            {
              quote: '"CriptoUNAM me abrió las puertas al mundo de blockchain. Ahora trabajo en un proyecto DeFi."',
              name: 'María González',
              role: 'Desarrolladora Blockchain',
              img: 'https://randomuser.me/api/portraits/women/44.jpg'
            },
            {
              quote: '"La comunidad y los recursos de CriptoUNAM son increíbles. Aprendí más de lo que esperaba."',
              name: 'Carlos Rodríguez',
              role: 'Analista de Criptomonedas',
              img: 'https://randomuser.me/api/portraits/men/32.jpg'
            }
          ].map((t, i) => (
            <motion.div key={i} className="card" style={{display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center'}} variants={itemVariants} initial="hidden" whileInView="visible" viewport={{once:true}}>
              <FontAwesomeIcon icon={faQuoteLeft} style={{color:'#D4AF37', fontSize:'1.5rem', marginBottom:8}} />
              <p style={{fontStyle:'italic', marginBottom:16}}>{t.quote}</p>
              <img src={t.img} alt={t.name} style={{width:60, height:60, borderRadius:'50%', objectFit:'cover', marginBottom:8, border:'2px solid #D4AF37'}} />
              <h4 style={{color:'#D4AF37', margin:0}}>{t.name}</h4>
              <p style={{margin:0, fontSize:'0.95rem'}}>{t.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PARTNERS */}
      <section className="section" style={{paddingTop:0}}>
        <h2 className="text-center" style={{marginBottom: '2rem'}}>Nuestros Aliados</h2>
        <div className="grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', maxWidth: 700, margin: '0 auto'}}>
          {[
            { img: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png', alt: 'Partner 1' },
            { img: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Python_logo.png', alt: 'Partner 2' },
            { img: 'https://upload.wikimedia.org/wikipedia/commons/1/18/C_Programming_Language.svg', alt: 'Partner 3' }
          ].map((p, i) => (
            <motion.div key={i} className="card" style={{display:'flex', alignItems:'center', justifyContent:'center', minHeight:100}} variants={itemVariants} initial="hidden" whileInView="visible" viewport={{once:true}}>
              <img src={p.img} alt={p.alt} style={{maxWidth:100, maxHeight:60, objectFit:'contain'}} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home 