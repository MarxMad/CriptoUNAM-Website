/**
 * Servicio de progreso de cursos (Issues #9 y #10)
 * Usa tablas: curso_inscripciones, curso_progreso, perfiles_puntos
 */

import { supabase } from '../config/supabase'

const PUNTOS_POR_LECCION = 10
const PUNTOS_CURSO_COMPLETO = 50

export interface InscripcionCurso {
  wallet_address: string
  curso_id: string
  inscrito_en: string
  nombre_completo?: string
  email?: string
}

export interface ProgresoLeccionRow {
  wallet_address: string
  curso_id: string
  leccion_index: number
  completado_en: string
}

export interface PerfilPuntos {
  wallet_address: string
  puntos: number
  updated_at: string
}

/** Registrar inscripción a un curso (tras firma) */
export async function inscripcionCurso(params: {
  walletAddress: string
  cursoId: string
  nombre?: string
  email?: string
}): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase.from('curso_inscripciones').upsert(
    {
      wallet_address: params.walletAddress.toLowerCase(),
      curso_id: params.cursoId,
      nombre_completo: params.nombre ?? null,
      email: params.email ?? null,
      inscrito_en: new Date().toISOString()
    },
    { onConflict: 'wallet_address,curso_id' }
  )
  if (error) {
    console.error('Error guardando inscripción:', error)
    return false
  }
  return true
}

/** Verificar si el usuario está inscrito en un curso */
export async function estaInscrito(walletAddress: string, cursoId: string): Promise<boolean> {
  if (!supabase) return false
  const { data, error } = await supabase
    .from('curso_inscripciones')
    .select('id')
    .eq('wallet_address', walletAddress.toLowerCase())
    .eq('curso_id', cursoId)
    .maybeSingle()
  if (error) {
    console.error('Error verificando inscripción:', error)
    return false
  }
  return !!data
}

/** Obtener índices de lecciones completadas para un curso */
export async function obtenerProgresoCurso(
  walletAddress: string,
  cursoId: string
): Promise<number[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('curso_progreso')
    .select('leccion_index')
    .eq('wallet_address', walletAddress.toLowerCase())
    .eq('curso_id', cursoId)
    .order('leccion_index', { ascending: true })
  if (error) {
    console.error('Error obteniendo progreso:', error)
    return []
  }
  return (data || []).map((r) => r.leccion_index)
}

/** Marcar lección como completada y actualizar puntos */
export async function marcarLeccionCompletada(params: {
  walletAddress: string
  cursoId: string
  leccionIndex: number
  totalLecciones: number
}): Promise<boolean> {
  if (!supabase) return false
  const wallet = params.walletAddress.toLowerCase()

  const yaCompletada = await supabase
    .from('curso_progreso')
    .select('id')
    .eq('wallet_address', wallet)
    .eq('curso_id', params.cursoId)
    .eq('leccion_index', params.leccionIndex)
    .maybeSingle()

  const { error: errProgreso } = await supabase.from('curso_progreso').upsert(
    {
      wallet_address: wallet,
      curso_id: params.cursoId,
      leccion_index: params.leccionIndex,
      completado_en: new Date().toISOString()
    },
    { onConflict: 'wallet_address,curso_id,leccion_index' }
  )
  if (errProgreso) {
    console.error('Error guardando progreso:', errProgreso)
    return false
  }

  const esNueva = !yaCompletada.data
  if (!esNueva) return true

  const completadasAhora = (await obtenerProgresoCurso(wallet, params.cursoId)).length
  const cursoCompleto = completadasAhora >= params.totalLecciones

  const { data: perfil } = await supabase
    .from('perfiles_puntos')
    .select('puntos')
    .eq('wallet_address', wallet)
    .maybeSingle()

  const puntosActuales = perfil?.puntos ?? 0
  const suma = PUNTOS_POR_LECCION + (cursoCompleto ? PUNTOS_CURSO_COMPLETO : 0)
  const { error: errPuntos } = await supabase.from('perfiles_puntos').upsert(
    {
      wallet_address: wallet,
      puntos: puntosActuales + suma,
      updated_at: new Date().toISOString()
    },
    { onConflict: 'wallet_address' }
  )

  if (errPuntos) {
    console.error('Error actualizando puntos:', errPuntos)
  }

  return true
}

/** Obtener puntos de un usuario (para perfil) */
export async function obtenerPuntos(walletAddress: string): Promise<number> {
  if (!supabase) return 0
  const { data, error } = await supabase
    .from('perfiles_puntos')
    .select('puntos')
    .eq('wallet_address', walletAddress.toLowerCase())
    .maybeSingle()
  if (error) {
    console.error('Error obteniendo puntos:', error)
    return 0
  }
  return data?.puntos ?? 0
}

/** Recalcular puntos desde progreso (por si se cambian reglas); opcional */
export async function recalcularPuntos(walletAddress: string): Promise<number> {
  if (!supabase) return 0
  const wallet = walletAddress.toLowerCase()
  const { data: rows } = await supabase
    .from('curso_progreso')
    .select('curso_id, leccion_index')
    .eq('wallet_address', wallet)
  if (!rows || rows.length === 0) {
    await supabase.from('perfiles_puntos').upsert(
      { wallet_address: wallet, puntos: 0, updated_at: new Date().toISOString() },
      { onConflict: 'wallet_address' }
    )
    return 0
  }
  const porCurso = rows.reduce<Record<string, number[]>>((acc, r) => {
    if (!acc[r.curso_id]) acc[r.curso_id] = []
    acc[r.curso_id].push(r.leccion_index)
    return acc
  }, {})
  let total = 0
  for (const indices of Object.values(porCurso)) {
    total += indices.length * PUNTOS_POR_LECCION
  }
  const cursosCompletos = Object.keys(porCurso).length
  total += cursosCompletos * PUNTOS_CURSO_COMPLETO

  await supabase.from('perfiles_puntos').upsert(
    { wallet_address: wallet, puntos: total, updated_at: new Date().toISOString() },
    { onConflict: 'wallet_address' }
  )
  return total
}

export const PUNTOS = {
  POR_LECCION: PUNTOS_POR_LECCION,
  CURSO_COMPLETO: PUNTOS_CURSO_COMPLETO
}
