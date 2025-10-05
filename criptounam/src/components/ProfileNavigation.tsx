import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGraduationCap, 
  faCertificate, 
  faChartLine, 
  faCog,
  faUser
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
      id: 'configuracion',
      label: 'Configuración',
      icon: faCog,
      description: 'Ajustes de cuenta'
    }
  ];

  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
          <FontAwesomeIcon icon={faUser} className="text-black text-xl" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Mi Perfil</h2>
          <p className="text-gray-400 text-sm">Gestiona tu cuenta y progreso</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              p-4 rounded-xl transition-all duration-300 text-left
              ${activeTab === tab.id 
                ? 'bg-yellow-400 text-black border-2 border-yellow-400' 
                : 'bg-gray-800 text-white border-2 border-transparent hover:border-gray-600 hover:bg-gray-700'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <FontAwesomeIcon 
                icon={tab.icon} 
                className={`text-xl ${activeTab === tab.id ? 'text-black' : 'text-yellow-400'}`}
              />
              <div>
                <h3 className="font-semibold text-lg">{tab.label}</h3>
                <p className={`text-sm ${activeTab === tab.id ? 'text-gray-700' : 'text-gray-400'}`}>
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


