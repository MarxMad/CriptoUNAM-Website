import { useState, useEffect } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { useNavigate, useParams } from 'react-router-dom'
import { sendTelegramMessage } from '../api/telegram'
import { cursosData, type Curso, type Leccion, type Capitulo, getLeccionesFlat } from '../constants/cursosData'
import {
  inscripcionCurso,
  estaInscrito,
  obtenerProgresoCurso,
  marcarLeccionCompletada
} from '../services/progresoCurso.service'
import '../styles/global.css'

const RegistroCurso = () => {
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const { id } = useParams()
  const navigate = useNavigate()
  const [curso, setCurso] = useState<Curso | null>(null)
  const [loading, setLoading] = useState(true)
  const [inscrito, setInscrito] = useState(false)
  const [firmando, setFirmando] = useState(false)
  const [errorInscripcion, setErrorInscripcion] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nombre: '',
    email: ''
  })
  const [showForm, setShowForm] = useState(false)
  const [leccionActual, setLeccionActual] = useState(0)
  const [leccionesCompletadas, setLeccionesCompletadas] = useState<number[]>([])
  const [respuestasCuestionario, setRespuestasCuestionario] = useState<Record<number, number>>({})
  const [preguntaActual, setPreguntaActual] = useState(0) // índice en el cuestionario de la lección actual (carrusel)
  const [sidebarAbierto, setSidebarAbierto] = useState(false) // móvil: menú desplegable

  useEffect(() => {
    const c = id ? cursosData.find((x) => x.id === id) : undefined
    setCurso(c !== undefined ? c : null)
    setLoading(false)
  }, [id])

  // Cargar inscripción y progreso desde Supabase cuando hay wallet y curso
  useEffect(() => {
    if (!address || !id) return
    const load = async () => {
      const ok = await estaInscrito(address, id)
      if (ok) setInscrito(true)
      const indices = await obtenerProgresoCurso(address, id)
      if (indices.length > 0) setLeccionesCompletadas(indices)
    }
    load()
  }, [address, id])

  // Al cambiar de lección, volver a la primera pregunta del cuestionario
  useEffect(() => {
    setPreguntaActual(0)
  }, [leccionActual])

  if (loading) return <div style={{minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#D4AF37'}}>Cargando...</div>

  if (!curso) {
    return (
      <div className="registro-curso-container" style={{minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <h2 style={{color:'#ff4444'}}>Curso no encontrado</h2>
        <button className="primary-button" style={{marginTop:24}} onClick={()=>navigate('/cursos')}>Volver a cursos</button>
      </div>
    )
  }

  // Si no está conectada la wallet, mostrar mensaje amigable
  if (!isConnected) {
    return (
      <div className="registro-curso-container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: '#D4AF37', marginBottom: 12, fontSize: '1.5rem' }}>Un paso antes de inscribirte</h2>
        <p style={{ color: '#E0E0E0', maxWidth: 420, marginBottom: 28, lineHeight: 1.6 }}>
          Conecta tu wallet para firmar tu inscripción. Así registramos tu progreso de forma segura y sin correos.
        </p>
        <button className="primary-button" onClick={() => navigate('/')}>Conectar wallet</button>
        <button className="secondary-button" style={{ marginTop: 12 }} onClick={() => navigate('/cursos')}>Volver a cursos</button>
      </div>
    )
  }

  const handleInscribirse = async () => {
    if (!curso || !address) return
    setErrorInscripcion(null)
    setFirmando(true)
    try {
      const mensajeAFirmar = `Me inscribo al curso "${curso.titulo}" en CriptoUNAM. Wallet: ${address}. Fecha: ${new Date().toISOString()}`
      await signMessageAsync({ account: address, message: mensajeAFirmar })
      const notif = `🚀 Nuevo alumno inscrito en CriptoUNAM\nCurso: ${curso.titulo}\nWallet: ${address}`
      if (formData.nombre) await sendTelegramMessage(notif + `\nNombre: ${formData.nombre}`, '1608242541')
      else await sendTelegramMessage(notif, '1608242541')
      if (formData.email) await sendTelegramMessage(`Email: ${formData.email}`, '1608242541')
      await inscripcionCurso({
        walletAddress: address,
        cursoId: id!,
        nombre: formData.nombre || undefined,
        email: formData.email || undefined
      })
      setInscrito(true)
    } catch (e: any) {
      if (e?.message?.includes('reject') || e?.code === 'ACTION_REJECTED') {
        setErrorInscripcion('Firma cancelada. Necesitamos tu firma para inscribirte.')
      } else {
        setErrorInscripcion('No se pudo completar. Intenta de nuevo.')
      }
    } finally {
      setFirmando(false)
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCompletarLeccion = () => {
    const leccionesFlat = curso ? getLeccionesFlat(curso) : []
    if (!curso || leccionesFlat.length === 0) return
    const leccion = leccionesFlat[leccionActual]
    const tieneCuestionario = leccion?.cuestionario && leccion.cuestionario.length > 0
    if (tieneCuestionario) {
      const correctas = leccion.cuestionario!.every((p, i) => respuestasCuestionario[leccionActual * 10 + i] === p.correcta)
      if (!correctas) return
    }
    if (!leccionesCompletadas.includes(leccionActual)) {
      setLeccionesCompletadas([...leccionesCompletadas, leccionActual])
      if (address && id) {
        marcarLeccionCompletada({
          walletAddress: address,
          cursoId: id,
          leccionIndex: leccionActual,
          totalLecciones: leccionesFlat.length
        }).catch((e) => console.error('Error guardando progreso en Supabase:', e))
      }
    }
  }

  /** Convierte guía tipo markdown a elementos: ##, ###, ####, **, ```, listas, > */
  const renderGuia = (texto: string) => {
    const lines = texto.trim().split('\n')
    const out: React.ReactNode[] = []
    let i = 0
    const key = () => `g-${i}-${out.length}`

    while (i < lines.length) {
      const line = lines[i]
      const trimmed = line.trim()

      // Bloques de código ```
      if (trimmed.startsWith('```')) {
        const lang = trimmed.slice(3).trim() || 'text'
        const codeLines: string[] = []
        i++
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i])
          i++
        }
        if (i < lines.length) i++ // cerrar ```
        out.push(
          <pre key={key()} style={{ background: '#0d1117', padding: 16, borderRadius: 8, overflow: 'auto', margin: '16px 0', border: '1px solid #30363d', fontSize: '0.9rem' }}>
            <code style={{ color: '#e6edf3', fontFamily: 'ui-monospace, monospace' }}>{codeLines.join('\n')}</code>
          </pre>
        )
        continue
      }

      // Encabezados
      if (line.startsWith('#### ')) {
        out.push(<h4 key={key()} style={{ color: '#93C5FD', fontSize: '1rem', marginTop: 16, marginBottom: 6 }}>{line.slice(5)}</h4>)
        i++
        continue
      }
      if (line.startsWith('### ')) {
        out.push(<h3 key={key()} style={{ color: '#E0E0E0', fontSize: '1.15rem', marginTop: 20, marginBottom: 8 }}>{line.slice(4)}</h3>)
        i++
        continue
      }
      if (line.startsWith('## ')) {
        out.push(<h2 key={key()} style={{ color: '#D4AF37', fontSize: '1.4rem', marginTop: 24, marginBottom: 12 }}>{line.slice(3)}</h2>)
        i++
        continue
      }

      // Blockquote (referencias / cita)
      if (line.startsWith('> ')) {
        const quoteLines: string[] = [line.slice(2)]
        i++
        while (i < lines.length && lines[i].startsWith('> ')) {
          quoteLines.push(lines[i].slice(2))
          i++
        }
        const parseInline = (s: string) => {
          const parts = s.split(/(\*\*[^*]+\*\*)/g)
          return parts.map((p, j) => p.startsWith('**') && p.endsWith('**') ? <strong key={j}>{p.slice(2, -2)}</strong> : p)
        }
        out.push(
          <blockquote key={key()} style={{ margin: '12px 0', padding: '12px 16px', borderLeft: '4px solid #2563EB', background: 'rgba(37,99,235,0.08)', borderRadius: 4, color: '#bfdbfe' }}>
            {quoteLines.map((q, idx) => <p key={idx} style={{ margin: idx ? '8px 0 0 0' : 0 }}>{parseInline(q)}</p>)}
          </blockquote>
        )
        continue
      }

      // Lista desordenada (- o *)
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items: React.ReactNode[] = []
        while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
          const content = lines[i].trim().slice(2)
          const parts = content.split(/(\*\*[^*]+\*\*)/g)
          const parsed = parts.map((p, j) => p.startsWith('**') && p.endsWith('**') ? <strong key={j}>{p.slice(2, -2)}</strong> : p)
          items.push(<li key={i}>{parsed}</li>)
          i++
        }
        out.push(<ul key={key()} style={{ margin: '8px 0 16px 1.2rem', color: '#E0E0E0', lineHeight: 1.7 }}>{items}</ul>)
        continue
      }

      // Lista ordenada (1. 2. etc.)
      if (/^\d+\.\s/.test(trimmed)) {
        const items: React.ReactNode[] = []
        while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
          const content = lines[i].trim().replace(/^\d+\.\s/, '')
          const parts = content.split(/(\*\*[^*]+\*\*)/g)
          const parsed = parts.map((p, j) => p.startsWith('**') && p.endsWith('**') ? <strong key={j}>{p.slice(2, -2)}</strong> : p)
          items.push(<li key={i}>{parsed}</li>)
          i++
        }
        out.push(<ol key={key()} style={{ margin: '8px 0 16px 1.2rem', color: '#E0E0E0', lineHeight: 1.7 }}>{items}</ol>)
        continue
      }

      // Párrafo normal
      if (trimmed) {
        const parts = line.split(/(\*\*[^*]+\*\*)/g)
        const parsed = parts.map((p, j) => p.startsWith('**') && p.endsWith('**') ? <strong key={j}>{p.slice(2, -2)}</strong> : p)
        out.push(<p key={key()} style={{ color: '#E0E0E0', lineHeight: 1.7, marginBottom: 12 }}>{parsed}</p>)
      } else {
        out.push(<br key={key()} />)
      }
      i++
    }
    return out
  }

  if (!inscrito) {
  return (
    <div className="registro-curso-container" style={{ padding: '2rem 1rem' }}>
      <div className="registro-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: 8 }}>{curso.titulo}</h1>
        <p style={{ color: '#888', fontSize: '0.95rem' }}>ID del curso: {id}</p>
      </div>
      <div className="registro-content" style={{ maxWidth: 420, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p style={{ color: '#E0E0E0', marginBottom: 24, textAlign: 'center', lineHeight: 1.6 }}>
          Con un clic te inscribes. Tu wallet firmará el mensaje para registrar tu inscripción.
        </p>
        <button
          className="primary-button"
          style={{ width: '100%', maxWidth: 280, marginBottom: 16, fontSize: '1.1rem', padding: '1rem 1.5rem' }}
          onClick={handleInscribirse}
          disabled={firmando}
        >
          {firmando ? 'Firmando...' : 'Inscribirse'}
        </button>
        {errorInscripcion && (
          <p style={{ color: '#f87171', fontSize: '0.9rem', marginBottom: 16, textAlign: 'center' }}>{errorInscripcion}</p>
        )}
        <button className="secondary-button" style={{ marginBottom: 8 }} onClick={() => setShowForm(v => !v)}>
          Quiero constancia (agregar nombre y correo)
        </button>
        {showForm && (
          <form className="registro-form" style={{ width: '100%', marginTop: 16 }} onSubmit={e => { e.preventDefault(); handleInscribirse() }}>
            <div className="form-group">
              <label>Nombre completo</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleFormChange} required />
            </div>
            <div className="form-group">
              <label>Correo electrónico</label>
              <input type="email" name="email" value={formData.email} onChange={handleFormChange} required />
            </div>
            <button className="primary-button" type="submit" style={{ width: '100%' }} disabled={firmando}>
              Inscribirse y obtener constancia
            </button>
          </form>
        )}
        <div className="registro-info" style={{ marginTop: 32, padding: '1.25rem', background: 'rgba(212,175,55,0.06)', borderRadius: 12, border: '1px solid rgba(212,175,55,0.2)' }}>
          <h3 style={{ color: '#D4AF37', marginBottom: 12, fontSize: '1rem' }}>Importante</h3>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#E0E0E0', fontSize: '0.9rem', lineHeight: 1.8 }}>
            <li>El curso es gratuito</li>
            <li>Tu wallet solo firma un mensaje para inscribirte; no se envían fondos</li>
            <li>Si quieres constancia, añade tu nombre y correo antes de inscribirte</li>
            <li>Debes completar todas las lecciones para obtener tu constancia</li>
          </ul>
        </div>
      </div>
    </div>
  )
  }

  const leccionesFlat = curso ? getLeccionesFlat(curso) : []
  const leccion = leccionesFlat[leccionActual] as Leccion | undefined
  const progreso = leccionesFlat.length > 0 ? Math.round((leccionesCompletadas.length / leccionesFlat.length) * 100) : 0
  const muestraGuia = leccion?.guia != null
  const cuestionario = leccion?.cuestionario
  const respuestasLeccion = cuestionario ? cuestionario.map((_, i) => respuestasCuestionario[leccionActual * 10 + i]) : []
  const cuestionarioCompleto = !cuestionario || cuestionario.every((p, i) => respuestasLeccion[i] !== undefined)
  const cuestionarioCorrecto = cuestionario && cuestionarioCompleto && cuestionario.every((p, i) => respuestasLeccion[i] === p.correcta)
  const puedeCompletar = muestraGuia ? (cuestionario ? cuestionarioCorrecto : true) : true

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @media (max-width: 768px) {
          .curso-mobile-nav { display: block !important; }
          .curso-lecciones-sidebar { display: none !important; }
          .curso-main-content { flex-direction: column !important; }
        }
      `}</style>
    <div className="curso-platzi-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '90vh', padding: '1rem 0' }}>
      {/* Móvil: selector de sección (desplegable) */}
      <div className="curso-mobile-nav" style={{ display: 'none', padding: '0 1rem 1rem', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
        <label style={{ color: '#93C5FD', fontSize: '0.85rem', display: 'block', marginBottom: 6 }}>Ir a sección</label>
        <select
          value={leccionActual}
          onChange={(e) => { setLeccionActual(Number(e.target.value)); setSidebarAbierto(false) }}
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: 10,
            border: '1px solid rgba(37,99,235,0.4)',
            background: '#18181b',
            color: '#E0E0E0',
            fontSize: '0.95rem',
            cursor: 'pointer'
          }}
        >
          {leccionesFlat.map((sec, idx) => (
            <option key={idx} value={idx}>
              {sec.titulo} {leccionesCompletadas.includes(idx) ? '✔' : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="curso-main-content" style={{
        display: 'flex',
        gap: 24,
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 1400,
        margin: '0 auto',
        padding: '0 1rem',
        flexWrap: 'wrap'
      }}>
        {/* Contenido principal */}
        <div className="curso-video-container" style={{
          flex: '2 1 320px',
          minWidth: 0,
          background: '#18181b',
          borderRadius: 16,
          boxShadow: '0 4px 32px #1E3A8A22',
          padding: 'clamp(16px, 4vw, 24px)',
          width: '100%'
        }}>
          {leccion && (
            <>
              {muestraGuia ? (
                <div className="curso-guia-libro" style={{ marginBottom: 24 }}>
                  <h2 style={{ color: '#D4AF37', marginBottom: 8 }}>{leccion.titulo}</h2>
                  <p style={{ color: '#888', marginBottom: 20 }}>{leccion.descripcion}</p>
                  <div style={{ color: '#E0E0E0', fontSize: '1rem' }}>{renderGuia(leccion.guia!)}</div>
                </div>
              ) : leccion.video ? (
                <iframe
                  width="100%"
                  height="420"
                  src={leccion.video}
                  title={leccion.titulo}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: 12, boxShadow: '0 2px 12px #2563EB33', marginBottom: 16 }}
                />
              ) : null}
              {!muestraGuia && <h2 style={{ color: '#D4AF37', margin: '1rem 0 0.5rem 0' }}>{leccion.titulo}</h2>}
              {!muestraGuia && <p style={{ color: '#E0E0E0', marginBottom: 16 }}>{leccion.descripcion}</p>}

              {/* Cuestionario tipo carrusel: una pregunta a la vez */}
              {cuestionario && cuestionario.length > 0 && (
                <div className="curso-cuestionario" style={{
                  marginTop: 28,
                  padding: 'clamp(20px, 4vw, 28px)',
                  background: 'linear-gradient(145deg, rgba(37,99,235,0.12) 0%, rgba(30,58,138,0.08) 100%)',
                  borderRadius: 16,
                  border: '1px solid rgba(37,99,235,0.25)',
                  boxShadow: '0 4px 24px rgba(37,99,235,0.15)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                    <h3 style={{ color: '#2563EB', margin: 0, fontSize: '1.1rem' }}>Cuestionario</h3>
                    <span style={{ color: '#93C5FD', fontSize: '0.9rem', fontWeight: 600 }}>
                      Pregunta {Math.min(preguntaActual + 1, cuestionario.length)} de {cuestionario.length}
                    </span>
                  </div>

                  {/* Barra de progreso tipo carrusel */}
                  <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
                    {cuestionario.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        aria-label={`Ir a pregunta ${idx + 1}`}
                        onClick={() => setPreguntaActual(idx)}
                        style={{
                          width: Math.max(28, 40 - cuestionario.length * 2),
                          height: 8,
                          borderRadius: 4,
                          border: 'none',
                          background: idx === preguntaActual ? '#2563EB' : respuestasCuestionario[leccionActual * 10 + idx] !== undefined ? 'rgba(52, 211, 153, 0.6)' : 'rgba(37,99,235,0.25)',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                      />
                    ))}
                  </div>

                  {/* Una sola pregunta visible (carrusel) */}
                  {cuestionario.map((preg, i) => (
                    <div
                      key={i}
                      style={{
                        display: i === preguntaActual ? 'block' : 'none',
                        animation: 'fadeIn 0.25s ease'
                      }}
                    >
                      <p style={{
                        color: '#E0E0E0',
                        fontWeight: 600,
                        marginBottom: 16,
                        fontSize: '1.05rem',
                        lineHeight: 1.5
                      }}>
                        {preg.pregunta}
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {preg.opciones.map((op, j) => {
                          const selected = respuestasCuestionario[leccionActual * 10 + i] === j
                          const correcta = cuestionarioCompleto && preg.correcta === j
                          const incorrecta = cuestionarioCompleto && selected && preg.correcta !== j
                          return (
                            <button
                              key={j}
                              type="button"
                              onClick={() => setRespuestasCuestionario(prev => ({ ...prev, [leccionActual * 10 + i]: j }))}
                              style={{
                                width: '100%',
                                textAlign: 'left',
                                padding: '14px 18px',
                                borderRadius: 12,
                                border: `2px solid ${selected ? '#2563EB' : 'rgba(37,99,235,0.3)'}`,
                                background: incorrecta ? 'rgba(248,113,113,0.15)' : correcta ? 'rgba(52,211,153,0.12)' : selected ? 'rgba(37,99,235,0.15)' : 'rgba(15,23,42,0.6)',
                                color: '#E0E0E0',
                                fontSize: '0.98rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              <span style={{ marginRight: 10 }}>{String.fromCharCode(65 + j)}.</span> {op}
                              {correcta && ' ✓'}
                              {incorrecta && ' ✗'}
                            </button>
                          )
                        })}
                      </div>
                      {cuestionarioCompleto && respuestasCuestionario[leccionActual * 10 + i] !== preg.correcta && (
                        <p style={{ color: '#f87171', fontSize: '0.9rem', marginTop: 12 }}>Respuesta correcta: {preg.opciones[preg.correcta]}</p>
                      )}

                      {/* Navegación carrusel */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, gap: 12, flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => setPreguntaActual(p => Math.max(0, p - 1))}
                          disabled={preguntaActual === 0}
                          style={{
                            padding: '10px 18px',
                            borderRadius: 10,
                            border: '1px solid rgba(37,99,235,0.4)',
                            background: preguntaActual === 0 ? 'rgba(0,0,0,0.2)' : 'rgba(37,99,235,0.15)',
                            color: preguntaActual === 0 ? '#64748b' : '#93C5FD',
                            cursor: preguntaActual === 0 ? 'not-allowed' : 'pointer',
                            fontSize: '0.95rem'
                          }}
                        >
                          ← Anterior
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (preguntaActual < cuestionario.length - 1) setPreguntaActual(p => p + 1)
                          }}
                          disabled={respuestasCuestionario[leccionActual * 10 + i] === undefined}
                          style={{
                            padding: '10px 20px',
                            borderRadius: 10,
                            border: 'none',
                            background: respuestasCuestionario[leccionActual * 10 + i] !== undefined ? '#2563EB' : 'rgba(37,99,235,0.3)',
                            color: '#fff',
                            cursor: respuestasCuestionario[leccionActual * 10 + i] !== undefined ? 'pointer' : 'not-allowed',
                            fontSize: '0.95rem',
                            fontWeight: 600
                          }}
                        >
                          {preguntaActual < cuestionario.length - 1 ? 'Siguiente →' : 'Ver resultado'}
                        </button>
                      </div>
                    </div>
                  ))}

                  {cuestionarioCompleto && !cuestionarioCorrecto && (
                    <p style={{ color: '#f87171', marginTop: 16, fontWeight: 500 }}>Revisa las respuestas incorrectas. Puedes cambiar de pregunta con los botones o los puntos de arriba.</p>
                  )}
                  {cuestionarioCorrecto && (
                    <p style={{ color: '#34d399', fontWeight: 600, marginTop: 16, fontSize: '1.05rem' }}>✓ Todas correctas. Puedes marcar la lección como completada.</p>
                  )}
                </div>
              )}

              <button
                className="primary-button"
                style={{ marginTop: 20, marginBottom: 16 }}
                onClick={handleCompletarLeccion}
                disabled={leccionesCompletadas.includes(leccionActual) || (cuestionario && !puedeCompletar)}
              >
                {leccionesCompletadas.includes(leccionActual) ? 'Lección completada' : cuestionario && !cuestionarioCompleto ? 'Responde el cuestionario' : cuestionario && !cuestionarioCorrecto ? 'Revisa tus respuestas' : 'Marcar como completada'}
              </button>
              <div style={{ marginTop: 16, color: '#34d399', fontWeight: 600 }}>
                Progreso del curso: {progreso}%
              </div>
            </>
          )}
        </div>
        {/* Sidebar: capítulos + secciones o solo lecciones */}
        <div className="curso-lecciones-sidebar" style={{ flex: 1, minWidth: 260, background: '#101014', borderRadius: 16, boxShadow: '0 2px 12px #2563EB22', padding: 24 }}>
          <h3 style={{ color: '#2563EB', marginBottom: 16 }}>{curso.capitulos ? 'Contenido' : 'Lecciones'}</h3>
          {curso.capitulos && curso.capitulos.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {curso.capitulos.map((cap: Capitulo) => (
                <li key={cap.id} style={{ marginBottom: 16 }}>
                  <div style={{ color: '#D4AF37', fontSize: '0.85rem', fontWeight: 700, marginBottom: 8, paddingBottom: 4, borderBottom: '1px solid rgba(212,175,55,0.3)' }}>
                    {cap.titulo}
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {cap.secciones.map((sec, secIdx) => {
                      const flatIdx = curso.capitulos!.slice(0, curso.capitulos!.indexOf(cap)).reduce((acc, c) => acc + c.secciones.length, 0) + secIdx
                      return (
                        <li key={sec.id} style={{ marginBottom: 6 }}>
                          <button
                            style={{
                              width: '100%',
                              textAlign: 'left',
                              padding: '0.6rem 0.75rem',
                              borderRadius: 8,
                              border: flatIdx === leccionActual ? '2px solid #D4AF37' : '1px solid #2563EB44',
                              background: flatIdx === leccionActual ? 'rgba(212,175,55,0.08)' : 'rgba(37,99,235,0.06)',
                              color: leccionesCompletadas.includes(flatIdx) ? '#34d399' : '#E0E0E0',
                              fontWeight: leccionesCompletadas.includes(flatIdx) ? 700 : 500,
                              cursor: 'pointer',
                              fontSize: '0.9rem'
                            }}
                            onClick={() => setLeccionActual(flatIdx)}
                          >
                            {sec.titulo} {leccionesCompletadas.includes(flatIdx) && '✔️'}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {(curso.lecciones || []).map((l: Leccion, idx: number) => (
                <li key={l.titulo || idx} style={{ marginBottom: 12 }}>
                  <button
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.7rem 1rem',
                      borderRadius: 8,
                      border: idx === leccionActual ? '2px solid #D4AF37' : '1px solid #2563EB44',
                      background: idx === leccionActual ? 'rgba(212,175,55,0.08)' : 'rgba(37,99,235,0.06)',
                      color: leccionesCompletadas.includes(idx) ? '#34d399' : '#E0E0E0',
                      fontWeight: leccionesCompletadas.includes(idx) ? 700 : 500,
                      cursor: 'pointer',
                      marginBottom: 2
                    }}
                    onClick={() => setLeccionActual(idx)}
                  >
                    {l.titulo} {leccionesCompletadas.includes(idx) && '✔️'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* Info relevante bajo el video */}
      <div className="curso-info-extra" style={{maxWidth:900, margin:'2rem auto 0 auto', background:'#18181b', borderRadius:16, boxShadow:'0 2px 12px #2563EB22', padding:32}}>
        <h2 style={{color:'#D4AF37', marginBottom:12}}>Sobre el curso</h2>
        <p style={{color:'#E0E0E0', marginBottom:16}}>{curso.descripcion}</p>
        <h3 style={{color:'#2563EB', marginBottom:8}}>Requisitos</h3>
        <p style={{color:'#E0E0E0'}}>{curso.requisitos ?? 'No especificados.'}</p>
      </div>
    </div>
    </>
  )
}

export default RegistroCurso 