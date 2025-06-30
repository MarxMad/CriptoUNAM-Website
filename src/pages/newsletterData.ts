export interface NewsletterEntry {
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

// Eliminadas las entradas hardcodeadas. Si se requiere la interfaz, se puede dejar solo la exportación de la interfaz NewsletterEntry. 