// Servicio de Resend para envío de emails
import { Resend } from 'resend'
import { ENV_CONFIG } from '../config/env'

const resend = new Resend(ENV_CONFIG.RESEND_API_KEY)

export class ResendService {
  // Enviar email de bienvenida
  static async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    try {
      const { data, error } = await resend.emails.send({
        from: ENV_CONFIG.RESEND_FROM_EMAIL,
        to: [email],
        subject: '¡Bienvenido a CriptoUNAM! 🚀',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #fff;">
            <div style="background: linear-gradient(135deg, #D4AF37, #FFD700); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: #000; margin: 0; font-size: 2rem; font-weight: bold;">¡Bienvenido a CriptoUNAM!</h1>
            </div>
            <div style="padding: 40px; background: #2a2a3e;">
              <h2 style="color: #D4AF37; margin: 0 0 20px 0;">¡Hola ${name}!</h2>
              <p style="color: #E0E0E0; line-height: 1.6; margin: 0 0 20px 0;">
                Gracias por unirte a nuestra comunidad blockchain. Estamos emocionados de tenerte aquí.
              </p>
              <p style="color: #E0E0E0; line-height: 1.6; margin: 0 0 30px 0;">
                Con tu suscripción, recibirás:
              </p>
              <ul style="color: #E0E0E0; line-height: 1.8; margin: 0 0 30px 0; padding-left: 20px;">
                <li>📧 Notificaciones de nuevos artículos</li>
                <li>🎓 Actualizaciones de cursos</li>
                <li>🚀 Eventos exclusivos</li>
                <li>💰 Recompensas $PUMA</li>
              </ul>
              <div style="text-align: center; margin: 40px 0;">
                <a href="${ENV_CONFIG.APP_URL}/newsletter" 
                   style="background: linear-gradient(135deg, #D4AF37, #FFD700); color: #000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Ver Newsletter
                </a>
              </div>
            </div>
            <div style="background: #1a1a2e; color: #888; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #333;">
              <p style="margin: 0; font-size: 14px;">
                Si no deseas recibir estos emails, puedes 
                <a href="${ENV_CONFIG.APP_URL}/unsubscribe?token=${this.generateUnsubscribeToken(email)}" 
                   style="color: #D4AF37; text-decoration: none;">desuscribirte aquí</a>
              </p>
            </div>
          </div>
        `,
        text: `
          ¡Bienvenido a CriptoUNAM!
          
          Hola ${name},
          
          Gracias por unirte a nuestra comunidad blockchain. Estamos emocionados de tenerte aquí.
          
          Con tu suscripción, recibirás:
          - Notificaciones de nuevos artículos
          - Actualizaciones de cursos
          - Eventos exclusivos
          - Recompensas $PUMA
          
          Visita: ${ENV_CONFIG.APP_URL}/newsletter
          
          Si no deseas recibir estos emails, puedes desuscribirte aquí:
          ${ENV_CONFIG.APP_URL}/unsubscribe?token=${this.generateUnsubscribeToken(email)}
        `
      })

      if (error) {
        console.error('Error enviando email de bienvenida:', error)
        return false
      }

      console.log('Email de bienvenida enviado:', data)
      return true
    } catch (error) {
      console.error('Error en sendWelcomeEmail:', error)
      return false
    }
  }

  // Enviar notificación de newsletter
  static async sendNewsletterNotification(
    subscribers: string[], 
    newsletter: { title: string; excerpt: string; author: string; id: string }
  ): Promise<boolean> {
    try {
      if (subscribers.length === 0) {
        console.log('No hay suscriptores para enviar')
        return true
      }

      const { data, error } = await resend.emails.send({
        from: ENV_CONFIG.RESEND_FROM_EMAIL,
        to: subscribers,
        subject: `📰 Nueva entrada: ${newsletter.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #fff;">
            <div style="background: linear-gradient(135deg, #D4AF37, #FFD700); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: #000; margin: 0; font-size: 1.8rem; font-weight: bold;">📰 Nueva Entrada en CriptoUNAM</h1>
            </div>
            <div style="padding: 40px; background: #2a2a3e;">
              <h2 style="color: #D4AF37; margin: 0 0 15px 0; font-size: 1.5rem;">${newsletter.title}</h2>
              <p style="color: #888; margin: 0 0 20px 0; font-size: 1rem;"><strong>Por:</strong> ${newsletter.author}</p>
              <p style="color: #E0E0E0; line-height: 1.6; margin: 0 0 30px 0; font-size: 1.1rem;">${newsletter.excerpt}</p>
              <div style="text-align: center; margin: 40px 0;">
                <a href="${ENV_CONFIG.APP_URL}/newsletter/${newsletter.id}" 
                   style="background: linear-gradient(135deg, #D4AF37, #FFD700); color: #000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Leer Artículo Completo
                </a>
              </div>
            </div>
            <div style="background: #1a1a2e; color: #888; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; border-top: 1px solid #333;">
              <p style="margin: 0; font-size: 14px;">
                Si no deseas recibir estos emails, puedes 
                <a href="${ENV_CONFIG.APP_URL}/unsubscribe" style="color: #D4AF37; text-decoration: none;">desuscribirte aquí</a>
              </p>
            </div>
          </div>
        `,
        text: `
          Nueva Entrada en CriptoUNAM
          
          ${newsletter.title}
          Por: ${newsletter.author}
          
          ${newsletter.excerpt}
          
          Leer artículo completo: ${ENV_CONFIG.APP_URL}/newsletter/${newsletter.id}
          
          Si no deseas recibir estos emails, puedes desuscribirte aquí:
          ${ENV_CONFIG.APP_URL}/unsubscribe
        `
      })

      if (error) {
        console.error('Error enviando notificación de newsletter:', error)
        return false
      }

      console.log('Notificación de newsletter enviada:', data)
      return true
    } catch (error) {
      console.error('Error en sendNewsletterNotification:', error)
      return false
    }
  }

  // Enviar email personalizado
  static async sendCustomEmail(
    to: string, 
    subject: string, 
    html: string, 
    text: string
  ): Promise<boolean> {
    try {
      const { data, error } = await resend.emails.send({
        from: ENV_CONFIG.RESEND_FROM_EMAIL,
        to: [to],
        subject,
        html,
        text
      })

      if (error) {
        console.error('Error enviando email personalizado:', error)
        return false
      }

      console.log('Email personalizado enviado:', data)
      return true
    } catch (error) {
      console.error('Error en sendCustomEmail:', error)
      return false
    }
  }

  // Enviar email masivo
  static async sendBulkEmail(
    recipients: string[],
    subject: string,
    html: string,
    text: string
  ): Promise<boolean> {
    try {
      const batchSize = 50 // Resend permite hasta 50 emails por lote
      const batches = []
      
      for (let i = 0; i < recipients.length; i += batchSize) {
        batches.push(recipients.slice(i, i + batchSize))
      }

      for (const batch of batches) {
        const { data, error } = await resend.emails.send({
          from: ENV_CONFIG.RESEND_FROM_EMAIL,
          to: batch,
          subject,
          html,
          text
        })

        if (error) {
          console.error('Error enviando lote:', error)
          return false
        }

        console.log(`Lote enviado: ${batch.length} emails`)
      }

      return true
    } catch (error) {
      console.error('Error en sendBulkEmail:', error)
      return false
    }
  }

  // Generar token de desuscripción
  static generateUnsubscribeToken(email: string): string {
    const timestamp = Date.now().toString()
    const randomString = Math.random().toString(36).substring(2)
    return Buffer.from(`${email}:${timestamp}:${randomString}`).toString('base64')
  }

  // Verificar token de desuscripción
  static verifyUnsubscribeToken(token: string): { email: string; valid: boolean } {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8')
      const [email, timestamp, randomString] = decoded.split(':')
      
      // Verificar que el token no sea muy antiguo (30 días)
      const tokenAge = Date.now() - parseInt(timestamp)
      const maxAge = 30 * 24 * 60 * 60 * 1000 // 30 días en ms
      
      if (tokenAge > maxAge) {
        return { email: '', valid: false }
      }
      
      return { email, valid: true }
    } catch (error) {
      return { email: '', valid: false }
    }
  }

  // Obtener estado de entrega
  static async getDeliveryStatus(emailId: string): Promise<string> {
    try {
      // Resend no proporciona API para obtener estado de entrega
      // Esto sería implementado con webhooks
      return 'delivered'
    } catch (error) {
      console.error('Error obteniendo estado de entrega:', error)
      return 'unknown'
    }
  }
}
