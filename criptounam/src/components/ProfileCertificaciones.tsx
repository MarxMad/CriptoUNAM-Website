import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCertificate, faDownload, faShare, faEye, faCalendarAlt, faBookOpen, faExclamationTriangle, faRedo } from '@fortawesome/free-solid-svg-icons';

interface Certificacion {
  id: string;
  titulo: string;
  descripcion: string;
  curso: string;
  fechaObtencion: string;
  imagen: string;
  url: string;
  valido: boolean;
  nivel: string;
}

interface ProfileCertificacionesProps {
  certificaciones: Certificacion[];
}

const ProfileCertificaciones: React.FC<ProfileCertificacionesProps> = ({ certificaciones }) => {
  const certificacionesValidas = certificaciones.filter(cert => cert.valido);
  const certificacionesExpiradas = certificaciones.filter(cert => !cert.valido);

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
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#fff',
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Mis Certificaciones</h2>
          <p style={{
            color: '#9CA3AF',
            margin: 0,
            fontSize: '16px'
          }}>Certificados y logros obtenidos</p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontSize: '14px',
          color: '#9CA3AF'
        }}>
          <span style={{
            backgroundColor: '#10B981',
            color: '#fff',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600'
          }}>{certificacionesValidas.length} válidas</span>
          <span style={{
            backgroundColor: '#EF4444',
            color: '#fff',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600'
          }}>{certificacionesExpiradas.length} expiradas</span>
        </div>
      </div>

      {/* Estadísticas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #374151',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
            }}>
              <FontAwesomeIcon icon={faCertificate} style={{ color: '#000', fontSize: '24px' }} />
            </div>
            <div>
              <h3 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#fff',
                margin: '0 0 4px 0'
              }}>{certificaciones.length}</h3>
              <p style={{
                color: '#9CA3AF',
                fontSize: '14px',
                margin: 0,
                fontWeight: '500'
              }}>Total Certificados</p>
            </div>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #374151',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}>
              <FontAwesomeIcon icon={faCertificate} style={{ color: '#fff', fontSize: '24px' }} />
            </div>
            <div>
              <h3 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#fff',
                margin: '0 0 4px 0'
              }}>{certificacionesValidas.length}</h3>
              <p style={{
                color: '#9CA3AF',
                fontSize: '14px',
                margin: 0,
                fontWeight: '500'
              }}>Certificados Válidos</p>
            </div>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #374151',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}>
              <FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#fff', fontSize: '24px' }} />
            </div>
            <div>
              <h3 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#fff',
                margin: '0 0 4px 0'
              }}>
                {certificaciones.length > 0 ? new Date(Math.max(...certificaciones.map(c => new Date(c.fechaObtencion).getTime()))).getFullYear() : 'N/A'}
              </h3>
              <p style={{
                color: '#9CA3AF',
                fontSize: '14px',
                margin: 0,
                fontWeight: '500'
              }}>Último Certificado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Certificaciones Válidas */}
      {certificacionesValidas.length > 0 && (
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
              <FontAwesomeIcon icon={faCertificate} style={{ color: '#fff', fontSize: '18px' }} />
            </div>
            Certificados Válidos
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '24px'
          }}>
            {certificacionesValidas.map((cert) => (
              <div key={cert.id} style={{
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
                {/* Badge de válido */}
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
                  <FontAwesomeIcon icon={faCertificate} style={{ fontSize: '10px' }} />
                  Válido
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}>
                  {/* Imagen del certificado */}
                  <div style={{
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    height: '240px',
                    background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)'
                  }}>
                    <img 
                      src={cert.imagen} 
                      alt={cert.titulo}
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
                      height: '80px',
                      background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))'
                    }} />
                  </div>

                  {/* Contenido del certificado */}
                  <div>
                    <h4 style={{
                      fontSize: '22px',
                      fontWeight: '600',
                      color: '#fff',
                      margin: '0 0 8px 0',
                      lineHeight: '1.3'
                    }}>{cert.titulo}</h4>
                    <p style={{
                      color: '#D4AF37',
                      fontSize: '16px',
                      fontWeight: '500',
                      margin: '0 0 8px 0'
                    }}>{cert.curso}</p>
                    <p style={{
                      color: '#9CA3AF',
                      fontSize: '14px',
                      margin: '0 0 16px 0',
                      lineHeight: '1.5'
                    }}>{cert.descripcion}</p>
                    
                    {/* Información del certificado */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '24px',
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
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        {new Date(cert.fechaObtencion).toLocaleDateString()}
                      </div>
                      <div style={{
                        backgroundColor: '#10B981',
                        color: '#fff',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {cert.nivel}
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
                        <FontAwesomeIcon icon={faDownload} />
                        Descargar
                      </button>
                      <button style={{
                        background: 'linear-gradient(135deg, #374151 0%, #4B5563 100%)',
                        color: '#fff',
                        padding: '14px 16px',
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
                        <FontAwesomeIcon icon={faShare} />
                      </button>
                      <button style={{
                        background: 'linear-gradient(135deg, #374151 0%, #4B5563 100%)',
                        color: '#fff',
                        padding: '14px 16px',
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
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificaciones Expiradas */}
      {certificacionesExpiradas.length > 0 && (
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
              background: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
            }}>
              <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: '#fff', fontSize: '18px' }} />
            </div>
            Certificados Expirados
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '24px'
          }}>
            {certificacionesExpiradas.map((cert) => (
              <div key={cert.id} style={{
                background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid #374151',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                opacity: 0.8
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = '#EF4444';
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(239, 68, 68, 0.2)';
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#374151';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.opacity = '0.8';
              }}>
                {/* Badge de expirado */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
                  color: '#fff',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <FontAwesomeIcon icon={faExclamationTriangle} style={{ fontSize: '10px' }} />
                  Expirado
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}>
                  {/* Imagen del certificado */}
                  <div style={{
                    position: 'relative',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    height: '240px',
                    background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
                    opacity: 0.6
                  }}>
                    <img 
                      src={cert.imagen} 
                      alt={cert.titulo}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                        filter: 'grayscale(50%)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.filter = 'grayscale(0%)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.filter = 'grayscale(50%)';
                      }}
                    />
                    {/* Overlay gradiente */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '80px',
                      background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))'
                    }} />
                  </div>

                  {/* Contenido del certificado */}
                  <div>
                    <h4 style={{
                      fontSize: '22px',
                      fontWeight: '600',
                      color: '#fff',
                      margin: '0 0 8px 0',
                      lineHeight: '1.3'
                    }}>{cert.titulo}</h4>
                    <p style={{
                      color: '#D4AF37',
                      fontSize: '16px',
                      fontWeight: '500',
                      margin: '0 0 8px 0'
                    }}>{cert.curso}</p>
                    <p style={{
                      color: '#9CA3AF',
                      fontSize: '14px',
                      margin: '0 0 16px 0',
                      lineHeight: '1.5'
                    }}>{cert.descripcion}</p>
                    
                    {/* Información del certificado */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '24px',
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
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        {new Date(cert.fechaObtencion).toLocaleDateString()}
                      </div>
                      <div style={{
                        backgroundColor: '#EF4444',
                        color: '#fff',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {cert.nivel}
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div style={{
                      display: 'flex',
                      gap: '12px'
                    }}>
                      <button style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
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
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                      }}>
                        <FontAwesomeIcon icon={faRedo} />
                        Renovar
                      </button>
                      <button style={{
                        background: 'linear-gradient(135deg, #374151 0%, #4B5563 100%)',
                        color: '#fff',
                        padding: '14px 16px',
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
                        <FontAwesomeIcon icon={faEye} />
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
      {certificaciones.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
          borderRadius: '20px',
          border: '1px solid #374151'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 32px auto',
            boxShadow: '0 8px 32px rgba(212, 175, 55, 0.3)'
          }}>
            <FontAwesomeIcon icon={faCertificate} style={{ color: '#000', fontSize: '48px' }} />
          </div>
          <h3 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#fff',
            margin: '0 0 12px 0'
          }}>No tienes certificaciones aún</h3>
          <p style={{
            color: '#9CA3AF',
            fontSize: '16px',
            margin: '0 auto 32px auto',
            maxWidth: '400px',
            lineHeight: '1.5'
          }}>Completa cursos para obtener certificados y validar tus conocimientos en blockchain</p>
          <button style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
            color: '#000',
            padding: '16px 32px',
            borderRadius: '12px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
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
            <FontAwesomeIcon icon={faBookOpen} />
            Ver Cursos Disponibles
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileCertificaciones;


