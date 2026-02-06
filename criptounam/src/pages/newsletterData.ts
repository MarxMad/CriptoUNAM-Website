/**
 * Interfaz legacy (inglés). No usar para el blog actual.
 * Las entradas del newsletter están en src/data/newsletterData.ts (NewsletterEntryItem).
 */
export interface NewsletterEntryLegacy {
  id: number
  _id?: string
  title: string
  date: string
  content: string
  fullContent: string
  imageUrl?: string
  author?: string
  tags?: string[]
} 