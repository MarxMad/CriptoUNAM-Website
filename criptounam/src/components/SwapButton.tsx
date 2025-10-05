import React from 'react';
import { useAppKit } from '@reown/appkit/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt, faCoins } from '@fortawesome/free-solid-svg-icons';

interface SwapButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SwapButton: React.FC<SwapButtonProps> = ({ 
  variant = 'primary', 
  size = 'md',
  className = ''
}) => {
  const { open } = useAppKit();

  const handleSwap = () => {
    open({ view: 'Swap' });
  };

  const getButtonStyles = () => {
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      borderRadius: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: 'none',
      textDecoration: 'none',
      fontFamily: 'inherit'
    };

    const sizeStyles = {
      sm: { padding: '8px 16px', fontSize: '0.875rem' },
      md: { padding: '12px 24px', fontSize: '1rem' },
      lg: { padding: '16px 32px', fontSize: '1.125rem' }
    };

    const variantStyles = {
      primary: {
        background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
        color: '#fff',
        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
      },
      secondary: {
        background: 'rgba(26, 26, 26, 0.8)',
        color: '#2563EB',
        border: '1px solid rgba(37, 99, 235, 0.3)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
      },
      outline: {
        background: 'transparent',
        color: '#2563EB',
        border: '2px solid #2563EB',
        boxShadow: 'none'
      }
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant]
    };
  };

  return (
    <button
      onClick={handleSwap}
      style={getButtonStyles()}
      className={className}
      onMouseEnter={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)';
        } else if (variant === 'secondary') {
          e.currentTarget.style.background = 'rgba(37, 99, 235, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.5)';
        } else if (variant === 'outline') {
          e.currentTarget.style.background = 'rgba(37, 99, 235, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
        } else if (variant === 'secondary') {
          e.currentTarget.style.background = 'rgba(26, 26, 26, 0.8)';
          e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.3)';
        } else if (variant === 'outline') {
          e.currentTarget.style.background = 'transparent';
        }
      }}
    >
      <FontAwesomeIcon icon={faExchangeAlt} />
      Intercambiar Tokens
    </button>
  );
};

export default SwapButton;
