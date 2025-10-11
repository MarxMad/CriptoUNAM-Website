// Hook personalizado para manejo de emails
import { useState, useEffect, useCallback } from 'react'
import { EmailUtils } from '../utils/email.utils'

export interface UseEmailReturn {
  sendWelcomeEmail: (email: string, name: string) => Promise<boolean>
  sendNewsletterNotification: (subscribers: string[], newsletter: any) => Promise<boolean>
  sendCustomEmail: (to: string, subject: string, html: string, text: string) => Promise<boolean>
  isSending: boolean
  error: string | null
  success: boolean
}

export const useEmail = (): UseEmailReturn => {
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleEmailAction = useCallback(async (action: () => Promise<boolean>) => {
    setIsSending(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await action()
      setSuccess(result)
      if (!result) {
        setError('Error al enviar email')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setSuccess(false)
    } finally {
      setIsSending(false)
    }
  }, [])

  const sendWelcomeEmail = useCallback(async (email: string, name: string): Promise<boolean> => {
    return new Promise((resolve) => {
      handleEmailAction(async () => {
        const result = await EmailUtils.sendWelcomeEmail(email, name)
        resolve(result)
        return result
      })
    })
  }, [handleEmailAction])

  const sendNewsletterNotification = useCallback(async (
    subscribers: string[], 
    newsletter: any
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      handleEmailAction(async () => {
        const result = await EmailUtils.sendNewsletterNotification(subscribers, newsletter)
        resolve(result)
        return result
      })
    })
  }, [handleEmailAction])

  const sendCustomEmail = useCallback(async (
    to: string, 
    subject: string, 
    html: string, 
    text: string
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      handleEmailAction(async () => {
        const result = await EmailUtils.sendCustomEmail(to, subject, html, text)
        resolve(result)
        return result
      })
    })
  }, [handleEmailAction])

  // Limpiar estados después de un tiempo
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(false)
        setError(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [success, error])

  return {
    sendWelcomeEmail,
    sendNewsletterNotification,
    sendCustomEmail,
    isSending,
    error,
    success
  }
}
