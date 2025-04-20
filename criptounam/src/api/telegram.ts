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

    // Log para debugging en producción
    console.log('Intentando enviar mensaje a Telegram...');
    console.log('Bot Token presente:', !!botToken);
    console.log('Chat ID proporcionado:', chatId);
    console.log('Chat ID de variables de entorno:', telegramChatId);

    if (!botToken) {
      console.error('Error: VITE_TELEGRAM_BOT_TOKEN no está definido');
      return { success: false, message: 'Token del bot de Telegram no configurado' };
    }

    if (!chatId && !telegramChatId) {
      console.error('Error: No se proporcionó un chat ID válido');
      return { success: false, message: 'Chat ID de Telegram no configurado' };
    }

    const finalChatId = chatId || telegramChatId;
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    console.log('URL de la API:', url);
    console.log('Chat ID final:', finalChatId);

    const response = await axios.post<TelegramResponse>(
      url,
      {
        chat_id: finalChatId,
        text: message,
        parse_mode: 'HTML'
      }
    );

    console.log('Respuesta de Telegram:', response.data);

    if (response.data.ok) {
      return { success: true, message: 'Mensaje enviado correctamente' };
    } else {
      console.error('Error en la respuesta de Telegram:', response.data);
      return { success: false, message: response.data.description || 'Error al enviar el mensaje' };
    }
  } catch (error) {
    console.error('Error al enviar mensaje a Telegram:', error);
    if (axios.isAxiosError(error)) {
      console.error('Detalles del error Axios:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      return { 
        success: false, 
        message: error.response?.data?.description || 'Error al enviar el mensaje' 
      };
    }
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