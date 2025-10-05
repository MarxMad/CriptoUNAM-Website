import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faUser, faSpinner } from '@fortawesome/free-solid-svg-icons';

interface ProfilePictureProps {
  currentImage?: string;
  onImageChange: (file: File) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  currentImage,
  onImageChange,
  size = 'lg',
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeStyles = {
    sm: { width: '64px', height: '64px' },
    md: { width: '96px', height: '96px' },
    lg: { width: '128px', height: '128px' },
    xl: { width: '160px', height: '160px' }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen debe ser menor a 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Simular subida (aquí integrarías con Supabase o tu servicio de almacenamiento)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onImageChange(file);
    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('Error al subir la imagen');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <div
        style={{
          ...sizeStyles[size],
          borderRadius: '50%',
          border: preview ? '4px solid #D4AF37' : '4px dashed #9CA3AF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          opacity: isUploading ? 0.5 : 1
        }}
        onClick={handleClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#D4AF37';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = preview ? '#D4AF37' : '#9CA3AF';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {isUploading ? (
          <FontAwesomeIcon 
            icon={faSpinner} 
            style={{ fontSize: '24px', color: '#D4AF37' }}
            className="animate-spin"
          />
        ) : preview ? (
          <img
            src={preview}
            alt="Foto de perfil"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <FontAwesomeIcon 
            icon={faUser} 
            style={{ fontSize: '32px', color: '#9CA3AF' }}
          />
        )}
      </div>

      {/* Botón de cámara */}
      <div
        style={{
          position: 'absolute',
          bottom: '-8px',
          right: '-8px',
          backgroundColor: '#D4AF37',
          color: '#000',
          borderRadius: '50%',
          padding: '8px',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onClick={handleClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#B8941F';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#D4AF37';
        }}
      >
        <FontAwesomeIcon icon={faCamera} style={{ fontSize: '12px' }} />
      </div>

      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Overlay de carga */}
      {isUploading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <FontAwesomeIcon 
            icon={faSpinner} 
            style={{ color: '#fff', fontSize: '20px' }}
            className="animate-spin"
          />
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;


