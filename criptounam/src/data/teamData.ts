/**
 * Miembros del equipo CriptoUNAM.
 * Editar aquí para cambiar roles, descripciones, agregar o quitar miembros.
 * Fotos en: public/images/Equipo/
 * Ver docs/PLAN_MEJORA_ACTUALIZACION.md
 */
export interface TeamMember {
  name: string
  role: string
  description: string
  image: string
  linkedin?: string
  twitter?: string
  github?: string
}

export const teamMembers: TeamMember[] = [
  // Founders
  {
    name: 'Gerardo Vela',
    role: 'Founder & CEO',
    description: 'Fundador y líder de CriptoUNAM. Experto en blockchain y criptomonedas.',
    image: '/images/Equipo/GerardoVela.jpg',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Fernanda Tello',
    role: 'Founder & COO',
    description: 'Co-fundadora y directora de operaciones. Especialista en estrategia y desarrollo.',
    image: '/images/Equipo/FernandaTello.jpg',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Adrian Armenta',
    role: 'Founder & CTO',
    description: 'Co-fundador y director técnico. Desarrollador blockchain y experto en DeFi.',
    image: '/images/Equipo/AArmenta.png',
    linkedin: '#',
    github: '#'
  },
  {
    name: 'Daniel Cruz',
    role: 'Founder & CMO',
    description: 'Co-fundador y director de marketing. Experto en crecimiento de comunidades blockchain.',
    image: '/images/Equipo/Kubs.png',
    linkedin: '#',
    twitter: '#'
  },
  // Embajadores
  {
    name: 'Andrés Rodríguez',
    role: 'Embajador CriptoUNAM',
    description: 'Embajador de la comunidad. Especialista en investigación blockchain.',
    image: '/images/Equipo/AndresRodriguez.jpg',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Adrián Martínez',
    role: 'Embajador CriptoUNAM',
    description: 'Embajador de la comunidad. Experto en protocolos de consenso.',
    image: '/images/Equipo/AdrianMartinez.png',
    linkedin: '#',
    github: '#'
  },
  {
    name: 'Ian Hernández',
    role: 'Embajador CriptoUNAM',
    description: 'Embajador de la comunidad. Especialista en smart contracts.',
    image: '/images/Equipo/IanHernandes.jpg',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Jorge Saldaña',
    role: 'Embajador CriptoUNAM',
    description: 'Embajador de la comunidad. Experto en desarrollo blockchain y Web3.',
    image: '/images/Equipo/JorgeSaldana.jpg',
    linkedin: '#',
    github: '#'
  },
  {
    name: 'Tadeo Sepúlveda',
    role: 'Embajador CriptoUNAM',
    description: 'Embajador de la comunidad. Especialista en educación blockchain.',
    image: '/images/Equipo/TadeoSepulveda.png',
    linkedin: '#',
    twitter: '#'
  },
  {
    name: 'Benjamín Romero',
    role: 'Embajador CriptoUNAM',
    description: 'Embajador de la comunidad. Experto en desarrollo de aplicaciones descentralizadas.',
    image: '/images/Equipo/BenjaminRomero.png',
    linkedin: '#',
    github: '#'
  }
]
