import { IMAGES } from './images'

export interface Curso {
  id: string
  titulo: string
  nivel: 'Principiante' | 'Intermedio' | 'Avanzado'
  duracion: string
  imagen: string
  descripcion: string
  instructor: string
  precio: number
  estudiantes: number
  rating: number
  categorias: string[]
  lecciones?: { id: number, titulo: string, video: string, descripcion: string }[]
  requisitos?: string
}

export const cursosData: Curso[] = [
  {
    id: '1',
    titulo: 'Introducción a Blockchain',
    nivel: 'Principiante',
    duracion: '2 semanas',
    imagen: IMAGES.CURSOS.BLOCKCHAIN_BASICS,
    descripcion: 'Aprende los fundamentos de la tecnología blockchain y sus aplicaciones.',
    instructor: 'Gerardo Pedrizco Vela',
    precio: 0,
    estudiantes: 1200,
    rating: 4.8,
    categorias: ['Blockchain', 'Tecnología', 'Fundamentos'],
    requisitos: 'No se requieren conocimientos previos.',
    lecciones: [
      { id: 1, titulo: '¿Qué es Blockchain?', video: 'https://www.youtube.com/embed/SSo_EIwHSd4', descripcion: 'Conceptos básicos de blockchain.' },
      { id: 2, titulo: 'Criptomonedas y Bitcoin', video: 'https://www.youtube.com/embed/bBC-nXj3Ng4', descripcion: '¿Qué es una criptomoneda? ¿Cómo funciona Bitcoin?' },
      { id: 3, titulo: 'Contratos Inteligentes', video: 'https://www.youtube.com/embed/ZE2HxTmxfrI', descripcion: 'Introducción a los smart contracts.' },
    ]
  },
  {
    id: '2',
    titulo: 'Smart Contracts con Solidity',
    nivel: 'Intermedio',
    duracion: '4 semanas',
    imagen: IMAGES.CURSOS.SMART_CONTRACTS,
    descripcion: 'Desarrolla contratos inteligentes en la red Ethereum.',
    instructor: 'Adrian Armenta Sequeira',
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
    instructor: 'Fernanda Tello Arzate',
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