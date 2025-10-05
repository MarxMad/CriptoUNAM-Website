import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faClock, faTrophy, faBookOpen } from '@fortawesome/free-solid-svg-icons';

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Mis Cursos</h2>
          <p className="text-gray-400">Gestiona tu aprendizaje en blockchain</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>{cursosCompletados.length} completados</span>
          <span>•</span>
          <span>{cursosEnProgreso.length} en progreso</span>
        </div>
      </div>

      {/* Cursos en Progreso */}
      {cursosEnProgreso.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faBookOpen} className="text-yellow-400" />
            En Progreso
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cursosEnProgreso.map((curso) => (
              <div key={curso.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-yellow-400 transition-colors">
                <div className="flex items-start gap-4">
                  <img 
                    src={curso.imagen} 
                    alt={curso.titulo}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-2">{curso.titulo}</h4>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{curso.descripcion}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faClock} />
                        {curso.duracion}
                      </span>
                      <span className="bg-gray-700 px-2 py-1 rounded">{curso.nivel}</span>
                    </div>

                    {/* Barra de progreso */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>Progreso</span>
                        <span>{curso.progreso}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${curso.progreso}%` }}
                        />
                      </div>
                    </div>

                    <button className="w-full bg-yellow-400 text-black py-2 px-4 rounded-lg font-medium hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2">
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
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faTrophy} className="text-yellow-400" />
            Completados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cursosCompletados.map((curso) => (
              <div key={curso.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-400 transition-colors">
                <div className="flex items-start gap-4">
                  <img 
                    src={curso.imagen} 
                    alt={curso.titulo}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-white">{curso.titulo}</h4>
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Completado
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{curso.descripcion}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faClock} />
                        {curso.duracion}
                      </span>
                      <span className="bg-gray-700 px-2 py-1 rounded">{curso.nivel}</span>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-400 transition-colors">
                        Ver Certificado
                      </button>
                      <button className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
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
        <div className="text-center py-12">
          <FontAwesomeIcon icon={faBookOpen} className="text-6xl text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No tienes cursos aún</h3>
          <p className="text-gray-400 mb-6">Explora nuestros cursos de blockchain y comienza tu aprendizaje</p>
          <button className="bg-yellow-400 text-black py-3 px-6 rounded-lg font-medium hover:bg-yellow-300 transition-colors">
            Explorar Cursos
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileCursos;


