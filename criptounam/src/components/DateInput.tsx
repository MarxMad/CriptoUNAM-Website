import React, { useState } from 'react';

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  style?: React.CSSProperties;
}

const DateInput: React.FC<DateInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "DD/MM/YYYY", 
  required = false,
  style = {}
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isValid, setIsValid] = useState(true);

  const formatDateForDisplay = (dateStr: string): string => {
    if (!dateStr) return '';
    
    // Si ya está en formato DD/MM/YYYY, devolverlo
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      return dateStr;
    }
    
    // Si está en formato YYYY-MM-DD, convertir a DD/MM/YYYY
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    }
    
    return dateStr;
  };

  const formatDateForStorage = (dateStr: string): string => {
    if (!dateStr) return '';
    
    // Si está en formato DD/MM/YYYY, convertir a YYYY-MM-DD para almacenamiento
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month}-${day}`;
    }
    
    return dateStr;
  };

  const validateDate = (dateStr: string): boolean => {
    if (!dateStr) return true;
    
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(dateStr)) return false;
    
    const [day, month, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    
    return date.getDate() === day && 
           date.getMonth() === month - 1 && 
           date.getFullYear() === year;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    // Remover caracteres no numéricos excepto /
    inputValue = inputValue.replace(/[^\d\/]/g, '');
    
    // Auto-formatear mientras el usuario escribe
    if (inputValue.length <= 10) {
      // Agregar / automáticamente
      if (inputValue.length === 2 && !inputValue.includes('/')) {
        inputValue += '/';
      } else if (inputValue.length === 5 && inputValue.split('/').length === 2) {
        inputValue += '/';
      }
      
      setDisplayValue(inputValue);
      
      const isValidDate = validateDate(inputValue);
      setIsValid(isValidDate || inputValue === '');
      
      if (isValidDate) {
        const storageValue = formatDateForStorage(inputValue);
        onChange(storageValue);
      }
    }
  };

  const handleBlur = () => {
    if (displayValue && !validateDate(displayValue)) {
      setIsValid(false);
    }
  };

  React.useEffect(() => {
    const formatted = formatDateForDisplay(value);
    setDisplayValue(formatted);
  }, [value]);

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        required={required}
        style={{
          padding: '12px',
          borderRadius: '8px',
          border: `2px solid ${isValid ? '#e0e0e0' : '#ff4444'}`,
          fontSize: '1rem',
          transition: 'all 0.3s ease',
          width: '100%',
          backgroundColor: '#fff',
          ...style
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#D4AF37';
          e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = isValid ? '#e0e0e0' : '#ff4444';
          e.target.style.boxShadow = 'none';
        }}
      />
      {!isValid && displayValue && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: '#ff4444',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.8rem',
          marginTop: '2px',
          zIndex: 1000
        }}>
          Formato: DD/MM/YYYY (ej: 06/10/2025)
        </div>
      )}
    </div>
  );
};

export default DateInput;
