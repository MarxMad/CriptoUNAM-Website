import React, { useState } from 'react'
import { IMAGES } from '../constants/images'

interface RegistrationForm {
  nombre: string
  apellidos: string
  edad: string
  carrera: string
  plantel: string
  numeroCuenta: string
  motivacion: string
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
    twitter: '',
    instagram: '',
    linkedin: '',
    facebook: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Datos del formulario:', formData)
    setFormData({
      nombre: '',
      apellidos: '',
      edad: '',
      carrera: '',
      plantel: '',
      numeroCuenta: '',
      motivacion: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      facebook: ''
    })
    setShowForm(false)
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Email registrado:', email)
    setEmail('')
  }

  

  return (
    <div className="home-container">
      {/* Hero Section */}
      <header 
        className="hero"
        style={{ 
          backgroundImage: `url(${IMAGES.LOGO})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain'
        }}
      >
        <div className="hero-content">
          <h1>CriptoUNAM</h1>
          <h2>Formando la próxima generación de profesionales en blockchain</h2>
          <button 
            className="join-button"
            onClick={() => setShowForm(true)}
          >
            Únete a la comunidad
          </button>
        </div>
      </header>

      {/* Sobre Nosotros */}
      <section id="about" className="section">
        <h2>Nuestra Misión</h2>
        <p>Somos una comunidad universitaria dedicada a formar profesionales en tecnología blockchain y Web3, 
           creando un espacio de aprendizaje, innovación y networking.</p>
        
        <div className="stats-container">
          <div className="stat-box">
            <h3>500+</h3>
            <p>Miembros</p>
          </div>
          <div className="stat-box">
            <h3>50+</h3>
            <p>Eventos Realizados</p>
          </div>
          <div className="stat-box">
            <h3>20+</h3>
            <p>Proyectos Blockchain</p>
          </div>
          <div className="stat-box">
            <h3>20+</h3>
            <p>Hackathons</p>
          </div>
        </div>
      </section>

      {/* Video Destacado */}
      <section className="section video-section">
        <h2>Conoce Nuestra Comunidad</h2>
        <div className="video-container">
          <iframe 
            src="https://www.youtube.com/embed/tu-video-id"
            title="CriptoUNAM Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section newsletter">
        <h2>Únete a Nuestra Newsletter</h2>
        <p>Mantente actualizado con las últimas noticias y eventos de CriptoUNAM</p>
        <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu correo electrónico"
            required
          />
          <button type="submit">Suscribirse</button>
        </form>
      </section>

      {/* Sección de Redes Sociales */}
      <section className="social-section">
        <h2>Síguenos en Redes Sociales</h2>
        <p>Mantente al día con las últimas novedades y eventos</p>
        <div className="social-links">
          <a href="https://discord.gg/criptounam" className="social-link discord" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-discord"></i>
            Discord
          </a>
          <a href="https://t.me/criptounam" className="social-link telegram" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-telegram"></i>
            Telegram
          </a>
          <a href="https://twitter.com/criptounam" className="social-link twitter" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i>
            Twitter
          </a>
        </div>
      </section>

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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="plantel">Plantel UNAM*</label>
                <select
                  id="plantel"
                  name="plantel"
                  value={formData.plantel}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecciona un plantel</option>
                  <option value="FI">Facultad de Ingeniería</option>
                  <option value="FC">Facultad de Ciencias</option>
                  <option value="FCA">Facultad de Contaduría y Administración</option>
                  <option value="FE">Facultad de Economía</option>
                  {/* Agregar más planteles según sea necesario */}
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
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="motivacion">¿Por qué quieres formar parte de CriptoUNAM?*</label>
                <textarea
                  id="motivacion"
                  name="motivacion"
                  value={formData.motivacion}
                  onChange={handleInputChange}
                  required
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Redes Sociales</label>
                <div className="social-inputs">
                  <input
                    type="text"
                    name="twitter"
                    placeholder="Twitter/X"
                    value={formData.twitter}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="instagram"
                    placeholder="Instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="linkedin"
                    placeholder="LinkedIn"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="facebook"
                    placeholder="Facebook"
                    value={formData.facebook}
                    onChange={handleInputChange}
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

      <footer className="footer">
        <p>&copy; 2024 CriptoUNAM. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}

export default Home 