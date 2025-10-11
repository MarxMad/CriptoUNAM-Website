// Tipos para el sistema de emails
export interface EmailTemplate {
  id: string
  name: string
  subject: string
  html: string
  text: string
  variables: string[]
  createdAt: string
  updatedAt: string
}

export interface EmailSubscription {
  id: string
  email: string
  isActive: boolean
  preferences: EmailPreferences
  subscribedAt: string
  unsubscribedAt?: string
}

export interface EmailPreferences {
  newsletter: boolean
  notifications: boolean
  updates: boolean
  events: boolean
  promotions: boolean
}

export interface EmailQueue {
  id: string
  to: string
  templateId: string
  variables: Record<string, any>
  status: 'pending' | 'sent' | 'failed' | 'retrying'
  attempts: number
  maxAttempts: number
  scheduledAt: string
  sentAt?: string
  error?: string
}

export interface EmailAnalytics {
  id: string
  emailId: string
  event: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained'
  timestamp: string
  metadata?: Record<string, any>
}

export interface NewsletterEmail {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  publishedAt: string
  tags: string[]
  featuredImage?: string
}

export interface EmailService {
  sendWelcomeEmail(email: string, name: string): Promise<boolean>
  sendNewsletterNotification(subscribers: EmailSubscription[], newsletter: NewsletterEmail): Promise<boolean>
  sendCustomEmail(to: string, template: EmailTemplate, variables: Record<string, any>): Promise<boolean>
  addToQueue(email: EmailQueue): Promise<void>
  processQueue(): Promise<void>
  getAnalytics(emailId: string): Promise<EmailAnalytics[]>
}
