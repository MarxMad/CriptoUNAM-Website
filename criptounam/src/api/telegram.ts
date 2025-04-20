import axios from 'axios'

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

interface TelegramResponse {
  success: boolean
  error?: string
}

const sendTelegramMessage = async (message: string): Promise<TelegramResponse> => {
  try {
    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID

    if (!botToken) {
      console.error('Error: VITE_TELEGRAM_BOT_TOKEN no está definido')
      throw new Error('Token del bot de Telegram no configurado')
    }

    if (!chatId) {
      console.error('Error: VITE_TELEGRAM_CHAT_ID no está definido')
      throw new Error('Chat ID de Telegram no configurado')
    }

    console.log('Enviando mensaje a Telegram...')
    console.log('Bot Token:', botToken ? 'Definido' : 'No definido')
    console.log('Chat ID:', chatId ? 'Definido' : 'No definido')

    const response = await axios.post(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      }
    )

    if (response.data.ok) {
      console.log('Mensaje enviado exitosamente a Telegram')
      return { success: true }
    } else {
      console.error('Error en la respuesta de Telegram:', response.data)
      throw new Error('Error al enviar el mensaje a Telegram')
    }
  } catch (error) {
    console.error('Error detallado al enviar mensaje a Telegram:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
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

  return await sendTelegramMessage(mensaje)
}

export const handleNewsletterSubscription = async (email: string, source: 'home' | 'newsletter' = 'newsletter'): Promise<TelegramResponse> => {
  const message = source === 'home' 
    ? `
📧 *Nueva Suscripción desde el Home*
----------------------------
✉️ Email: ${email}
📍 Fuente: Página Principal
⏰ Fecha: ${new Date().toLocaleString()}
----------------------------
`
    : `
📧 *Nueva Suscripción desde Newsletter*
----------------------------
✉️ Email: ${email}
📍 Fuente: Página de Newsletter
⏰ Fecha: ${new Date().toLocaleString()}
----------------------------
`

  return await sendTelegramMessage(message)
}

export const handleWalletNotification = async (address: string, provider: string): Promise<TelegramResponse> => {
  const message = `
🔐 *Nueva Wallet Conectada*
----------------------------
💰 Dirección: \`${address}\`
🔧 Proveedor: ${provider}
⏰ Fecha: ${new Date().toLocaleString()}
----------------------------
`

  return await sendTelegramMessage(message)
} 