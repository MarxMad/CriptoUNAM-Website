// Componente para suscripción de emails
import React, { useState } from 'react'
import { useEmailContext } from '../../context/EmailContext'
import { ValidationUtils } from '../../utils/validation.utils'

interface EmailSubscriptionProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export const EmailSubscription: React.FC<EmailSubscriptionProps> = ({ 
  onSuccess, 
  onError 
}) => {
  const { state, addSubscription } = useEmailContext()
  const [email, setEmail] = useState('')
  const [preferences, setPreferences] = useState({
    newsletter: true,
    notifications: true,
    updates: true,
    events: false,
    promotions: false
  })
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    // Validar email
    const emailValidation = ValidationUtils.validateEmail(email)
    if (!emailValidation.isValid) {
      setLocalError(emailValidation.error!)
      onError?.(emailValidation.error!)
      return
    }

    // Validar suscripción
    const subscriptionValidation = ValidationUtils.validateEmailSubscription({
      email,
      preferences
    })
    if (!subscriptionValidation.isValid) {
      setLocalError(subscriptionValidation.error!)
      onError?.(subscriptionValidation.error!)
      return
    }

    const success = await addSubscription(email, preferences)
    if (success) {
      setEmail('')
      onSuccess?.()
    } else {
      const error = state.error || 'Error al suscribirse'
      setLocalError(error)
      onError?.(error)
    }
  }

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className="email-subscription">
      <div className="subscription-header">
        <h3>📧 Suscríbete a nuestro Newsletter</h3>
        <p>Recibe las últimas noticias sobre blockchain y Web3</p>
      </div>

      <form onSubmit={handleSubmit} className="subscription-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            disabled={state.isLoading}
          />
        </div>

        <div className="preferences-section">
          <h4>Preferencias de notificación</h4>
          <div className="preferences-grid">
            <label className="preference-item">
              <input
                type="checkbox"
                checked={preferences.newsletter}
                onChange={(e) => handlePreferenceChange('newsletter', e.target.checked)}
              />
              <span>📰 Newsletter semanal</span>
            </label>
            <label className="preference-item">
              <input
                type="checkbox"
                checked={preferences.notifications}
                onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
              />
              <span>🔔 Notificaciones importantes</span>
            </label>
            <label className="preference-item">
              <input
                type="checkbox"
                checked={preferences.updates}
                onChange={(e) => handlePreferenceChange('updates', e.target.checked)}
              />
              <span>🔄 Actualizaciones de la plataforma</span>
            </label>
            <label className="preference-item">
              <input
                type="checkbox"
                checked={preferences.events}
                onChange={(e) => handlePreferenceChange('events', e.target.checked)}
              />
              <span>🎉 Eventos y webinars</span>
            </label>
            <label className="preference-item">
              <input
                type="checkbox"
                checked={preferences.promotions}
                onChange={(e) => handlePreferenceChange('promotions', e.target.checked)}
              />
              <span>🎁 Promociones especiales</span>
            </label>
          </div>
        </div>

        {(localError || state.error) && (
          <div className="error-message">
            {localError || state.error}
          </div>
        )}

        {state.success && (
          <div className="success-message">
            ¡Suscripción exitosa! Revisa tu email para confirmar.
          </div>
        )}

        <button 
          type="submit" 
          className="subscribe-button"
          disabled={state.isLoading}
        >
          {state.isLoading ? 'Suscribiendo...' : 'Suscribirse'}
        </button>
      </form>

        <style>{`
        .email-subscription {
          max-width: 500px;
          margin: 0 auto;
          padding: 2rem;
          background: rgba(26, 26, 26, 0.9);
          border-radius: 16px;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .subscription-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .subscription-header h3 {
          color: #D4AF37;
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
        }

        .subscription-header p {
          color: #E0E0E0;
          margin: 0;
        }

        .subscription-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          color: #D4AF37;
          font-weight: 600;
        }

        .form-group input {
          padding: 12px;
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 8px;
          background: rgba(26, 26, 26, 0.8);
          color: #fff;
          font-size: 1rem;
        }

        .form-group input:focus {
          outline: none;
          border-color: #D4AF37;
        }

        .preferences-section h4 {
          color: #D4AF37;
          margin: 0 0 1rem 0;
        }

        .preferences-grid {
          display: grid;
          gap: 0.75rem;
        }

        .preference-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #E0E0E0;
          cursor: pointer;
        }

        .preference-item input[type="checkbox"] {
          width: 18px;
          height: 18px;
          accent-color: #D4AF37;
        }

        .error-message {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
          padding: 12px;
          border-radius: 8px;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .success-message {
          color: #22c55e;
          background: rgba(34, 197, 94, 0.1);
          padding: 12px;
          border-radius: 8px;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .subscribe-button {
          background: linear-gradient(135deg, #D4AF37, #FFD700);
          color: #000;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .subscribe-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
        }

        .subscribe-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}
