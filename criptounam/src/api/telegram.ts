import { sendTelegramMessage } from '../config/telegram'

interface RegistrationData {
  nombre: string
  apellidos: string
  carrera: string
  plantel: string
  numeroCuenta: string
  edad: string
  motivacion: string
  twitter: string
  instagram: string
  linkedin: string
  facebook: string
  telegram: string
}

export const handleRegistration = async (data: RegistrationData) => {
  const mensaje = `
🎓 *Nuevo Registro en CriptoUNAM* 🎓

👤 *Información Personal*
• 👨‍🎓 Nombre: ${data.nombre} ${data.apellidos}
• 📅 Edad: ${data.edad}
• 🏛️ Carrera: ${data.carrera} (${data.plantel})
• 🔢 Número de Cuenta: ${data.numeroCuenta}
• 📱 Telegram: ${data.telegram}

💭 *Motivación*
${data.motivacion}

🔗 *Redes Sociales*
• 🐦 Twitter: ${data.twitter || 'No proporcionado'}
• 📸 Instagram: ${data.instagram || 'No proporcionado'}
• 💼 LinkedIn: ${data.linkedin || 'No proporcionado'}
• 👍 Facebook: ${data.facebook || 'No proporcionado'}
  `

  try {
    const success = await sendTelegramMessage(mensaje)
    return { success }
  } catch (error) {
    console.error('Error al enviar a Telegram:', error)
    return { success: false, error: 'Error al enviar a Telegram' }
  }
}

export const handleNewsletterSubscription = async (email: string) => {
  console.log('Preparando mensaje de newsletter para:', email)
  
  const mensaje = `
📧 *Nueva Suscripción al Newsletter* 📧

• ✉️ Email: ${email}

¡Nuevo suscriptor para el newsletter de CriptoUNAM!
  `

  try {
    console.log('Enviando mensaje de newsletter a Telegram...')
    const success = await sendTelegramMessage(mensaje)
    console.log('Resultado del envío del newsletter:', success)
    return { success }
  } catch (error) {
    console.error('Error al enviar suscripción a Telegram:', error)
    return { success: false, error: 'Error al enviar suscripción a Telegram' }
  }
} 