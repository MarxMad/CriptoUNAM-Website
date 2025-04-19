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
    // Aquí iría la lógica para enviar el formulario
    console.log('Datos del registro:', formData)
    // Redirigir a la página de confirmación o cursos
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
        <form onSubmit={handleSubmit} className="registro-form">
          <div className="form-section">
            <h2>Información Personal</h2>
            <div className="form-group">
              <label htmlFor="nombre">Nombre completo</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ingresa tu nombre completo"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ejemplo@unam.mx"
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
                placeholder="55 1234 5678"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Información Adicional</h2>
            <div className="form-group">
              <label htmlFor="comentarios">Comentarios o preguntas</label>
              <textarea
                id="comentarios"
                name="comentarios"
                value={formData.comentarios}
                onChange={handleChange}
                placeholder="¿Tienes alguna pregunta o comentario sobre el curso?"
                rows={4}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => navigate('/cursos')}>
              Cancelar
            </button>
            <button type="submit" className="submit-btn">
              Confirmar Registro
            </button>
          </div>
        </form>

        <div className="registro-info">
          <h3>Importante</h3>
          <ul>
            <li>Los campos marcados con * son obligatorios</li>
            <li>Recibirás un correo de confirmación</li>
            <li>El pago se realiza al inicio del curso</li>
            <li>Puedes cancelar tu registro hasta 24 horas antes</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default RegistroCurso 