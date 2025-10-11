// Servicio para manejo de emails
import { createClient } from '@supabase/supabase-js'
import { EmailUtils } from '../utils/email.utils'
import { ValidationUtils } from '../utils/validation.utils'
import { ENV_CONFIG } from '../config/env'

const supabase = createClient(
  ENV_CONFIG.SUPABASE_URL,
  ENV_CONFIG.SUPABASE_ANON_KEY
)

export class EmailService {
  // Agregar suscripción
  static async addSubscription(email: string, preferences: any): Promise<boolean> {
    try {
      // Validar email
      const emailValidation = ValidationUtils.validateEmail(email)
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.error)
      }

      // Validar suscripción
      const subscriptionValidation = ValidationUtils.validateEmailSubscription({
        email,
        preferences
      })
      if (!subscriptionValidation.isValid) {
        throw new Error(subscriptionValidation.error)
      }

      // Insertar en base de datos
      const { data, error } = await supabase
        .from('email_subscriptions')
        .insert({
          email: email.toLowerCase(),
          preferences,
          is_active: true,
          subscribed_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error insertando suscripción:', error)
        return false
      }

      // Enviar email de bienvenida
      const welcomeSent = await EmailUtils.sendWelcomeEmail(email, 'Usuario')
      if (!welcomeSent) {
        console.error('Error enviando email de bienvenida')
      }

      return true
    } catch (error) {
      console.error('Error en addSubscription:', error)
      return false
    }
  }

  // Remover suscripción
  static async removeSubscription(email: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('email_subscriptions')
        .update({
          is_active: false,
          unsubscribed_at: new Date().toISOString()
        })
        .eq('email', email.toLowerCase())

      if (error) {
        console.error('Error removiendo suscripción:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error en removeSubscription:', error)
      return false
    }
  }

  // Obtener suscriptores activos
  static async getActiveSubscribers(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('email_subscriptions')
        .select('email')
        .eq('is_active', true)

      if (error) {
        console.error('Error obteniendo suscriptores:', error)
        return []
      }

      return data?.map(sub => sub.email) || []
    } catch (error) {
      console.error('Error en getActiveSubscribers:', error)
      return []
    }
  }

  // Enviar newsletter a suscriptores
  static async sendNewsletterToSubscribers(newsletter: any): Promise<boolean> {
    try {
      const subscribers = await this.getActiveSubscribers()
      
      if (subscribers.length === 0) {
        console.log('No hay suscriptores activos')
        return true
      }

      // Filtrar suscriptores que quieren newsletter
      const newsletterSubscribers = await this.getNewsletterSubscribers()
      
      const success = await EmailUtils.sendNewsletterNotification(
        newsletterSubscribers,
        newsletter
      )

      return success
    } catch (error) {
      console.error('Error en sendNewsletterToSubscribers:', error)
      return false
    }
  }

  // Obtener suscriptores de newsletter
  static async getNewsletterSubscribers(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('email_subscriptions')
        .select('email')
        .eq('is_active', true)
        .eq('preferences->newsletter', true)

      if (error) {
        console.error('Error obteniendo suscriptores de newsletter:', error)
        return []
      }

      return data?.map(sub => sub.email) || []
    } catch (error) {
      console.error('Error en getNewsletterSubscribers:', error)
      return []
    }
  }

  // Obtener estadísticas de suscripciones
  static async getSubscriptionStats(): Promise<any> {
    try {
      const { data: total, error: totalError } = await supabase
        .from('email_subscriptions')
        .select('*', { count: 'exact' })

      const { data: active, error: activeError } = await supabase
        .from('email_subscriptions')
        .select('*', { count: 'exact' })
        .eq('is_active', true)

      if (totalError || activeError) {
        console.error('Error obteniendo estadísticas:', totalError || activeError)
        return null
      }

      return {
        total: total?.length || 0,
        active: active?.length || 0,
        inactive: (total?.length || 0) - (active?.length || 0)
      }
    } catch (error) {
      console.error('Error en getSubscriptionStats:', error)
      return null
    }
  }

  // Agregar a cola de emails
  static async addToQueue(emailData: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('email_queue')
        .insert({
          to: emailData.to,
          template_id: emailData.templateId,
          variables: emailData.variables,
          status: 'pending',
          attempts: 0,
          max_attempts: 3,
          scheduled_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error agregando a cola:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error en addToQueue:', error)
      return false
    }
  }

  // Procesar cola de emails
  static async processQueue(): Promise<void> {
    try {
      const { data: queue, error } = await supabase
        .from('email_queue')
        .select('*')
        .eq('status', 'pending')
        .lt('attempts', 3)
        .order('scheduled_at', { ascending: true })
        .limit(10)

      if (error) {
        console.error('Error obteniendo cola:', error)
        return
      }

      for (const email of queue || []) {
        try {
          // Procesar email
          const success = await EmailUtils.sendCustomEmail(
            email.to,
            email.subject || 'Notificación',
            email.html || '',
            email.text || ''
          )

          if (success) {
            // Marcar como enviado
            await supabase
              .from('email_queue')
              .update({
                status: 'sent',
                sent_at: new Date().toISOString()
              })
              .eq('id', email.id)
          } else {
            // Incrementar intentos
            await supabase
              .from('email_queue')
              .update({
                attempts: email.attempts + 1,
                status: email.attempts + 1 >= email.max_attempts ? 'failed' : 'retrying'
              })
              .eq('id', email.id)
          }
        } catch (error) {
          console.error('Error procesando email:', error)
        }
      }
    } catch (error) {
      console.error('Error en processQueue:', error)
    }
  }

  // Obtener analytics de email
  static async getEmailAnalytics(emailId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('email_analytics')
        .select('*')
        .eq('email_id', emailId)
        .order('timestamp', { ascending: false })

      if (error) {
        console.error('Error obteniendo analytics:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error en getEmailAnalytics:', error)
      return []
    }
  }
}
