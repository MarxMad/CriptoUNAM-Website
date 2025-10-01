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
    console.log('📱 sendTelegramMessage iniciado:', { message: message.substring(0, 50) + '...', chatId });
    
    // Credenciales hardcodeadas temporalmente para que funcione
    const botToken = '7988985791:AAGEvzxwgDa0ERXoKS1G6J5s8XIhxcywYYM';
    const telegramChatId = '1608242541';
    
    console.log('📱 Credenciales configuradas:', { botToken: 'Configurado', telegramChatId });

    const finalChatId = chatId || telegramChatId;
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    console.log('📱 URL y Chat ID finales:', { url, finalChatId });

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

    console.log('📱 Enviando petición a Telegram...');
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

    console.log('📱 Respuesta de Telegram:', response.data);

    if (response.data.ok) {
      console.log('✅ Mensaje enviado exitosamente');
      return { success: true, message: 'Mensaje enviado correctamente' };
    } else {
      console.error('❌ Error en respuesta de Telegram:', response.data);
      return { 
        success: false, 
        message: response.data.description || 'Error al enviar el mensaje a Telegram' 
      };
    }
  } catch (error: any) {
    if (error.response) {
      // Error de respuesta HTTP
      const errorMessage = error.response?.data?.description || error.message || 'Error de respuesta del servidor';
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