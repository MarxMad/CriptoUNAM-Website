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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Mis Certificaciones</h2>
          <p className="text-gray-400">Certificados y logros obtenidos</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>{certificacionesValidas.length} válidas</span>
          <span>•</span>
          <span>{certificacionesExpiradas.length} expiradas</span>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faCertificate} className="text-black text-xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{certificaciones.length}</h3>
              <p className="text-gray-400 text-sm">Total Certificados</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faCertificate} className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">{certificacionesValidas.length}</h3>
              <p className="text-gray-400 text-sm">Certificados Válidos</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">
                {certificaciones.length > 0 ? new Date(Math.max(...certificaciones.map(c => new Date(c.fechaObtencion).getTime()))).getFullYear() : 'N/A'}
              </h3>
              <p className="text-gray-400 text-sm">Último Certificado</p>
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


