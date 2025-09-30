import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import '../styles/global.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_ENDPOINTS } from '../config/api'

interface NewsletterEntry {
  id: number
  title: string
  date: string
  content: string
  fullContent: string
  imageUrl?: string
  author?: string
  tags?: string[]
}

const NewsletterEntry = () => {
  const { id } = useParams()
  
  const [entry, setEntry] = useState<NewsletterEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await axios.get<NewsletterEntry>(API_ENDPOINTS.NEWSLETTER_ENTRY(id));
        setEntry(res.data);
        setNotFound(false);
      } catch (error) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [id]);

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
    <div className="section" style={{minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', paddingTop:'2rem'}}>
      <article className="card full-entry" style={{maxWidth:700, width:'100%', padding:'2.5rem 2rem', margin:'0 auto', background:'rgba(26,26,26,0.85)', backdropFilter:'blur(12px)', border:'1.5px solid #D4AF37', boxShadow:'0 8px 32px rgba(30,58,138,0.18)'}}>
        {entry.imageUrl && (
          <div className="entry-header-image" style={{width:'100%', height:220, marginBottom:18}}>
            <img src={entry.imageUrl} alt={entry.title} style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:18, boxShadow:'0 4px 24px 0 #1E3A8A33'}} />
          </div>
        )}
        <div className="entry-content" style={{display:'flex', flexDirection:'column', gap:'0.7rem'}}>
          <div className="entry-meta" style={{display:'flex', gap:'1.5rem', alignItems:'center', marginBottom:4}}>
            <span className="entry-date" style={{color:'#2563EB', fontWeight:600}}>
              <FontAwesomeIcon icon={faCalendarAlt} /> {entry.date}
            </span>
            {entry.author && (
              <span className="entry-author" style={{color:'#D4AF37', fontWeight:600}}>
                Por {entry.author}
              </span>
            )}
          </div>
          <h1 style={{fontFamily:'Orbitron', color:'#D4AF37', fontSize:'1.7rem', margin:'0 0 0.5rem 0', lineHeight:'1.2'}}>{entry.title}</h1>
          {entry.tags && entry.tags.length > 0 && (
            <div className="entry-tags" style={{display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'0.5rem'}}>
              {entry.tags.map((tag, index) => (
                <span key={index} className="tag" style={{background:'linear-gradient(45deg,#D4AF37,#2563EB)', color:'#0A0A0A', borderRadius:12, padding:'0.2rem 0.9rem', fontWeight:700, fontFamily:'Orbitron', fontSize:'0.95rem', boxShadow:'0 2px 8px #1E3A8A22'}}>{tag}</span>
              ))}
            </div>
          )}
          <div className="entry-body" style={{color:'#E0E0E0', fontSize:'1.08rem', lineHeight:'1.7', marginBottom:'1.2rem'}}>
            {entry.fullContent.split('\n\n').map((paragraph, index) => (
              <p key={index} style={{margin:'0 0 1rem 0'}}>{paragraph}</p>
            ))}
          </div>
          <Link to="/newsletter" className="primary-button" style={{marginTop:'1rem', borderRadius:16, width:'fit-content'}}>
            <FontAwesomeIcon icon={faArrowLeft} /> Volver al Newsletter
          </Link>
        </div>
      </article>
    </div>
  )
}

export default NewsletterEntry 