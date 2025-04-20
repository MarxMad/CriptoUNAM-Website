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
  ok: boolean;
  result?: any;
  description?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

export const sendTelegramMessage = async (message: string, chatId: string): Promise<ApiResponse> => {
  try {
    const response = await axios.post<TelegramResponse>(
      `https://api.telegram.org/bot${import.meta.env.VITE_TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      }
    );

    if (response.data.ok) {
      return { success: true, message: 'Mensaje enviado correctamente' };
    } else {
      return { success: false, message: 'Error al enviar el mensaje' };
    }
  } catch (error) {
    console.error('Error al enviar mensaje a Telegram:', error);
    return { success: false, message: 'Error al enviar el mensaje' };
  }
};

export const handleRegistration = async (data: RegistrationData): Promise<ApiResponse> => {
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

  return await sendTelegramMessage(mensaje, data.telegram)
}

export const handleNewsletterSubscription = async (email: string, source: 'home' | 'newsletter' = 'newsletter'): Promise<ApiResponse> => {
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

  return await sendTelegramMessage(message, import.meta.env.VITE_TELEGRAM_CHAT_ID)
}

export const handleWalletNotification = async (address: string, provider: string): Promise<ApiResponse> => {
  const message = `
🔐 *Nueva Wallet Conectada*
----------------------------
💰 Dirección: \`${address}\`
🔧 Proveedor: ${provider}
⏰ Fecha: ${new Date().toLocaleString()}
----------------------------
`

  return await sendTelegramMessage(message, import.meta.env.VITE_TELEGRAM_CHAT_ID)
} 