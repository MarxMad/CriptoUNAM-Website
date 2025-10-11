// Utilidades de validación y seguridad
export class ValidationUtils {
  // Validar email
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validar URL
  static isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // Validar dirección de wallet
  static isValidWalletAddress(address: string): boolean {
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/
    return ethAddressRegex.test(address)
  }

  // Validar número de teléfono
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  // Validar string no vacío
  static isNotEmpty(value: string): boolean {
    return value.trim().length > 0
  }

  // Validar longitud mínima
  static hasMinLength(value: string, minLength: number): boolean {
    return value.length >= minLength
  }

  // Validar longitud máxima
  static hasMaxLength(value: string, maxLength: number): boolean {
    return value.length <= maxLength
  }

  // Validar rango de números
  static isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max
  }

  // Validar fecha
  static isValidDate(dateString: string): boolean {
    const date = new Date(dateString)
    return date instanceof Date && !isNaN(date.getTime())
  }

  // Validar fecha futura
  static isFutureDate(dateString: string): boolean {
    const date = new Date(dateString)
    const now = new Date()
    return date > now
  }

  // Validar archivo de imagen
  static isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB
    
    return validTypes.includes(file.type) && file.size <= maxSize
  }

  // Validar archivo de video
  static isValidVideoFile(file: File): boolean {
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi']
    const maxSize = 100 * 1024 * 1024 // 100MB
    
    return validTypes.includes(file.type) && file.size <= maxSize
  }

  // Sanitizar string
  static sanitizeString(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remover < y >
      .replace(/javascript:/gi, '') // Remover javascript:
      .replace(/on\w+=/gi, '') // Remover event handlers
      .trim()
  }

  // Sanitizar HTML
  static sanitizeHtml(input: string): string {
    const allowedTags = ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a']
    const allowedAttributes = ['href', 'target']
    
    // Implementación básica de sanitización
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
      .replace(/javascript:/gi, '')
  }

  // Validar formulario completo
  static validateForm(formData: Record<string, any>, rules: Record<string, any>): {
    isValid: boolean
    errors: Record<string, string>
  } {
    const errors: Record<string, string> = {}
    let isValid = true

    for (const [field, value] of Object.entries(formData)) {
      const fieldRules = rules[field]
      if (!fieldRules) continue

      // Validar campo requerido
      if (fieldRules.required && (!value || value.toString().trim() === '')) {
        errors[field] = `${field} es requerido`
        isValid = false
        continue
      }

      // Validar email
      if (fieldRules.type === 'email' && value && !this.isValidEmail(value)) {
        errors[field] = 'Email inválido'
        isValid = false
      }

      // Validar URL
      if (fieldRules.type === 'url' && value && !this.isValidUrl(value)) {
        errors[field] = 'URL inválida'
        isValid = false
      }

      // Validar longitud mínima
      if (fieldRules.minLength && value && !this.hasMinLength(value, fieldRules.minLength)) {
        errors[field] = `Mínimo ${fieldRules.minLength} caracteres`
        isValid = false
      }

      // Validar longitud máxima
      if (fieldRules.maxLength && value && !this.hasMaxLength(value, fieldRules.maxLength)) {
        errors[field] = `Máximo ${fieldRules.maxLength} caracteres`
        isValid = false
      }

      // Validar rango numérico
      if (fieldRules.type === 'number' && value !== undefined) {
        const numValue = Number(value)
        if (isNaN(numValue)) {
          errors[field] = 'Debe ser un número válido'
          isValid = false
        } else if (fieldRules.min !== undefined && numValue < fieldRules.min) {
          errors[field] = `Mínimo ${fieldRules.min}`
          isValid = false
        } else if (fieldRules.max !== undefined && numValue > fieldRules.max) {
          errors[field] = `Máximo ${fieldRules.max}`
          isValid = false
        }
      }
    }

    return { isValid, errors }
  }

  // Validar datos de evento
  static validateEventData(eventData: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!this.isNotEmpty(eventData.titulo)) {
      errors.push('El título es requerido')
    }

    if (!this.isValidDate(eventData.fecha)) {
      errors.push('La fecha debe ser válida')
    }

    if (!this.isNotEmpty(eventData.lugar)) {
      errors.push('El lugar es requerido')
    }

    if (!this.isNotEmpty(eventData.descripcion)) {
      errors.push('La descripción es requerida')
    }

    if (eventData.cupo && !this.isInRange(Number(eventData.cupo), 1, 1000)) {
      errors.push('El cupo debe estar entre 1 y 1000')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Validar datos de curso
  static validateCourseData(courseData: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!this.isNotEmpty(courseData.titulo)) {
      errors.push('El título es requerido')
    }

    if (!this.isNotEmpty(courseData.descripcion)) {
      errors.push('La descripción es requerida')
    }

    if (!this.isNotEmpty(courseData.nivel)) {
      errors.push('El nivel es requerido')
    }

    if (!this.isNotEmpty(courseData.duracion)) {
      errors.push('La duración es requerida')
    }

    if (courseData.precio && !this.isInRange(Number(courseData.precio), 0, 10000)) {
      errors.push('El precio debe estar entre 0 y 10000')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Validar datos de newsletter
  static validateNewsletterData(newsletterData: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!this.isNotEmpty(newsletterData.titulo)) {
      errors.push('El título es requerido')
    }

    if (!this.isNotEmpty(newsletterData.contenido)) {
      errors.push('El contenido es requerido')
    }

    if (!this.isNotEmpty(newsletterData.autor)) {
      errors.push('El autor es requerido')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Generar token de validación
  static generateValidationToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15)
  }

  // Validar token de validación
  static validateToken(token: string, expectedLength: number = 26): boolean {
    return token.length === expectedLength && /^[a-z0-9]+$/.test(token)
  }
}

export default ValidationUtils
