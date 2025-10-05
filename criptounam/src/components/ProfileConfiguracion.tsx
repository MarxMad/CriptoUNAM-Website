import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt, 
  faGraduationCap,
  faCog,
  faBell,
  faShield,
  faPalette,
  faLanguage,
  faMoon,
  faSun,
  faSave,
  faEdit,
  faCheck,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import ProfilePicture from './ProfilePicture';

interface ProfileConfiguracionProps {
  userProfile: {
    nombre: string;
    apellidos: string;
    email: string;
    telefono?: string;
    ubicacion?: string;
    carrera?: string;
    universidad?: string;
    fotoPerfil?: string;
  };
  onProfileUpdate: (updatedProfile: any) => void;
}

const ProfileConfiguracion: React.FC<ProfileConfiguracionProps> = ({ 
  userProfile, 
  onProfileUpdate 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false
  });
  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showEmail: false,
    showPhone: false,
    showLocation: true
  });
  const [appearance, setAppearance] = useState({
    theme: 'dark',
    language: 'es',
    fontSize: 'medium'
  });

  const handleSave = () => {
    onProfileUpdate(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(userProfile);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (imageUrl: string) => {
    setEditedProfile(prev => ({
      ...prev,
      fotoPerfil: imageUrl
    }));
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
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#fff',
            margin: '0 0 8px 0'
          }}>Configuración</h2>
          <p style={{
            color: '#9CA3AF',
            margin: 0,
            fontSize: '16px'
          }}>Gestiona tu perfil y preferencias</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                  color: '#fff',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
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
                }}
              >
                <FontAwesomeIcon icon={faCheck} />
                Guardar
              </button>
              <button
                onClick={handleCancel}
                style={{
                  background: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
                  color: '#fff',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
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
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
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
              <FontAwesomeIcon icon={faEdit} />
              Editar Perfil
            </button>
          )}
        </div>
      </div>

      {/* Información Personal */}
      <div style={{
        background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
        borderRadius: '20px',
        padding: '32px',
        border: '1px solid #374151',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#fff',
          margin: '0 0 24px 0',
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
            <FontAwesomeIcon icon={faUser} style={{ color: '#fff', fontSize: '18px' }} />
          </div>
          Información Personal
        </h3>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* Foto de perfil */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            flexWrap: 'wrap'
          }}>
            <ProfilePicture
              currentImage={editedProfile.fotoPerfil}
              onImageChange={handleImageChange}
              size="xl"
            />
            <div>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#fff',
                margin: '0 0 8px 0'
              }}>Foto de Perfil</h4>
              <p style={{
                color: '#9CA3AF',
                fontSize: '14px',
                margin: 0
              }}>Haz clic en la imagen para cambiar tu foto de perfil</p>
            </div>
          </div>

          {/* Campos del formulario */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            <div>
              <label style={{
                display: 'block',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>Nombre</label>
              <input
                type="text"
                value={editedProfile.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid #374151',
                  background: isEditing ? '#1F2937' : '#374151',
                  color: '#fff',
                  fontSize: '16px',
                  transition: 'all 0.3s ease'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>Apellidos</label>
              <input
                type="text"
                value={editedProfile.apellidos}
                onChange={(e) => handleInputChange('apellidos', e.target.value)}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid #374151',
                  background: isEditing ? '#1F2937' : '#374151',
                  color: '#fff',
                  fontSize: '16px',
                  transition: 'all 0.3s ease'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>Email</label>
              <input
                type="email"
                value={editedProfile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid #374151',
                  background: isEditing ? '#1F2937' : '#374151',
                  color: '#fff',
                  fontSize: '16px',
                  transition: 'all 0.3s ease'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>Teléfono</label>
              <input
                type="tel"
                value={editedProfile.telefono || ''}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                disabled={!isEditing}
                placeholder="Opcional"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid #374151',
                  background: isEditing ? '#1F2937' : '#374151',
                  color: '#fff',
                  fontSize: '16px',
                  transition: 'all 0.3s ease'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>Ubicación</label>
              <input
                type="text"
                value={editedProfile.ubicacion || ''}
                onChange={(e) => handleInputChange('ubicacion', e.target.value)}
                disabled={!isEditing}
                placeholder="Ciudad, País"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid #374151',
                  background: isEditing ? '#1F2937' : '#374151',
                  color: '#fff',
                  fontSize: '16px',
                  transition: 'all 0.3s ease'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px'
              }}>Carrera</label>
              <input
                type="text"
                value={editedProfile.carrera || ''}
                onChange={(e) => handleInputChange('carrera', e.target.value)}
                disabled={!isEditing}
                placeholder="Tu carrera o especialización"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid #374151',
                  background: isEditing ? '#1F2937' : '#374151',
                  color: '#fff',
                  fontSize: '16px',
                  transition: 'all 0.3s ease'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Configuraciones adicionales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '32px'
      }}>
        {/* Notificaciones */}
        <div style={{
          background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid #374151',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#fff',
            margin: '0 0 24px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}>
              <FontAwesomeIcon icon={faBell} style={{ color: '#fff', fontSize: '14px' }} />
            </div>
            Notificaciones
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                background: '#374151',
                borderRadius: '12px',
                border: '1px solid #4B5563'
              }}>
                <span style={{ color: '#fff', fontSize: '16px' }}>
                  {key === 'email' ? 'Email' : 
                   key === 'push' ? 'Notificaciones Push' : 
                   key === 'sms' ? 'SMS' : 'Marketing'}
                </span>
                <label style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: '48px',
                  height: '24px'
                }}>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setNotifications(prev => ({
                      ...prev,
                      [key]: e.target.checked
                    }))}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: value ? '#10B981' : '#6B7280',
                    borderRadius: '24px',
                    transition: '0.3s'
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '""',
                      height: '18px',
                      width: '18px',
                      left: '3px',
                      bottom: '3px',
                      backgroundColor: '#fff',
                      borderRadius: '50%',
                      transition: '0.3s',
                      transform: value ? 'translateX(24px)' : 'translateX(0)'
                    }} />
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Privacidad */}
        <div style={{
          background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid #374151',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#fff',
            margin: '0 0 24px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
            }}>
              <FontAwesomeIcon icon={faShield} style={{ color: '#fff', fontSize: '14px' }} />
            </div>
            Privacidad
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.entries(privacy).map(([key, value]) => (
              <div key={key} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                background: '#374151',
                borderRadius: '12px',
                border: '1px solid #4B5563'
              }}>
                <span style={{ color: '#fff', fontSize: '16px' }}>
                  {key === 'profilePublic' ? 'Perfil Público' : 
                   key === 'showEmail' ? 'Mostrar Email' : 
                   key === 'showPhone' ? 'Mostrar Teléfono' : 'Mostrar Ubicación'}
                </span>
                <label style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: '48px',
                  height: '24px'
                }}>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setPrivacy(prev => ({
                      ...prev,
                      [key]: e.target.checked
                    }))}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: value ? '#10B981' : '#6B7280',
                    borderRadius: '24px',
                    transition: '0.3s'
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '""',
                      height: '18px',
                      width: '18px',
                      left: '3px',
                      bottom: '3px',
                      backgroundColor: '#fff',
                      borderRadius: '50%',
                      transition: '0.3s',
                      transform: value ? 'translateX(24px)' : 'translateX(0)'
                    }} />
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileConfiguracion;