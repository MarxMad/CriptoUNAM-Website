// Utilidades para el sistema de emails
import { Resend } from 'resend'
import { ENV_CONFIG } from '../config/env'

const resend = new Resend(ENV_CONFIG.RESEND_API_KEY)

export class EmailUtils {
  // Validar formato de email
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Limpiar lista de emails
  static cleanEmailList(emails: string[]): string[] {
    return emails
      .map(email => email.trim().toLowerCase())
      .filter(email => this.validateEmail(email))
      .filter((email, index, array) => array.indexOf(email) === index) // Remove duplicates
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

  // Enviar email de bienvenida
  static async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    try {
      const { data, error } = await resend.emails.send({
        from: ENV_CONFIG.RESEND_FROM_EMAIL,
        to: [email],
        subject: '¡Bienvenido a CriptoUNAM! 🚀',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #D4AF37, #FFD700); padding: 20px; text-align: center;">
              <h1 style="color: #000; margin: 0;">¡Bienvenido a CriptoUNAM!</h1>
            </div>
            <div style="padding: 30px; background: #f8f9fa;">
              <h2>¡Hola ${name}!</h2>
              <p>Gracias por unirte a nuestra comunidad blockchain. Estamos emocionados de tenerte aquí.</p>
              <p>Con tu suscripción, recibirás:</p>
              <ul>
                <li>📧 Notificaciones de nuevos artículos</li>
                <li>🎓 Actualizaciones de cursos</li>
                <li>🚀 Eventos exclusivos</li>
                <li>💰 Recompensas $PUMA</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${ENV_CONFIG.APP_URL}/newsletter" 
                   style="background: #D4AF37; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                  Ver Newsletter
                </a>
              </div>
            </div>
            <div style="background: #2a2a3e; color: #fff; padding: 20px; text-align: center;">
              <p style="margin: 0; font-size: 14px;">
                Si no deseas recibir estos emails, puedes 
                <a href="${ENV_CONFIG.APP_URL}/unsubscribe?token=${this.generateUnsubscribeToken(email)}" 
                   style="color: #D4AF37;">desuscribirte aquí</a>
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

  // Enviar notificación de nueva newsletter
  static async sendNewsletterNotification(
    subscribers: string[], 
    newsletter: { title: string; excerpt: string; author: string; id: string }
  ): Promise<boolean> {
    try {
      const { data, error } = await resend.emails.send({
        from: ENV_CONFIG.RESEND_FROM_EMAIL,
        to: subscribers,
        subject: `📰 Nueva entrada: ${newsletter.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #D4AF37, #FFD700); padding: 20px; text-align: center;">
              <h1 style="color: #000; margin: 0;">📰 Nueva Entrada en CriptoUNAM</h1>
            </div>
            <div style="padding: 30px; background: #f8f9fa;">
              <h2>${newsletter.title}</h2>
              <p><strong>Por:</strong> ${newsletter.author}</p>
              <p>${newsletter.excerpt}</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${ENV_CONFIG.APP_URL}/newsletter/${newsletter.id}" 
                   style="background: #D4AF37; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                  Leer Artículo Completo
                </a>
              </div>
            </div>
            <div style="background: #2a2a3e; color: #fff; padding: 20px; text-align: center;">
              <p style="margin: 0; font-size: 14px;">
                Si no deseas recibir estos emails, puedes 
                <a href="${ENV_CONFIG.APP_URL}/unsubscribe" style="color: #D4AF37;">desuscribirte aquí</a>
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

  // Procesar cola de emails
  static async processEmailQueue(queue: any[]): Promise<void> {
    for (const email of queue) {
      try {
        const success = await this.sendCustomEmail(
          email.to,
          email.subject,
          email.html,
          email.text
        )
        
        if (success) {
          console.log(`Email enviado exitosamente a ${email.to}`)
        } else {
          console.error(`Error enviando email a ${email.to}`)
        }
      } catch (error) {
        console.error(`Error procesando email para ${email.to}:`, error)
      }
    }
  }

  // Generar plantilla HTML base
  static generateBaseTemplate(content: string, title: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background: #fff;">
            <div style="background: linear-gradient(135deg, #D4AF37, #FFD700); padding: 20px; text-align: center;">
              <h1 style="color: #000; margin: 0; font-size: 24px;">CriptoUNAM</h1>
            </div>
            <div style="padding: 30px;">
              ${content}
            </div>
            <div style="background: #2a2a3e; color: #fff; padding: 20px; text-align: center; font-size: 14px;">
              <p style="margin: 0;">
                © 2024 CriptoUNAM. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </body>
      </html>
    `
  }
}
