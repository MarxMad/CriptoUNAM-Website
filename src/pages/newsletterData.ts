export interface NewsletterEntry {
  id: number
  title: string
  date: string
  content: string
  fullContent: string
  imageUrl?: string
  author?: string
  tags?: string[]
}

export const newsletterEntries: NewsletterEntry[] = [
  {
    id: 1,
    title: 'Introducción a Web3: El Futuro de Internet',
    date: '15 de abril, 2024',
    content: 'En esta edición exploramos los fundamentos de Web3 y cómo está transformando la forma en que interactuamos con internet. Desde la descentralización hasta los contratos inteligentes, te llevamos a través de los conceptos básicos que todo entusiasta de blockchain debe conocer.',
    fullContent: `En esta edición exploramos los fundamentos de Web3 y cómo está transformando la forma en que interactuamos con internet. Desde la descentralización hasta los contratos inteligentes, te llevamos a través de los conceptos básicos que todo entusiasta de blockchain debe conocer.

La Web3 representa una nueva era en la evolución de internet, donde la descentralización y la transparencia son fundamentales. A diferencia de la Web2, que está dominada por grandes corporaciones que controlan nuestros datos, la Web3 pone el poder en manos de los usuarios.

En esta edición especial, cubriremos:
- Los principios fundamentales de la Web3
- Cómo funcionan los contratos inteligentes
- El papel de las DAOs en la gobernanza descentralizada
- Casos de uso reales de la Web3 en la actualidad
- El futuro de la descentralización

Además, tendremos una entrevista exclusiva con expertos en el campo que compartirán sus perspectivas sobre el futuro de esta tecnología revolucionaria.`,
    imageUrl: '/images/web3-intro.jpg',
    author: 'Dr. Blockchain',
    tags: ['Web3', 'Blockchain', 'Descentralización']
  },
  {
    id: 2,
    title: 'Bitcoin Halving 2024: ¿Qué Significa para el Mercado?',
    date: '10 de abril, 2024',
    content: 'Analizamos el próximo halving de Bitcoin y sus posibles implicaciones en el mercado de criptomonedas. Incluimos perspectivas de expertos y datos históricos para entender mejor este importante evento en el ecosistema Bitcoin.',
    fullContent: `Analizamos el próximo halving de Bitcoin y sus posibles implicaciones en el mercado de criptomonedas. Incluimos perspectivas de expertos y datos históricos para entender mejor este importante evento en el ecosistema Bitcoin.

El halving de Bitcoin es un evento programado que ocurre aproximadamente cada cuatro años, donde la recompensa por minar nuevos bloques se reduce a la mitad. Este mecanismo está diseñado para controlar la inflación y mantener la escasez de Bitcoin.

En esta edición especial, exploramos:
- El mecanismo del halving y su importancia
- Análisis histórico de halvings anteriores
- Impacto en el precio y la minería
- Perspectivas de expertos para 2024
- Estrategias de inversión recomendadas

También incluimos una sección especial con gráficos y análisis técnico detallado para ayudar a los inversores a tomar decisiones informadas.`,
    imageUrl: '/images/bitcoin-halving.jpg',
    author: 'Crypto Analyst',
    tags: ['Bitcoin', 'Halving', 'Mercado']
  },
  {
    id: 3,
    title: 'NFTs en la Educación: Casos de Uso Innovadores',
    date: '5 de abril, 2024',
    content: 'Descubre cómo las universidades y centros educativos están utilizando NFTs para certificar logros académicos, crear colecciones digitales y revolucionar la forma en que se comparte el conocimiento.',
    fullContent: `Descubre cómo las universidades y centros educativos están utilizando NFTs para certificar logros académicos, crear colecciones digitales y revolucionar la forma en que se comparte el conocimiento.

Los NFTs están transformando la educación superior, ofreciendo nuevas formas de verificar y compartir logros académicos. Desde diplomas digitales hasta colecciones de investigación, esta tecnología está abriendo nuevas posibilidades.

En esta edición, exploramos:
- Certificados académicos como NFTs
- Colecciones digitales de investigación
- Plataformas educativas basadas en blockchain
- Casos de éxito en universidades líderes
- El futuro de la educación con Web3

Incluimos entrevistas con profesores y estudiantes que están implementando estas innovaciones, así como una guía práctica para instituciones educativas interesadas en adoptar esta tecnología.`,
    imageUrl: '/images/nft-education.jpg',
    author: 'EduTech Expert',
    tags: ['NFTs', 'Educación', 'Innovación']
  }
] 