import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGraduationCap, faCalendarAlt, faCertificate, faTrophy, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { handleNewsletterSubscription } from '../api/telegram'
import '../styles/global.css'
import { newsletterEntries } from './newsletterData'

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

      const { success, message: telegramError } = await handleNewsletterSubscription(email, 'newsletter')
      
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

  return (
    <div className="section" style={{minHeight:'100vh', display:'flex', flexDirection:'column', paddingTop:'2rem'}}>
      <header className="newsletter-header" style={{textAlign:'center', marginBottom:'2.5rem'}}>
        <h1 className="hero-title" style={{fontFamily:'Orbitron', color:'#D4AF37', marginBottom:8}}>Newsletter CriptoUNAM</h1>
        <p className="hero-subtitle" style={{color:'#E0E0E0', fontSize:'1.2rem'}}>Mantente actualizado con las últimas noticias y eventos sobre blockchain y criptomonedas</p>
      </header>

      <div className="sections-container" style={{display:'flex', flexWrap:'wrap', gap:'2.5rem', justifyContent:'center', alignItems:'flex-start', margin:'0 auto', maxWidth:1200}}>
        <section className="entries-section" style={{flex:'2 1 480px', minWidth:320, maxWidth:700}}>
          <h2 className="hero-title" style={{fontFamily:'Orbitron', color:'#D4AF37', fontSize:'1.3rem', marginBottom:'1.2rem'}}>Últimas Entradas</h2>
          <div className="newsletter-entries" style={{display:'flex', flexDirection:'column', gap:'2.2rem'}}>
            {newsletterEntries.map((entry) => (
              <article key={entry.id} className="card newsletter-entry" style={{padding:'1.2rem', display:'flex', flexDirection:'column', gap:'0.7rem', minHeight:320, maxWidth:'100%', margin:'0 auto'}}>
                {entry.imageUrl && (
                  <div className="entry-image" style={{width:'100%', height:140, marginBottom:8}}>
                    <img src={entry.imageUrl} alt={entry.title} style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:16, boxShadow:'0 4px 18px 0 #1E3A8A22'}} />
                  </div>
                )}
                <div className="entry-content" style={{display:'flex', flexDirection:'column', gap:'0.3rem'}}>
                  <h2 style={{fontFamily:'Orbitron', color:'#D4AF37', fontSize:'1.1rem', margin:'0 0 0.2rem 0'}}>{entry.title}</h2>
                  <span className="entry-date" style={{color:'#2563EB', fontSize:'0.98rem', marginBottom:2}}>
                    <i className="fas fa-calendar"></i> {entry.date}
                  </span>
                  <p style={{color:'#E0E0E0', fontSize:'0.98rem'}}>{entry.content}</p>
                  <Link to={`/newsletter/${entry.id}`} className="primary-button" style={{marginTop:'0.5rem', fontSize:'0.98rem', borderRadius:16, fontWeight:700, letterSpacing:'1px', padding:'0.4rem 1.2rem', width:'fit-content'}}>Leer más <i className="fas fa-arrow-right"></i></Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="subscription-section card" style={{flex:'1 1 340px', minWidth:320, maxWidth:400, padding:'2rem', background:'rgba(26,26,26,0.7)', backdropFilter:'blur(12px)', border:'1.5px solid #D4AF37', boxShadow:'0 4px 24px rgba(30,58,138,0.08)', position:'sticky', top:'6rem', alignSelf:'flex-start', height:'fit-content'}}>
          <h2 className="hero-title" style={{fontFamily:'Orbitron', color:'#D4AF37', fontSize:'1.2rem', marginBottom:'1rem'}}>Suscríbete a Nuestra Newsletter</h2>
          <p className="subscription-description" style={{color:'#E0E0E0', fontSize:'1rem', marginBottom:'1.2rem'}}>
            Únete a nuestra comunidad y recibe contenido exclusivo sobre blockchain, criptomonedas y tecnología Web3
          </p>
          <div className="newsletter-form-container">
            <form onSubmit={handleSubmit} className="newsletter-form" style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
              <div className="form-group" style={{display:'flex', flexDirection:'column', gap:'0.3rem'}}>
                <label htmlFor="email" style={{color:'#D4AF37', fontWeight:600, marginBottom:2}}>
                  <FontAwesomeIcon icon={faEnvelope} /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  style={{borderRadius:12, border:'2px solid #D4AF37', background:'rgba(26,26,26,0.7)', color:'#fff', fontSize:'1rem', padding:'0.8rem 1rem'}}
                />
              </div>

              {error && <div className="error-message" style={{color:'#ff4444', fontWeight:600}}>{error}</div>}
              {isSubscribed && (
                <div className="success-message" style={{color:'#D4AF37', fontWeight:600}}>
                  ¡Gracias por suscribirte! Te mantendremos informado.
                </div>
              )}

              <button type="submit" className="primary-button" style={{fontSize:'1rem', borderRadius:18, fontWeight:700, letterSpacing:'1px', padding:'0.7rem 1.2rem', marginTop:'0.5rem'}} disabled={loading}>
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
        </aside>
      </div>

      <div className="benefits-section" style={{margin:'3rem auto 0 auto', maxWidth:1200}}>
        <h2 className="hero-title" style={{fontFamily:'Orbitron', color:'#D4AF37', fontSize:'1.3rem', marginBottom:'1.2rem'}}>Beneficios de Suscribirte</h2>
        <div className="benefits-grid grid-4">
          <div className="card benefit-card" style={{textAlign:'center', padding:'2rem 1rem', minWidth:180}}>
            <FontAwesomeIcon icon={faGraduationCap} className="benefit-icon" style={{fontSize:'2.2rem', color:'#D4AF37', marginBottom:10}} />
            <h3 style={{fontFamily:'Orbitron', color:'#D4AF37', fontSize:'1.1rem', margin:0}}>Cursos Exclusivos</h3>
            <p style={{color:'#E0E0E0', margin:0}}>Acceso a cursos especializados en blockchain y criptomonedas</p>
          </div>
          <div className="card benefit-card" style={{textAlign:'center', padding:'2rem 1rem', minWidth:180}}>
            <FontAwesomeIcon icon={faCalendarAlt} className="benefit-icon" style={{fontSize:'2.2rem', color:'#D4AF37', marginBottom:10}} />
            <h3 style={{fontFamily:'Orbitron', color:'#D4AF37', fontSize:'1.1rem', margin:0}}>Eventos Prioritarios</h3>
            <p style={{color:'#E0E0E0', margin:0}}>Información anticipada sobre eventos y conferencias</p>
          </div>
          <div className="card benefit-card" style={{textAlign:'center', padding:'2rem 1rem', minWidth:180}}>
            <FontAwesomeIcon icon={faCertificate} className="benefit-icon" style={{fontSize:'2.2rem', color:'#D4AF37', marginBottom:10}} />
            <h3 style={{fontFamily:'Orbitron', color:'#D4AF37', fontSize:'1.1rem', margin:0}}>Certificaciones</h3>
            <p style={{color:'#E0E0E0', margin:0}}>Oportunidades para obtener certificaciones reconocidas</p>
          </div>
          <div className="card benefit-card" style={{textAlign:'center', padding:'2rem 1rem', minWidth:180}}>
            <FontAwesomeIcon icon={faTrophy} className="benefit-icon" style={{fontSize:'2.2rem', color:'#D4AF37', marginBottom:10}} />
            <h3 style={{fontFamily:'Orbitron', color:'#D4AF37', fontSize:'1.1rem', margin:0}}>Logros y Recompensas</h3>
            <p style={{color:'#E0E0E0', margin:0}}>Participa en programas de recompensas y logros</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Newsletter 