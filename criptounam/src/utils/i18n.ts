// Sistema de internacionalización
export interface Translation {
  [key: string]: string | Translation
}

export interface LanguageConfig {
  code: string
  name: string
  nativeName: string
  flag: string
  rtl: boolean
}

export interface I18nConfig {
  defaultLanguage: string
  fallbackLanguage: string
  supportedLanguages: LanguageConfig[]
  translations: Record<string, Translation>
}

export class I18nManager {
  private static instance: I18nManager
  private currentLanguage: string
  private config: I18nConfig
  private translations: Translation = {}

  constructor(config: I18nConfig) {
    this.config = config
    this.currentLanguage = config.defaultLanguage
    this.loadTranslations()
  }

  static getInstance(config?: I18nConfig): I18nManager {
    if (!I18nManager.instance && config) {
      I18nManager.instance = new I18nManager(config)
    }
    return I18nManager.instance
  }

  // Cargar traducciones
  private loadTranslations(): void {
    this.translations = this.config.translations[this.currentLanguage] || {}
  }

  // Cambiar idioma
  setLanguage(language: string): void {
    if (this.config.supportedLanguages.find(lang => lang.code === language)) {
      this.currentLanguage = language
      this.loadTranslations()
      this.saveLanguagePreference()
    }
  }

  // Obtener idioma actual
  getCurrentLanguage(): string {
    return this.currentLanguage
  }

  // Obtener configuración de idioma
  getLanguageConfig(code: string): LanguageConfig | undefined {
    return this.config.supportedLanguages.find(lang => lang.code === code)
  }

  // Obtener todos los idiomas soportados
  getSupportedLanguages(): LanguageConfig[] {
    return this.config.supportedLanguages
  }

  // Traducir texto
  t(key: string, params?: Record<string, any>): string {
    const translation = this.getNestedTranslation(key)
    
    if (typeof translation !== 'string') {
      console.warn(`Translation not found for key: ${key}`)
      return key
    }

    return this.interpolate(translation, params)
  }

  // Obtener traducción anidada
  private getNestedTranslation(key: string): string | Translation | undefined {
    const keys = key.split('.')
    let current: any = this.translations

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k]
      } else {
        // Fallback al idioma por defecto
        if (this.currentLanguage !== this.config.fallbackLanguage) {
          const fallbackTranslations = this.config.translations[this.config.fallbackLanguage]
          current = fallbackTranslations
          for (const k of keys) {
            if (current && typeof current === 'object' && k in current) {
              current = current[k]
            } else {
              return undefined
            }
          }
        } else {
          return undefined
        }
      }
    }

    return current
  }

  // Interpolar parámetros en traducción
  private interpolate(text: string, params?: Record<string, any>): string {
    if (!params) return text

    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key] !== undefined ? String(params[key]) : match
    })
  }

  // Guardar preferencia de idioma
  private saveLanguagePreference(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('preferred-language', this.currentLanguage)
    }
  }

  // Cargar preferencia de idioma
  loadLanguagePreference(): void {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('preferred-language')
      if (saved && this.config.supportedLanguages.find(lang => lang.code === saved)) {
        this.setLanguage(saved)
      }
    }
  }

  // Detectar idioma del navegador
  detectBrowserLanguage(): string {
    if (typeof navigator === 'undefined') return this.config.defaultLanguage

    const browserLang = navigator.language.split('-')[0]
    const supportedCodes = this.config.supportedLanguages.map(lang => lang.code.split('-')[0])
    
    if (supportedCodes.includes(browserLang)) {
      return this.config.supportedLanguages.find(lang => 
        lang.code.startsWith(browserLang)
      )?.code || this.config.defaultLanguage
    }

    return this.config.defaultLanguage
  }

  // Formatear fecha según idioma
  formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    return new Intl.DateTimeFormat(this.currentLanguage, options).format(date)
  }

  // Formatear número según idioma
  formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(this.currentLanguage, options).format(number)
  }

  // Formatear moneda según idioma
  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat(this.currentLanguage, {
      style: 'currency',
      currency
    }).format(amount)
  }

  // Formatear pluralización
  formatPlural(count: number, singular: string, plural: string): string {
    const rules = new Intl.PluralRules(this.currentLanguage)
    const rule = rules.select(count)
    
    switch (rule) {
      case 'one':
        return count === 1 ? singular : plural
      default:
        return plural
    }
  }

  // Verificar si es RTL
  isRTL(): boolean {
    const langConfig = this.getLanguageConfig(this.currentLanguage)
    return langConfig?.rtl || false
  }

  // Obtener dirección de texto
  getTextDirection(): 'ltr' | 'rtl' {
    return this.isRTL() ? 'rtl' : 'ltr'
  }

  // Agregar traducciones dinámicamente
  addTranslations(language: string, translations: Translation): void {
    if (!this.config.translations[language]) {
      this.config.translations[language] = {}
    }
    
    this.config.translations[language] = {
      ...this.config.translations[language],
      ...translations
    }

    if (this.currentLanguage === language) {
      this.loadTranslations()
    }
  }

  // Exportar traducciones
  exportTranslations(language?: string): Translation {
    if (language) {
      return this.config.translations[language] || {}
    }
    return this.config.translations
  }

  // Importar traducciones
  importTranslations(translations: Record<string, Translation>): void {
    this.config.translations = {
      ...this.config.translations,
      ...translations
    }
    this.loadTranslations()
  }
}

// Configuración por defecto
export const defaultI18nConfig: I18nConfig = {
  defaultLanguage: 'es',
  fallbackLanguage: 'en',
  supportedLanguages: [
    {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      flag: '🇪🇸',
      rtl: false
    },
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      rtl: false
    },
    {
      code: 'pt',
      name: 'Portuguese',
      nativeName: 'Português',
      flag: '🇧🇷',
      rtl: false
    },
    {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      flag: '🇫🇷',
      rtl: false
    }
  ],
  translations: {
    es: {
      common: {
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito',
        cancel: 'Cancelar',
        save: 'Guardar',
        delete: 'Eliminar',
        edit: 'Editar',
        close: 'Cerrar',
        back: 'Atrás',
        next: 'Siguiente',
        previous: 'Anterior',
        search: 'Buscar',
        filter: 'Filtrar',
        sort: 'Ordenar',
        refresh: 'Actualizar',
        share: 'Compartir',
        copy: 'Copiar',
        download: 'Descargar',
        upload: 'Subir',
        submit: 'Enviar',
        confirm: 'Confirmar',
        yes: 'Sí',
        no: 'No',
        ok: 'OK'
      },
      navigation: {
        home: 'Inicio',
        courses: 'Cursos',
        community: 'Comunidad',
        newsletter: 'Newsletter',
        profile: 'Perfil',
        games: 'Juegos',
        projects: 'Proyectos'
      },
      auth: {
        connect: 'Conectar Wallet',
        disconnect: 'Desconectar',
        signIn: 'Iniciar Sesión',
        signOut: 'Cerrar Sesión',
        register: 'Registrarse'
      },
      courses: {
        title: 'Cursos',
        description: 'Aprende sobre blockchain y criptomonedas',
        enroll: 'Inscribirse',
        completed: 'Completado',
        inProgress: 'En Progreso',
        notStarted: 'No Iniciado'
      },
      community: {
        title: 'Comunidad',
        description: 'Únete a nuestra comunidad de desarrolladores',
        join: 'Unirse',
        members: 'Miembros',
        events: 'Eventos',
        discussions: 'Discusiones'
      },
      newsletter: {
        title: 'Newsletter',
        description: 'Mantente actualizado con las últimas noticias',
        subscribe: 'Suscribirse',
        unsubscribe: 'Desuscribirse',
        email: 'Correo Electrónico',
        name: 'Nombre'
      },
      profile: {
        title: 'Perfil',
        edit: 'Editar Perfil',
        settings: 'Configuración',
        preferences: 'Preferencias',
        notifications: 'Notificaciones',
        privacy: 'Privacidad',
        security: 'Seguridad'
      },
      games: {
        title: 'Juegos',
        description: 'Juegos educativos sobre blockchain',
        play: 'Jugar',
        score: 'Puntuación',
        highScore: 'Mejor Puntuación',
        level: 'Nivel',
        time: 'Tiempo'
      },
      puma: {
        title: 'Tokens PUMA',
        balance: 'Balance',
        earned: 'Ganados',
        spent: 'Gastados',
        level: 'Nivel',
        experience: 'Experiencia',
        badges: 'Insignias',
        missions: 'Misiones',
        leaderboard: 'Ranking'
      }
    },
    en: {
      common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        close: 'Close',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        refresh: 'Refresh',
        share: 'Share',
        copy: 'Copy',
        download: 'Download',
        upload: 'Upload',
        submit: 'Submit',
        confirm: 'Confirm',
        yes: 'Yes',
        no: 'No',
        ok: 'OK'
      },
      navigation: {
        home: 'Home',
        courses: 'Courses',
        community: 'Community',
        newsletter: 'Newsletter',
        profile: 'Profile',
        games: 'Games',
        projects: 'Projects'
      },
      auth: {
        connect: 'Connect Wallet',
        disconnect: 'Disconnect',
        signIn: 'Sign In',
        signOut: 'Sign Out',
        register: 'Register'
      },
      courses: {
        title: 'Courses',
        description: 'Learn about blockchain and cryptocurrencies',
        enroll: 'Enroll',
        completed: 'Completed',
        inProgress: 'In Progress',
        notStarted: 'Not Started'
      },
      community: {
        title: 'Community',
        description: 'Join our developer community',
        join: 'Join',
        members: 'Members',
        events: 'Events',
        discussions: 'Discussions'
      },
      newsletter: {
        title: 'Newsletter',
        description: 'Stay updated with the latest news',
        subscribe: 'Subscribe',
        unsubscribe: 'Unsubscribe',
        email: 'Email',
        name: 'Name'
      },
      profile: {
        title: 'Profile',
        edit: 'Edit Profile',
        settings: 'Settings',
        preferences: 'Preferences',
        notifications: 'Notifications',
        privacy: 'Privacy',
        security: 'Security'
      },
      games: {
        title: 'Games',
        description: 'Educational games about blockchain',
        play: 'Play',
        score: 'Score',
        highScore: 'High Score',
        level: 'Level',
        time: 'Time'
      },
      puma: {
        title: 'PUMA Tokens',
        balance: 'Balance',
        earned: 'Earned',
        spent: 'Spent',
        level: 'Level',
        experience: 'Experience',
        badges: 'Badges',
        missions: 'Missions',
        leaderboard: 'Leaderboard'
      }
    }
  }
}

// Instancia global del i18n
export const i18n = I18nManager.getInstance(defaultI18nConfig)

// Hook para React
export const useI18n = () => {
  return {
    t: i18n.t.bind(i18n),
    setLanguage: i18n.setLanguage.bind(i18n),
    getCurrentLanguage: i18n.getCurrentLanguage.bind(i18n),
    getSupportedLanguages: i18n.getSupportedLanguages.bind(i18n),
    formatDate: i18n.formatDate.bind(i18n),
    formatNumber: i18n.formatNumber.bind(i18n),
    formatCurrency: i18n.formatCurrency.bind(i18n),
    formatPlural: i18n.formatPlural.bind(i18n),
    isRTL: i18n.isRTL.bind(i18n),
    getTextDirection: i18n.getTextDirection.bind(i18n)
  }
}

// Componente de selector de idioma
export const LanguageSelector = () => {
  const { getCurrentLanguage, getSupportedLanguages, setLanguage } = useI18n()
  const currentLang = getCurrentLanguage()
  const languages = getSupportedLanguages()

  return (
    <select
      value={currentLang}
      onChange={(e) => setLanguage(e.target.value)}
      style={{
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        backgroundColor: 'white',
        fontSize: '14px'
      }}
    >
      {languages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.nativeName}
        </option>
      ))}
    </select>
  )
}

export default I18nManager
