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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div>
        <h2 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#fff',
          margin: '0 0 8px 0',
          background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>Dashboard</h2>
        <p style={{
          color: '#9CA3AF',
          margin: 0,
          fontSize: '18px',
          fontWeight: '500'
        }}>Tu progreso y estadísticas de aprendizaje</p>
      </div>

      {/* Estadísticas Principales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
          borderRadius: '20px',
          padding: '28px',
          color: '#000',
          boxShadow: '0 8px 32px rgba(212, 175, 55, 0.3)',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(212, 175, 55, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(212, 175, 55, 0.3)';
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{
                fontSize: '36px',
                fontWeight: 'bold',
                margin: '0 0 8px 0'
              }}>{stats.cursosCompletados}</h3>
              <p style={{
                fontSize: '16px',
                opacity: 0.8,
                margin: 0,
                fontWeight: '600'
              }}>Cursos Completados</p>
            </div>
            <FontAwesomeIcon icon={faBookOpen} style={{ fontSize: '32px', opacity: 0.8 }} />
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
          borderRadius: '20px',
          padding: '28px',
          color: '#fff',
          boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(16, 185, 129, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(16, 185, 129, 0.3)';
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{
                fontSize: '36px',
                fontWeight: 'bold',
                margin: '0 0 8px 0'
              }}>{stats.certificacionesObtenidas}</h3>
              <p style={{
                fontSize: '16px',
                opacity: 0.9,
                margin: 0,
                fontWeight: '600'
              }}>Certificaciones</p>
            </div>
            <FontAwesomeIcon icon={faCertificate} style={{ fontSize: '32px', opacity: 0.8 }} />
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
          borderRadius: '20px',
          padding: '28px',
          color: '#fff',
          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.3)';
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{
                fontSize: '36px',
                fontWeight: 'bold',
                margin: '0 0 8px 0'
              }}>{stats.horasEstudiadas}</h3>
              <p style={{
                fontSize: '16px',
                opacity: 0.9,
                margin: 0,
                fontWeight: '600'
              }}>Horas Estudiadas</p>
            </div>
            <FontAwesomeIcon icon={faClock} style={{ fontSize: '32px', opacity: 0.8 }} />
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
          borderRadius: '20px',
          padding: '28px',
          color: '#fff',
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(139, 92, 246, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(139, 92, 246, 0.3)';
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{
                fontSize: '36px',
                fontWeight: 'bold',
                margin: '0 0 8px 0'
              }}>{stats.rachaActual}</h3>
              <p style={{
                fontSize: '16px',
                opacity: 0.9,
                margin: 0,
                fontWeight: '600'
              }}>Días de Racha</p>
            </div>
            <FontAwesomeIcon icon={faFire} style={{ fontSize: '32px', opacity: 0.8 }} />
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


