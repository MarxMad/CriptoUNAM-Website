import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGraduationCap, 
  faCertificate, 
  faChartLine, 
  faCog,
  faUser,
  faCoins
} from '@fortawesome/free-solid-svg-icons';

interface ProfileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProfileNavigation: React.FC<ProfileNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'cursos',
      label: 'Cursos',
      icon: faGraduationCap,
      description: 'Mis cursos y progreso'
    },
    {
      id: 'certificaciones',
      label: 'Certificaciones',
      icon: faCertificate,
      description: 'Certificados obtenidos'
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: faChartLine,
      description: 'Estadísticas y logros'
    },
    {
      id: 'bonus',
      label: 'Bonus $PUMA',
      icon: faCoins,
      description: 'Recompensas y tokens'
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: faCog,
      description: 'Ajustes de cuenta'
    }
  ];

  return (
    <div style={{
      backgroundColor: '#1F2937',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #374151'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          backgroundColor: '#D4AF37',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <FontAwesomeIcon icon={faUser} style={{ color: '#000', fontSize: '20px' }} />
        </div>
        <div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#fff',
            margin: 0
          }}>Mi Perfil</h2>
          <p style={{
            color: '#9CA3AF',
            fontSize: '14px',
            margin: 0
          }}>Gestiona tu cuenta y progreso</p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: '16px',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              textAlign: 'left',
              border: '2px solid',
              backgroundColor: activeTab === tab.id ? '#D4AF37' : '#1F2937',
              color: activeTab === tab.id ? '#000' : '#fff',
              borderColor: activeTab === tab.id ? '#D4AF37' : 'transparent',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.borderColor = '#6B7280';
                e.currentTarget.style.backgroundColor = '#374151';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.backgroundColor = '#1F2937';
              }
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <FontAwesomeIcon 
                icon={tab.icon} 
                style={{
                  fontSize: '20px',
                  color: activeTab === tab.id ? '#000' : '#D4AF37'
                }}
              />
              <div>
                <h3 style={{
                  fontWeight: '600',
                  fontSize: '18px',
                  margin: 0,
                  marginBottom: '4px'
                }}>{tab.label}</h3>
                <p style={{
                  fontSize: '14px',
                  margin: 0,
                  color: activeTab === tab.id ? '#374151' : '#9CA3AF'
                }}>
                  {tab.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileNavigation;


