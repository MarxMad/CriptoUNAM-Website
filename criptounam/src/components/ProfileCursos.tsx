import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faClock, faTrophy, faBookOpen, faCertificate } from '@fortawesome/free-solid-svg-icons';

interface Curso {
  id: string;
  titulo: string;
  descripcion: string;
  progreso: number;
  duracion: string;
  nivel: string;
  imagen: string;
  completado: boolean;
  fechaInicio: string;
  fechaFin?: string;
}

interface ProfileCursosProps {
  cursos: Curso[];
}

const ProfileCursos: React.FC<ProfileCursosProps> = ({ cursos }) => {
  const cursosEnProgreso = cursos.filter(curso => !curso.completado);
  const cursosCompletados = cursos.filter(curso => curso.completado);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#fff',
            margin: '0 0 4px 0'
          }}>Mis Cursos</h2>
          <p style={{
            color: '#9CA3AF',
            margin: 0
          }}>Gestiona tu aprendizaje en blockchain</p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontSize: '14px',
          color: '#9CA3AF'
        }}>
          <span>{cursosCompletados.length} completados</span>
          <span>•</span>
          <span>{cursosEnProgreso.length} en progreso</span>
        </div>
      </div>

      {/* Cursos en Progreso */}
      {cursosEnProgreso.length > 0 && (
        <div>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#fff',
            margin: '0 0 20px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
            }}>
              <FontAwesomeIcon icon={faBookOpen} style={{ color: '#000', fontSize: '18px' }} />
            </div>
            En Progreso
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {cursosEnProgreso.map((curso) => (
              <div key={curso.id} style={{
                background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid #374151',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = '#D4AF37';
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(212, 175, 55, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#374151';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
              }}>
                {/* Badge de progreso */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
                  color: '#000',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3)'
                }}>
                  {curso.progreso}% Completado
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  {/* Imagen del curso */}
                  <div style={{
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    height: '200px',
                    background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)'
                  }}>
                    <img 
                      src={curso.imagen} 
                      alt={curso.titulo}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                    {/* Overlay gradiente */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '60px',
                      background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))'
                    }} />
                  </div>

                  {/* Contenido del curso */}
                  <div>
                    <h4 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#fff',
                      margin: '0 0 8px 0',
                      lineHeight: '1.3'
                    }}>{curso.titulo}</h4>
                    <p style={{
                      color: '#9CA3AF',
                      fontSize: '14px',
                      margin: '0 0 16px 0',
                      lineHeight: '1.5',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>{curso.descripcion}</p>
                    
                    {/* Información del curso */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '20px',
                      flexWrap: 'wrap'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#9CA3AF',
                        fontSize: '12px',
                        backgroundColor: '#374151',
                        padding: '6px 12px',
                        borderRadius: '20px'
                      }}>
                        <FontAwesomeIcon icon={faClock} />
                        {curso.duracion}
                      </div>
                      <div style={{
                        backgroundColor: '#D4AF37',
                        color: '#000',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {curso.nivel}
                      </div>
                    </div>

                    {/* Barra de progreso mejorada */}
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <span style={{
                          color: '#9CA3AF',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}>Progreso del curso</span>
                        <span style={{
                          color: '#D4AF37',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>{curso.progreso}%</span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: '#374151',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div 
                          style={{
                            height: '100%',
                            background: 'linear-gradient(90deg, #D4AF37 0%, #F4D03F 100%)',
                            borderRadius: '4px',
                            transition: 'width 0.8s ease',
                            width: `${curso.progreso}%`,
                            boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3)'
                          }}
                        />
                      </div>
                    </div>

                    {/* Botón de acción */}
                    <button style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
                      color: '#000',
                      padding: '14px 24px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)';
                    }}>
                      <FontAwesomeIcon icon={faPlay} />
                      Continuar Curso
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cursos Completados */}
      {cursosCompletados.length > 0 && (
        <div>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#fff',
            margin: '0 0 20px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}>
              <FontAwesomeIcon icon={faTrophy} style={{ color: '#fff', fontSize: '18px' }} />
            </div>
            Completados
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '24px'
          }}>
            {cursosCompletados.map((curso) => (
              <div key={curso.id} style={{
                background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid #374151',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = '#10B981';
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(16, 185, 129, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#374151';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
              }}>
                {/* Badge de completado */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                  color: '#fff',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <FontAwesomeIcon icon={faTrophy} style={{ fontSize: '10px' }} />
                  Completado
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  {/* Imagen del curso */}
                  <div style={{
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    height: '200px',
                    background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)'
                  }}>
                    <img 
                      src={curso.imagen} 
                      alt={curso.titulo}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                    {/* Overlay gradiente */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '60px',
                      background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))'
                    }} />
                  </div>

                  {/* Contenido del curso */}
                  <div>
                    <h4 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#fff',
                      margin: '0 0 8px 0',
                      lineHeight: '1.3'
                    }}>{curso.titulo}</h4>
                    <p style={{
                      color: '#9CA3AF',
                      fontSize: '14px',
                      margin: '0 0 16px 0',
                      lineHeight: '1.5',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>{curso.descripcion}</p>
                    
                    {/* Información del curso */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '20px',
                      flexWrap: 'wrap'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#9CA3AF',
                        fontSize: '12px',
                        backgroundColor: '#374151',
                        padding: '6px 12px',
                        borderRadius: '20px'
                      }}>
                        <FontAwesomeIcon icon={faClock} />
                        {curso.duracion}
                      </div>
                      <div style={{
                        backgroundColor: '#10B981',
                        color: '#fff',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {curso.nivel}
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div style={{
                      display: 'flex',
                      gap: '12px'
                    }}>
                      <button style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                        color: '#fff',
                        padding: '14px 20px',
                        borderRadius: '12px',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                      }}>
                        <FontAwesomeIcon icon={faCertificate} />
                        Ver Certificado
                      </button>
                      <button style={{
                        background: 'linear-gradient(135deg, #374151 0%, #4B5563 100%)',
                        color: '#fff',
                        padding: '14px 20px',
                        borderRadius: '12px',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                      }}>
                        <FontAwesomeIcon icon={faPlay} />
                        Repetir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {cursos.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
          borderRadius: '20px',
          border: '1px solid #374151'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #374151 0%, #4B5563 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }}>
            <FontAwesomeIcon icon={faBookOpen} style={{ fontSize: '48px', color: '#9CA3AF' }} />
          </div>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#fff',
            margin: '0 0 12px 0'
          }}>No tienes cursos aún</h3>
          <p style={{
            color: '#9CA3AF',
            fontSize: '16px',
            margin: '0 auto 32px auto',
            maxWidth: '400px',
            lineHeight: '1.5'
          }}>Explora nuestros cursos de blockchain y comienza tu aprendizaje en el mundo de las criptomonedas</p>
          <button style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
            color: '#000',
            padding: '16px 32px',
            borderRadius: '12px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
            fontSize: '16px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)';
          }}>
            Explorar Cursos
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileCursos;


