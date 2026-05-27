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

export interface InscripcionResumen {
  curso_id: string
  inscrito_en: string
  nombre_completo?: string | null
  email?: string | null
  lecciones_completadas: number[]
}

/** Devuelve todas las inscripciones del usuario con sus lecciones completadas. */
export async function obtenerInscripcionesUsuario(
  walletAddress: string
): Promise<InscripcionResumen[]> {
  if (!supabase) return []
  const wallet = walletAddress.toLowerCase()

  const { data: insRows, error: insErr } = await supabase
    .from('curso_inscripciones')
    .select('curso_id, inscrito_en, nombre_completo, email')
    .eq('wallet_address', wallet)
    .order('inscrito_en', { ascending: false })
  if (insErr || !insRows || insRows.length === 0) return []

  const { data: progRows } = await supabase
    .from('curso_progreso')
    .select('curso_id, leccion_index')
    .eq('wallet_address', wallet)

  const progByCurso: Record<string, number[]> = {}
  for (const r of progRows || []) {
    if (!progByCurso[r.curso_id]) progByCurso[r.curso_id] = []
    progByCurso[r.curso_id].push(r.leccion_index)
  }

  return insRows.map((r) => ({
    curso_id: r.curso_id,
    inscrito_en: r.inscrito_en,
    nombre_completo: r.nombre_completo,
    email: r.email,
    lecciones_completadas: progByCurso[r.curso_id] ?? [],
  }))
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

/* ======================================================================
   Certificados NFT (CriptoUNAMBadges, kind=CourseCompletion)

   Tabla sugerida en Supabase:
     create table curso_certificados (
       id uuid primary key default gen_random_uuid(),
       wallet_address text not null,
       curso_id       text not null,
       badge_ref      text not null,  -- ej. course-1-v1
       token_id       numeric,
       tx_hash        text,
       claimed_at     timestamptz not null default now(),
       unique (wallet_address, badge_ref)
     );

   Si la tabla no existe, todas las funciones retornan estado vacío
   sin tirar errores (el reclamo on-chain sigue funcionando).
   ====================================================================== */

export interface CertificadoCurso {
  wallet_address: string
  curso_id: string
  badge_ref: string
  token_id?: string | null
  tx_hash?: string | null
  claimed_at: string
}

/** Verifica si el alumno completó el 100% de las lecciones de un curso. */
export async function cursoCompletado(
  walletAddress: string,
  cursoId: string,
  totalLecciones: number
): Promise<boolean> {
  if (totalLecciones <= 0) return false
  const completadas = await obtenerProgresoCurso(walletAddress, cursoId)
  const unicos = new Set(completadas)
  return unicos.size >= totalLecciones
}

/** Registra que el certificado fue emitido (idempotente por wallet+badge_ref). */
export async function registrarCertificadoEmitido(params: {
  walletAddress: string
  cursoId: string
  badgeRef: string
  tokenId?: string
  txHash?: string
}): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase.from('curso_certificados').upsert(
    {
      wallet_address: params.walletAddress.toLowerCase(),
      curso_id: params.cursoId,
      badge_ref: params.badgeRef,
      token_id: params.tokenId ?? null,
      tx_hash: params.txHash ?? null,
      claimed_at: new Date().toISOString()
    },
    { onConflict: 'wallet_address,badge_ref' }
  )
  if (error) {
    // Tabla puede no existir aún — log silencioso para no romper UX
    console.warn('curso_certificados upsert error (¿tabla creada?):', error.message)
    return false
  }
  return true
}

/** Devuelve el certificado registrado en Supabase si existe (puede ser null si no se ha reclamado). */
export async function obtenerCertificadoCurso(
  walletAddress: string,
  badgeRef: string
): Promise<CertificadoCurso | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('curso_certificados')
    .select('wallet_address, curso_id, badge_ref, token_id, tx_hash, claimed_at')
    .eq('wallet_address', walletAddress.toLowerCase())
    .eq('badge_ref', badgeRef)
    .maybeSingle()
  if (error) {
    return null
  }
  return (data as CertificadoCurso | null) ?? null
}

/** Lista todos los certificados registrados para una wallet (para el perfil). */
export async function obtenerCertificadosUsuario(
  walletAddress: string
): Promise<CertificadoCurso[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('curso_certificados')
    .select('wallet_address, curso_id, badge_ref, token_id, tx_hash, claimed_at')
    .eq('wallet_address', walletAddress.toLowerCase())
    .order('claimed_at', { ascending: false })
  if (error) return []
  return (data as CertificadoCurso[]) ?? []
}
