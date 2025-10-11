// Sistema de optimización de imágenes
export interface ImageOptimizationOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp'
  progressive?: boolean
  blur?: number
}

export interface OptimizedImage {
  originalSize: number
  optimizedSize: number
  compressionRatio: number
  url: string
  width: number
  height: number
  format: string
}

export class ImageOptimizer {
  private static instance: ImageOptimizer
  private cache = new Map<string, OptimizedImage>()

  static getInstance(): ImageOptimizer {
    if (!ImageOptimizer.instance) {
      ImageOptimizer.instance = new ImageOptimizer()
    }
    return ImageOptimizer.instance
  }

  // Optimizar imagen
  async optimizeImage(
    file: File,
    options: ImageOptimizationOptions = {}
  ): Promise<OptimizedImage> {
    const cacheKey = this.generateCacheKey(file, options)
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      format = 'webp',
      progressive = true,
      blur = 0
    } = options

    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('No se pudo obtener contexto del canvas')

      const img = new Image()
      const imageUrl = URL.createObjectURL(file)
      
      return new Promise((resolve, reject) => {
        img.onload = () => {
          try {
            // Calcular dimensiones optimizadas
            const { width, height } = this.calculateDimensions(
              img.width,
              img.height,
              maxWidth,
              maxHeight
            )

            canvas.width = width
            canvas.height = height

            // Aplicar blur si es necesario
            if (blur > 0) {
              ctx.filter = `blur(${blur}px)`
            }

            // Dibujar imagen redimensionada
            ctx.drawImage(img, 0, 0, width, height)

            // Convertir a blob
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error('Error al convertir imagen'))
                  return
                }

                const optimizedImage: OptimizedImage = {
                  originalSize: file.size,
                  optimizedSize: blob.size,
                  compressionRatio: (file.size - blob.size) / file.size,
                  url: URL.createObjectURL(blob),
                  width,
                  height,
                  format
                }

                this.cache.set(cacheKey, optimizedImage)
                URL.revokeObjectURL(imageUrl)
                resolve(optimizedImage)
              },
              `image/${format}`,
              quality
            )
          } catch (error) {
            URL.revokeObjectURL(imageUrl)
            reject(error)
          }
        }

        img.onerror = () => {
          URL.revokeObjectURL(imageUrl)
          reject(new Error('Error al cargar imagen'))
        }

        img.src = imageUrl
      })
    } catch (error) {
      throw new Error(`Error optimizando imagen: ${error}`)
    }
  }

  // Optimizar múltiples imágenes
  async optimizeImages(
    files: File[],
    options: ImageOptimizationOptions = {}
  ): Promise<OptimizedImage[]> {
    const promises = files.map(file => this.optimizeImage(file, options))
    return Promise.all(promises)
  }

  // Crear thumbnail
  async createThumbnail(
    file: File,
    size: number = 200,
    quality: number = 0.7
  ): Promise<OptimizedImage> {
    return this.optimizeImage(file, {
      maxWidth: size,
      maxHeight: size,
      quality,
      format: 'jpeg'
    })
  }

  // Redimensionar imagen
  async resizeImage(
    file: File,
    width: number,
    height: number,
    quality: number = 0.8
  ): Promise<OptimizedImage> {
    return this.optimizeImage(file, {
      maxWidth: width,
      maxHeight: height,
      quality
    })
  }

  // Comprimir imagen
  async compressImage(
    file: File,
    quality: number = 0.6
  ): Promise<OptimizedImage> {
    return this.optimizeImage(file, {
      quality,
      format: 'jpeg'
    })
  }

  // Convertir a WebP
  async convertToWebP(
    file: File,
    quality: number = 0.8
  ): Promise<OptimizedImage> {
    return this.optimizeImage(file, {
      format: 'webp',
      quality
    })
  }

  // Aplicar blur
  async applyBlur(
    file: File,
    blurAmount: number = 5,
    quality: number = 0.8
  ): Promise<OptimizedImage> {
    return this.optimizeImage(file, {
      blur: blurAmount,
      quality
    })
  }

  // Obtener información de imagen
  async getImageInfo(file: File): Promise<{
    width: number
    height: number
    size: number
    type: string
    aspectRatio: number
  }> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const imageUrl = URL.createObjectURL(file)

      img.onload = () => {
        const info = {
          width: img.width,
          height: img.height,
          size: file.size,
          type: file.type,
          aspectRatio: img.width / img.height
        }
        URL.revokeObjectURL(imageUrl)
        resolve(info)
      }

      img.onerror = () => {
        URL.revokeObjectURL(imageUrl)
        reject(new Error('Error al cargar imagen'))
      }

      img.src = imageUrl
    })
  }

  // Validar imagen
  validateImage(file: File): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

    if (file.size > maxSize) {
      errors.push('La imagen es demasiado grande (máximo 10MB)')
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push('Tipo de archivo no soportado')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Calcular dimensiones optimizadas
  private calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    let width = originalWidth
    let height = originalHeight

    // Redimensionar si es necesario
    if (width > maxWidth || height > maxHeight) {
      const aspectRatio = width / height
      
      if (width > height) {
        width = Math.min(maxWidth, width)
        height = width / aspectRatio
        
        if (height > maxHeight) {
          height = maxHeight
          width = height * aspectRatio
        }
      } else {
        height = Math.min(maxHeight, height)
        width = height * aspectRatio
        
        if (width > maxWidth) {
          width = maxWidth
          height = width / aspectRatio
        }
      }
    }

    return {
      width: Math.round(width),
      height: Math.round(height)
    }
  }

  // Generar clave de caché
  private generateCacheKey(file: File, options: ImageOptimizationOptions): string {
    const optionsStr = JSON.stringify(options)
    return `${file.name}-${file.size}-${optionsStr}`
  }

  // Limpiar caché
  clearCache(): void {
    this.cache.forEach(image => {
      URL.revokeObjectURL(image.url)
    })
    this.cache.clear()
  }

  // Obtener estadísticas de caché
  getCacheStats(): {
    size: number
    totalOriginalSize: number
    totalOptimizedSize: number
    averageCompressionRatio: number
  } {
    const images = Array.from(this.cache.values())
    const totalOriginalSize = images.reduce((sum, img) => sum + img.originalSize, 0)
    const totalOptimizedSize = images.reduce((sum, img) => sum + img.optimizedSize, 0)
    const averageCompressionRatio = images.length > 0 
      ? images.reduce((sum, img) => sum + img.compressionRatio, 0) / images.length
      : 0

    return {
      size: this.cache.size,
      totalOriginalSize,
      totalOptimizedSize,
      averageCompressionRatio
    }
  }
}

// Instancia global del optimizador
export const imageOptimizer = ImageOptimizer.getInstance()

// Hook para React
export const useImageOptimizer = () => {
  return {
    optimizeImage: imageOptimizer.optimizeImage.bind(imageOptimizer),
    optimizeImages: imageOptimizer.optimizeImages.bind(imageOptimizer),
    createThumbnail: imageOptimizer.createThumbnail.bind(imageOptimizer),
    resizeImage: imageOptimizer.resizeImage.bind(imageOptimizer),
    compressImage: imageOptimizer.compressImage.bind(imageOptimizer),
    convertToWebP: imageOptimizer.convertToWebP.bind(imageOptimizer),
    applyBlur: imageOptimizer.applyBlur.bind(imageOptimizer),
    getImageInfo: imageOptimizer.getImageInfo.bind(imageOptimizer),
    validateImage: imageOptimizer.validateImage.bind(imageOptimizer),
    clearCache: imageOptimizer.clearCache.bind(imageOptimizer),
    getCacheStats: imageOptimizer.getCacheStats.bind(imageOptimizer)
  }
}

// Utilidades de optimización
export const imageUtils = {
  // Verificar si el navegador soporta WebP
  supportsWebP(): boolean {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
  },

  // Obtener formato recomendado
  getRecommendedFormat(): 'webp' | 'jpeg' | 'png' {
    if (this.supportsWebP()) {
      return 'webp'
    }
    return 'jpeg'
  },

  // Calcular tamaño de archivo en formato legible
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  // Generar placeholder para imagen
  generatePlaceholder(width: number, height: number, text: string = 'Imagen'): string {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    canvas.width = width
    canvas.height = height
    
    if (ctx) {
      ctx.fillStyle = '#f0f0f0'
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = '#999'
      ctx.font = '14px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(text, width / 2, height / 2)
    }
    
    return canvas.toDataURL()
  }
}

export default ImageOptimizer
