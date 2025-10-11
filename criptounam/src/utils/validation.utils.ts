// Utilidades de validación para el sistema
export class ValidationUtils {
  // Validar email
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    if (!email) {
      return { isValid: false, error: 'Email es requerido' }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Formato de email inválido' }
    }

    if (email.length > 254) {
      return { isValid: false, error: 'Email demasiado largo' }
    }

    return { isValid: true }
  }

  // Validar transacción PUMA
  static validatePumaTransaction(data: {
    amount: number
    type: string
    description: string
    category: string
  }): { isValid: boolean; error?: string } {
    if (!data.amount || typeof data.amount !== 'number' || data.amount <= 0) {
      return { isValid: false, error: 'Cantidad debe ser un número positivo' }
    }

    if (data.amount > 1000000) {
      return { isValid: false, error: 'Cantidad excede el límite máximo' }
    }

    if (!data.type || !['earn', 'spend', 'transfer', 'reward'].includes(data.type)) {
      return { isValid: false, error: 'Tipo de transacción inválido' }
    }

    if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
      return { isValid: false, error: 'Descripción es requerida' }
    }

    if (data.description.length > 500) {
      return { isValid: false, error: 'Descripción demasiado larga' }
    }

    if (!data.category || typeof data.category !== 'string' || data.category.trim().length === 0) {
      return { isValid: false, error: 'Categoría es requerida' }
    }

    return { isValid: true }
  }

  // Validar like
  static validateLike(data: {
    userId: string
    newsletterId: string
  }): { isValid: boolean; error?: string } {
    if (!data.userId || typeof data.userId !== 'string' || data.userId.trim().length === 0) {
      return { isValid: false, error: 'ID de usuario es requerido' }
    }

    if (!data.newsletterId || typeof data.newsletterId !== 'string' || data.newsletterId.trim().length === 0) {
      return { isValid: false, error: 'ID de newsletter es requerido' }
    }

    // Validar formato UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(data.userId)) {
      return { isValid: false, error: 'ID de usuario inválido' }
    }

    if (!uuidRegex.test(data.newsletterId)) {
      return { isValid: false, error: 'ID de newsletter inválido' }
    }

    return { isValid: true }
  }

  // Validar newsletter
  static validateNewsletter(data: {
    title: string
    content: string
    excerpt: string
    author: string
    tags?: string[]
  }): { isValid: boolean; error?: string } {
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      return { isValid: false, error: 'Título es requerido' }
    }

    if (data.title.length > 200) {
      return { isValid: false, error: 'Título demasiado largo' }
    }

    if (!data.content || typeof data.content !== 'string' || data.content.trim().length === 0) {
      return { isValid: false, error: 'Contenido es requerido' }
    }

    if (data.content.length < 100) {
      return { isValid: false, error: 'Contenido demasiado corto' }
    }

    if (data.content.length > 50000) {
      return { isValid: false, error: 'Contenido demasiado largo' }
    }

    if (!data.excerpt || typeof data.excerpt !== 'string' || data.excerpt.trim().length === 0) {
      return { isValid: false, error: 'Resumen es requerido' }
    }

    if (data.excerpt.length > 500) {
      return { isValid: false, error: 'Resumen demasiado largo' }
    }

    if (!data.author || typeof data.author !== 'string' || data.author.trim().length === 0) {
      return { isValid: false, error: 'Autor es requerido' }
    }

    if (data.author.length > 100) {
      return { isValid: false, error: 'Nombre de autor demasiado largo' }
    }

    if (data.tags && Array.isArray(data.tags)) {
      if (data.tags.length > 10) {
        return { isValid: false, error: 'Demasiadas etiquetas' }
      }

      for (const tag of data.tags) {
        if (typeof tag !== 'string' || tag.trim().length === 0) {
          return { isValid: false, error: 'Etiqueta inválida' }
        }
        if (tag.length > 50) {
          return { isValid: false, error: 'Etiqueta demasiado larga' }
        }
      }
    }

    return { isValid: true }
  }

  // Validar misión PUMA
  static validateMission(data: {
    title: string
    description: string
    reward: number
    requirements: any[]
    isActive: boolean
  }): { isValid: boolean; error?: string } {
    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      return { isValid: false, error: 'Título de misión es requerido' }
    }

    if (data.title.length > 200) {
      return { isValid: false, error: 'Título de misión demasiado largo' }
    }

    if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
      return { isValid: false, error: 'Descripción de misión es requerida' }
    }

    if (data.description.length > 1000) {
      return { isValid: false, error: 'Descripción de misión demasiado larga' }
    }

    if (!data.reward || typeof data.reward !== 'number' || data.reward <= 0) {
      return { isValid: false, error: 'Recompensa debe ser un número positivo' }
    }

    if (data.reward > 10000) {
      return { isValid: false, error: 'Recompensa excede el límite máximo' }
    }

    if (!Array.isArray(data.requirements)) {
      return { isValid: false, error: 'Requisitos deben ser un array' }
    }

    if (data.requirements.length === 0) {
      return { isValid: false, error: 'Al menos un requisito es requerido' }
    }

    if (data.requirements.length > 10) {
      return { isValid: false, error: 'Demasiados requisitos' }
    }

    for (const req of data.requirements) {
      if (!req.type || !['like', 'newsletter', 'referral', 'time', 'custom'].includes(req.type)) {
        return { isValid: false, error: 'Tipo de requisito inválido' }
      }
      if (!req.target || typeof req.target !== 'number' || req.target <= 0) {
        return { isValid: false, error: 'Objetivo de requisito inválido' }
      }
    }

    return { isValid: true }
  }

  // Validar suscripción de email
  static validateEmailSubscription(data: {
    email: string
    preferences: {
      newsletter: boolean
      notifications: boolean
      updates: boolean
      events: boolean
      promotions: boolean
    }
  }): { isValid: boolean; error?: string } {
    const emailValidation = this.validateEmail(data.email)
    if (!emailValidation.isValid) {
      return emailValidation
    }

    if (!data.preferences || typeof data.preferences !== 'object') {
      return { isValid: false, error: 'Preferencias son requeridas' }
    }

    const requiredPreferences = ['newsletter', 'notifications', 'updates', 'events', 'promotions']
    for (const pref of requiredPreferences) {
      if (typeof data.preferences[pref as keyof typeof data.preferences] !== 'boolean') {
        return { isValid: false, error: `Preferencia ${pref} debe ser un booleano` }
      }
    }

    return { isValid: true }
  }

  // Validar plantilla de email
  static validateEmailTemplate(data: {
    name: string
    subject: string
    html: string
    text: string
    variables: string[]
  }): { isValid: boolean; error?: string } {
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      return { isValid: false, error: 'Nombre de plantilla es requerido' }
    }

    if (data.name.length > 100) {
      return { isValid: false, error: 'Nombre de plantilla demasiado largo' }
    }

    if (!data.subject || typeof data.subject !== 'string' || data.subject.trim().length === 0) {
      return { isValid: false, error: 'Asunto es requerido' }
    }

    if (data.subject.length > 200) {
      return { isValid: false, error: 'Asunto demasiado largo' }
    }

    if (!data.html || typeof data.html !== 'string' || data.html.trim().length === 0) {
      return { isValid: false, error: 'Contenido HTML es requerido' }
    }

    if (!data.text || typeof data.text !== 'string' || data.text.trim().length === 0) {
      return { isValid: false, error: 'Contenido de texto es requerido' }
    }

    if (!Array.isArray(data.variables)) {
      return { isValid: false, error: 'Variables deben ser un array' }
    }

    for (const variable of data.variables) {
      if (typeof variable !== 'string' || variable.trim().length === 0) {
        return { isValid: false, error: 'Variable inválida' }
      }
    }

    return { isValid: true }
  }

  // Validar datos de usuario
  static validateUserData(data: {
    username?: string
    email?: string
    role?: string
  }): { isValid: boolean; error?: string } {
    if (data.username) {
      if (typeof data.username !== 'string' || data.username.trim().length === 0) {
        return { isValid: false, error: 'Nombre de usuario inválido' }
      }
      if (data.username.length < 3) {
        return { isValid: false, error: 'Nombre de usuario demasiado corto' }
      }
      if (data.username.length > 50) {
        return { isValid: false, error: 'Nombre de usuario demasiado largo' }
      }
    }

    if (data.email) {
      const emailValidation = this.validateEmail(data.email)
      if (!emailValidation.isValid) {
        return emailValidation
      }
    }

    if (data.role) {
      if (!['user', 'admin', 'moderator'].includes(data.role)) {
        return { isValid: false, error: 'Rol inválido' }
      }
    }

    return { isValid: true }
  }

  // Sanitizar entrada de texto
  static sanitizeText(text: string): string {
    return text
      .trim()
      .replace(/[<>]/g, '') // Remover caracteres potencialmente peligrosos
      .replace(/\s+/g, ' ') // Normalizar espacios
  }

  // Validar límites de rate limiting
  static validateRateLimit(
    currentCount: number, 
    maxCount: number, 
    windowMs: number, 
    lastReset: number
  ): { isValid: boolean; resetTime?: number } {
    const now = Date.now()
    
    if (now - lastReset > windowMs) {
      return { isValid: true } // Reset window
    }

    if (currentCount >= maxCount) {
      return { 
        isValid: false, 
        resetTime: lastReset + windowMs 
      }
    }

    return { isValid: true }
  }
}
