/**
 * Servicio de Cursos - CriptoUNAM
 * Maneja las operaciones de cursos con Supabase
 */

import { supabase } from '../config/supabase'

// ==========================================
// TIPOS
// ==========================================

export interface Curso {
  id: string
  slug: string
  titulo: string
  descripcion: string
  descripcion_corta?: string
  nivel: 'Principiante' | 'Intermedio' | 'Avanzado'
  duracion?: string
  instructor?: string
  instructor_avatar?: string
  imagen?: string
  precio: number
  categorias: string[]
  requisitos?: string
  objetivos?: string[]
  rating: number
  total_estudiantes: number
  total_lecciones: number
  duracion_total_minutos: number
  is_published: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
  // Relaciones
  modulos?: Modulo[]
  lecciones?: Leccion[]
}

export interface Modulo {
  id: string
  curso_id: string
  titulo: string
  descripcion?: string
  orden: number
  is_published: boolean
  lecciones?: Leccion[]
}

export interface Leccion {
  id: string
  curso_id: string
  modulo_id?: string
  titulo: string
  descripcion?: string
  tipo: 'video' | 'texto' | 'quiz' | 'ejercicio'
  video_url?: string
  video_plataforma: 'youtube' | 'vimeo' | 'bunny' | 'directo'
  duracion_minutos: number
  contenido_texto?: string
  recursos?: { nombre: string; url: string; tipo: string }[]
  orden: number
  is_preview: boolean
  is_published: boolean
}

export interface Inscripcion {
  id: string
  user_id: string
  curso_id: string
  nombre_completo?: string
  email?: string
  estado: 'activo' | 'completado' | 'cancelado' | 'pausado'
  progreso_porcentaje: number
  fecha_inscripcion: string
  fecha_completado?: string
  ultima_actividad: string
}

export interface ProgresoLeccion {
  id: string
  user_id: string
  leccion_id: string
  curso_id: string
  completada: boolean
  progreso_video: number
  fecha_completado?: string
  notas?: string
}

export interface Certificado {
  id: string
  user_id: string
  curso_id: string
  codigo_verificacion: string
  nombre_estudiante: string
  titulo_curso: string
  instructor?: string
  nft_token_id?: string
  fecha_emision: string
}

// ==========================================
// SERVICIO DE CURSOS
// ==========================================

class CursosService {
  // ========================================
  // CURSOS
  // ========================================

  /**
   * Obtener todos los cursos publicados
   */
  async getCursos(options?: {
    nivel?: string
    categoria?: string
    featured?: boolean
    limit?: number
  }): Promise<Curso[]> {
    if (!supabase) {
      console.warn('Supabase no configurado, usando datos locales')
      return []
    }

    let query = supabase
      .from('cursos')
      .select('*')
      .eq('is_published', true)
      .order('orden', { ascending: true })

    if (options?.nivel) {
      query = query.eq('nivel', options.nivel)
    }

    if (options?.categoria) {
      query = query.contains('categorias', [options.categoria])
    }

    if (options?.featured) {
      query = query.eq('is_featured', true)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error obteniendo cursos:', error)
      return []
    }

    return data || []
  }

  /**
   * Obtener un curso por slug con sus lecciones
   */
  async getCursoBySlug(slug: string): Promise<Curso | null> {
    if (!supabase) return null

    const { data: curso, error } = await supabase
      .from('cursos')
      .select(`
        *,
        modulos (
          *,
          lecciones (*)
        ),
        lecciones (*)
      `)
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (error) {
      console.error('Error obteniendo curso:', error)
      return null
    }

    return curso
  }

  /**
   * Obtener un curso por ID
   */
  async getCursoById(id: string): Promise<Curso | null> {
    if (!supabase) return null

    const { data, error } = await supabase
      .from('cursos')
      .select(`
        *,
        modulos (
          *,
          lecciones (*)
        ),
        lecciones (*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error obteniendo curso:', error)
      return null
    }

    return data
  }

  // ========================================
  // LECCIONES
  // ========================================

  /**
   * Obtener lecciones de un curso
   */
  async getLeccionesByCurso(cursoId: string): Promise<Leccion[]> {
    if (!supabase) return []

    const { data, error } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', cursoId)
      .eq('is_published', true)
      .order('orden', { ascending: true })

    if (error) {
      console.error('Error obteniendo lecciones:', error)
      return []
    }

    return data || []
  }

  /**
   * Obtener una lección específica
   */
  async getLeccion(leccionId: string): Promise<Leccion | null> {
    if (!supabase) return null

    const { data, error } = await supabase
      .from('lecciones')
      .select('*')
      .eq('id', leccionId)
      .single()

    if (error) {
      console.error('Error obteniendo lección:', error)
      return null
    }

    return data
  }

  // ========================================
  // INSCRIPCIONES
  // ========================================

  /**
   * Inscribir usuario a un curso
   */
  async inscribirUsuario(params: {
    userId: string
    cursoId: string
    nombre?: string
    email?: string
  }): Promise<Inscripcion | null> {
    if (!supabase) return null

    const { data, error } = await supabase
      .from('inscripciones_cursos')
      .upsert({
        user_id: params.userId,
        curso_id: params.cursoId,
        nombre_completo: params.nombre,
        email: params.email,
        estado: 'activo',
        fecha_inicio: new Date().toISOString()
      }, {
        onConflict: 'user_id,curso_id'
      })
      .select()
      .single()

    if (error) {
      console.error('Error inscribiendo usuario:', error)
      return null
    }

    return data
  }

  /**
   * Verificar si un usuario está inscrito
   */
  async verificarInscripcion(userId: string, cursoId: string): Promise<Inscripcion | null> {
    if (!supabase) return null

    const { data, error } = await supabase
      .from('inscripciones_cursos')
      .select('*')
      .eq('user_id', userId)
      .eq('curso_id', cursoId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
      console.error('Error verificando inscripción:', error)
    }

    return data || null
  }

  /**
   * Obtener inscripciones de un usuario
   */
  async getInscripcionesUsuario(userId: string): Promise<Inscripcion[]> {
    if (!supabase) return []

    const { data, error } = await supabase
      .from('inscripciones_cursos')
      .select(`
        *,
        curso:cursos (*)
      `)
      .eq('user_id', userId)
      .order('ultima_actividad', { ascending: false })

    if (error) {
      console.error('Error obteniendo inscripciones:', error)
      return []
    }

    return data || []
  }

  // ========================================
  // PROGRESO
  // ========================================

  /**
   * Marcar lección como completada
   */
  async completarLeccion(params: {
    userId: string
    leccionId: string
    cursoId: string
  }): Promise<boolean> {
    if (!supabase) return false

    const { error } = await supabase
      .from('progreso_lecciones')
      .upsert({
        user_id: params.userId,
        leccion_id: params.leccionId,
        curso_id: params.cursoId,
        completada: true,
        fecha_completado: new Date().toISOString()
      }, {
        onConflict: 'user_id,leccion_id'
      })

    if (error) {
      console.error('Error marcando lección como completada:', error)
      return false
    }

    return true
  }

  /**
   * Actualizar progreso de video
   */
  async actualizarProgresoVideo(params: {
    userId: string
    leccionId: string
    cursoId: string
    segundos: number
    duracionTotal: number
  }): Promise<boolean> {
    if (!supabase) return false

    const completada = params.segundos >= params.duracionTotal * 0.9 // 90% = completado

    const { error } = await supabase
      .from('progreso_lecciones')
      .upsert({
        user_id: params.userId,
        leccion_id: params.leccionId,
        curso_id: params.cursoId,
        progreso_video: params.segundos,
        duracion_total: params.duracionTotal,
        ultima_posicion: params.segundos,
        completada,
        fecha_completado: completada ? new Date().toISOString() : null
      }, {
        onConflict: 'user_id,leccion_id'
      })

    if (error) {
      console.error('Error actualizando progreso:', error)
      return false
    }

    return true
  }

  /**
   * Obtener progreso de un usuario en un curso
   */
  async getProgresoCurso(userId: string, cursoId: string): Promise<ProgresoLeccion[]> {
    if (!supabase) return []

    const { data, error } = await supabase
      .from('progreso_lecciones')
      .select('*')
      .eq('user_id', userId)
      .eq('curso_id', cursoId)

    if (error) {
      console.error('Error obteniendo progreso:', error)
      return []
    }

    return data || []
  }

  // ========================================
  // CERTIFICADOS
  // ========================================

  /**
   * Generar certificado al completar curso
   */
  async generarCertificado(params: {
    userId: string
    cursoId: string
    nombreEstudiante: string
  }): Promise<Certificado | null> {
    if (!supabase) return null

    // Verificar que el curso está completado
    const inscripcion = await this.verificarInscripcion(params.userId, params.cursoId)
    if (!inscripcion || inscripcion.progreso_porcentaje < 100) {
      console.error('El curso no está completado')
      return null
    }

    // Obtener datos del curso
    const curso = await this.getCursoById(params.cursoId)
    if (!curso) return null

    // Generar código único
    const codigoVerificacion = `CUNAM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    const { data, error } = await supabase
      .from('certificados')
      .upsert({
        user_id: params.userId,
        curso_id: params.cursoId,
        inscripcion_id: inscripcion.id,
        codigo_verificacion: codigoVerificacion,
        nombre_estudiante: params.nombreEstudiante,
        titulo_curso: curso.titulo,
        instructor: curso.instructor
      }, {
        onConflict: 'user_id,curso_id'
      })
      .select()
      .single()

    if (error) {
      console.error('Error generando certificado:', error)
      return null
    }

    return data
  }

  /**
   * Verificar certificado por código
   */
  async verificarCertificado(codigo: string): Promise<Certificado | null> {
    if (!supabase) return null

    const { data, error } = await supabase
      .from('certificados')
      .select(`
        *,
        curso:cursos (titulo, imagen)
      `)
      .eq('codigo_verificacion', codigo)
      .single()

    if (error) {
      console.error('Error verificando certificado:', error)
      return null
    }

    return data
  }

  /**
   * Obtener certificados de un usuario
   */
  async getCertificadosUsuario(userId: string): Promise<Certificado[]> {
    if (!supabase) return []

    const { data, error } = await supabase
      .from('certificados')
      .select(`
        *,
        curso:cursos (titulo, imagen)
      `)
      .eq('user_id', userId)
      .order('fecha_emision', { ascending: false })

    if (error) {
      console.error('Error obteniendo certificados:', error)
      return []
    }

    return data || []
  }
}

// Exportar instancia única
export const cursosService = new CursosService()
export default cursosService
