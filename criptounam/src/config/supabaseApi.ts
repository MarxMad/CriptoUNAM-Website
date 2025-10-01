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

// API para suscripciones de newsletter
export const suscripcionesApi = {
  create: async (email: string, source: string = 'website'): Promise<void> => {
    console.log('📧 suscripcionesApi.create iniciado:', { email, source });
    // Solo usar campos que sabemos que existen, dejar que Supabase maneje el timestamp automáticamente
    const dataToInsert = { email, fuente: source };
    console.log('📊 Datos a insertar en suscripciones_newsletter:', dataToInsert);
    
    const { error } = await supabase
      .from('suscripciones_newsletter')
      .insert([dataToInsert])
    
    if (error) {
      console.error('❌ Error en suscripcionesApi.create:', error);
      throw error;
    }
    console.log('✅ Suscripción creada exitosamente en Supabase');
  },

  getAll: async () => {
    const { data, error } = await supabase
      .from('suscripciones_newsletter')
      .select('*')
      .order('id', { ascending: false })
    
    if (error) throw error
    return data
  }
}

// API para registros de comunidad
export const registrosComunidadApi = {
  create: async (datos: {
    nombre: string
    apellidos: string
    carrera: string
    plantel: string
    numeroCuenta: string
    edad: number
    motivacion: string
    twitter?: string
    instagram?: string
    linkedin?: string
    facebook?: string
    telegram?: string
  }): Promise<void> => {
    console.log('🎓 registrosComunidadApi.create iniciado con datos:', datos);
    
    // Mapear solo los campos básicos que sabemos que existen
    const dataToInsert = {
      nombre: datos.nombre,
      apellidos: datos.apellidos,
      carrera: datos.carrera,
      plantel: datos.plantel,
      edad: datos.edad,
      motivacion: datos.motivacion
    };
    
    console.log('📊 Datos a insertar en registros_comunidad (solo campos básicos):', dataToInsert);
    
    const { error } = await supabase
      .from('registros_comunidad')
      .insert([dataToInsert])
    
    if (error) {
      console.error('❌ Error en registrosComunidadApi.create:', error);
      throw error;
    }
    console.log('✅ Registro de comunidad creado exitosamente en Supabase');
  },

  getAll: async () => {
    const { data, error } = await supabase
      .from('registros_comunidad')
      .select('*')
      .order('id', { ascending: false })
    
    if (error) throw error
    return data
  }
}

// API para wallets conectadas
export const walletsApi = {
  create: async (datos: {
    address: string
    provider: string
    chainId?: string
    timestamp: string
  }): Promise<void> => {
    const { error } = await supabase
      .from('wallets_conectadas')
      .insert([{
        address: datos.address,
        provider: datos.provider,
        conectadoen: datos.timestamp
      }])
    
    if (error) throw error
  },

  getAll: async () => {
    const { data, error } = await supabase
      .from('wallets_conectadas')
      .select('*')
      .order('conectadoen', { ascending: false })
    
    if (error) throw error
    return data
  }
}

// Re-exportar tipos para uso externo
export type { Evento, Curso, NewsletterEntry } from './supabase';
