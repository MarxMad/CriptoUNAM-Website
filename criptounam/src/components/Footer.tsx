import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord, faTelegram, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { handleNewsletterSubscription } from '../api/telegram'

const Footer = () => {
  // Estado para el modal de comunidad
  const [showJoinModal, setShowJoinModal] = useState(false)
  // Estado para el formulario de comunidad
  const [formData, setFormData] = useState({
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
  // Newsletter
  const [email, setEmail] = useState('')
  const [showNewsletterSuccess, setShowNewsletterSuccess] = useState(false)
  const [showNewsletterError, setShowNewsletterError] = useState(false)

  // Handlers para el formulario de comunidad
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.apellidos || !formData.edad || !formData.carrera || !formData.plantel || !formData.numeroCuenta || !formData.motivacion) {
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 5000);
      return;
    }
    // Aquí deberías llamar a tu API real, por ahora simula éxito
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowJoinModal(false);
      setFormData({
        nombre: '', apellidos: '', edad: '', carrera: '', plantel: '', numeroCuenta: '', motivacion: '', telegram: '', twitter: '', instagram: '', linkedin: '', facebook: ''
      });
    }, 700);
    setTimeout(() => setShowSuccessMessage(false), 5000);
  }
  // Newsletter
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setShowNewsletterError(true)
      setTimeout(() => setShowNewsletterError(false), 5000)
      return
    }
    
    try {
      console.log('📧 Intentando enviar notificación de newsletter desde Footer:', email)
      // Enviar notificación a Telegram
      const result = await handleNewsletterSubscription(email, 'home')
      console.log('📧 Resultado de notificación:', result)
      
      setEmail('')
      setShowNewsletterSuccess(true)
      setTimeout(() => setShowNewsletterSuccess(false), 5000)
    } catch (error) {
      console.error('📧 Error en notificación de newsletter:', error)
      setShowNewsletterError(true)
      setTimeout(() => setShowNewsletterError(false), 5000)
    }
  }

  return (
    <footer className="section" style={{
      position: 'relative',
      background: 'linear-gradient(135deg, rgba(26,26,26,0.9), rgba(30,58,138,0.2))',
      backdropFilter: 'blur(12px)',
      borderTop: '2px solid rgba(212, 175, 55, 0.3)',
      padding: '3rem 2rem 4rem 2rem', // Aumentado el padding inferior
      marginBottom: '80px' // Espacio adicional para el navbar
    }}>
      {/* Sección principal del footer */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem',
        maxWidth: '1200px',
        margin: '0 auto 2rem auto'
      }}>
        {/* Logo y descripción */}
        <div style={{ textAlign: 'center' }}>
          <h3 style={{
            fontFamily: 'Orbitron',
            color: '#D4AF37',
            fontSize: '1.5rem',
            margin: '0 0 1rem 0',
            fontWeight: 'bold'
          }}>
            CriptoUNAM
          </h3>
          <p style={{
            color: '#E0E0E0',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            maxWidth: '300px',
            margin: '0 auto'
          }}>
            La comunidad líder en blockchain y criptomonedas de la UNAM. 
            Educando y conectando a la próxima generación de desarrolladores Web3.
          </p>
        </div>

        {/* Enlaces rápidos */}
        <div style={{ textAlign: 'center' }}>
          <h4 style={{
            color: '#D4AF37',
            fontSize: '1.1rem',
            margin: '0 0 1rem 0',
            fontWeight: 'bold'
          }}>
            Enlaces Rápidos
          </h4>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <Link to="/" style={{
              color: '#E0E0E0',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
              fontSize: '0.9rem'
            }} onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#D4AF37'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#E0E0E0'}>
              Home
            </Link>
            <Link to="/cursos" style={{
              color: '#E0E0E0',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
              fontSize: '0.9rem'
            }} onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#D4AF37'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#E0E0E0'}>
              Cursos
            </Link>
            <Link to="/comunidad" style={{
              color: '#E0E0E0',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
              fontSize: '0.9rem'
            }} onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#D4AF37'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#E0E0E0'}>
              Comunidad
            </Link>
            <Link to="/newsletter" style={{
              color: '#E0E0E0',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
              fontSize: '0.9rem'
            }} onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#D4AF37'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#E0E0E0'}>
              Newsletter
            </Link>
          </div>
        </div>

        {/* Redes sociales */}
        <div style={{ textAlign: 'center' }}>
          <h4 style={{
            color: '#D4AF37',
            fontSize: '1.1rem',
            margin: '0 0 1rem 0',
            fontWeight: 'bold'
          }}>
            Síguenos
          </h4>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <a href="https://discord.gg/Pmu4JQeNR6" 
               target="_blank" 
               rel="noopener noreferrer" 
               style={{
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 width: '40px',
                 height: '40px',
                 background: 'linear-gradient(135deg, #5865F2, #4752C4)',
                 color: 'white',
                 borderRadius: '50%',
                 textDecoration: 'none',
                 transition: 'all 0.3s ease',
                 boxShadow: '0 2px 8px rgba(88, 101, 242, 0.3)'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.transform = 'translateY(-2px) scale(1.1)';
                 e.currentTarget.style.boxShadow = '0 4px 12px rgba(88, 101, 242, 0.5)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.transform = 'translateY(0) scale(1)';
                 e.currentTarget.style.boxShadow = '0 2px 8px rgba(88, 101, 242, 0.3)';
               }}
            >
              <FontAwesomeIcon icon={faDiscord} />
            </a>
            <a href="https://t.me/+tPgjd4cOxG05NmVh" 
               target="_blank" 
               rel="noopener noreferrer" 
               style={{
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 width: '40px',
                 height: '40px',
                 background: 'linear-gradient(135deg, #0088CC, #0077B3)',
                 color: 'white',
                 borderRadius: '50%',
                 textDecoration: 'none',
                 transition: 'all 0.3s ease',
                 boxShadow: '0 2px 8px rgba(0, 136, 204, 0.3)'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.transform = 'translateY(-2px) scale(1.1)';
                 e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 136, 204, 0.5)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.transform = 'translateY(0) scale(1)';
                 e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 136, 204, 0.3)';
               }}
            >
              <FontAwesomeIcon icon={faTelegram} />
            </a>
            <a href="https://x.com/Cripto_UNAM" 
               target="_blank" 
               rel="noopener noreferrer" 
               style={{
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 width: '40px',
                 height: '40px',
                 background: 'linear-gradient(135deg, #1DA1F2, #0D8BD9)',
                 color: 'white',
                 borderRadius: '50%',
                 textDecoration: 'none',
                 transition: 'all 0.3s ease',
                 boxShadow: '0 2px 8px rgba(29, 161, 242, 0.3)'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.transform = 'translateY(-2px) scale(1.1)';
                 e.currentTarget.style.boxShadow = '0 4px 12px rgba(29, 161, 242, 0.5)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.transform = 'translateY(0) scale(1)';
                 e.currentTarget.style.boxShadow = '0 2px 8px rgba(29, 161, 242, 0.3)';
               }}
            >
              <FontAwesomeIcon icon={faTwitter} />
            </a>
          </div>
        </div>
      </div>
      {/* Sección de acción */}
      <div style={{
        textAlign: 'center',
        margin: '2rem 0',
        padding: '2rem',
        background: 'rgba(212, 175, 55, 0.1)',
        borderRadius: '16px',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        maxWidth: '800px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <h3 style={{
          color: '#D4AF37',
          fontSize: '1.3rem',
          margin: '0 0 1rem 0',
          fontFamily: 'Orbitron',
          fontWeight: 'bold'
        }}>
          ¿Quieres ser parte de nuestra comunidad?
        </h3>
        <p style={{
          color: '#E0E0E0',
          fontSize: '1rem',
          margin: '0 0 1.5rem 0',
          lineHeight: '1.6'
        }}>
          Únete a nosotros y accede a contenido exclusivo, eventos y networking profesional.
        </p>
        
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <button 
            className="glow-button" 
            style={{
              fontWeight: 700, 
              fontSize: '1.1rem', 
              padding: '0.8rem 2rem', 
              borderRadius: '12px', 
              border: 'none', 
              background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', 
              color: '#fff', 
              boxShadow: '0 0 16px 4px rgba(37, 99, 235, 0.6), 0 0 32px 8px rgba(212, 175, 55, 0.3)', 
              cursor: 'pointer', 
              transition: 'all 0.3s ease'
            }} 
            onClick={() => setShowJoinModal(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(37, 99, 235, 0.8), 0 8px 40px rgba(212, 175, 55, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 16px 4px rgba(37, 99, 235, 0.6), 0 0 32px 8px rgba(212, 175, 55, 0.3)';
            }}
          >
            Únete a la comunidad
          </button>
          
          <form onSubmit={handleNewsletterSubmit} style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(26, 26, 26, 0.8)',
            borderRadius: '12px',
            padding: '0.5rem 1rem',
            boxShadow: '0 2px 12px rgba(37, 99, 235, 0.2)',
            border: '1px solid #D4AF37',
            gap: '0.5rem'
          }}>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="Tu correo electrónico" 
              required 
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: '#fff',
                fontSize: '1rem',
                minWidth: '200px'
              }} 
            />
            <button 
              type="submit" 
              className="primary-button" 
              style={{
                borderRadius: '8px',
                fontWeight: 600,
                padding: '0.5rem 1rem',
                fontSize: '0.9rem'
              }}
            >
              Suscribirse
            </button>
          </form>
        </div>
        
        {showNewsletterSuccess && (
          <p style={{
            color: '#D4AF37', 
            marginTop: '1rem',
            fontWeight: 'bold',
            fontSize: '0.9rem'
          }}>
            ¡Gracias por suscribirte!
          </p>
        )}
        {showNewsletterError && (
          <p style={{
            color: '#ff4444', 
            marginTop: '1rem',
            fontWeight: 'bold',
            fontSize: '0.9rem'
          }}>
            Hubo un error. Por favor, intenta de nuevo.
          </p>
        )}
      </div>
      {/* Modal de comunidad */}
      {showJoinModal && (
        <div style={{position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.7)', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center'}} onClick={()=>setShowJoinModal(false)}>
          <div className="card" style={{maxWidth: 600, width:'100%', margin: '0 auto', padding: '2rem', position:'relative', maxHeight:'90vh', overflow:'auto'}} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setShowJoinModal(false)} style={{position:'absolute', top:12, right:12, background:'none', border:'none', fontSize:24, color:'#D4AF37', cursor:'pointer'}}>×</button>
            <h2 className="text-center" style={{marginBottom: '2rem'}}>Únete a la Comunidad</h2>
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
            {showSuccessMessage && <p style={{color:'#34d399', marginTop:8}}>¡Registro exitoso! Te contactaremos pronto.</p>}
            {showErrorMessage && <p style={{color:'#ff4444', marginTop:8}}>Hubo un error. Por favor, intenta de nuevo.</p>}
          </div>
        </div>
      )}
      
      {/* Copyright */}
      <div style={{
        textAlign: 'center',
        marginTop: '2rem',
        paddingTop: '2rem',
        paddingBottom: '1rem', // Espacio adicional abajo
        borderTop: '1px solid rgba(212, 175, 55, 0.2)'
      }}>
        <p style={{
          color: '#E0E0E0',
          fontSize: '0.9rem',
          margin: '0',
          opacity: '0.8'
        }}>
          © 2024 CriptoUNAM. Todos los derechos reservados.
        </p>
        <p style={{
          color: '#D4AF37',
          fontSize: '0.8rem',
          margin: '0.5rem 0 0 0',
          opacity: '0.7'
        }}>
          Construyendo el futuro de la educación blockchain
        </p>
      </div>
    </footer>
  )
}

export default Footer 