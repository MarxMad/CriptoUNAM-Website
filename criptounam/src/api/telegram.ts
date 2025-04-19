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
📝 *Nuevo Registro en CriptoUNAM*:

👤 *Información Personal*
• Nombre: ${data.nombre} ${data.apellidos}
• Edad: ${data.edad}
• Carrera: ${data.carrera} (${data.plantel})
• Número de Cuenta: ${data.numeroCuenta}
• Telegram: ${data.telegram}

💭 *Motivación*
${data.motivacion}

🔗 *Redes Sociales*
• Twitter: ${data.twitter || 'No proporcionado'}
• Instagram: ${data.instagram || 'No proporcionado'}
• LinkedIn: ${data.linkedin || 'No proporcionado'}
• Facebook: ${data.facebook || 'No proporcionado'}
  `

  try {
    const success = await sendTelegramMessage(mensaje)
    return { success }
  } catch (error) {
    console.error('Error al enviar a Telegram:', error)
    return { success: false, error: 'Error al enviar a Telegram' }
  }
} 