import { supabase, Evento, Curso, NewsletterEntry, uploadImageToSupabase, uploadMultipleImagesToSupabase } from './supabase'

// API para Eventos
export const eventosApi = {
  // Obtener todos los eventos
  async getAll(): Promise<Evento[]> {
    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .order('fecha', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Obtener evento por ID
  async getById(id: string): Promise<Evento | null> {
    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Crear evento
  async create(evento: Omit<Evento, 'id' | 'creadoEn'>): Promise<Evento> {
    const { data, error } = await supabase
      .from('eventos')
      .insert([evento])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Actualizar evento
  async update(id: string, evento: Partial<Evento>): Promise<Evento> {
    const { data, error } = await supabase
      .from('eventos')
      .update(evento)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Eliminar evento
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('eventos')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Subir imagen de evento
  async uploadEventImage(file: File): Promise<string> {
    return uploadImageToSupabase(file, 'eventos')
  },

  // Subir múltiples imágenes
  async uploadMultipleImages(files: File[]): Promise<string[]> {
    return uploadMultipleImagesToSupabase(files, 'eventos')
  }
}

// API para Cursos
export const cursosApi = {
  async getAll(): Promise<Curso[]> {
    const { data, error } = await supabase
      .from('cursos')
      .select('*')
      .order('fechaInicio', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Curso | null> {
    const { data, error } = await supabase
      .from('cursos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(curso: Omit<Curso, 'id' | 'creadoEn'>): Promise<Curso> {
    const { data, error } = await supabase
      .from('cursos')
      .insert([curso])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, curso: Partial<Curso>): Promise<Curso> {
    const { data, error } = await supabase
      .from('cursos')
      .update(curso)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('cursos')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async uploadCourseImage(file: File): Promise<string> {
    return uploadImageToSupabase(file, 'cursos')
  }
}

// API para Newsletter
export const newsletterApi = {
  async getAll(): Promise<NewsletterEntry[]> {
    const { data, error } = await supabase
      .from('newsletter')
      .select('*')
      .order('fecha', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<NewsletterEntry | null> {
    const { data, error } = await supabase
      .from('newsletter')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(entry: Omit<NewsletterEntry, 'id' | 'creadoEn'>): Promise<NewsletterEntry> {
    const { data, error } = await supabase
      .from('newsletter')
      .insert([entry])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, entry: Partial<NewsletterEntry>): Promise<NewsletterEntry> {
    const { data, error } = await supabase
      .from('newsletter')
      .update(entry)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('newsletter')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async uploadNewsletterImage(file: File): Promise<string> {
    return uploadImageToSupabase(file, 'newsletter')
  }
}

// Re-exportar tipos para uso externo
export type { Evento, Curso, NewsletterEntry } from './supabase';
