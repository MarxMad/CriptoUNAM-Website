// Rutas de API para sistema de emails
import { Router } from 'express'
import { EmailUtils } from '../utils/email.utils'
import { ValidationUtils } from '../utils/validation.utils'
import { authenticateToken, validateEmail } from '../middleware/auth.middleware'

const router = Router()

// Suscribir email
router.post('/subscribe', validateEmail, async (req, res) => {
  try {
    const { email, preferences } = req.body

    // Validar preferencias
    const subscriptionValidation = ValidationUtils.validateEmailSubscription({
      email,
      preferences
    })

    if (!subscriptionValidation.isValid) {
      return res.status(400).json({ error: subscriptionValidation.error })
    }

    // Enviar email de bienvenida
    const welcomeSent = await EmailUtils.sendWelcomeEmail(email, 'Usuario')
    
    if (!welcomeSent) {
      console.error('Error enviando email de bienvenida')
    }

    // Aquí se guardaría en la base de datos
    // const subscription = await emailService.addSubscription(email, preferences)

    res.json({ 
      success: true, 
      message: 'Suscripción exitosa',
      welcomeSent 
    })
  } catch (error) {
    console.error('Error en suscripción:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Desuscribir email
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email, token } = req.body

    if (!email && !token) {
      return res.status(400).json({ error: 'Email o token requerido' })
    }

    // Si hay token, verificar
    if (token) {
      const { email: tokenEmail, valid } = EmailUtils.verifyUnsubscribeToken(token)
      if (!valid) {
        return res.status(400).json({ error: 'Token inválido' })
      }
      // Usar email del token
    }

    // Aquí se procesaría la desuscripción
    // await emailService.removeSubscription(email || tokenEmail)

    res.json({ 
      success: true, 
      message: 'Desuscripción exitosa' 
    })
  } catch (error) {
    console.error('Error en desuscripción:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Enviar newsletter
router.post('/newsletter', authenticateToken, async (req, res) => {
  try {
    const { title, content, excerpt, author, tags } = req.body

    // Validar newsletter
    const newsletterValidation = ValidationUtils.validateNewsletter({
      title,
      content,
      excerpt,
      author,
      tags
    })

    if (!newsletterValidation.isValid) {
      return res.status(400).json({ error: newsletterValidation.error })
    }

    // Obtener suscriptores (simulado)
    const subscribers = ['test@example.com', 'user@example.com']

    // Enviar notificación
    const notificationSent = await EmailUtils.sendNewsletterNotification(
      subscribers,
      { title, excerpt, author, id: 'newsletter-id' }
    )

    if (!notificationSent) {
      console.error('Error enviando notificación de newsletter')
    }

    res.json({ 
      success: true, 
      message: 'Newsletter enviado',
      subscribers: subscribers.length,
      notificationSent 
    })
  } catch (error) {
    console.error('Error enviando newsletter:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Obtener analytics de email
router.get('/analytics/:emailId', authenticateToken, async (req, res) => {
  try {
    const { emailId } = req.params

    // Simular analytics
    const analytics = [
      {
        id: '1',
        emailId,
        event: 'sent',
        timestamp: new Date().toISOString(),
        metadata: { status: 'delivered' }
      },
      {
        id: '2',
        emailId,
        event: 'opened',
        timestamp: new Date().toISOString(),
        metadata: { userAgent: 'Mozilla/5.0' }
      }
    ]

    res.json(analytics)
  } catch (error) {
    console.error('Error obteniendo analytics:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Obtener suscriptores
router.get('/subscribers', authenticateToken, async (req, res) => {
  try {
    // Simular lista de suscriptores
    const subscribers = [
      {
        id: '1',
        email: 'test@example.com',
        isActive: true,
        subscribedAt: new Date().toISOString(),
        preferences: {
          newsletter: true,
          notifications: true,
          updates: false,
          events: false,
          promotions: false
        }
      }
    ]

    res.json(subscribers)
  } catch (error) {
    console.error('Error obteniendo suscriptores:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Enviar email personalizado
router.post('/send', authenticateToken, async (req, res) => {
  try {
    const { to, subject, html, text } = req.body

    if (!to || !subject || !html || !text) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' })
    }

    const emailSent = await EmailUtils.sendCustomEmail(to, subject, html, text)

    if (!emailSent) {
      return res.status(500).json({ error: 'Error enviando email' })
    }

    res.json({ 
      success: true, 
      message: 'Email enviado exitosamente' 
    })
  } catch (error) {
    console.error('Error enviando email personalizado:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

export default router
