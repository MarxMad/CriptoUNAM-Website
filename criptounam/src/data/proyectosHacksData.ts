/**
 * Proyectos de hackathones CriptoUNAM.
 * Imágenes en: public/images/Proyectos_Hacks/
 * Editar aquí para actualizar en /proyectos y en la sección de Comunidad.
 */
const IMG = '/images/Proyectos_Hacks'

export interface ProyectoHackItem {
  id: string
  nombre: string
  descripcion: string
  demo?: string
  repo?: string
  red: string
  imagen: string
}

export const proyectosHacksData: ProyectoHackItem[] = [
  {
    id: 'blueprint',
    nombre: 'Blueprint',
    descripcion: 'Proyecto desarrollado en el hackathon de Mantle.',
    demo: 'https://blueprint-1-six.vercel.app/',
    repo: 'https://github.com/Mantle-Hackaton/Blueprint',
    red: 'Mantle',
    imagen: `${IMG}/BluePrint.svg`,
  },
  {
    id: 'econosfera',
    nombre: 'Econosfera',
    descripcion: 'Herramienta para economistas.',
    demo: 'https://econosfera.vercel.app/',
    repo: 'https://github.com/MarxMad/Econosfera',
    red: 'Herramienta para economistas',
    imagen: `${IMG}/Econosfera.svg`,
  },
  {
    id: 'pumapay',
    nombre: 'PumaPay',
    descripcion: 'Wallet universitaria para pagos en campus.',
    demo: 'https://puma-pay-campus-wallet.vercel.app/',
    repo: 'https://github.com/MarxMad/puma-pay-campus-wallet',
    red: 'Stellar',
    imagen: `${IMG}/PumaPay.svg`,
  },
  {
    id: 'faro',
    nombre: 'Faro',
    descripcion: 'Proyecto sobre la red Stellar.',
    demo: 'https://faro-gamma.vercel.app/',
    repo: 'https://github.com/MarxMad/Faro',
    red: 'Stellar',
    imagen: `${IMG}/Faro.svg`,
  },
  {
    id: 'unbox',
    nombre: 'Unbox',
    descripcion: 'Tokenización de streetwear y art toys en Solana.',
    demo: 'https://unbo-x.vercel.app/',
    repo: 'https://github.com/MarxMad/UnboX/tree/main',
    red: 'Solana',
    imagen: `${IMG}/Unbox.svg`, // Añadir Unbox.svg en public/images/Proyectos_Hacks/ cuando esté disponible
  },
  {
    id: 'mydentalvault',
    nombre: 'My Dental Vault',
    descripcion: 'Registro dental e historia médica en blockchain.',
    demo: 'https://nerd-camp.vercel.app/',
    repo: 'https://github.com/MarxMad/NerdCamp',
    red: 'Polkadot',
    imagen: `${IMG}/MyDentalVault.svg`,
  },
  {
    id: 'premio',
    nombre: 'Premio.xyz',
    descripcion: 'Plataforma de sorteos y premios descentralizados.',
    demo: 'https://celo-build-web-8rej.vercel.app/',
    repo: 'https://github.com/MarxMad/CeloBuild-/tree/main/apps/web',
    red: 'Celo',
    imagen: `${IMG}/Premioxyz.svg`,
  },
  {
    id: 'cirkula',
    nombre: 'CirKula',
    descripcion: 'Proyecto desarrollado en ETH México.',
    demo: 'https://eth-mex2025.vercel.app/',
    repo: 'https://github.com/MarxMad/EthMex2025',
    red: 'Arbitrum',
    imagen: `${IMG}/Cirkula.svg`,
  },
  {
    id: 'evvm',
    nombre: 'EVVM Explorer',
    descripcion: 'Explorador de bloques para EVVM.',
    demo: 'https://evvm-blockexplorer.vercel.app/',
    repo: 'https://github.com/MarxMad/EVVM-Blockexplorer',
    red: 'EVVM',
    imagen: `${IMG}/EVVM_Explorer.svg`,
  },
  {
    id: 'campuscoin',
    nombre: 'CampusCoin',
    descripcion: 'Token universitario para incentivos y gobernanza.',
    demo: 'https://base-batches-miniapp-cc.vercel.app/',
    repo: 'https://github.com/MarxMad/BaseBatches-MiniappCC',
    red: 'Base',
    imagen: `${IMG}/CampusCoin.svg`,
  },
  {
    id: 'copamundial',
    nombre: 'CopaMundial',
    descripcion: 'Predicciones y apuestas para el mundial.',
    demo: 'https://mundial-buzz.vercel.app/',
    repo: 'https://github.com/MarxMad/mundial-buzz',
    red: 'Chiliz',
    imagen: `${IMG}/CopaMundial.svg`,
  },
  {
    id: 'corewaves',
    nombre: 'Corewaves Agent',
    descripcion: 'Agentes y TokenLauncher sobre Core.',
    demo: 'https://coreweave-agents.vercel.app/dashboard',
    repo: 'https://github.com/MarxMad/coreweave-agents',
    red: 'Core',
    imagen: `${IMG}/Sinter.svg`, // placeholder
  },
  {
    id: 'verifica',
    nombre: 'Verifica.XYZ',
    descripcion: 'Transparencia institucional con ENS. Ganador de 3 tracks en ETH México Monterrey.',
    red: 'Ethereum',
    imagen: `${IMG}/Verifica.svg`,
  },
  {
    id: 'skillhub',
    nombre: 'SkillHub ID',
    descripcion: 'Certificación de habilidades a través de la comunidad.',
    demo: 'https://skill-hub-id.vercel.app/',
    repo: 'https://github.com/MarxMad/SkillHubID/tree/main/frontend-skillchain',
    red: 'Stellar',
    imagen: `${IMG}/SkilhubID.svg`,
  },
  {
    id: 'utonoma',
    nombre: 'UTONOMA',
    descripcion: 'Plataforma de videos descentralizada para contenido educativo.',
    demo: 'https://utonoma.com/',
    red: 'Web3',
    imagen: `${IMG}/UTONOMA.svg`,
  },
]
