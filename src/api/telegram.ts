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
    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const telegramChatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

    // Validaciones de entorno
    if (!botToken) {
      console.error('Error: VITE_TELEGRAM_BOT_TOKEN no está definido en el entorno');
      return { success: false, message: 'Error de configuración: Token del bot no encontrado' };
    }

    if (!chatId && !telegramChatId) {
      console.error('Error: No se encontró un chat ID válido');
      return { success: false, message: 'Error de configuración: Chat ID no encontrado' };
    }

    const finalChatId = chatId || telegramChatId;
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    // Validación de la URL
    if (!url.startsWith('https://api.telegram.org/bot')) {
      console.error('Error: URL de Telegram inválida');
      return { success: false, message: 'Error de configuración: URL inválida' };
    }

    // Validación del mensaje
    if (!message || message.trim().length === 0) {
      console.error('Error: Mensaje vacío');
      return { success: false, message: 'Error: El mensaje no puede estar vacío' };
    }

    const response = await axios.post<TelegramResponse>(
      url,
      {
        chat_id: finalChatId,
        text: message,
        parse_mode: 'HTML'
      },
      {
        timeout: 10000, // 10 segundos de timeout
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.ok) {
      return { success: true, message: 'Mensaje enviado correctamente' };
    } else {
      console.error('Error en la respuesta de Telegram:', response.data);
      return { 
        success: false, 
        message: response.data.description || 'Error al enviar el mensaje a Telegram' 
      };
    }
  } catch (error) {
    console.error('Error al enviar mensaje a Telegram:', error);
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.description || error.message;
      console.error('Detalles del error:', {
        status: error.response?.status,
        message: errorMessage,
        url: error.config?.url
      });
      return { 
        success: false, 
        message: `Error al enviar el mensaje: ${errorMessage}` 
      };
    }
    return { 
      success: false, 
      message: 'Error inesperado al enviar el mensaje' 
    };
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

  return await sendTelegramMessage(mensaje, import.meta.env.VITE_TELEGRAM_CHAT_ID)
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