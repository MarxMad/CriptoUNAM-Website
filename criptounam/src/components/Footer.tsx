import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord, faTelegram, faTwitter } from '@fortawesome/free-brands-svg-icons'

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
    setEmail('')
    setShowNewsletterSuccess(true)
    setTimeout(() => setShowNewsletterSuccess(false), 5000)
  }

  return (
    <footer className="section" style={{position:'relative'}}>
      <div className="flex flex-center gap-2" style={{flexWrap:'wrap', justifyContent:'center'}}>
        <div className="flex gap-2">
          <Link to="/" className="text-primary-gold">Home</Link>
          <Link to="/cursos" className="text-primary-gold">Cursos</Link>
          <Link to="/comunidad" className="text-primary-gold">Comunidad</Link>
          <Link to="/newsletter" className="text-primary-gold">Newsletter</Link>
        </div>
        <div className="flex gap-2">
          <a href="https://discord.gg/Pmu4JQeNR6" target="_blank" rel="noopener noreferrer" className="text-primary-gold">
            <FontAwesomeIcon icon={faDiscord} />
          </a>
          <a href="https://t.me/+tPgjd4cOxG05NmVh" target="_blank" rel="noopener noreferrer" className="text-primary-gold">
            <FontAwesomeIcon icon={faTelegram} />
          </a>
          <a href="https://x.com/Cripto_UNAM" target="_blank" rel="noopener noreferrer" className="text-primary-gold">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
        </div>
      </div>
      {/* Botones destacados */}
      <div className="flex flex-center gap-2" style={{margin:'2rem 0', flexWrap:'wrap', justifyContent:'center'}}>
        <button className="glow-button" style={{fontWeight:700, fontSize:'1.1rem', padding:'0.8rem 2rem', borderRadius: '12px', border:'none', background:'#1E3A8A', color:'#fff', boxShadow:'0 0 16px 4px #2563EB99, 0 0 32px 8px #D4AF3755', cursor:'pointer', transition:'box-shadow 0.3s'}} onClick={()=>setShowJoinModal(true)}>
          Únete a la comunidad
        </button>
        <form onSubmit={handleNewsletterSubmit} className="flex gap-1" style={{alignItems:'center', background:'#18181b', borderRadius:12, padding:'0.5rem 1rem', boxShadow:'0 2px 12px #2563EB22', border:'1px solid #D4AF37'}}>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Tu correo electrónico" required style={{flex:1, border:'none', outline:'none', background:'transparent', color:'#fff', fontSize:'1rem'}} />
          <button type="submit" className="primary-button" style={{borderRadius:8, fontWeight:600}}>Suscribirse</button>
        </form>
        {showNewsletterSuccess && <p style={{color:'#D4AF37', marginTop:8}}>¡Gracias por suscribirte!</p>}
        {showNewsletterError && <p style={{color:'#ff4444', marginTop:8}}>Hubo un error. Por favor, intenta de nuevo.</p>}
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
      <p className="text-center mt-2">© 2024 CriptoUNAM. Todos los derechos reservados.</p>
    </footer>
  )
}

export default Footer 