import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGraduationCap, faCalendarAlt, faCertificate, faTrophy, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { handleNewsletterSubscription } from '../api/telegram'
import '../styles/global.css'
import { useWallet } from '../context/WalletContext'
import axios from 'axios'

interface NewsletterEntry {
  id: number
  title: string
  date: string
  content: string
  imageUrl?: string
}

const ADMIN_WALLET = '0x04BEf5bF293BB01d4946dBCfaaeC9a5140316217'.toLowerCase();

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { walletAddress, isConnected } = useWallet();
  const isAdmin = isConnected && walletAddress.toLowerCase() === ADMIN_WALLET;

  // Estado para modal, nueva entrada y entradas desde backend
  const [showModal, setShowModal] = useState(false);
  const [nuevaEntrada, setNuevaEntrada] = useState({
    title: '',
    date: '',
    content: '',
    imageFile: null as File | null,
    author: '',
    tags: '' // string separada por comas
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [entradas, setEntradas] = useState<NewsletterEntry[]>([]);

  // Cargar entradas desde backend
  useEffect(() => {
    const fetchEntradas = async () => {
      try {
        const res = await axios.get<NewsletterEntry[]>('http://localhost:4000/newsletter');
        setEntradas(res.data);
      } catch (error) {
        console.error('Error al cargar entradas de newsletter:', error);
      }
    };
    fetchEntradas();
  }, []);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNuevaEntrada({ ...nuevaEntrada, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNuevaEntrada({ ...nuevaEntrada, imageFile: e.target.files[0] });
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const uploadToPinata = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post<{ ipfsUrl: string }>('http://localhost:4000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.ipfsUrl;
    } catch (error) {
      console.error('Error al subir a Pinata (vía backend):', error);
      throw error;
    }
  };

  const handleAgregarEntrada = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaEntrada.title || !nuevaEntrada.date || !nuevaEntrada.content || !nuevaEntrada.imageFile || !nuevaEntrada.author) return;
    try {
      const imagenUrl = await uploadToPinata(nuevaEntrada.imageFile);
      const entradaData = {
        title: nuevaEntrada.title,
        date: nuevaEntrada.date,
        content: nuevaEntrada.content,
        imageUrl: imagenUrl,
        author: nuevaEntrada.author,
        tags: nuevaEntrada.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      await axios.post('http://localhost:4000/newsletter', entradaData);
      setShowModal(false);
      setNuevaEntrada({ title: '', date: '', content: '', imageFile: null, author: '', tags: '' });
      setPreviewImage(null);
      // Recargar entradas
      const res = await axios.get<NewsletterEntry[]>('http://localhost:4000/newsletter');
      setEntradas(res.data);
    } catch (error: any) {
      alert('Error al subir la entrada: ' + (error?.message || error));
    }
  };

  const handleEliminarEntrada = async (id: string) => {
    if (!window.confirm('¿Seguro que quieres eliminar esta entrada?')) return;
    try {
      await axios.delete(`http://localhost:4000/newsletter/${id}`);
      setEntradas(entradas.filter(e => (e as any)._id !== id));
    } catch (error) {
      alert('Error al eliminar la entrada');
    }
  };

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
            {entradas.map((entry) => (
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
                  {isAdmin && (
                    <button onClick={() => handleEliminarEntrada((entry as any)._id || entry.id.toString())} style={{background:'red', color:'white', border:'none', borderRadius:5, padding:'4px 10px', fontWeight:600, marginTop:8}}>Eliminar</button>
                  )}
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

      {isAdmin && (
        <button
          className="floating-button"
          onClick={() => setShowModal(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '10px 20px',
            backgroundColor: '#D4AF37',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 600,
            zIndex: 1100,
          }}
        >
          Agregar Nueva Entrada
        </button>
      )}
      {showModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1200,
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 8px 32px #00000044',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}>
            <h2>Agregar Nueva Entrada de Newsletter</h2>
            <form onSubmit={handleAgregarEntrada} style={{display:'flex', flexDirection:'column', gap:14}}>
              <input name="title" value={nuevaEntrada.title} onChange={handleInputChange} placeholder="Título" required style={{padding:8, borderRadius:8}} />
              <input name="date" value={nuevaEntrada.date} onChange={handleInputChange} placeholder="Fecha (ej. 15 de Abril, 2024)" required style={{padding:8, borderRadius:8}} />
              <input name="author" value={nuevaEntrada.author} onChange={handleInputChange} placeholder="Instructor" required style={{padding:8, borderRadius:8}} />
              <input name="tags" value={nuevaEntrada.tags} onChange={handleInputChange} placeholder="Tags (separados por coma)" style={{padding:8, borderRadius:8}} />
              <textarea name="content" value={nuevaEntrada.content} onChange={handleInputChange} placeholder="Contenido" required style={{padding:8, borderRadius:8, minHeight:100}} />
              <label style={{color:'#D4AF37', fontWeight:'bold'}}>Imagen de la entrada</label>
              <input type="file" onChange={handleImageChange} accept="image/*" required style={{padding:8, borderRadius:8}} />
              {previewImage && (
                <img src={previewImage} alt="Previsualización" style={{width: '100%', maxWidth: 320, margin: '0 auto 10px auto', borderRadius: 12, boxShadow: '0 2px 12px #1E3A8A33'}} />
              )}
              <div style={{ marginTop: '20px' }}>
                <button type="submit" style={{ marginRight: '10px' }}>Guardar</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Newsletter 