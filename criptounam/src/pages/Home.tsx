import React, { useState } from 'react'
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
import '../styles/Home.css'

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
    e.preventDefault()
    
    try {
      const result = await handleRegistration(formData)
      
      if (result.success) {
        setShowSuccessMessage(true)
        setTimeout(() => {
          setShowForm(false)
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
          })
        }, 700)

        setTimeout(() => {
          setShowSuccessMessage(false)
        }, 5000)
      } else {
        setShowErrorMessage(true)
        setTimeout(() => {
          setShowErrorMessage(false)
        }, 5000)
      }
    } catch (error) {
      console.error('Error al procesar el formulario:', error)
      setShowErrorMessage(true)
      setTimeout(() => {
        setShowErrorMessage(false)
      }, 5000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Enviando suscripción:', email)
    
    if (!email) {
      setShowNewsletterError(true)
      setTimeout(() => setShowNewsletterError(false), 5000)
      return
    }

    try {
      console.log('Llamando a handleNewsletterSubscription...')
      const result = await handleNewsletterSubscription(email, 'home')
      console.log('Resultado de la suscripción:', result)
      
      if (result.success) {
        setEmail('')
        setShowNewsletterSuccess(true)
        setTimeout(() => setShowNewsletterSuccess(false), 5000)
      } else {
        setShowNewsletterError(true)
        setTimeout(() => setShowNewsletterError(false), 5000)
      }
    } catch (error) {
      console.error('Error al procesar la suscripción:', error)
      setShowNewsletterError(true)
      setTimeout(() => setShowNewsletterError(false), 5000)
    }
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Bienvenido a CriptoUNAM</h1>
          <p>Tu puerta de entrada al mundo de blockchain, criptomonedas y Web3</p>
          <div className="hero-buttons">
            <button className="primary-button" onClick={() => setShowForm(true)}>
              Únete a la Comunidad
            </button>
            <Link to="/cursos" className="secondary-button">
              Explora Nuestros Cursos
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src={IMAGES.HERO_BG} alt="CriptoUNAM Hero" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-card">
          <FontAwesomeIcon icon={faGraduationCap} className="stat-icon" />
          <h3>+500</h3>
          <p>Estudiantes Activos</p>
        </div>
        <div className="stat-card">
          <FontAwesomeIcon icon={faCertificate} className="stat-icon" />
          <h3>+100</h3>
          <p>Certificaciones Emitidas</p>
        </div>
        <div className="stat-card">
          <FontAwesomeIcon icon={faUsers} className="stat-icon" />
          <h3>+50</h3>
          <p>Eventos Realizados</p>
        </div>
        <div className="stat-card">
          <FontAwesomeIcon icon={faRocket} className="stat-icon" />
          <h3>+10</h3>
          <p>Proyectos Desarrollados</p>
        </div>
      </section>

      {/* Blockchain Tech Section */}
      <section className="blockchain-tech-section">
        <div className="tech-container">
          <h2>Tecnologías Blockchain</h2>
          <div className="tech-grid">
            <div className="tech-card">
              <FontAwesomeIcon icon={faEthereum} className="tech-icon" />
              <h3>Ethereum</h3>
              <p>Plataforma líder para contratos inteligentes y aplicaciones descentralizadas.</p>
              <div className="tech-progress">
                <div className="progress-bar" style={{ width: '90%' }}></div>
              </div>
            </div>
            <div className="tech-card">
              <FontAwesomeIcon icon={faBitcoin} className="tech-icon" />
              <h3>Bitcoin</h3>
              <p>La primera y más grande criptomoneda, fundamento de la tecnología blockchain.</p>
              <div className="tech-progress">
                <div className="progress-bar" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div className="tech-card">
              <FontAwesomeIcon icon={faCode} className="tech-icon" />
              <h3>Solidity</h3>
              <p>Lenguaje de programación para desarrollar contratos inteligentes en Ethereum.</p>
              <div className="tech-progress">
                <div className="progress-bar" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div className="tech-card">
              <FontAwesomeIcon icon={faShieldAlt} className="tech-icon" />
              <h3>Seguridad</h3>
              <p>Principios de criptografía y seguridad en el desarrollo blockchain.</p>
              <div className="tech-progress">
                <div className="progress-bar" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>¿Por Qué Elegir CriptoUNAM?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FontAwesomeIcon icon={faGraduationCap} className="feature-icon" />
            <h3>Educación de Calidad</h3>
            <p>Cursos diseñados por expertos en blockchain y criptomonedas</p>
          </div>
          <div className="feature-card">
            <FontAwesomeIcon icon={faChartLine} className="feature-icon" />
            <h3>Mercado Laboral</h3>
            <p>Preparación para las demandas del mercado laboral en Web3</p>
          </div>
          <div className="feature-card">
            <FontAwesomeIcon icon={faCode} className="feature-icon" />
            <h3>Desarrollo Práctico</h3>
            <p>Proyectos reales y hands-on experience</p>
          </div>
          <div className="feature-card">
            <FontAwesomeIcon icon={faShieldAlt} className="feature-icon" />
            <h3>Seguridad</h3>
            <p>Enfoque en las mejores prácticas de seguridad en blockchain</p>
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="learning-path">
        <h2>Tu Camino de Aprendizaje</h2>
        <div className="path-container">
          <div className="path-step">
            <div className="step-number">1</div>
            <h3>Fundamentos</h3>
            <p>Blockchain, Bitcoin, Ethereum y conceptos básicos</p>
          </div>
          <div className="path-arrow">→</div>
          <div className="path-step">
            <div className="step-number">2</div>
            <h3>Desarrollo</h3>
            <p>Smart Contracts, DApps y desarrollo Web3</p>
          </div>
          <div className="path-arrow">→</div>
          <div className="path-step">
            <div className="step-number">3</div>
            <h3>Especialización</h3>
            <p>DeFi, NFTs, DAOs y más</p>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section newsletter">
        <h2>Únete a Nuestra Newsletter</h2>
        <p>Mantente actualizado con las últimas noticias y eventos de CriptoUNAM</p>
        <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
          <div className="newsletter-input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu correo electrónico"
              required
              className="newsletter-input"
            />
            <button type="submit" className="newsletter-button">
              Suscribirse
            </button>
          </div>
        </form>
      </section>

      {/* Social Section */}
      <section className="social-section">
        <h2>Síguenos en Redes Sociales</h2>
        <p>Mantente al día con las últimas novedades y eventos</p>
        <div className="social-links">
          <a href="https://discord.gg/Pmu4JQeNR6" className="social-link discord" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-discord"></i>
            Discord
          </a>
          <a href="https://t.me/+tPgjd4cOxG05NmVh" className="social-link telegram" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-telegram"></i>
            Telegram
          </a>
          <a href="https://x.com/Cripto_UNAM" className="social-link twitter" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i>
            Twitter
          </a>
        </div>
      </section>

      {/* Video Section */}
      <section className="video-section">
        <div className="video-container">
          <h2>Conoce Más Sobre CriptoUNAM</h2>
          <div className="video-wrapper">
            <iframe
              src="https://www.youtube.com/embed/VIDEO_ID"
              title="Video de CriptoUNAM"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2>Lo Que Dicen Nuestros Estudiantes</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <FontAwesomeIcon icon={faQuoteLeft} className="quote-icon" />
              <p>"CriptoUNAM me abrió las puertas al mundo de blockchain. Ahora trabajo en un proyecto DeFi."</p>
            </div>
            <div className="testimonial-author">
              <img src={IMAGES.TESTIMONIALS.TESTIMONIAL_1} alt="Estudiante" className="author-image" />
              <div className="author-info">
                <h4>María González</h4>
                <p>Desarrolladora Blockchain</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <FontAwesomeIcon icon={faQuoteLeft} className="quote-icon" />
              <p>"La comunidad y los recursos de CriptoUNAM son increíbles. Aprendí más de lo que esperaba."</p>
            </div>
            <div className="testimonial-author">
              <img src={IMAGES.TESTIMONIALS.TESTIMONIAL_2} alt="Estudiante" className="author-image" />
              <div className="author-info">
                <h4>Carlos Rodríguez</h4>
                <p>Analista de Criptomonedas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners-section">
        <h2>Nuestros Aliados</h2>
        <div className="partners-grid">
          <div className="partner-logo">
            <img src={IMAGES.PARTNERS.PARTNER_1} alt="Partner 1" />
          </div>
          <div className="partner-logo">
            <img src={IMAGES.PARTNERS.PARTNER_2} alt="Partner 2" />
          </div>
          <div className="partner-logo">
            <img src={IMAGES.PARTNERS.PARTNER_3} alt="Partner 3" />
          </div>
        </div>
      </section>

      {/* Success/Error Messages */}
      {showSuccessMessage && (
        <div className="success-message">
          <p>¡Registro exitoso! Te contactaremos pronto.</p>
        </div>
      )}
      
      {showErrorMessage && (
        <div className="error-message">
          <p>Hubo un error al procesar tu registro. Por favor, intenta de nuevo.</p>
        </div>
      )}

      {showNewsletterSuccess && (
        <div className="success-message newsletter-message">
          <p>¡Suscripción exitosa! Te mantendremos informado.</p>
        </div>
      )}
      
      {showNewsletterError && (
        <div className="error-message newsletter-message">
          <p>Hubo un error al procesar tu suscripción. Por favor, intenta de nuevo.</p>
        </div>
      )}

      {/* Registration Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content registration-form">
            <button 
              className="close-button"
              onClick={() => setShowForm(false)}
              aria-label="Cerrar formulario"
            >
              ×
            </button>
            <h2>Registro en CriptoUNAM</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nombre">Nombre*</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="apellidos">Apellidos*</label>
                <input
                  type="text"
                  id="apellidos"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edad">Edad*</label>
                <input
                  type="number"
                  id="edad"
                  name="edad"
                  min="15"
                  max="99"
                  value={formData.edad}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="carrera">Carrera*</label>
                <input
                  type="text"
                  id="carrera"
                  name="carrera"
                  value={formData.carrera}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="plantel">Plantel UNAM*</label>
                <select
                  id="plantel"
                  name="plantel"
                  value={formData.plantel}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona un plantel</option>
                  <option value="FI">Facultad de Ingeniería</option>
                  <option value="FC">Facultad de Ciencias</option>
                  <option value="FCA">Facultad de Contaduría y Administración</option>
                  <option value="FE">Facultad de Economía</option>
                  <option value="FM">Facultad de Medicina</option>
                  <option value="FQ">Facultad de Química</option>
                  <option value="FAD">Facultad de Arte y Diseño</option>
                  <option value="FTS">Facultad de Trabajo Social y Desarrollo Humano</option>
                  <option value="FV">Facultad de Veterinaria</option>
                  <option value="FCPyS">Facultad de Ciencias Políticas y Sociales</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="numeroCuenta">Número de Cuenta*</label>
                <input
                  type="text"
                  id="numeroCuenta"
                  name="numeroCuenta"
                  pattern="\d{9}"
                  title="El número de cuenta debe tener 9 dígitos"
                  value={formData.numeroCuenta}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="motivacion">¿Por qué quieres formar parte de CriptoUNAM?*</label>
                <textarea
                  id="motivacion"
                  name="motivacion"
                  value={formData.motivacion}
                  onChange={handleChange}
                  required
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label htmlFor="telegram">Usuario de Telegram*</label>
                <input
                  type="text"
                  id="telegram"
                  name="telegram"
                  value={formData.telegram}
                  onChange={handleChange}
                  placeholder="@usuario"
                  required
                />
              </div>

              <div className="form-group">
                <label>Redes Sociales</label>
                <div className="social-inputs">
                  <input
                    type="text"
                    name="instagram"
                    placeholder="Instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="linkedin"
                    placeholder="LinkedIn"
                    value={formData.linkedin}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="facebook"
                    placeholder="Facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    placeholder="Twitter"
                  />
                </div>
              </div>

              <button type="submit" className="submit-button">
                Enviar Registro
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home 