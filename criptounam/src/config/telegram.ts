// Configuración de Telegram
export const TELEGRAM_CONFIG = {
  BOT_TOKEN: '7988985791:AAH6jDjFDkUXomzJT3yFtH05POJRnr1yEsA', // Reemplaza con tu token de bot
  USERNAME: '@gerardoPVela' // Reemplaza con el @usuario de Telegram (ej: @juanperez)
}

// Función para enviar mensajes a Telegram
export const sendTelegramMessage = async (message: string) => {
  try {
    // Primero obtenemos las actualizaciones del bot para encontrar el ID del usuario
    const updatesResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/getUpdates`)
    const updatesData = await updatesResponse.json()

    if (!updatesData.ok) {
      throw new Error('Error al obtener actualizaciones del bot')
    }

    // Buscamos el ID del usuario en las actualizaciones
    const userUpdate = updatesData.result.find((update: any) => 
      update.message?.from?.username === TELEGRAM_CONFIG.USERNAME.replace('@', '')
    )

    if (!userUpdate) {
      throw new Error('No se encontró el usuario en las actualizaciones del bot')
    }

    const userId = userUpdate.message.from.id

    // Enviamos el mensaje usando el ID del usuario
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: userId,
        text: message,
        parse_mode: 'Markdown'
      })
    })

    if (!response.ok) {
      throw new Error('Error al enviar el mensaje')
    }

    return true
  } catch (error) {
    console.error('Error al enviar a Telegram:', error)
    return false
  }
} 