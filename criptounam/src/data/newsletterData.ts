/**
 * Entradas del blog / newsletter. Editar aquí para agregar o modificar notas.
 * El `id` se usa en la URL: /newsletter/:id
 */
export interface NewsletterEntryItem {
  id: string
  titulo: string
  contenido: string
  autor: string
  fecha: string
  imagen: string
  tags?: string[]
}

export const newsletterData: NewsletterEntryItem[] = [
  {
    id: 'intro-blockchain-2024',
    titulo: 'Introducción a Blockchain en la UNAM',
    autor: 'CriptoUNAM',
    fecha: '2024-09-15',
    imagen: '/images/cursos/1.svg',
    tags: ['Blockchain', 'Educación', 'UNAM'],
    contenido: 'La tecnología blockchain llegó para quedarse. En CriptoUNAM trabajamos para que la comunidad universitaria conozca sus fundamentos y aplicaciones.\n\nDesde talleres de "Mi primera wallet" hasta workshops de DeFi, nuestro objetivo es democratizar el conocimiento sobre criptomonedas y Web3.\n\nTe invitamos a seguir nuestras actividades y sumarte a la comunidad.',
  },
  {
    id: 'fundamentos-blockchain-2024',
    titulo: 'Fundamentos de Blockchain: Más allá de las Criptomonedas',
    autor: 'CriptoUNAM',
    fecha: '2024-10-01',
    imagen: '/images/blog/blockchain-intro.png',
    tags: ['Blockchain', 'Educación', 'Tecnología'],
    contenido: '# ¿Qué es realmente la Blockchain?\n\nMás allá del precio de Bitcoin o la especulación, la **Blockchain** (cadena de bloques) es una tecnología revolucionaria que permite la transferencia de valor e información sin intermediarios.\n\n## Conceptos Clave\n\n- **Descentralización**: Ninguna entidad controla la red.\n- **Inmutabilidad**: Una vez registrado, un dato es extremadamente difícil de alterar.\n- **Transparencia**: Todas las transacciones son públicas y auditables.\n\n### ¿Por qué es importante para un estudiante?\n\nEntender blockchain te abre las puertas a una industria en crecimiento explosivo. No solo se trata de finanzas, sino de identidad digital, trazabilidad en cadenas de suministro y gobernanza.\n\n> "Blockchain es al valor lo que Internet fue a la información."\n\nEn CriptoUNAM, creemos que la educación es el primer paso para la adopción masiva. ¡Únete a nuestros talleres para aprender más!',
  },
  {
    id: 'defi-fundamentals-workshop',
    titulo: 'Workshop DeFi: Fundamentos de las Finanzas Descentralizadas',
    autor: 'CriptoUNAM',
    fecha: '2024-03-22',
    imagen: '/images/cursos/3.svg',
    tags: ['DeFi', 'Ethereum', 'Educación'],
    contenido: 'El pasado 22 de marzo realizamos el workshop de DeFi Fundamentals en el Auditorio Ho Chi Minh de la Facultad de Economía.\n\nLos asistentes aprendieron sobre protocolos de lending, AMMs y el ecosistema DeFi en Ethereum.\n\nAgradecemos a todos los participantes y esperamos repetir pronto con temas más avanzados.',
  },
  {
    id: 'intro-smart-contracts-solidity',
    titulo: 'Tu Primer Smart Contract: Introducción a Solidity',
    autor: 'DevTeam CriptoUNAM',
    fecha: '2024-10-15',
    imagen: '/images/blog/smart-contracts.png',
    tags: ['Blockchain', 'Programación', 'Solidity', 'Ethereum'],
    contenido: '# Empezando con Smart Contracts\n\nLos **Smart Contracts** son programas que se ejecutan en la blockchain. Ethereum popularizó este concepto, permitiendo crear aplicaciones descentralizadas (dApps).\n\n## Herramientas para empezar\n\nPara programar en **Solidity**, necesitas conocer:\n\n1. **Remix IDE**: Un entorno de desarrollo en el navegador.\n2. **Metamask**: Tu puente para interactuar con la blockchain.\n3. **Fundamentos de POO**: Solidity se parece a Javascript y C++.\n\n### Ejemplo Básico\n\n```solidity\n// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\n\ncontract HolaMundo {\n    string public saludo = "Hola UNAM!";\n\n    function setSaludo(string memory _nuevoSaludo) public {\n        saludo = _nuevoSaludo;\n    }\n}\n```\n\nEste contrato simple permite almacenar y actualizar un mensaje en la blockchain. ¿Te animas a desplegarlo en una testnet?',
  },
  {
    id: 'bitcoin-day-2024',
    titulo: 'Bitcoin Day en FES Acatlán',
    autor: 'CriptoUNAM',
    fecha: '2024-05-07',
    imagen: '/images/Comunidad/_DSC0118 (1).jpg',
    tags: ['Bitcoin', 'Eventos', 'Web3'],
    contenido: 'Celebramos el Bitcoin Day en FES Acatlán con charlas, demos en vivo y networking.\n\nExpertos de la industria compartieron las últimas tendencias en Web3 y las oportunidades para desarrolladores y emprendedores.\n\nFue un gran día para la comunidad CriptoUNAM. ¡Nos vemos en el próximo evento!',
  },
  {
    id: 'frontend-dapps-web3',
    titulo: 'Frontend para dApps: Conectando Web3 con React',
    autor: 'DevTeam CriptoUNAM',
    fecha: '2024-11-01',
    imagen: '/images/blog/frontend-dapps.png',
    tags: ['Web3', 'Frontend', 'React', 'Programación'],
    contenido: '# Conectando el Frontend a la Blockchain\n\nUna **dApp** (Aplicación Descentralizada) necesita un frontend amigable. Aquí es donde entran librerías como **Ethers.js** o **Wagmi**.\n\n## El Stack Moderno\n\n- **React / Next.js**: Para la interfaz de usuario.\n- **Viem / Ethers.js**: Para interactuar con los smart contracts.\n- **RainbowKit / Web3Modal**: Para la conexión de wallets.\n\n### Conectando una Wallet\n\nEl flujo básico consiste en:\n\n1. Detectar el proveedor (window.ethereum).\n2. Solicitar acceso a las cuentas.\n3. Instanciar un contrato con su dirección y ABI.\n\n> **Tip**: Usa hooks como `useAccount` y `useContractRead` de Wagmi para simplificar la gestión del estado en React.\n\nEn nuestros próximos hackathones, enseñaremos cómo integrar todo esto para construir tu primera DeFi app.',
  },
]
