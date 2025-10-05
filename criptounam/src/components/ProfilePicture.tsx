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

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40'
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
        className={`
          ${sizeClasses[size]}
          rounded-full border-4 border-dashed border-gray-300
          flex items-center justify-center
          cursor-pointer transition-all duration-300
          hover:border-yellow-400 hover:scale-105
          ${preview ? 'border-solid border-yellow-400' : ''}
          ${isUploading ? 'opacity-50' : ''}
        `}
        onClick={handleClick}
      >
        {isUploading ? (
          <FontAwesomeIcon 
            icon={faSpinner} 
            className="text-2xl text-yellow-400 animate-spin" 
          />
        ) : preview ? (
          <img
            src={preview}
            alt="Foto de perfil"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <FontAwesomeIcon 
            icon={faUser} 
            className="text-4xl text-gray-400" 
          />
        )}
      </div>

      {/* Botón de cámara */}
      <div
        className="absolute -bottom-2 -right-2 bg-yellow-400 text-black rounded-full p-2 cursor-pointer hover:bg-yellow-300 transition-colors"
        onClick={handleClick}
      >
        <FontAwesomeIcon icon={faCamera} className="text-sm" />
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
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
          <FontAwesomeIcon 
            icon={faSpinner} 
            className="text-white text-xl animate-spin" 
          />
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;


