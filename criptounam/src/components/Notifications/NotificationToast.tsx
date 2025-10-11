// Componente de notificaciones toast
import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCheckCircle, 
  faExclamationCircle, 
  faInfoCircle, 
  faTimes,
  faBell,
  faGift,
  faTrophy,
  faCoins
} from '@fortawesome/free-solid-svg-icons'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info' | 'reward' | 'achievement'
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  icon?: any
}

interface NotificationToastProps {
  notification: Notification
  onClose: (id: string) => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

const NotificationToast: React.FC<NotificationToastProps> = ({ 
  notification, 
  onClose, 
  position = 'top-right' 
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Mostrar notificación
    const showTimer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    // Auto-ocultar si tiene duración
    if (notification.duration && notification.duration > 0) {
      const hideTimer = setTimeout(() => {
        handleClose()
      }, notification.duration)

      return () => clearTimeout(hideTimer)
    }

    return () => clearTimeout(showTimer)
  }, [notification.duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose(notification.id)
    }, 300)
  }

  const getIcon = () => {
    if (notification.icon) return notification.icon
    
    const iconMap = {
      success: faCheckCircle,
      error: faExclamationCircle,
      warning: faExclamationCircle,
      info: faInfoCircle,
      reward: faGift,
      achievement: faTrophy
    }
    
    return iconMap[notification.type] || faBell
  }

  const getTypeStyles = () => {
    const baseStyles = {
      border: '1px solid',
      borderRadius: '12px',
      padding: '1rem',
      margin: '0.5rem',
      maxWidth: '400px',
      minWidth: '300px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
      transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
      opacity: isLeaving ? 0 : 1
    }

    const typeStyles = {
      success: {
        background: 'rgba(34, 197, 94, 0.1)',
        borderColor: '#22c55e',
        color: '#fff'
      },
      error: {
        background: 'rgba(239, 68, 68, 0.1)',
        borderColor: '#ef4444',
        color: '#fff'
      },
      warning: {
        background: 'rgba(245, 158, 11, 0.1)',
        borderColor: '#f59e0b',
        color: '#fff'
      },
      info: {
        background: 'rgba(59, 130, 246, 0.1)',
        borderColor: '#3b82f6',
        color: '#fff'
      },
      reward: {
        background: 'rgba(212, 175, 55, 0.1)',
        borderColor: '#D4AF37',
        color: '#fff'
      },
      achievement: {
        background: 'rgba(168, 85, 247, 0.1)',
        borderColor: '#a855f7',
        color: '#fff'
      }
    }

    return { ...baseStyles, ...typeStyles[notification.type] }
  }

  return (
    <div 
      className={`notification-toast ${position}`}
      style={getTypeStyles()}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: '2rem',
          height: '2rem',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          flexShrink: 0
        }}>
          <FontAwesomeIcon 
            icon={getIcon()} 
            style={{ 
              color: notification.type === 'reward' ? '#D4AF37' : 
                     notification.type === 'achievement' ? '#a855f7' :
                     notification.type === 'success' ? '#22c55e' :
                     notification.type === 'error' ? '#ef4444' :
                     notification.type === 'warning' ? '#f59e0b' : '#3b82f6',
              fontSize: '1rem'
            }} 
          />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ 
            margin: '0 0 0.25rem 0', 
            fontSize: '1rem', 
            fontWeight: '600',
            color: '#fff'
          }}>
            {notification.title}
          </h4>
          <p style={{ 
            margin: 0, 
            fontSize: '0.875rem', 
            color: '#E0E0E0',
            lineHeight: '1.4'
          }}>
            {notification.message}
          </p>
          
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              style={{
                marginTop: '0.5rem',
                padding: '0.25rem 0.75rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              }}
            >
              {notification.action.label}
            </button>
          )}
        </div>

        <button
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#9CA3AF',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: '4px',
            transition: 'all 0.2s ease',
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none'
            e.currentTarget.style.color = '#9CA3AF'
          }}
        >
          <FontAwesomeIcon icon={faTimes} style={{ fontSize: '0.875rem' }} />
        </button>
      </div>

      <style>{`
        .notification-toast {
          position: fixed;
          z-index: 9999;
          animation: slideIn 0.3s ease-out;
        }

        .notification-toast.top-right {
          top: 1rem;
          right: 1rem;
        }

        .notification-toast.top-left {
          top: 1rem;
          left: 1rem;
        }

        .notification-toast.bottom-right {
          bottom: 1rem;
          right: 1rem;
        }

        .notification-toast.bottom-left {
          bottom: 1rem;
          left: 1rem;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .notification-toast {
            max-width: calc(100vw - 2rem);
            min-width: auto;
            margin: 0.5rem;
          }
        }
      `}</style>
    </div>
  )
}

export default NotificationToast
