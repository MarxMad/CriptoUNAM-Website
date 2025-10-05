import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCertificate, faDownload, faShare, faEye, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

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
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faCertificate} className="text-green-400" />
            Certificados Válidos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificacionesValidas.map((cert) => (
              <div key={cert.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-400 transition-colors">
                <div className="flex items-start gap-4">
                  <img 
                    src={cert.imagen} 
                    alt={cert.titulo}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-white">{cert.titulo}</h4>
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Válido
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{cert.curso}</p>
                    <p className="text-gray-400 text-xs mb-3">{cert.descripcion}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        {new Date(cert.fechaObtencion).toLocaleDateString()}
                      </span>
                      <span className="bg-gray-700 px-2 py-1 rounded">{cert.nivel}</span>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-400 transition-colors flex items-center justify-center gap-2">
                        <FontAwesomeIcon icon={faDownload} />
                        Descargar
                      </button>
                      <button className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                        <FontAwesomeIcon icon={faShare} />
                      </button>
                      <button className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
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
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faCertificate} className="text-red-400" />
            Certificados Expirados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificacionesExpiradas.map((cert) => (
              <div key={cert.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-red-400 transition-colors opacity-75">
                <div className="flex items-start gap-4">
                  <img 
                    src={cert.imagen} 
                    alt={cert.titulo}
                    className="w-20 h-20 rounded-lg object-cover grayscale"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-white">{cert.titulo}</h4>
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Expirado
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{cert.curso}</p>
                    <p className="text-gray-400 text-xs mb-3">{cert.descripcion}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        {new Date(cert.fechaObtencion).toLocaleDateString()}
                      </span>
                      <span className="bg-gray-700 px-2 py-1 rounded">{cert.nivel}</span>
                    </div>

                    <button className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors">
                      Renovar Certificado
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {certificaciones.length === 0 && (
        <div className="text-center py-12">
          <FontAwesomeIcon icon={faCertificate} className="text-6xl text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No tienes certificaciones aún</h3>
          <p className="text-gray-400 mb-6">Completa cursos para obtener certificados</p>
          <button className="bg-yellow-400 text-black py-3 px-6 rounded-lg font-medium hover:bg-yellow-300 transition-colors">
            Explorar Cursos
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileCertificaciones;


