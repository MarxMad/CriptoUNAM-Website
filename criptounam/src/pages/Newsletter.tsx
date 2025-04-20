import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGraduationCap, faCalendarAlt, faCertificate, faTrophy, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { handleNewsletterSubscription } from '../api/telegram'
import '../styles/Newsletter.css'

interface NewsletterEntry {
  id: number
  title: string
  date: string
  content: string
  imageUrl?: string
}

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isSubscribed) {
      timeoutId = setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isSubscribed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!email || !email.includes('@')) {
        throw new Error('Por favor ingresa un email válido')
      }

      const { success, error: telegramError } = await handleNewsletterSubscription(email)
      
      if (!success) {
        throw new Error(telegramError || 'Error al enviar la suscripción')
      }

      setIsSubscribed(true)
      setEmail('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar la suscripción')
    } finally {
      setLoading(false)
    }
  }

  const entries: NewsletterEntry[] = [
    {
      id: 1,
      title: 'Introducción a Web3: El Futuro de Internet',
      date: '15 de abril, 2024',
      content: 'En esta edición exploramos los fundamentos de Web3 y cómo está transformando la forma en que interactuamos con internet. Desde la descentralización hasta los contratos inteligentes, te llevamos a través de los conceptos básicos que todo entusiasta de blockchain debe conocer.',
      imageUrl: 'src/constants/images/web3-intro.jpg'
    },
    {
      id: 2,
      title: 'Bitcoin Halving 2024: ¿Qué Significa para el Mercado?',
      date: '10 de abril, 2024',
      content: 'Analizamos el próximo halving de Bitcoin y sus posibles implicaciones en el mercado de criptomonedas. Incluimos perspectivas de expertos y datos históricos para entender mejor este importante evento en el ecosistema Bitcoin.',
      imageUrl: 'src/constants/images/bitcoin-halving.jpg'
    },
    {
      id: 3,
      title: 'NFTs en la Educación: Casos de Uso Innovadores',
      date: '5 de abril, 2024',
      content: 'Descubre cómo las universidades y centros educativos están utilizando NFTs para certificar logros académicos, crear colecciones digitales y revolucionar la forma en que se comparte el conocimiento.',
      imageUrl: 'src/constants/images/nft-education.jpg'
    }
  ]

  return (
    <div className="newsletter-page">
      <header className="newsletter-header">
        <h1>Newsletter CriptoUNAM</h1>
        <p>Mantente actualizado con las últimas noticias y eventos sobre blockchain y criptomonedas</p>
      </header>

      <div className="sections-container">
        <section className="entries-section">
          <h2>Últimas Entradas</h2>
          <div className="newsletter-entries">
            {entries.map((entry) => (
              <article key={entry.id} className="newsletter-entry">
                {entry.imageUrl && (
                  <div className="entry-image">
                    <img src={entry.imageUrl} alt={entry.title} />
                  </div>
                )}
                <div className="entry-content">
                  <h2>{entry.title}</h2>
                  <span className="entry-date">
                    <i className="fas fa-calendar"></i>
                    {entry.date}
                  </span>
                  <p>{entry.content}</p>
                  <Link to={`/newsletter/${entry.id}`} className="read-more">
                    Leer más
                    <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="subscription-section">
          <h2>Suscríbete a Nuestra Newsletter</h2>
          <p className="subscription-description">
            Únete a nuestra comunidad y recibe contenido exclusivo sobre blockchain, criptomonedas y tecnología Web3
          </p>
          <div className="newsletter-form-container">
            <form onSubmit={handleSubmit} className="newsletter-form">
              <div className="form-group">
                <label htmlFor="email">
                  <FontAwesomeIcon icon={faEnvelope} /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                />
              </div>

              {error && <div className="error-message">{error}</div>}
              {isSubscribed && (
                <div className="success-message">
                  ¡Gracias por suscribirte! Te mantendremos informado.
                </div>
              )}

              <button type="submit" className="subscribe-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Procesando...
                  </>
                ) : (
                  'Suscribirse Ahora'
                )}
              </button>
            </form>
          </div>
        </section>
      </div>

      <div className="benefits-section">
        <h2>Beneficios de Suscribirte</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <FontAwesomeIcon icon={faGraduationCap} className="benefit-icon" />
            <h3>Cursos Exclusivos</h3>
            <p>Acceso a cursos especializados en blockchain y criptomonedas</p>
          </div>
          <div className="benefit-card">
            <FontAwesomeIcon icon={faCalendarAlt} className="benefit-icon" />
            <h3>Eventos Prioritarios</h3>
            <p>Información anticipada sobre eventos y conferencias</p>
          </div>
          <div className="benefit-card">
            <FontAwesomeIcon icon={faCertificate} className="benefit-icon" />
            <h3>Certificaciones</h3>
            <p>Oportunidades para obtener certificaciones reconocidas</p>
          </div>
          <div className="benefit-card">
            <FontAwesomeIcon icon={faTrophy} className="benefit-icon" />
            <h3>Logros y Recompensas</h3>
            <p>Participa en programas de recompensas y logros</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Newsletter 