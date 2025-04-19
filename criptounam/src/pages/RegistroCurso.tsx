import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
//import { IMAGES } from '../constants/images'
import '../styles/RegistroCurso.css'

const RegistroCurso = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    comentarios: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Datos del registro:', formData)
    navigate('/cursos')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="registro-curso-container">
      <div className="registro-header">
        <h1>Registro al Curso</h1>
        <p className="curso-id">ID del Curso: {id}</p>
      </div>

      <div className="registro-content">
        <form className="registro-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Información Personal</h2>
            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="telefono">Teléfono</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Información Adicional</h2>
            <div className="form-group">
              <label htmlFor="comentarios">Comentarios o Preguntas</label>
              <textarea
                id="comentarios"
                name="comentarios"
                value={formData.comentarios}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate('/cursos')}>
              Cancelar
            </button>
            <button type="submit" className="submit-btn">
              Enviar Registro
            </button>
          </div>
        </form>

        <div className="registro-info">
          <h3>Importante</h3>
          <ul>
            <li>Recibirás un correo de confirmación</li>
            <li>El curso es gratuito</li>
            <li>Se requiere asistencia mínima del 80%</li>
            <li>Se entregará constancia de participación</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default RegistroCurso 