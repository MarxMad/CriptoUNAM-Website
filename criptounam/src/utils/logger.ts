// Sistema de logging y monitoreo
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: any
  userId?: string
  sessionId?: string
  userAgent?: string
  url?: string
  stack?: string
}

export class Logger {
  private static instance: Logger
  private logs: LogEntry[] = []
  private maxLogs = 1000
  private currentLevel = LogLevel.INFO

  private constructor() {
    this.setupErrorHandling()
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  // Configurar nivel de logging
  setLevel(level: LogLevel): void {
    this.currentLevel = level
  }

  // Log de debug
  debug(message: string, context?: any): void {
    this.log(LogLevel.DEBUG, message, context)
  }

  // Log de información
  info(message: string, context?: any): void {
    this.log(LogLevel.INFO, message, context)
  }

  // Log de advertencia
  warn(message: string, context?: any): void {
    this.log(LogLevel.WARN, message, context)
  }

  // Log de error
  error(message: string, context?: any, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, error)
  }

  // Log fatal
  fatal(message: string, context?: any, error?: Error): void {
    this.log(LogLevel.FATAL, message, context, error)
  }

  // Método principal de logging
  private log(level: LogLevel, message: string, context?: any, error?: Error): void {
    if (level < this.currentLevel) return

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
      stack: error?.stack
    }

    // Agregar a logs internos
    this.logs.push(logEntry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // Log a consola
    this.logToConsole(level, message, context, error)

    // Log a servidor en producción
    if (process.env.NODE_ENV === 'production') {
      this.logToServer(logEntry)
    }
  }

  // Log a consola con colores
  private logToConsole(level: LogLevel, message: string, context?: any, error?: Error): void {
    const timestamp = new Date().toLocaleTimeString()
    const levelName = LogLevel[level]
    
    const logMessage = `[${timestamp}] ${levelName}: ${message}`
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(logMessage, context)
        break
      case LogLevel.INFO:
        console.info(logMessage, context)
        break
      case LogLevel.WARN:
        console.warn(logMessage, context)
        break
      case LogLevel.ERROR:
        console.error(logMessage, context, error)
        break
      case LogLevel.FATAL:
        console.error(`🚨 FATAL: ${logMessage}`, context, error)
        break
    }
  }

  // Enviar log a servidor
  private async logToServer(logEntry: LogEntry): Promise<void> {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(logEntry)
      })
    } catch (error) {
      console.error('Error enviando log al servidor:', error)
    }
  }

  // Configurar manejo de errores globales
  private setupErrorHandling(): void {
    // Error handler global
    window.addEventListener('error', (event) => {
      this.error('Error global capturado', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }, event.error)
    })

    // Unhandled promise rejection
    window.addEventListener('unhandledrejection', (event) => {
      this.error('Promise rejection no manejada', {
        reason: event.reason
      })
    })

    // Performance monitoring
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        this.info('Performance metrics', {
          loadTime: perfData.loadEventEnd - perfData.loadEventStart,
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
          firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime
        })
      })
    }
  }

  // Obtener logs
  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter(log => log.level >= level)
    }
    return [...this.logs]
  }

  // Limpiar logs
  clearLogs(): void {
    this.logs = []
  }

  // Exportar logs
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  // Métricas de rendimiento
  trackPerformance(name: string, startTime: number): void {
    const duration = performance.now() - startTime
    this.info(`Performance: ${name}`, { duration: `${duration.toFixed(2)}ms` })
  }

  // Tracking de eventos de usuario
  trackUserEvent(event: string, data?: any): void {
    this.info(`User event: ${event}`, data)
  }

  // Tracking de errores de API
  trackApiError(endpoint: string, status: number, error: any): void {
    this.error(`API Error: ${endpoint}`, {
      status,
      endpoint,
      error: error.message || error
    })
  }

  // Tracking de transacciones blockchain
  trackBlockchainTransaction(txHash: string, action: string, success: boolean): void {
    this.info(`Blockchain transaction: ${action}`, {
      txHash,
      action,
      success,
      timestamp: new Date().toISOString()
    })
  }

  // Tracking de emails
  trackEmailSent(to: string, template: string, success: boolean): void {
    this.info(`Email sent: ${template}`, {
      to,
      template,
      success,
      timestamp: new Date().toISOString()
    })
  }

  // Tracking de likes
  trackLikeAction(itemId: string, action: 'like' | 'unlike', userId: string): void {
    this.info(`Like action: ${action}`, {
      itemId,
      action,
      userId,
      timestamp: new Date().toISOString()
    })
  }

  // Tracking de PUMA rewards
  trackPumaReward(userId: string, amount: number, reason: string): void {
    this.info(`PUMA reward granted`, {
      userId,
      amount,
      reason,
      timestamp: new Date().toISOString()
    })
  }
}

// Instancia global del logger
export const logger = Logger.getInstance()

// Funciones de conveniencia
export const logDebug = (message: string, context?: any) => logger.debug(message, context)
export const logInfo = (message: string, context?: any) => logger.info(message, context)
export const logWarn = (message: string, context?: any) => logger.warn(message, context)
export const logError = (message: string, context?: any, error?: Error) => logger.error(message, context, error)
export const logFatal = (message: string, context?: any, error?: Error) => logger.fatal(message, context, error)

// Hook para React
export const useLogger = () => {
  return {
    debug: logDebug,
    info: logInfo,
    warn: logWarn,
    error: logError,
    fatal: logFatal,
    trackUserEvent: logger.trackUserEvent.bind(logger),
    trackPerformance: logger.trackPerformance.bind(logger)
  }
}

export default Logger
