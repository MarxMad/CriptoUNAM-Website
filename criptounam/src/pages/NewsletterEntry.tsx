import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCalendarAlt, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'
import '../styles/global.css'
import { useState, useEffect } from 'react'
import { newsletterApi, type NewsletterEntry as NewsletterEntryType } from '../config/supabaseApi'
import BlogContent from '../components/BlogContent'
import SEOHead from '../components/SEOHead'
import { useWallet } from '../context/WalletContext'
import { supabase } from '../config/supabase'

// Tipo para entradas que vienen de la base de datos (con id garantizado)
type NewsletterEntryWithId = NewsletterEntryType & { id: string }

const NewsletterEntry = () => {
  const { id } = useParams()
  const { walletAddress, isConnected } = useWallet()
  
  const [entry, setEntry] = useState<NewsletterEntryWithId | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        if (!id) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        const entryData = await newsletterApi.getById(id);
        if (entryData && entryData.id) {
          setEntry(entryData as NewsletterEntryWithId);
          setNotFound(false);
          // Cargar conteo de likes
          if (supabase) {
            const { count } = await supabase
              .from('likes')
              .select('*', { count: 'exact', head: true })
              .eq('newsletter_id', entryData.id);
            setLikeCount(count || 0);
          }
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching entry:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [id]);

  // Verificar si el usuario ya dio like
  useEffect(() => {
    const checkIfLiked = async () => {
      if (!walletAddress || !id || !supabase) return;
      
      try {
        const { data, error } = await supabase
          .from('likes')
          .select('*')
          .eq('user_id', walletAddress)
          .eq('newsletter_id', id)
          .single();
        
        if (data && !error) {
          setIsLiked(true);
        }
      } catch (error) {
        console.log('No like encontrado');
      }
    };
    
    checkIfLiked();
  }, [walletAddress, id]);

  const handleLike = async () => {
    if (!walletAddress || !isConnected) {
      alert('Por favor conecta tu wallet para dar like');
      return;
    }
    
    if (!id || !supabase) return;
    
    setIsLiking(true);
    
    try {
      if (isLiked) {
        // Quitar like
        await supabase
          .from('likes')
          .delete()
          .eq('user_id', walletAddress)
          .eq('newsletter_id', id);
        
        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
      } else {
        // Agregar like
        await supabase
          .from('likes')
          .insert([{
            user_id: walletAddress,
            newsletter_id: id
          }]);
        
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
        
        // TODO: Otorgar 10 PUMA tokens al usuario
        console.log('¡Usuario ganó 10 PUMA por dar like!');
      }
    } catch (error) {
      console.error('Error al dar like:', error);
      alert('Error al procesar el like. Intenta de nuevo.');
    } finally {
      setIsLiking(false);
    }
  };

  if (loading) {
    return (
      <div className="section" style={{minHeight:'60vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
        <div className="card" style={{padding:'2rem', textAlign:'center', maxWidth:400}}>
          <h2 style={{color:'#D4AF37', fontFamily:'Orbitron'}}>Cargando entrada...</h2>
        </div>
      </div>
    );
  }

  if (notFound || !entry) {
    return (
      <div className="section" style={{minHeight:'60vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
        <div className="card" style={{padding:'2rem', textAlign:'center', maxWidth:400}}>
          <h2 style={{color:'#D4AF37', fontFamily:'Orbitron'}}>Entrada no encontrada</h2>
          <p style={{color:'#E0E0E0'}}>La entrada que buscas no existe o ha sido eliminada.</p>
          <Link to="/newsletter" className="primary-button" style={{marginTop:'1rem', borderRadius:16}}>
            <FontAwesomeIcon icon={faArrowLeft} /> Volver al Newsletter
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEOHead 
        title={`${entry.titulo} - CriptoUNAM Newsletter`}
        description={entry.contenido.substring(0, 160) + '...'}
        image={entry.imagen}
        url={`https://criptounam.xyz/newsletter/${entry.id}`}
        type="article"
      />
      <div className="section" style={{minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', paddingTop:'2rem'}}>
        <article className="card full-entry" style={{maxWidth:700, width:'100%', padding:'2.5rem 2rem', margin:'0 auto', background:'rgba(26,26,26,0.85)', backdropFilter:'blur(12px)', border:'1.5px solid #D4AF37', boxShadow:'0 8px 32px rgba(30,58,138,0.18)'}}>
        {entry.imagen && (
          <div className="entry-header-image" style={{width:'100%', height:220, marginBottom:18}}>
            <img src={entry.imagen} alt={entry.titulo} style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:18, boxShadow:'0 4px 24px 0 #1E3A8A33'}} />
          </div>
        )}
        <div className="entry-content" style={{display:'flex', flexDirection:'column', gap:'0.7rem'}}>
          <div className="entry-meta" style={{display:'flex', gap:'1.5rem', alignItems:'center', marginBottom:4}}>
            <span className="entry-date" style={{color:'#2563EB', fontWeight:600}}>
              <FontAwesomeIcon icon={faCalendarAlt} /> {entry.fecha}
            </span>
            {entry.autor && (
              <span className="entry-author" style={{color:'#D4AF37', fontWeight:600}}>
                Por {entry.autor}
              </span>
            )}
          </div>
          <h1 style={{fontFamily:'Orbitron', color:'#D4AF37', fontSize:'1.7rem', margin:'0 0 0.5rem 0', lineHeight:'1.2'}}>{entry.titulo}</h1>
          
          {/* Botón de Like */}
          <div style={{display:'flex', gap:'1rem', alignItems:'center', marginBottom:'1rem'}}>
            <button
              onClick={handleLike}
              disabled={isLiking || !isConnected}
              style={{
                background: isLiked ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'rgba(239, 68, 68, 0.1)',
                border: isLiked ? '2px solid #ef4444' : '2px solid rgba(239, 68, 68, 0.3)',
                color: isLiked ? '#fff' : '#ef4444',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                cursor: isLiking || !isConnected ? 'not-allowed' : 'pointer',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease',
                opacity: isLiking || !isConnected ? 0.5 : 1,
                boxShadow: isLiked ? '0 4px 12px rgba(239, 68, 68, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!isLiking && isConnected) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <FontAwesomeIcon 
                icon={isLiked ? faHeartSolid : faHeartRegular} 
                style={{fontSize: '1.3rem'}} 
              />
              <span>{isLiked ? 'Te gusta' : 'Me gusta'}</span>
              <span style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '0.2rem 0.6rem',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}>
                {likeCount}
              </span>
            </button>
            
            {!isConnected && (
              <span style={{color: '#9CA3AF', fontSize: '0.9rem', fontStyle: 'italic'}}>
                Conecta tu wallet para dar like
              </span>
            )}
          </div>

          {entry.tags && entry.tags.length > 0 && (
            <div className="entry-tags" style={{display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'0.5rem'}}>
              {entry.tags.map((tag, index) => (
                <span key={index} className="tag" style={{background:'linear-gradient(45deg,#D4AF37,#2563EB)', color:'#0A0A0A', borderRadius:12, padding:'0.2rem 0.9rem', fontWeight:700, fontFamily:'Orbitron', fontSize:'0.95rem', boxShadow:'0 2px 8px #1E3A8A22'}}>{tag}</span>
              ))}
            </div>
          )}
          <div className="entry-body" style={{
            marginBottom: '1.2rem',
            backgroundColor: 'rgba(26, 26, 26, 0.6)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              color: '#E0E0E0',
              fontSize: '1.1rem',
              lineHeight: '1.8',
              textAlign: 'justify'
            }}>
              {entry.contenido.split('\n\n').map((paragraph, index) => (
                <p key={index} style={{
                  margin: '0 0 1.5rem 0',
                  padding: '0',
                  color: '#E0E0E0',
                  lineHeight: '1.8',
                  fontSize: '1.1rem'
                }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <Link to="/newsletter" className="primary-button" style={{marginTop:'1rem', borderRadius:16, width:'fit-content'}}>
            <FontAwesomeIcon icon={faArrowLeft} /> Volver al Newsletter
          </Link>
        </div>
      </article>
    </div>
    </>
  )
}

export default NewsletterEntry 