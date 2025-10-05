import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faBell, 
  faShield, 
  faPalette, 
  faLanguage,
  faDownload,
  faTrash,
  faEdit,
  faSave,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import OnRampButton from './OnRampButton';
import SwapButton from './SwapButton';

interface ProfileConfiguracionProps {
  userData: {
    nombre: string;
    email: string;
    telefono?: string;
    bio?: string;
    avatar?: string;
  };
  onUpdateUser: (data: any) => void;
}

const ProfileConfiguracion: React.FC<ProfileConfiguracionProps> = ({ userData, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userData);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false,
    updates: true
  });
  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showEmail: false,
    showPhone: false,
    showActivity: true
  });

  const handleSave = () => {
    onUpdateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
  };

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
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#fff',
            margin: '0 0 8px 0',
            background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Configuración</h2>
          <p style={{
            color: '#9CA3AF',
            margin: 0,
            fontSize: '18px',
            fontWeight: '500'
          }}>Gestiona tu cuenta y preferencias</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          style={{
            background: isEditing 
              ? 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)' 
              : 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
            color: '#000',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
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
          }}
        >
          <FontAwesomeIcon icon={isEditing ? faTimes : faEdit} />
          {isEditing ? 'Cancelar' : 'Editar'}
        </button>
      </div>

      {/* Información Personal */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faUser} className="text-yellow-400" />
          Información Personal
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nombre</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
              />
            ) : (
              <p className="text-white">{userData.nombre}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
              />
            ) : (
              <p className="text-white">{userData.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Teléfono</label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.telefono || ''}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
              />
            ) : (
              <p className="text-white">{userData.telefono || 'No especificado'}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Biografía</label>
            {isEditing ? (
              <textarea
                value={formData.bio || ''}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                rows={3}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-yellow-400 focus:outline-none"
                placeholder="Cuéntanos sobre ti..."
              />
            ) : (
              <p className="text-white">{userData.bio || 'No especificada'}</p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-400 transition-colors flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faSave} />
              Guardar Cambios
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-500 transition-colors flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faTimes} />
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Notificaciones */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faBell} className="text-yellow-400" />
          Notificaciones
        </h3>
        
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium capitalize">{key}</h4>
                <p className="text-gray-400 text-sm">
                  {key === 'email' && 'Recibir notificaciones por email'}
                  {key === 'push' && 'Notificaciones push en el navegador'}
                  {key === 'marketing' && 'Promociones y ofertas especiales'}
                  {key === 'updates' && 'Actualizaciones de la plataforma'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setNotifications({...notifications, [key]: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Privacidad */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faShield} className="text-yellow-400" />
          Privacidad
        </h3>
        
        <div className="space-y-4">
          {Object.entries(privacy).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium capitalize">
                  {key === 'profilePublic' && 'Perfil Público'}
                  {key === 'showEmail' && 'Mostrar Email'}
                  {key === 'showPhone' && 'Mostrar Teléfono'}
                  {key === 'showActivity' && 'Mostrar Actividad'}
                </h4>
                <p className="text-gray-400 text-sm">
                  {key === 'profilePublic' && 'Otros usuarios pueden ver tu perfil'}
                  {key === 'showEmail' && 'Mostrar tu email en tu perfil público'}
                  {key === 'showPhone' && 'Mostrar tu teléfono en tu perfil público'}
                  {key === 'showActivity' && 'Mostrar tu actividad reciente'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setPrivacy({...privacy, [key]: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Gestión de Criptomonedas */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faPalette} className="text-yellow-400" />
          Gestión de Criptomonedas
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center">
            <OnRampButton variant="primary" size="md" />
            <p className="text-gray-400 text-sm mt-2">Comprar criptomonedas</p>
          </div>
          <div className="text-center">
            <SwapButton variant="secondary" size="md" />
            <p className="text-gray-400 text-sm mt-2">Intercambiar tokens</p>
          </div>
        </div>
      </div>

      {/* Acciones de Cuenta */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faDownload} className="text-yellow-400" />
          Datos de Cuenta
        </h3>
        
        <div className="space-y-3">
          <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-400 transition-colors flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faDownload} />
            Descargar Mis Datos
          </button>
          <button className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-400 transition-colors flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faTrash} />
            Eliminar Cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileConfiguracion;


