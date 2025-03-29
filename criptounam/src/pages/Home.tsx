import { useState } from 'react'

const Home = () => {
  const [email, setEmail] = useState('')
  const [walletConnected, setWalletConnected] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Email registrado:', email)
  }

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        setWalletConnected(true)
      } catch (error) {
        console.error('Error al conectar wallet:', error)
      }
    } else {
      alert('Por favor instala MetaMask!')
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1>CriptoUNAM</h1>
          <h2>Formando la próxima generación de profesionales en blockchain</h2>
          <button className="cta-button">Únete a la comunidad</button>
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
        <form onSubmit={handleSubmit} className="newsletter-form">
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

      <footer className="footer">
        <p>&copy; 2024 CriptoUNAM. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}

export default Home 