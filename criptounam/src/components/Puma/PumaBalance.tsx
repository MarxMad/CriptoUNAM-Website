// Componente para mostrar balance de tokens PUMA
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins, faTrophy, faStar, faGift } from '@fortawesome/free-solid-svg-icons'
import { usePumaContext } from '../../context/PumaContext'

interface PumaBalanceProps {
  showDetails?: boolean
  showLevel?: boolean
  showBadges?: boolean
  size?: 'small' | 'medium' | 'large'
}

export const PumaBalance: React.FC<PumaBalanceProps> = ({
  showDetails = true,
  showLevel = true,
  showBadges = true,
  size = 'medium'
}) => {
  const { state } = usePumaContext()

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: 'puma-balance-small',
          icon: '1rem',
          text: '0.9rem',
          title: '1rem'
        }
      case 'large':
        return {
          container: 'puma-balance-large',
          icon: '2rem',
          text: '1.2rem',
          title: '1.5rem'
        }
      default:
        return {
          container: 'puma-balance-medium',
          icon: '1.5rem',
          text: '1rem',
          title: '1.2rem'
        }
    }
  }

  const sizeStyles = getSizeStyles()

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <div className={`puma-balance ${sizeStyles.container}`}>
      <div className="balance-header">
        <div className="balance-icon">
          <FontAwesomeIcon icon={faCoins} style={{ fontSize: sizeStyles.icon }} />
        </div>
        <div className="balance-info">
          <div className="balance-amount" style={{ fontSize: sizeStyles.title }}>
            {formatNumber(state.balance)} $PUMA
          </div>
          {showDetails && (
            <div className="balance-details" style={{ fontSize: sizeStyles.text }}>
              <span>Ganados: {formatNumber(state.totalEarned)}</span>
              <span>Gastados: {formatNumber(state.totalSpent)}</span>
            </div>
          )}
        </div>
      </div>

      {showLevel && (
        <div className="level-info">
          <FontAwesomeIcon icon={faTrophy} />
          <span>Nivel {state.level}</span>
        </div>
      )}

      {showBadges && state.badges.length > 0 && (
        <div className="badges-section">
          <div className="badges-header">
            <FontAwesomeIcon icon={faStar} />
            <span>Logros</span>
          </div>
          <div className="badges-list">
            {state.badges.slice(0, 3).map((badge, index) => (
              <div key={index} className="badge-item">
                <FontAwesomeIcon icon={faGift} />
                <span>{badge}</span>
              </div>
            ))}
            {state.badges.length > 3 && (
              <div className="badge-more">
                +{state.badges.length - 3} más
              </div>
            )}
          </div>
        </div>
      )}

      {state.isLoading && (
        <div className="loading-indicator">
          Cargando...
        </div>
      )}

      {state.error && (
        <div className="error-message">
          {state.error}
        </div>
      )}

      <style jsx>{`
        .puma-balance {
          background: linear-gradient(135deg, rgba(26, 26, 26, 0.9), rgba(40, 40, 40, 0.9));
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 12px;
          padding: 1rem;
          color: #E0E0E0;
          position: relative;
          overflow: hidden;
        }

        .puma-balance::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #D4AF37, #FFD700, #D4AF37);
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .balance-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }

        .balance-icon {
          color: #D4AF37;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(212, 175, 55, 0.1);
          border-radius: 50%;
          border: 2px solid rgba(212, 175, 55, 0.3);
        }

        .balance-info {
          flex: 1;
        }

        .balance-amount {
          color: #D4AF37;
          font-weight: bold;
          margin-bottom: 0.25rem;
        }

        .balance-details {
          display: flex;
          gap: 1rem;
          color: #888;
          font-size: 0.9rem;
        }

        .level-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #22c55e;
          font-weight: 600;
          margin-bottom: 0.75rem;
          padding: 0.5rem;
          background: rgba(34, 197, 94, 0.1);
          border-radius: 6px;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .badges-section {
          margin-top: 0.75rem;
        }

        .badges-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #D4AF37;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .badges-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .badge-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 4px;
          padding: 0.25rem 0.5rem;
          font-size: 0.8rem;
          color: #D4AF37;
        }

        .badge-more {
          background: rgba(212, 175, 55, 0.2);
          border: 1px solid rgba(212, 175, 55, 0.4);
          border-radius: 4px;
          padding: 0.25rem 0.5rem;
          font-size: 0.8rem;
          color: #D4AF37;
          font-weight: 600;
        }

        .loading-indicator {
          text-align: center;
          color: #D4AF37;
          font-style: italic;
        }

        .error-message {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 6px;
          padding: 0.5rem;
          text-align: center;
          font-size: 0.9rem;
        }

        .puma-balance-small {
          padding: 0.75rem;
        }

        .puma-balance-medium {
          padding: 1rem;
        }

        .puma-balance-large {
          padding: 1.5rem;
        }
      `}</style>
    </div>
  )
}
