// Interfaces para el sistema de emails
export interface IEmailService {
  sendWelcomeEmail(email: string, name: string): Promise<boolean>
  sendNewsletterNotification(subscribers: string[], newsletter: INewsletter): Promise<boolean>
  sendCustomEmail(to: string, template: IEmailTemplate, variables: Record<string, any>): Promise<boolean>
  addToQueue(email: IEmailQueue): Promise<void>
  processQueue(): Promise<void>
  getAnalytics(emailId: string): Promise<IEmailAnalytics[]>
}

export interface INewsletter {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  publishedAt: string
  tags: string[]
  featuredImage?: string
}

export interface IEmailTemplate {
  id: string
  name: string
  subject: string
  html: string
  text: string
  variables: string[]
  createdAt: string
  updatedAt: string
}

export interface IEmailQueue {
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

export interface IEmailAnalytics {
  id: string
  emailId: string
  event: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained'
  timestamp: string
  metadata?: Record<string, any>
}

export interface IEmailSubscription {
  id: string
  email: string
  isActive: boolean
  preferences: IEmailPreferences
  subscribedAt: string
  unsubscribedAt?: string
}

export interface IEmailPreferences {
  newsletter: boolean
  notifications: boolean
  updates: boolean
  events: boolean
  promotions: boolean
}

export interface IEmailProvider {
  sendEmail(to: string, subject: string, html: string, text: string): Promise<boolean>
  getDeliveryStatus(emailId: string): Promise<string>
  getAnalytics(emailId: string): Promise<IEmailAnalytics[]>
}

export interface IEmailValidator {
  validateEmail(email: string): boolean
  validateTemplate(template: IEmailTemplate): boolean
  validateVariables(variables: Record<string, any>, required: string[]): boolean
}

export interface IEmailScheduler {
  scheduleEmail(email: IEmailQueue, delay: number): Promise<void>
  cancelScheduledEmail(emailId: string): Promise<boolean>
  getScheduledEmails(): Promise<IEmailQueue[]>
}

export interface IEmailRenderer {
  renderTemplate(template: IEmailTemplate, variables: Record<string, any>): Promise<{ html: string, text: string }>
  validateTemplate(template: IEmailTemplate): boolean
  getTemplateVariables(template: IEmailTemplate): string[]
}
