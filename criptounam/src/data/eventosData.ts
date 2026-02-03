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
  link?: string
}


/**
 * CriptoUNAM Connect - Spaces y charlas en vivo
 * Cada space debe tener un banner/imagen para mostrar en la página
 */
export interface SpaceItem {
  id: string
  title: string
  date: string
  time: string
  host: string
  url: string // Link to X Space / Recording
  image: string // Banner del space (requerido)
  description?: string // Descripción breve del tema
  status: 'upcoming' | 'past'
}

export interface HackathonItem {
  id: string
  name: string
  description: string
  date: string
  location: string // 'Online', 'CDMX', etc.
  url: string
  image: string
  status: 'upcoming' | 'live' | 'past'
  prizes?: string
}

export const eventosData: EventoItem[] = [
  // ========== EVENTOS PRÓXIMOS ==========
  {
    id: '5',
    title: 'Binance University Tour - BUAP Puebla',
    date: '9 de Febrero, 2026',
    time: '10:30 AM - 4:00 PM',
    location: 'BUAP, Puebla',
    image: '/images/eventos/BinancePuebla.png',
    description: 'Binance University Tour llega a Puebla. Aprende sobre blockchain y criptomonedas con expertos de Binance.',
    capacity: 200,
    isUpcoming: true,
    link: 'https://luma.com/ljcqpyv2',
  },
  {
    id: '6',
    title: 'Labitconf 2026',
    date: '8-9 de Mayo, 2026',
    time: 'Todo el día',
    location: 'Buenos Aires, Argentina',
    image: '/images/eventos/Labitconf.svg',
    description: 'La conferencia de Bitcoin y blockchain más importante de Latinoamérica.',
    isUpcoming: true,
    link: 'https://labitconf.com',
  },
  // Nota: Los eventos finalizados sin foto fueron removidos para evitar confusión.
  // Agregar eventos pasados aquí solo cuando tengan imagen disponible en /images/eventos/
]

/**
 * CriptoUNAM Connect - Spaces y charlas en vivo
 * Agregar banners en /public/images/spaces/
 */
export const spacesData: SpaceItem[] = [
  {
    id: 'space-1',
    title: 'El Futuro de Ethereum con Vitalik (Recap)',
    date: '10 de Octubre, 2024',
    time: '8:00 PM',
    host: 'CriptoUNAM Core Team',
    url: 'https://twitter.com/criptounam',
    image: '/images/spaces/ethereum-future.png', // TODO: Agregar imagen
    description: 'Análisis de las últimas propuestas de Vitalik para el futuro de Ethereum.',
    status: 'past',
  },
  {
    id: 'space-2',
    title: 'Introducción a Starknet y L2s',
    date: '15 de Noviembre, 2024',
    time: '7:00 PM',
    host: 'Starknet Mexico',
    url: 'https://twitter.com/criptounam',
    image: '/images/spaces/starknet-l2s.png', // TODO: Agregar imagen
    description: 'Aprende sobre las soluciones de escalabilidad Layer 2 y Starknet.',
    status: 'upcoming',
  }
]

export const hackathonsData: HackathonItem[] = [
  // ========== HACKATHONES 2026 ==========
  {
    id: 'hack-celo',
    name: 'Celo - Latam Buildathon',
    description: 'Hackathon específico para talento de Latinoamérica. Enfocado en "ship fast" y MiniApps (Farcaster/MiniPay). ¡Dan 3 CELO para gas por equipo!',
    date: '19 Enero - 27 Febrero, 2026',
    location: 'Online',
    url: 'https://latamhubs.lat',
    image: '/images/hackathones_proximos/celobuild.jpeg',
    status: 'upcoming',
    prizes: 'Open Track + MiniApps Track',
  },
  {
    id: 'hack-avalanche',
    name: 'Avalanche - Build Games',
    description: 'Competencia enfocada en productos de alta calidad y cultura crypto nativa. Buscan builders que entreguen un producto real en 6 semanas.',
    date: '20 Enero - 13 Febrero, 2026',
    location: 'Online',
    url: 'https://build.avax.network',
    image: '/images/hackathones_proximos/avas.jpeg',
    status: 'upcoming',
    prizes: '$1,000,000 USD',
  },
  {
    id: 'hack-near',
    name: 'NEAR - Innovation Sandbox',
    description: 'Sprint virtual sobre capacidades avanzadas de NEAR: AI Agentes, Abstracción de Cuentas y Privacidad. Los ganadores se presentan en NEARCON.',
    date: '26 Enero - 16 Febrero, 2026',
    location: 'Online',
    url: 'https://nearcon.org/innovation-sandbox',
    image: '/images/hackathones_proximos/nearhack.jpeg',
    status: 'upcoming',
    prizes: 'Presentación en NEARCON',
  },
  {
    id: 'hack-starknet',
    name: 'Starknet - Re{define} Hackathon',
    description: 'Enfocado en escalar Bitcoin y soluciones de privacidad usando ZK-Proofs. DeFi nativo en BTC y aplicaciones de privacidad en Cairo.',
    date: '1 Febrero - 28 Febrero, 2026',
    location: 'Online',
    url: 'https://hackathon.starknet.org',
    image: '/images/hackathones_proximos/starknet.jpeg',
    status: 'upcoming',
    prizes: 'DeFi + Privacy Tracks',
  },
  {
    id: 'hack-gemini',
    name: 'Gemini 3.0: The Space-Time Odyssey',
    description: 'Hackathon masivo centrado en la red Gemini (Subspace Network) para infraestructura descentralizada. Web3 Infrastructure, AI descentralizada y DePIN.',
    date: '2 Febrero - 16 Marzo, 2026',
    location: 'Online',
    url: 'https://gemini3.devpost.com',
    image: '/images/hackathones_proximos/gemini.jpeg',
    status: 'upcoming',
    prizes: '$100,000 USD',
  },
  {
    id: 'hack-arbitrum',
    name: 'Arbitrum - Open House NYC',
    description: 'Construye sobre el stack que usan grandes instituciones. DeFi, Gaming o DePIN usando Stylus (Rust) o Solidity. Los mejores van a Founder House en NYC.',
    date: '5 Febrero - 22 Febrero, 2026',
    location: 'Online + NYC',
    url: 'https://hackquest.io',
    image: '/images/hackathones_proximos/arbitrum.jpeg',
    status: 'upcoming',
    prizes: 'Founder House NYC',
  },
  {
    id: 'hack-hedera',
    name: 'Hedera - Hello Future Apex Hackathon',
    description: 'Evento virtual global para innovar sobre Hedera. Tracks: AI & Agentes, Tokenización y Sustentabilidad.',
    date: '17 Febrero - 16 Marzo, 2026',
    location: 'Online',
    url: 'https://stackup.dev',
    image: '/images/hackathones_proximos/Hedera.jpeg',
    status: 'upcoming',
    prizes: '$250,000 USD',
  },
  {
    id: 'hack-chainlink',
    name: 'Chainlink - Convergence Hackathon',
    description: 'Interoperabilidad y datos del mundo real. Uso de CCIP y Oráculos para conectar smart contracts con cualquier API.',
    date: 'Registro Abierto, 2026',
    location: 'Online',
    url: 'https://chain.link/hackathon',
    image: '/images/hackathones_proximos/chainlink.jpeg',
    status: 'upcoming',
    prizes: 'CCIP + Oracles Tracks',
  },
  {
    id: 'hack-ethglobal-hackmoney',
    name: 'ETHGlobal - HackMoney 2026',
    description: 'El evento cumbre para el futuro de las finanzas descentralizadas. El hackathon DeFi más importante del ecosistema Ethereum.',
    date: 'Próximamente, 2026',
    location: 'Online',
    url: 'https://ethglobal.com/events/hackmoney2026',
    image: '/images/hackathones_proximos/hackmoney.jpeg',
    status: 'upcoming',
    prizes: 'DeFi Track',
  },
]
