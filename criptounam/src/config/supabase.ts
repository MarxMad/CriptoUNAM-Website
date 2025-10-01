import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://shccrrwnmogswspvlakf.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoY2NycndubW9nc3dzcHZsYWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyODYwNzcsImV4cCI6MjA3NDg2MjA3N30.heVBb4qhASOv6UZlfrTkZpoiQbva3JXFynn2AhO6_oM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para TypeScript
export interface Evento {
  id?: string
  tipo: 'proximo' | 'anterior'
  titulo: string
  fecha: string
  hora?: string
  lugar: string
  cupo: number
  descripcion?: string
  imagen?: string
  imagenPrincipal?: string
  fotos?: string[]
  videos?: string[]
  presentaciones?: string[]
  registrolink?: string
  creadoEn?: string
  esFuturo?: boolean
}

export interface Curso {
  id?: string
  titulo: string
  descripcion: string
  duracion: string
  nivel: string
  instructor: string
  imagen: string
  precio: number
  fechaInicio: string
  fechaFin: string
  cupo: number
  creadoEn?: string
}

export interface NewsletterEntry {
  id?: string
  titulo: string
  contenido: string
  autor: string
  fecha: string
  imagen?: string
  tags?: string[]
  creadoEn?: string
}

// Funciones de utilidad para Supabase
export const uploadImageToSupabase = async (file: File, bucket: string = 'images'): Promise<string> => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`
  const filePath = `${fileName}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)

  if (error) {
    throw new Error(`Error uploading image: ${error.message}`)
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return publicUrl
}

export const uploadMultipleImagesToSupabase = async (files: File[], bucket: string = 'images'): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadImageToSupabase(file, bucket))
  return Promise.all(uploadPromises)
}
