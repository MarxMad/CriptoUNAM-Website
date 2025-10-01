import React, { useState } from 'react'

interface GaleriaFotosProps {
  fotos: string[]
  titulo: string
  maxHeight?: number
  showThumbnails?: boolean
}

const GaleriaFotos: React.FC<GaleriaFotosProps> = ({ 
  fotos, 
  titulo, 
  maxHeight = 300,
  showThumbnails = true 
}) => {
  const [indiceActual, setIndiceActual] = useState(0)
  const [mostrarModal, setMostrarModal] = useState(false)

  if (!fotos || fotos.length === 0) return null

  const siguiente = () => {
    setIndiceActual((prev) => (prev + 1) % fotos.length)
  }

  const anterior = () => {
    setIndiceActual((prev) => (prev - 1 + fotos.length) % fotos.length)
  }

  const abrirModal = () => {
    setMostrarModal(true)
  }

  const cerrarModal = () => {
    setMostrarModal(false)
  }

  return (
    <>
      {/* Galería principal */}
      <div style={{ position: 'relative', width: '100%', marginBottom: '1rem' }}>
        <img 
          src={fotos[indiceActual]} 
          alt={`${titulo} - Foto ${indiceActual + 1}`}
          style={{
            width: '100%',
            height: `${maxHeight}px`,
            objectFit: 'cover',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            transition: 'transform 0.3s ease'
          }}
          onClick={abrirModal}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />

        {/* Controles de navegación */}
        {fotos.length > 1 && (
          <>
            <button
              onClick={anterior}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0, 0, 0, 0.7)',
                color: '#D4AF37',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.9)'
                e.currentTarget.style.color = '#000'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)'
                e.currentTarget.style.color = '#D4AF37'
              }}
            >
              ‹
            </button>
            <button
              onClick={siguiente}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(0, 0, 0, 0.7)',
                color: '#D4AF37',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.9)'
                e.currentTarget.style.color = '#000'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)'
                e.currentTarget.style.color = '#D4AF37'
              }}
            >
              ›
            </button>
          </>
        )}

        {/* Indicador de imagen actual */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          {indiceActual + 1} / {fotos.length}
        </div>
      </div>

      {/* Miniaturas */}
      {showThumbnails && fotos.length > 1 && (
        <div style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: '12px'
        }}>
          {fotos.map((foto, index) => (
            <img
              key={index}
              src={foto}
              alt={`Miniatura ${index + 1}`}
              style={{
                width: '60px',
                height: '60px',
                objectFit: 'cover',
                borderRadius: '8px',
                cursor: 'pointer',
                border: index === indiceActual ? '3px solid #D4AF37' : '2px solid transparent',
                transition: 'all 0.3s ease',
                opacity: index === indiceActual ? 1 : 0.7
              }}
              onClick={() => setIndiceActual(index)}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1'
                e.currentTarget.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = index === indiceActual ? '1' : '0.7'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            />
          ))}
        </div>
      )}

      {/* Modal de imagen completa */}
      {mostrarModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={cerrarModal}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <img
              src={fotos[indiceActual]}
              alt={`${titulo} - Foto ${indiceActual + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: '8px'
              }}
              onClick={(e) => e.stopPropagation()}
            />
            
            {/* Botón cerrar */}
            <button
              onClick={cerrarModal}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>

            {/* Controles en modal */}
            {fotos.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    anterior()
                  }}
                  style={{
                    position: 'absolute',
                    left: '-60px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    cursor: 'pointer',
                    fontSize: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ‹
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    siguiente()
                  }}
                  style={{
                    position: 'absolute',
                    right: '-60px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    cursor: 'pointer',
                    fontSize: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ›
                </button>
              </>
            )}

            {/* Indicador en modal */}
            <div style={{
              position: 'absolute',
              bottom: '-40px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              {indiceActual + 1} / {fotos.length}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default GaleriaFotos
