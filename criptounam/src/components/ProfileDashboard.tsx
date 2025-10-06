import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faTrophy, 
  faBookOpen, 
  faCertificate, 
  faClock, 
  faFire,
  faStar,
  faCalendarAlt,
  faGraduationCap,
  faMedal,
  faBullseye,
  faArrowUp
} from '@fortawesome/free-solid-svg-icons';

interface ProfileDashboardProps {
  stats: {
    cursosCompletados: number;
    certificacionesObtenidas: number;
    horasEstudiadas: number;
    streakActual: number;
    nivelActual: string;
    puntosTotales: number;
    proximoLogro: string;
    ranking: number;
  };
}

const ProfileDashboard: React.FC<ProfileDashboardProps> = ({ stats }) => {
  const achievements = [
    {
      id: 1,
      titulo: 'Primer Curso',
      descripcion: 'Completa tu primer curso',
      icono: faBookOpen,
      completado: stats.cursosCompletados > 0,
      color: '#10B981'
    },
    {
      id: 2,
      titulo: 'Certificado de Oro',
      descripcion: 'Obtén 5 certificaciones',
      icono: faCertificate,
      completado: stats.certificacionesObtenidas >= 5,
      color: '#D4AF37'
    },
    {
      id: 3,
      titulo: 'Estudiante Dedicado',
      descripcion: 'Estudia 100 horas',
      icono: faClock,
      completado: stats.horasEstudiadas >= 100,
      color: '#3B82F6'
    },
    {
      id: 4,
      titulo: 'Racha de Fuego',
      descripcion: 'Mantén una racha de 30 días',
      icono: faFire,
      completado: stats.streakActual >= 30,
      color: '#EF4444'
    },
    {
      id: 5,
      titulo: 'Experto Blockchain',
      descripcion: 'Alcanza el nivel Experto',
      icono: faTrophy,
      completado: stats.nivelActual === 'Experto',
      color: '#8B5CF6'
    },
    {
      id: 6,
      titulo: 'Top 10',
      descripcion: 'Entra al top 10 del ranking',
      icono: faMedal,
      completado: stats.ranking <= 10,
      color: '#F59E0B'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      accion: 'Completaste el curso',
      curso: 'Blockchain Fundamentals',
      fecha: '2024-01-15',
      icono: faGraduationCap,
      color: '#10B981'
    },
    {
      id: 2,
      accion: 'Obtuviste el certificado',
      curso: 'Smart Contracts',
      fecha: '2024-01-12',
      icono: faCertificate,
      color: '#D4AF37'
    },
    {
      id: 3,
      accion: 'Nueva racha de',
      curso: '7 días consecutivos',
      fecha: '2024-01-10',
      icono: faFire,
      color: '#EF4444'
    },
    {
      id: 4,
      accion: 'Subiste al nivel',
      curso: 'Intermedio',
      fecha: '2024-01-08',
      icono: faArrowUp,
      color: '#3B82F6'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
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
            margin: '0 0 8px 0'
          }}>Mi Dashboard</h2>
          <p style={{
            color: '#9CA3AF',
            margin: 0,
            fontSize: '16px'
          }}>Resumen de tu progreso y logros</p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontSize: '14px',
          color: '#9CA3AF'
        }}>
          <span>Nivel {stats.nivelActual}</span>
          <span>•</span>
          <span>Ranking #{stats.ranking}</span>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px'
      }}>
        {/* Cursos Completados */}
        <div style={{
          background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid #374151',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}>
              <FontAwesomeIcon icon={faBookOpen} style={{ color: '#fff', fontSize: '20px' }} />
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#10B981'
            }}>
              {stats.cursosCompletados}
            </div>
          </div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#fff',
            margin: '0 0 4px 0'
          }}>Cursos Completados</h3>
          <p style={{
            color: '#9CA3AF',
            fontSize: '14px',
            margin: 0
          }}>Total de cursos finalizados</p>
        </div>

        {/* Certificaciones */}
        <div style={{
          background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid #374151',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
            }}>
              <FontAwesomeIcon icon={faCertificate} style={{ color: '#000', fontSize: '20px' }} />
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#D4AF37'
            }}>
              {stats.certificacionesObtenidas}
            </div>
          </div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#fff',
            margin: '0 0 4px 0'
          }}>Certificaciones</h3>
          <p style={{
            color: '#9CA3AF',
            fontSize: '14px',
            margin: 0
          }}>Certificados obtenidos</p>
        </div>

        {/* Horas Estudiadas */}
        <div style={{
          background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid #374151',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.borderColor = '#3B82F6';
          e.currentTarget.style.boxShadow = '0 16px 48px rgba(59, 130, 246, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = '#374151';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}>
              <FontAwesomeIcon icon={faClock} style={{ color: '#fff', fontSize: '20px' }} />
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#3B82F6'
            }}>
              {stats.horasEstudiadas}h
            </div>
          </div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#fff',
            margin: '0 0 4px 0'
          }}>Horas Estudiadas</h3>
          <p style={{
            color: '#9CA3AF',
            fontSize: '14px',
            margin: 0
          }}>Tiempo total de estudio</p>
        </div>

        {/* Racha Actual */}
        <div style={{
          background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid #374151',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.borderColor = '#EF4444';
          e.currentTarget.style.boxShadow = '0 16px 48px rgba(239, 68, 68, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = '#374151';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
            }}>
              <FontAwesomeIcon icon={faFire} style={{ color: '#fff', fontSize: '20px' }} />
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#EF4444'
            }}>
              {stats.streakActual}
            </div>
          </div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#fff',
            margin: '0 0 4px 0'
          }}>Racha Actual</h3>
          <p style={{
            color: '#9CA3AF',
            fontSize: '14px',
            margin: 0
          }}>Días consecutivos estudiando</p>
        </div>
      </div>

      {/* Logros y Actividad Reciente */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '32px'
      }}>
        {/* Logros */}
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
              background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}>
              <FontAwesomeIcon icon={faTrophy} style={{ color: '#fff', fontSize: '18px' }} />
            </div>
            Logros
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {achievements.map((achievement) => (
              <div key={achievement.id} style={{
                background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #374151',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                opacity: achievement.completado ? 1 : 0.6
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = achievement.color;
                e.currentTarget.style.boxShadow = `0 8px 24px rgba(${achievement.color === '#10B981' ? '16, 185, 129' : achievement.color === '#D4AF37' ? '212, 175, 55' : achievement.color === '#3B82F6' ? '59, 130, 246' : achievement.color === '#EF4444' ? '239, 68, 68' : achievement.color === '#8B5CF6' ? '139, 92, 246' : '245, 158, 11'}, 0.2)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#374151';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: achievement.completado 
                      ? `linear-gradient(135deg, ${achievement.color} 0%, ${achievement.color}CC 100%)`
                      : 'linear-gradient(135deg, #374151 0%, #4B5563 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: achievement.completado 
                      ? `0 4px 12px ${achievement.color}40`
                      : '0 4px 12px rgba(0, 0, 0, 0.2)'
                  }}>
                    <FontAwesomeIcon 
                      icon={achievement.icono} 
                      style={{ 
                        color: achievement.completado ? '#fff' : '#9CA3AF', 
                        fontSize: '20px' 
                      }} 
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: achievement.completado ? '#fff' : '#9CA3AF',
                      margin: '0 0 4px 0'
                    }}>{achievement.titulo}</h4>
                    <p style={{
                      color: '#9CA3AF',
                      fontSize: '14px',
                      margin: 0
                    }}>{achievement.descripcion}</p>
                  </div>
                  {achievement.completado && (
                    <div style={{
                      color: achievement.color,
                      fontSize: '24px'
                    }}>
                      <FontAwesomeIcon icon={faStar} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actividad Reciente */}
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
              background: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}>
              <FontAwesomeIcon icon={faChartLine} style={{ color: '#fff', fontSize: '18px' }} />
            </div>
            Actividad Reciente
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {recentActivity.map((activity) => (
              <div key={activity.id} style={{
                background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #374151',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = activity.color;
                e.currentTarget.style.boxShadow = `0 8px 24px ${activity.color}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#374151';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: `linear-gradient(135deg, ${activity.color} 0%, ${activity.color}CC 100%)`,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 12px ${activity.color}40`
                  }}>
                    <FontAwesomeIcon 
                      icon={activity.icono} 
                      style={{ color: '#fff', fontSize: '20px' }} 
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      color: '#fff',
                      fontSize: '16px',
                      fontWeight: '500',
                      margin: '0 0 4px 0'
                    }}>{activity.accion}</p>
                    <p style={{
                      color: '#D4AF37',
                      fontSize: '14px',
                      fontWeight: '600',
                      margin: '0 0 4px 0'
                    }}>{activity.curso}</p>
                    <p style={{
                      color: '#9CA3AF',
                      fontSize: '12px',
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <FontAwesomeIcon icon={faCalendarAlt} />
                      {new Date(activity.fecha).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Próximo Logro */}
      <div style={{
        background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
        borderRadius: '20px',
        padding: '32px',
        border: '1px solid #374151',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px auto',
          boxShadow: '0 8px 32px rgba(212, 175, 55, 0.3)'
        }}>
          <FontAwesomeIcon icon={faBullseye} style={{ color: '#000', fontSize: '32px' }} />
        </div>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#fff',
          margin: '0 0 12px 0'
        }}>Próximo Logro</h3>
        <p style={{
          color: '#D4AF37',
          fontSize: '18px',
          fontWeight: '500',
          margin: '0 0 16px 0'
        }}>{stats.proximoLogro}</p>
        <p style={{
          color: '#9CA3AF',
          fontSize: '16px',
          margin: '0 auto',
          maxWidth: '400px'
        }}>¡Sigue así! Estás muy cerca de alcanzar tu próximo objetivo.</p>
      </div>
    </div>
  );
};

export default ProfileDashboard;
