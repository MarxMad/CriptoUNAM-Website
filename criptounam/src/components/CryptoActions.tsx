import React from 'react';
import OnRampButton from './OnRampButton';
import SwapButton from './SwapButton';

interface CryptoActionsProps {
  layout?: 'horizontal' | 'vertical';
  showLabels?: boolean;
  className?: string;
}

const CryptoActions: React.FC<CryptoActionsProps> = ({ 
  layout = 'horizontal',
  showLabels = true,
  className = ''
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: layout === 'horizontal' ? 'row' : 'column',
    gap: '16px',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap'
  };

  return (
    <div style={containerStyle} className={className}>
      {showLabels && (
        <div style={{
          width: '100%',
          textAlign: 'center',
          marginBottom: '16px'
        }}>
          <h3 style={{
            color: '#D4AF37',
            fontSize: '1.5rem',
            marginBottom: '8px',
            fontFamily: 'Orbitron'
          }}>
            💰 Acciones de Criptomonedas
          </h3>
          <p style={{
            color: '#E0E0E0',
            fontSize: '1rem',
            margin: '0'
          }}>
            Compra, intercambia y gestiona tus criptomonedas
          </p>
        </div>
      )}
      
      <OnRampButton variant="primary" size="lg" />
      <SwapButton variant="secondary" size="lg" />
    </div>
  );
};

export default CryptoActions;
