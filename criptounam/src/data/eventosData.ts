/**
 * Eventos mostrados en la página (carrusel "Eventos anteriores" en Home).
 * Editar aquí para agregar o modificar eventos.
 *
 * Imágenes: colocar en public/images/eventos/ con los nombres indicados en cada
 * propiedad "image". Ver public/images/eventos/README.md para la lista de archivos.
 */

export interface EventoItem {
  id: string
  title: string
  date: string
  time: string
  location: string
  /** Ruta desde public: /images/eventos/nombre-archivo.jpg */
  image: string
  description: string
  capacity?: number
  registered?: number
  isUpcoming: boolean
}

export const eventosData: EventoItem[] = [
  {
    id: '1',
    title: 'Taller "Mi primer wallet" UNAM 2024',
    date: '9 de Septiembre, 2024',
    time: '9:00 AM - 6:00 PM',
    location: 'Anexo de la Facultad de Ingeniería, UNAM',
    image: '/images/eventos/01-taller-mi-primer-wallet-2024.jpg',
    description: 'Creación de una wallet en la red de Ethereum usando Metamask.',
    capacity: 200,
    registered: 156,
    isUpcoming: true,
  },
  {
    id: '2',
    title: 'Workshop: DeFi Fundamentals',
    date: '22 de Marzo, 2024',
    time: '2:00 PM - 5:00 PM',
    location: 'Auditorio Ho Chi Minh, FE-UNAM',
    image: '/images/eventos/02-workshop-defi-fundamentals-2024.jpg',
    description: 'Aprendiendo los fundamentos de las finanzas descentralizadas.',
    capacity: 80,
    registered: 67,
    isUpcoming: true,
  },
  {
    id: '3',
    title: 'Bitcoin Day',
    date: '7 de Mayo, 2024',
    time: '10:00 AM - 2:00 PM',
    location: 'FES Acatlán',
    image: '/images/eventos/03-bitcoin-day-2024.jpg',
    description: 'Explora las últimas tendencias en Web3 con expertos de la industria. Networking, demos en vivo y oportunidades de colaboración.',
    capacity: 150,
    registered: 134,
    isUpcoming: true,
  },
  {
    id: '4',
    title: 'Meetup: NFT y Arte Digital',
    date: '5 de Abril, 2024',
    time: '6:00 PM - 9:00 PM',
    location: 'Espacio de Innovación, UNAM',
    image: '/images/eventos/04-meetup-nft-arte-digital-2024.jpg',
    description: 'Descubre el mundo de los NFTs y su impacto en el arte digital. Presentaciones de artistas, galería virtual y subasta en vivo.',
    capacity: 60,
    registered: 45,
    isUpcoming: true,
  },
]
