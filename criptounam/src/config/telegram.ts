// Configuración de Telegram
export const TELEGRAM_CONFIG = {
  BOT_TOKEN: '7988985791:AAH6jDjFDkUXomzJT3yFtH05POJRnr1yEsA', // Reemplaza con tu token de bot
  CHAT_ID: '1608242541' // ID del chat donde se enviarán los mensajes
}

// Función para enviar mensajes a Telegram
export const sendTelegramMessage = async (message: string) => {
  console.log('Enviando mensaje a Telegram...')
  console.log('Mensaje:', message)
  console.log('Usando CHAT_ID:', TELEGRAM_CONFIG.CHAT_ID)
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CONFIG.CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    })

    console.log('Respuesta de Telegram:', response.status)
    const data = await response.json()
    console.log('Datos de respuesta:', data)

    if (!response.ok) {
      console.error('Error en la respuesta:', data)
      throw new Error('Error al enviar el mensaje')
    }

    return true
  } catch (error) {
    console.error('Error al enviar a Telegram:', error)
    return false
  }
} 