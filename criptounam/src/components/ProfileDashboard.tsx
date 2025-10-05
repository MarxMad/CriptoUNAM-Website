import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faTrophy, 
  faClock, 
  faBookOpen, 
  faCertificate,
  faFire,
  faStar,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';

interface DashboardStats {
  cursosCompletados: number;
  certificacionesObtenidas: number;
  horasEstudiadas: number;
  diasActivos: number;
  nivelActual: string;
  proximoNivel: string;
  progresoNivel: number;
  rachaActual: number;
  mejorRacha: number;
  puntosTotales: number;
  ranking: number;
  totalUsuarios: number;
}

interface Logro {
  id: string;
  titulo: string;
  descripcion: string;
  icono: any;
  obtenido: boolean;
  fecha?: string;
  puntos: number;
}

interface ProfileDashboardProps {
  stats: DashboardStats;
  logros: Logro[];
  actividadReciente: any[];
}

const ProfileDashboard: React.FC<ProfileDashboardProps> = ({ stats, logros, actividadReciente }) => {
  const logrosObtenidos = logros.filter(logro => logro.obtenido);
  const logrosPendientes = logros.filter(logro => !logro.obtenido);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <p className="text-gray-400">Tu progreso y estadísticas de aprendizaje</p>
      </div>

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl p-6 text-black">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{stats.cursosCompletados}</h3>
              <p className="text-sm opacity-80">Cursos Completados</p>
            </div>
            <FontAwesomeIcon icon={faBookOpen} className="text-2xl opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{stats.certificacionesObtenidas}</h3>
              <p className="text-sm opacity-80">Certificaciones</p>
            </div>
            <FontAwesomeIcon icon={faCertificate} className="text-2xl opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{stats.horasEstudiadas}</h3>
              <p className="text-sm opacity-80">Horas Estudiadas</p>
            </div>
            <FontAwesomeIcon icon={faClock} className="text-2xl opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold">{stats.rachaActual}</h3>
              <p className="text-sm opacity-80">Días de Racha</p>
            </div>
            <FontAwesomeIcon icon={faFire} className="text-2xl opacity-80" />
          </div>
        </div>
      </div>

      {/* Progreso de Nivel */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Progreso de Nivel</h3>
          <span className="text-yellow-400 font-bold">{stats.nivelActual}</span>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progreso hacia {stats.proximoNivel}</span>
            <span>{stats.progresoNivel}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${stats.progresoNivel}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-white">{stats.puntosTotales}</p>
            <p className="text-sm text-gray-400">Puntos Totales</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">#{stats.ranking}</p>
            <p className="text-sm text-gray-400">Ranking Global</p>
          </div>
        </div>
      </div>

      {/* Logros */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logros Obtenidos */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faTrophy} className="text-yellow-400" />
            Logros Obtenidos ({logrosObtenidos.length})
          </h3>
          <div className="space-y-3">
            {logrosObtenidos.slice(0, 5).map((logro) => (
              <div key={logro.id} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                <FontAwesomeIcon icon={logro.icono} className="text-yellow-400 text-xl" />
                <div className="flex-1">
                  <h4 className="font-medium text-white">{logro.titulo}</h4>
                  <p className="text-sm text-gray-400">{logro.descripcion}</p>
                </div>
                <span className="text-yellow-400 font-bold">+{logro.puntos}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Logros Pendientes */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faStar} className="text-gray-400" />
            Próximos Logros ({logrosPendientes.length})
          </h3>
          <div className="space-y-3">
            {logrosPendientes.slice(0, 5).map((logro) => (
              <div key={logro.id} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg opacity-60">
                <FontAwesomeIcon icon={logro.icono} className="text-gray-400 text-xl" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-400">{logro.titulo}</h4>
                  <p className="text-sm text-gray-500">{logro.descripcion}</p>
                </div>
                <span className="text-gray-400 font-bold">+{logro.puntos}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actividad Reciente */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-400" />
          Actividad Reciente
        </h3>
        <div className="space-y-3">
          {actividadReciente.length > 0 ? (
            actividadReciente.map((actividad, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white">{actividad.descripcion}</p>
                  <p className="text-sm text-gray-400">{actividad.fecha}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-4">No hay actividad reciente</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;


