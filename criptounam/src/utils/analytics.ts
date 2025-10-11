// Sistema de métricas y analytics
export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp: number
  userId?: string
  sessionId?: string
}

export interface UserMetrics {
  userId: string
  totalSessions: number
  totalTimeSpent: number
  pagesVisited: string[]
  actionsPerformed: Record<string, number>
  lastActive: number
}

export interface PageMetrics {
  page: string
  views: number
  uniqueViews: number
  averageTimeOnPage: number
  bounceRate: number
  exitRate: number
}

export interface ConversionMetrics {
  event: string
  conversions: number
  conversionRate: number
  revenue?: number
}

export class AnalyticsManager {
  private events: AnalyticsEvent[] = []
  private userMetrics: Map<string, UserMetrics> = new Map()
  private pageMetrics: Map<string, PageMetrics> = new Map()
  private conversionMetrics: Map<string, ConversionMetrics> = new Map()
  private sessionId: string
  private userId?: string
  private startTime: number

  constructor() {
    this.sessionId = this.generateSessionId()
    this.startTime = Date.now()
    this.setupEventListeners()
  }

  // Configurar usuario
  setUser(userId: string): void {
    this.userId = userId
    this.initializeUserMetrics(userId)
  }

  // Trackear evento
  track(eventName: string, properties?: Record<string, any>): void {
    const event: AnalyticsEvent = {
      name: eventName,
      properties,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId
    }

    this.events.push(event)
    this.updateUserMetrics(event)
    this.sendToServer(event)
  }

  // Trackear página
  trackPage(page: string, properties?: Record<string, any>): void {
    this.track('page_view', {
      page,
      ...properties
    })
    this.updatePageMetrics(page)
  }

  // Trackear conversión
  trackConversion(event: string, value?: number): void {
    this.track('conversion', {
      event,
      value
    })
    this.updateConversionMetrics(event, value)
  }

  // Trackear error
  trackError(error: Error, context?: Record<string, any>): void {
    this.track('error', {
      message: error.message,
      stack: error.stack,
      ...context
    })
  }

  // Trackear performance
  trackPerformance(metric: string, value: number): void {
    this.track('performance', {
      metric,
      value
    })
  }

  // Trackear interacción de usuario
  trackUserInteraction(element: string, action: string, properties?: Record<string, any>): void {
    this.track('user_interaction', {
      element,
      action,
      ...properties
    })
  }

  // Trackear tiempo en página
  trackTimeOnPage(page: string, timeSpent: number): void {
    this.track('time_on_page', {
      page,
      timeSpent
    })
  }

  // Trackear scroll
  trackScroll(depth: number, page: string): void {
    this.track('scroll', {
      depth,
      page
    })
  }

  // Trackear click
  trackClick(element: string, page: string, properties?: Record<string, any>): void {
    this.track('click', {
      element,
      page,
      ...properties
    })
  }

  // Trackear formulario
  trackFormSubmit(formName: string, success: boolean, properties?: Record<string, any>): void {
    this.track('form_submit', {
      formName,
      success,
      ...properties
    })
  }

  // Trackear búsqueda
  trackSearch(query: string, results: number, page: string): void {
    this.track('search', {
      query,
      results,
      page
    })
  }

  // Trackear descarga
  trackDownload(fileName: string, fileType: string, fileSize?: number): void {
    this.track('download', {
      fileName,
      fileType,
      fileSize
    })
  }

  // Trackear share
  trackShare(platform: string, content: string, page: string): void {
    this.track('share', {
      platform,
      content,
      page
    })
  }

  // Obtener métricas de usuario
  getUserMetrics(userId: string): UserMetrics | undefined {
    return this.userMetrics.get(userId)
  }

  // Obtener métricas de página
  getPageMetrics(page: string): PageMetrics | undefined {
    return this.pageMetrics.get(page)
  }

  // Obtener métricas de conversión
  getConversionMetrics(event: string): ConversionMetrics | undefined {
    return this.conversionMetrics.get(event)
  }

  // Obtener todos los eventos
  getEvents(): AnalyticsEvent[] {
    return [...this.events]
  }

  // Obtener estadísticas generales
  getStats(): {
    totalEvents: number
    totalUsers: number
    totalSessions: number
    averageEventsPerSession: number
    topPages: Array<{ page: string; views: number }>
    topEvents: Array<{ event: string; count: number }>
  } {
    const totalEvents = this.events.length
    const totalUsers = this.userMetrics.size
    const totalSessions = new Set(this.events.map(e => e.sessionId)).size
    const averageEventsPerSession = totalSessions > 0 ? totalEvents / totalSessions : 0

    // Top páginas
    const pageViews = new Map<string, number>()
    this.events
      .filter(e => e.name === 'page_view')
      .forEach(e => {
        const page = e.properties?.page
        if (page) {
          pageViews.set(page, (pageViews.get(page) || 0) + 1)
        }
      })

    const topPages = Array.from(pageViews.entries())
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    // Top eventos
    const eventCounts = new Map<string, number>()
    this.events.forEach(e => {
      eventCounts.set(e.name, (eventCounts.get(e.name) || 0) + 1)
    })

    const topEvents = Array.from(eventCounts.entries())
      .map(([event, count]) => ({ event, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return {
      totalEvents,
      totalUsers,
      totalSessions,
      averageEventsPerSession,
      topPages,
      topEvents
    }
  }

  // Exportar datos
  exportData(): string {
    return JSON.stringify({
      events: this.events,
      userMetrics: Object.fromEntries(this.userMetrics),
      pageMetrics: Object.fromEntries(this.pageMetrics),
      conversionMetrics: Object.fromEntries(this.conversionMetrics),
      stats: this.getStats()
    }, null, 2)
  }

  // Limpiar datos
  clear(): void {
    this.events = []
    this.userMetrics.clear()
    this.pageMetrics.clear()
    this.conversionMetrics.clear()
  }

  // Configurar event listeners
  private setupEventListeners(): void {
    // Trackear tiempo en página
    let pageStartTime = Date.now()
    let currentPage = window.location.pathname

    // Trackear cambio de página
    window.addEventListener('popstate', () => {
      const newPage = window.location.pathname
      if (newPage !== currentPage) {
        this.trackTimeOnPage(currentPage, Date.now() - pageStartTime)
        this.trackPage(newPage)
        currentPage = newPage
        pageStartTime = Date.now()
      }
    })

    // Trackear scroll
    let maxScrollDepth = 0
    window.addEventListener('scroll', () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth
        this.trackScroll(scrollDepth, currentPage)
      }
    })

    // Trackear clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      if (target) {
        const element = target.tagName.toLowerCase()
        const className = target.className
        const id = target.id
        this.trackClick(element, currentPage, {
          className,
          id,
          text: target.textContent?.slice(0, 100)
        })
      }
    })

    // Trackear formularios
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement
      if (form) {
        this.trackFormSubmit(form.name || 'unnamed', true, {
          action: form.action,
          method: form.method
        })
      }
    })

    // Trackear errores
    window.addEventListener('error', (event) => {
      this.trackError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      })
    })

    // Trackear performance
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      this.trackPerformance('page_load_time', perfData.loadEventEnd - perfData.loadEventStart)
      this.trackPerformance('dom_content_loaded', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart)
    })
  }

  // Inicializar métricas de usuario
  private initializeUserMetrics(userId: string): void {
    if (!this.userMetrics.has(userId)) {
      this.userMetrics.set(userId, {
        userId,
        totalSessions: 0,
        totalTimeSpent: 0,
        pagesVisited: [],
        actionsPerformed: {},
        lastActive: Date.now()
      })
    }
  }

  // Actualizar métricas de usuario
  private updateUserMetrics(event: AnalyticsEvent): void {
    if (!this.userId) return

    const userMetrics = this.userMetrics.get(this.userId)
    if (userMetrics) {
      userMetrics.lastActive = Date.now()
      userMetrics.actionsPerformed[event.name] = (userMetrics.actionsPerformed[event.name] || 0) + 1

      if (event.name === 'page_view' && event.properties?.page) {
        if (!userMetrics.pagesVisited.includes(event.properties.page)) {
          userMetrics.pagesVisited.push(event.properties.page)
        }
      }
    }
  }

  // Actualizar métricas de página
  private updatePageMetrics(page: string): void {
    const existing = this.pageMetrics.get(page)
    if (existing) {
      existing.views++
    } else {
      this.pageMetrics.set(page, {
        page,
        views: 1,
        uniqueViews: 1,
        averageTimeOnPage: 0,
        bounceRate: 0,
        exitRate: 0
      })
    }
  }

  // Actualizar métricas de conversión
  private updateConversionMetrics(event: string, value?: number): void {
    const existing = this.conversionMetrics.get(event)
    if (existing) {
      existing.conversions++
      if (value) {
        existing.revenue = (existing.revenue || 0) + value
      }
    } else {
      this.conversionMetrics.set(event, {
        event,
        conversions: 1,
        conversionRate: 0,
        revenue: value
      })
    }
  }

  // Enviar a servidor
  private async sendToServer(event: AnalyticsEvent): Promise<void> {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      })
    } catch (error) {
      console.error('Error sending analytics event:', error)
    }
  }

  // Generar ID de sesión
  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15)
  }
}

// Instancia global del analytics
export const analytics = new AnalyticsManager()

// Hook para React
export const useAnalytics = () => {
  return {
    track: analytics.track.bind(analytics),
    trackPage: analytics.trackPage.bind(analytics),
    trackConversion: analytics.trackConversion.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackPerformance: analytics.trackPerformance.bind(analytics),
    trackUserInteraction: analytics.trackUserInteraction.bind(analytics),
    trackTimeOnPage: analytics.trackTimeOnPage.bind(analytics),
    trackScroll: analytics.trackScroll.bind(analytics),
    trackClick: analytics.trackClick.bind(analytics),
    trackFormSubmit: analytics.trackFormSubmit.bind(analytics),
    trackSearch: analytics.trackSearch.bind(analytics),
    trackDownload: analytics.trackDownload.bind(analytics),
    trackShare: analytics.trackShare.bind(analytics)
  }
}

export default AnalyticsManager
