import { IMAGES } from './images'
import { capitulosIntroBlockchain } from './cursoIntroBlockchain'

export interface PreguntaCuestionario {
  pregunta: string
  opciones: string[]
  correcta: number // índice de la opción correcta (0-based)
}

export interface Leccion {
  id: number
  titulo: string
  descripcion: string
  /** URL de video (opcional; si hay guía, se prioriza la guía) */
  video?: string
  /** Guía escrita tipo libro didáctico (HTML o texto con \n) */
  guia?: string
  /** Cuestionario para afianzar la lección */
  cuestionario?: PreguntaCuestionario[]
}

/** Capítulo de un curso: agrupa secciones con un título común */
export interface Capitulo {
  id: number | string
  titulo: string
  descripcion?: string
  secciones: Leccion[]
}

export interface Curso {
  id: string
  titulo: string
  nivel: 'Principiante' | 'Intermedio' | 'Avanzado'
  duracion: string
  imagen: string
  descripcion: string
  precio: number
  /** Precio del curso en $PUMA. Si es undefined o 0 → curso gratuito (solo firma). */
  precioPuma?: number
  /**
   * Identificador de cohorte/versión del curso para el certificado on-chain.
   * Se usa para construir el `ref` único en CriptoUNAMBadges (kind=CourseCompletion).
   * Default: "v1". Cambia cuando relances el curso (ej. "2026-Q2").
   */
  cohorteRef?: string
  estudiantes: number
  rating: number
  categorias: string[]
  /** Lecciones en formato plano (cursos simples) */
  lecciones?: Leccion[]
  /** Capítulos con secciones (curso tipo libro; si existe, se usa en lugar de lecciones) */
  capitulos?: Capitulo[]
  requisitos?: string
}

/** Devuelve la lista plana de lecciones/secciones para un curso (desde capitulos o lecciones) */
export function getLeccionesFlat(curso: Curso): Leccion[] {
  if (curso.capitulos && curso.capitulos.length > 0) {
    return curso.capitulos.flatMap((c) => c.secciones)
  }
  return curso.lecciones ?? []
}

/**
 * Devuelve el `ref` único del certificado on-chain para un curso.
 * Formato estable: `course-{cursoId}-{cohorteRef}` (cohorteRef default = "v1").
 * Coincide con la convención de CriptoUNAMBadges (kind=CourseCompletion).
 */
export function cursoBadgeRef(cursoId: string, cohorteRef?: string): string {
  const cohort = (cohorteRef && cohorteRef.trim()) || 'v1'
  return `course-${cursoId}-${cohort}`
}

export const cursosData: Curso[] = [
  {
    id: '1',
    titulo: 'Introducción a Blockchain',
    nivel: 'Principiante',
    duracion: '4-6 semanas',
    imagen: IMAGES.CURSOS.BLOCKCHAIN_BASICS,
    descripcion: 'Curso tipo libro: desde antes de Satoshi hasta contratos inteligentes. Contexto histórico, whitepaper, bloques, minería, consenso, Ethereum y referencias bibliográficas.',
    precio: 0,
    estudiantes: 1200,
    rating: 4.8,
    categorias: ['Blockchain', 'Tecnología', 'Fundamentos'],
    requisitos: 'No se requieren conocimientos previos.',
    capitulos: capitulosIntroBlockchain
  },
  {
    id: '2',
    titulo: 'Smart Contracts con Solidity',
    nivel: 'Intermedio',
    duracion: '4 semanas',
    imagen: IMAGES.CURSOS.SMART_CONTRACTS,
    descripcion: 'Desarrolla contratos inteligentes en la red Ethereum.',
    precio: 0,
    estudiantes: 800,
    rating: 4.9,
    categorias: ['Ethereum', 'Desarrollo', 'Smart Contracts'],
    requisitos: 'Conocimientos básicos de blockchain recomendados.',
    lecciones: [
      { id: 1, titulo: 'Introducción a Solidity', video: 'https://www.youtube.com/embed/gyMwXuJrbJQ', descripcion: 'Primeros pasos con Solidity.' },
      { id: 2, titulo: 'Variables y Tipos', video: 'https://www.youtube.com/embed/1YVJt2Q1gZQ', descripcion: 'Variables, tipos y estructuras.' },
      { id: 3, titulo: 'Funciones y Contratos', video: 'https://www.youtube.com/embed/8jI1TuEaTro', descripcion: 'Cómo escribir funciones y contratos.' },
    ]
  },
  {
    id: '3',
    titulo: 'DeFi y Finanzas Descentralizadas',
    nivel: 'Avanzado',
    duracion: '2 semanas',
    imagen: IMAGES.CURSOS.DEFI,
    descripcion: 'Explora el mundo de las finanzas descentralizadas y sus protocolos.',
    precio: 0,
    estudiantes: 600,
    rating: 4.7,
    categorias: ['DeFi', 'Finanzas', 'Trading'],
    requisitos: 'Conocimientos básicos de Ethereum y wallets recomendados.',
    lecciones: [
      { id: 1, titulo: '¿Qué es DeFi?', video: 'https://www.youtube.com/embed/8XGQGhli0IY', descripcion: 'Introducción a las finanzas descentralizadas.' },
      { id: 2, titulo: 'Protocolos DeFi', video: 'https://www.youtube.com/embed/8XGQGhli0IY', descripcion: 'Principales protocolos y casos de uso.' },
      { id: 3, titulo: 'Riesgos y Seguridad', video: 'https://www.youtube.com/embed/8XGQGhli0IY', descripcion: 'Riesgos y mejores prácticas.' },
    ]
  }
]
