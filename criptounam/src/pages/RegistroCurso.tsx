import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { sendTelegramMessage } from '../api/telegram'
import '../styles/global.css'

const RegistroCurso = () => {
  const { address, isConnected } = useAccount()
  const { id } = useParams()
  const navigate = useNavigate()
  const [curso, setCurso] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [inscrito, setInscrito] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    email: ''
  })
  const [showForm, setShowForm] = useState(false)
  const [leccionActual, setLeccionActual] = useState(0)
  const [leccionesCompletadas, setLeccionesCompletadas] = useState<number[]>([])

  useEffect(() => {
    const fetchCurso = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/curso/${id}`)
        setCurso(res.data)
      } catch (e) {
        setCurso(null)
      } finally {
        setLoading(false)
      }
    }
    fetchCurso()
  }, [id])

  if (loading) return <div style={{minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#D4AF37'}}>Cargando...</div>

  if (!curso) {
    return (
      <div className="registro-curso-container" style={{minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <h2 style={{color:'#ff4444'}}>Curso no encontrado</h2>
        <button className="primary-button" style={{marginTop:24}} onClick={()=>navigate('/cursos')}>Volver a cursos</button>
      </div>
    )
  }

  // Si no está conectada la wallet, mostrar mensaje claro
  if (!isConnected) {
    return (
      <div className="registro-curso-container" style={{minHeight:'60vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
        <h2 style={{color:'#D4AF37', marginBottom:24}}>Conecta tu wallet para inscribirte en el curso</h2>
        <button className="primary-button" onClick={()=>navigate('/')}>Ir a Home</button>
      </div>
    )
  }

  const handleInscribirse = async () => {
    if (!isConnected) {
      alert('Conecta tu wallet para inscribirte')
      return
    }
    let mensaje = `🚀 Nuevo alumno inscrito en CriptoUNAM\nCurso: ${curso?.titulo || id}\nWallet: ${address}`
    if (formData.nombre) mensaje += `\nNombre: ${formData.nombre}`
    if (formData.email) mensaje += `\nEmail: ${formData.email}`
    await sendTelegramMessage(mensaje, import.meta.env.VITE_TELEGRAM_CHAT_ID)
    setInscrito(true)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCompletarLeccion = () => {
    if (!leccionesCompletadas.includes(leccionActual)) {
      setLeccionesCompletadas([...leccionesCompletadas, leccionActual])
  }
  }

  if (!inscrito) {
  return (
    <div className="registro-curso-container">
      <div className="registro-header">
          <h1 style={{paddingLeft:'1.5rem', marginLeft:0}}>{curso.titulo}</h1>
          <p className="curso-id" style={{paddingLeft:'1.5rem', marginLeft:0}}>ID del Curso: {id}</p>
      </div>
        <div className="registro-content" style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh'}}>
          <button className="primary-button" style={{marginBottom:24, fontSize:'1.2rem'}} onClick={handleInscribirse}>
            Inscribirse con Wallet
          </button>
          <button className="secondary-button" style={{marginBottom:24}} onClick={()=>setShowForm(v=>!v)}>
            Quiero constancia (agregar nombre y correo)
          </button>
          {showForm && (
            <form className="registro-form" style={{maxWidth:400, margin:'0 auto'}} onSubmit={e=>{e.preventDefault(); handleInscribirse()}}>
            <div className="form-group">
                <label>Nombre completo</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleFormChange} required />
            </div>
            <div className="form-group">
                <label>Correo electrónico</label>
                <input type="email" name="email" value={formData.email} onChange={handleFormChange} required />
            </div>
              <button className="primary-button" type="submit">Inscribirse y obtener constancia</button>
            </form>
          )}
          <div className="registro-info" style={{marginTop:32}}>
            <h3>Importante</h3>
            <ul>
              <li>El curso es gratuito</li>
              <li>Se requiere wallet para registrar tu progreso</li>
              <li>Si quieres constancia, proporciona tu nombre y correo</li>
              <li>Se requiere completar todas las lecciones</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  const leccion = curso.lecciones && curso.lecciones[leccionActual]
  const progreso = curso.lecciones ? Math.round((leccionesCompletadas.length / curso.lecciones.length) * 100) : 0

  return (
    <div className="curso-platzi-container" style={{display:'flex', flexDirection:'column', minHeight:'90vh', padding:'2rem 0'}}>
      <div className="curso-main-content" style={{display:'flex', gap:32, alignItems:'flex-start', justifyContent:'center', width:'100%', maxWidth:1400, margin:'0 auto'}}>
        {/* Video principal */}
        <div className="curso-video-container" style={{flex:2, background:'#18181b', borderRadius:16, boxShadow:'0 4px 32px #1E3A8A22', padding:24, minWidth:320}}>
          {leccion && (
            <>
              <iframe
                width="100%"
                height="420"
                src={leccion.video}
                title={leccion.titulo}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{borderRadius:12, boxShadow:'0 2px 12px #2563EB33', marginBottom:16}}
              />
              <h2 style={{color:'#D4AF37', margin:'1rem 0 0.5rem 0'}}>{leccion.titulo}</h2>
              <p style={{color:'#E0E0E0', marginBottom:16}}>{leccion.descripcion}</p>
              <button className="primary-button" style={{marginBottom:16}} onClick={handleCompletarLeccion} disabled={leccionesCompletadas.includes(leccionActual)}>
                {leccionesCompletadas.includes(leccionActual) ? 'Lección completada' : 'Marcar como completada'}
              </button>
              <div style={{marginTop:16, color:'#34d399', fontWeight:600}}>
                Progreso del curso: {progreso}%
            </div>
            </>
          )}
          </div>
        {/* Sidebar de lecciones */}
        <div className="curso-lecciones-sidebar" style={{flex:1, minWidth:220, background:'#101014', borderRadius:16, boxShadow:'0 2px 12px #2563EB22', padding:24}}>
          <h3 style={{color:'#2563EB', marginBottom:16}}>Lecciones</h3>
          <ul style={{listStyle:'none', padding:0, margin:0}}>
            {curso.lecciones && curso.lecciones.map((l: any, idx: number) => (
              <li key={l.titulo || idx} style={{marginBottom:12}}>
                <button
                  style={{
                    width:'100%',
                    textAlign:'left',
                    padding:'0.7rem 1rem',
                    borderRadius:8,
                    border: idx === leccionActual ? '2px solid #D4AF37' : '1px solid #2563EB44',
                    background: idx === leccionActual ? 'rgba(212,175,55,0.08)' : 'rgba(37,99,235,0.06)',
                    color: leccionesCompletadas.includes(idx) ? '#34d399' : '#E0E0E0',
                    fontWeight: leccionesCompletadas.includes(idx) ? 700 : 500,
                    cursor:'pointer',
                    marginBottom:2
                  }}
                  onClick={()=>setLeccionActual(idx)}
                >
                  {l.titulo} {leccionesCompletadas.includes(idx) && '✔️'}
            </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Info relevante bajo el video */}
      <div className="curso-info-extra" style={{maxWidth:900, margin:'2rem auto 0 auto', background:'#18181b', borderRadius:16, boxShadow:'0 2px 12px #2563EB22', padding:32}}>
        <h2 style={{color:'#D4AF37', marginBottom:12}}>Sobre el curso</h2>
        <p style={{color:'#E0E0E0', marginBottom:16}}>{curso.descripcion}</p>
        <h3 style={{color:'#2563EB', marginBottom:8}}>Requisitos</h3>
        <p style={{color:'#E0E0E0'}}>{curso.requisitos}</p>
      </div>
    </div>
  )
}

export default RegistroCurso 