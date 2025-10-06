import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGraduationCap, faCalendarAlt, faCertificate, faTrophy, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { handleNewsletterSubscription } from '../api/telegram'
import '../styles/global.css'
import { useWallet } from '../context/WalletContext'
import { useAdmin } from '../hooks/useAdmin'
import { newsletterApi, NewsletterEntry as SupabaseNewsletterEntry } from '../config/supabaseApi'
import DateInput from '../components/DateInput'
import BlogContent from '../components/BlogContent'
import SEOHead from '../components/SEOHead'

// Usamos la interfaz de Supabase
type NewsletterEntry = SupabaseNewsletterEntry

// Función para formatear fechas en español
const formatDateToSpanish = (dateStr: string): string => {
  try {
    // Si está en formato YYYY-MM-DD, convertir
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return date.toLocaleDateString('es-MX', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    
    // Si está en formato DD/MM/YYYY, convertir
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split('/');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return date.toLocaleDateString('es-MX', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    
    return dateStr;
  } catch (error) {
    return dateStr;
  }
};

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { walletAddress, isConnected } = useWallet();
  const { isAdmin, canCreateNewsletter, canDeleteNewsletter } = useAdmin();

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
  const [filtroTag, setFiltroTag] = useState<string>('');
  const [tagsDisponibles] = useState([
    'Blockchain',
    'DeFi',
    'NFTs',
    'Web3',
    'Ethereum',
    'Bitcoin',
    'Trading',
    'Educación',
    'Eventos',
    'Tecnología'
  ]);

  // Filtrar entradas por tag
  const entradasFiltradas = filtroTag 
    ? entradas.filter(entrada => 
        entrada.tags && entrada.tags.some(tag => 
          tag.toLowerCase().includes(filtroTag.toLowerCase())
        )
      )
    : entradas;

  // Cargar entradas desde Supabase
  useEffect(() => {
    const fetchEntradas = async () => {
      try {
        const entradasData = await newsletterApi.getAll();
        setEntradas(entradasData);
      } catch (error) {
        console.error('Error al cargar entradas de newsletter:', error);
      }
    };
    fetchEntradas();
  }, []);

  // Verificar si se debe abrir el modal desde URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shouldOpenModal = urlParams.get('openModal');
    
    if (shouldOpenModal === 'true') {
      console.log('📧 Newsletter: Abriendo modal desde URL');
      setShowModal(true);
      // Limpiar el parámetro de la URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  // Listener para el botón de admin
  useEffect(() => {
    const handleOpenNewsletterModal = () => {
      console.log('📧 Newsletter: Abriendo modal desde botón admin');
      setShowModal(true);
    };

    window.addEventListener('openNewsletterModal', handleOpenNewsletterModal);
    
    return () => {
      window.removeEventListener('openNewsletterModal', handleOpenNewsletterModal);
    };
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


  const handleAgregarEntrada = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canCreateNewsletter) {
      alert('No tienes permisos para crear entradas de newsletter');
      return;
    }
    if (!nuevaEntrada.title || !nuevaEntrada.date || !nuevaEntrada.content || !nuevaEntrada.imageFile || !nuevaEntrada.author) return;
    try {
      // Subir imagen usando Supabase
      const imagenUrl = await newsletterApi.uploadNewsletterImage(nuevaEntrada.imageFile);
      
      // Crear entrada usando Supabase
      const entradaData: Omit<NewsletterEntry, 'id' | 'creadoEn'> = {
        titulo: nuevaEntrada.title,
        contenido: nuevaEntrada.content,
        autor: nuevaEntrada.author,
        fecha: nuevaEntrada.date,
        imagen: imagenUrl,
        tags: nuevaEntrada.tags
      };
      
      const entradaCreada = await newsletterApi.create(entradaData);
      setEntradas([entradaCreada, ...entradas]);
      setShowModal(false);
      setNuevaEntrada({ title: '', date: '', content: '', imageFile: null, author: '', tags: [] });
      setPreviewImage(null);
    } catch (error: any) {
      console.error('Error al crear entrada:', error);
      alert('Error al subir la entrada: ' + (error?.message || error));
    }
  };

  const handleEliminarEntrada = async (id: string) => {
    if (!window.confirm('¿Seguro que quieres eliminar esta entrada?')) return;
    if (!canDeleteNewsletter) {
      alert('No tienes permisos para eliminar entradas');
      return;
    }
    try {
      await newsletterApi.delete(id);
      setEntradas(entradas.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error al eliminar entrada:', error);
      alert('Error al eliminar la entrada');
    }
  };

  return (
    <>
      <SEOHead 
        title="Newsletter CriptoUNAM - Noticias y Eventos Blockchain"
        description="Mantente actualizado con las últimas noticias, eventos y artículos sobre blockchain, criptomonedas y Web3 en la UNAM."
        image="https://criptounam.xyz/images/LogosCriptounam.svg"
        url="https://criptounam.xyz/newsletter"
        type="website"
      />
      <div className="section" style={{minHeight:'100vh', display:'flex', flexDirection:'column', paddingTop:'2rem'}}>
      <header className="newsletter-header" style={{textAlign:'center', marginBottom:'2.5rem'}}>
        <h1 className="hero-title" style={{fontFamily:'Orbitron', color:'#D4AF37', marginBottom:8}}>Newsletter CriptoUNAM</h1>
        <p className="hero-subtitle" style={{color:'#E0E0E0', fontSize:'1.2rem'}}>Mantente actualizado con las últimas noticias y eventos sobre blockchain y criptomonedas</p>
      </header>

      {/* Filtros por Tags */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 2rem auto',
        padding: '0 20px'
      }}>
        <div style={{
          background: 'rgba(26,26,26,0.8)',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid rgba(212,175,55,0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{
            fontFamily: 'Orbitron',
            color: '#D4AF37',
            fontSize: '1.2rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            Filtrar por Categoría
          </h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <button
              onClick={() => setFiltroTag('')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                border: filtroTag === '' ? '2px solid #D4AF37' : '1px solid rgba(212,175,55,0.3)',
                background: filtroTag === '' ? '#D4AF37' : 'rgba(26,26,26,0.5)',
                color: filtroTag === '' ? '#0A0A0A' : '#E0E0E0',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: filtroTag === '' ? '600' : '400'
              }}
            >
              Todos
            </button>
            {tagsDisponibles.map(tag => (
              <button
                key={tag}
                onClick={() => setFiltroTag(tag)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: filtroTag === tag ? '2px solid #D4AF37' : '1px solid rgba(212,175,55,0.3)',
                  background: filtroTag === tag ? '#D4AF37' : 'rgba(26,26,26,0.5)',
                  color: filtroTag === tag ? '#0A0A0A' : '#E0E0E0',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: filtroTag === tag ? '600' : '400'
                }}
              >
                {tag}
              </button>
            ))}
          </div>
          {filtroTag && (
            <div style={{
              textAlign: 'center',
              color: '#E0E0E0',
              fontSize: '0.9rem'
            }}>
              Mostrando entradas con tag: <strong style={{color: '#D4AF37'}}>{filtroTag}</strong>
            </div>
          )}
        </div>
      </div>

      <div className="sections-container" style={{display:'flex', flexWrap:'wrap', gap:'2.5rem', justifyContent:'center', alignItems:'flex-start', margin:'0 auto', maxWidth:1200}}>
        <section className="entries-section" style={{flex:'2 1 480px', minWidth:320, maxWidth:700}}>
          <h2 className="hero-title" style={{fontFamily:'Orbitron', color:'#D4AF37', fontSize:'1.3rem', marginBottom:'1.2rem'}}>Últimas Entradas</h2>
          <div className="newsletter-entries" style={{display:'flex', flexDirection:'column', gap:'2.2rem'}}>
            {entradasFiltradas.map((entry) => (
              <article key={entry.id} className="card newsletter-entry" style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                minHeight: '400px',
                maxWidth: '100%',
                margin: '0 auto',
                backgroundColor: 'rgba(26, 26, 26, 0.8)',
                borderRadius: '20px',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)'
              }}>
                {entry.imagen && (
                  <div className="entry-image" style={{
                    width: '100%',
                    height: '200px',
                    marginBottom: '1.5rem',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
                  }}>
                    <img src={entry.imagen} alt={entry.titulo} style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }} />
                  </div>
                )}
                <div className="entry-content" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                  <h2 style={{
                    fontFamily: 'Orbitron',
                    color: '#D4AF37',
                    fontSize: '1.5rem',
                    margin: '0 0 0.5rem 0',
                    fontWeight: 'bold',
                    lineHeight: '1.3'
                  }}>{entry.titulo}</h2>
                  
                  <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
                    <span className="entry-date" style={{
                      color: '#4ecdc4',
                      fontSize: '1rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <i className="fas fa-calendar"></i> {formatDateToSpanish(entry.fecha)}
                    </span>
                    {entry.autor && (
                      <span style={{
                        color: '#D4AF37',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}>
                        Por {entry.autor}
                      </span>
                    )}
                  </div>
                  
                  {/* Tags */}
                  {entry.tags && entry.tags.length > 0 && (
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      marginTop: '0.5rem'
                    }}>
                      {entry.tags.map((tag, index) => (
                        <span key={index} style={{
                          background: 'rgba(212,175,55,0.2)',
                          color: '#D4AF37',
                          padding: '0.3rem 0.8rem',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: '500'
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div style={{
                    color: '#E0E0E0',
                    fontSize: '1.1rem',
                    lineHeight: '1.7',
                    textAlign: 'justify',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    {(() => {
                      const paragraphs = entry.contenido.split('\n\n');
                      const firstParagraph = paragraphs[0];
                      const previewLength = 200; // Caracteres para el preview
                      
                      if (firstParagraph.length > previewLength) {
                        return (
                          <p style={{
                            margin: '0 0 1rem 0',
                            color: '#E0E0E0',
                            lineHeight: '1.7',
                            fontSize: '1.1rem'
                          }}>
                            {firstParagraph.substring(0, previewLength)}...
                          </p>
                        );
                      } else {
                        return (
                          <p style={{
                            margin: '0 0 1rem 0',
                            color: '#E0E0E0',
                            lineHeight: '1.7',
                            fontSize: '1.1rem'
                          }}>
                            {firstParagraph}
                          </p>
                        );
                      }
                    })()}
                  </div>
                  
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem'}}>
                    <Link to={`/newsletter/${entry.id}`} className="primary-button" style={{
                      fontSize: '1rem',
                      borderRadius: '12px',
                      fontWeight: '700',
                      letterSpacing: '1px',
                      padding: '0.8rem 2rem',
                      background: 'linear-gradient(135deg, #D4AF37, #F4D03F)',
                      color: '#000',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(212, 175, 55, 0.3)';
                    }}>
                      Leer más <i className="fas fa-arrow-right" style={{marginLeft: '0.5rem'}}></i>
                    </Link>
                    
                    {isAdmin && (
                      <button onClick={() => handleEliminarEntrada((entry as any)._id || entry.id.toString())} style={{
                        background: 'linear-gradient(135deg, #ff4444, #cc0000)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.6rem 1.2rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}>
                        Eliminar
                      </button>
                    )}
                  </div>
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


      {showModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1200,
          padding: '20px',
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '450px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}>
            {/* Header del modal */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              borderBottom: '2px solid #D4AF37',
              paddingBottom: '12px'
            }}>
              <h2 style={{
                color: '#D4AF37',
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: 'bold',
                fontFamily: 'Orbitron'
              }}>
                Agregar Nueva Entrada de Newsletter
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '4px',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
              >
                ×
              </button>
            </div>

            {/* Contenido del formulario */}
            <form onSubmit={handleAgregarEntrada} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              flex: 1,
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: '#333', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Título *
                </label>
                <input 
                  name="title" 
                  value={nuevaEntrada.title} 
                  onChange={handleInputChange} 
                  placeholder="Título de la entrada" 
                  required 
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: '#333', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Fecha *
                </label>
                <DateInput
                  value={nuevaEntrada.date}
                  onChange={(value) => setNuevaEntrada({ ...nuevaEntrada, date: value })}
                  placeholder="DD/MM/YYYY (ej: 06/10/2025)"
                  required
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: '#333', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Autor *
                </label>
                <input 
                  name="author" 
                  value={nuevaEntrada.author} 
                  onChange={handleInputChange} 
                  placeholder="Nombre del autor" 
                  required 
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: '#333', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Tags
                </label>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  {tagsDisponibles.map(tag => (
                    <label key={tag} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem',
                      background: nuevaEntrada.tags.includes(tag) ? '#D4AF37' : 'rgba(212,175,55,0.1)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: `1px solid ${nuevaEntrada.tags.includes(tag) ? '#D4AF37' : 'rgba(212,175,55,0.3)'}`
                    }}>
                      <input
                        type="checkbox"
                        checked={nuevaEntrada.tags.includes(tag)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNuevaEntrada(prev => ({
                              ...prev,
                              tags: [...prev.tags, tag]
                            }));
                          } else {
                            setNuevaEntrada(prev => ({
                              ...prev,
                              tags: prev.tags.filter(t => t !== tag)
                            }));
                          }
                        }}
                        style={{ margin: 0 }}
                      />
                      <span style={{ 
                        fontSize: '0.9rem', 
                        color: nuevaEntrada.tags.includes(tag) ? '#0A0A0A' : '#333',
                        fontWeight: nuevaEntrada.tags.includes(tag) ? '600' : '400'
                      }}>
                        {tag}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: '#333', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Contenido *
                </label>
                <textarea 
                  name="content" 
                  value={nuevaEntrada.content} 
                  onChange={handleInputChange} 
                  placeholder="Contenido de la entrada..." 
                  required 
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '1rem',
                    minHeight: '120px',
                    resize: 'vertical',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: '#D4AF37', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Imagen de la entrada *
                </label>
                <input 
                  type="file" 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  required 
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                />
                {previewImage && (
                  <img 
                    src={previewImage} 
                    alt="Previsualización" 
                    style={{
                      width: '100%',
                      maxWidth: '320px',
                      margin: '8px auto',
                      borderRadius: '8px',
                      boxShadow: '0 2px 12px rgba(30, 58, 138, 0.2)'
                    }} 
                  />
                )}
              </div>

              {/* Botones de acción */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid #e0e0e0'
              }}>
                <button 
                  type="submit" 
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                    color: '#000',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    flex: 1
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Guardar Entrada
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  style={{
                    background: '#f5f5f5',
                    color: '#666',
                    border: '2px solid #e0e0e0',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    flex: 1
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#e0e0e0';
                    e.currentTarget.style.color = '#333';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f5f5f5';
                    e.currentTarget.style.color = '#666';
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  )
}

export default Newsletter 