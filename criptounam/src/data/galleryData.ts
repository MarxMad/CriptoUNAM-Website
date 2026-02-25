/**
 * Galería "Nuestra Comunidad en Acción" (usada en página Comunidad).
 * Imágenes en: public/images/Comunidad/
 */
export interface GalleryImageItem {
  id: string
  src: string
  alt: string
  title?: string
  description?: string
  category: string
}

export const galleryData: GalleryImageItem[] = [
  {
    id: '1',
    src: '/images/Comunidad/_DSC0027 (1).jpg',
    alt: 'Hackathon Blockchain 2024',
    title: 'Hackathon Blockchain 2024',
    description: 'Estudiantes desarrollando proyectos innovadores',
    category: 'eventos'
  },
  {
    id: '2',
    src: '/images/Comunidad/_DSC0151.jpg',
    alt: 'Conferencia CriptoUNAM',
    title: 'Conferencia Anual 2024',
    description: 'Expertos compartiendo conocimiento sobre blockchain',
    category: 'eventos'
  },
  {
    id: '3',
    src: '/images/Comunidad/_DSC0051.jpg',
    alt: 'Workshop de Smart Contracts',
    title: 'Workshop Smart Contracts',
    description: 'Aprendiendo desarrollo de contratos inteligentes',
    category: 'talleres'
  },
  {
    id: '4',
    src: '/images/Comunidad/_DSC0278 (1).jpg',
    alt: 'Networking Event',
    title: 'Networking Event',
    description: 'Conectando con la comunidad blockchain',
    category: 'networking'
  },
  {
    id: '5',
    src: '/images/Comunidad/_DSC0118 (1).jpg',
    alt: 'Laboratorio de Blockchain',
    title: 'Laboratorio de Blockchain',
    description: 'Espacio de trabajo colaborativo',
    category: 'infraestructura'
  },
  {
    id: '6',
    src: '/images/Comunidad/_DSC0158 (1).jpg',
    alt: 'Equipo CriptoUNAM',
    title: 'Equipo CriptoUNAM',
    description: 'Nuestro equipo trabajando en proyectos innovadores',
    category: 'equipo'
  }
]
