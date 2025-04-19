import { useParams } from 'react-router-dom'
import '../styles/Newsletter.css'

interface NewsletterEntry {
  id: number
  title: string
  date: string
  content: string
  fullContent: string
  imageUrl?: string
}

const NewsletterEntry = () => {
  const { id } = useParams()
  
  // En una aplicación real, esto vendría de una API o base de datos
  const entries: NewsletterEntry[] = [
    {
      id: 1,
      title: 'Introducción a Web3: El Futuro de Internet',
      date: '15 de abril, 2024',
      content: 'En esta edición exploramos los fundamentos de Web3 y cómo está transformando la forma en que interactuamos con internet.',
      fullContent: `En esta edición exploramos los fundamentos de Web3 y cómo está transformando la forma en que interactuamos con internet. Desde la descentralización hasta los contratos inteligentes, te llevamos a través de los conceptos básicos que todo entusiasta de blockchain debe conocer.

La Web3 representa una nueva era en la evolución de internet, donde la descentralización y la transparencia son fundamentales. A diferencia de la Web2, que está dominada por grandes corporaciones que controlan nuestros datos, la Web3 pone el poder en manos de los usuarios.

En esta edición especial, cubriremos:
- Los principios fundamentales de la Web3
- Cómo funcionan los contratos inteligentes
- El papel de las DAOs en la gobernanza descentralizada
- Casos de uso reales de la Web3 en la actualidad
- El futuro de la descentralización

Además, tendremos una entrevista exclusiva con expertos en el campo que compartirán sus perspectivas sobre el futuro de esta tecnología revolucionaria.`,
      imageUrl: 'src/constants/images/web3-intro.jpg'
    },
    {
      id: 2,
      title: 'Bitcoin Halving 2024: ¿Qué Significa para el Mercado?',
      date: '10 de abril, 2024',
      content: 'Analizamos el próximo halving de Bitcoin y sus posibles implicaciones en el mercado de criptomonedas.',
      fullContent: `Analizamos el próximo halving de Bitcoin y sus posibles implicaciones en el mercado de criptomonedas. Incluimos perspectivas de expertos y datos históricos para entender mejor este importante evento en el ecosistema Bitcoin.

El halving de Bitcoin es un evento programado que ocurre aproximadamente cada cuatro años, donde la recompensa por minar nuevos bloques se reduce a la mitad. Este mecanismo está diseñado para controlar la inflación y mantener la escasez de Bitcoin.

En esta edición especial, exploramos:
- El mecanismo del halving y su importancia
- Análisis histórico de halvings anteriores
- Impacto en el precio y la minería
- Perspectivas de expertos para 2024
- Estrategias de inversión recomendadas

También incluimos una sección especial con gráficos y análisis técnico detallado para ayudar a los inversores a tomar decisiones informadas.`,
      imageUrl: 'src/constants/images/bitcoin-halving.jpg'
    },
    {
      id: 3,
      title: 'NFTs en la Educación: Casos de Uso Innovadores',
      date: '5 de abril, 2024',
      content: 'Descubre cómo las universidades y centros educativos están utilizando NFTs para certificar logros académicos.',
      fullContent: `Descubre cómo las universidades y centros educativos están utilizando NFTs para certificar logros académicos, crear colecciones digitales y revolucionar la forma en que se comparte el conocimiento.

Los NFTs están transformando la educación superior, ofreciendo nuevas formas de verificar y compartir logros académicos. Desde diplomas digitales hasta colecciones de investigación, esta tecnología está abriendo nuevas posibilidades.

En esta edición, exploramos:
- Certificados académicos como NFTs
- Colecciones digitales de investigación
- Plataformas educativas basadas en blockchain
- Casos de éxito en universidades líderes
- El futuro de la educación con Web3

Incluimos entrevistas con profesores y estudiantes que están implementando estas innovaciones, así como una guía práctica para instituciones educativas interesadas en adoptar esta tecnología.`,
      imageUrl: 'src/constants/images/nft-education.jpg'
    }
  ]

  const entry = entries.find(e => e.id === Number(id))

  if (!entry) {
    return (
      <div className="newsletter-entry-page">
        <div className="entry-not-found">
          <h2>Entrada no encontrada</h2>
          <p>La entrada que buscas no existe o ha sido eliminada.</p>
          <Link to="/newsletter" className="back-link">
            Volver al Newsletter
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="newsletter-entry-page">
      <article className="full-entry">
        {entry.imageUrl && (
          <div className="entry-header-image">
            <img src={entry.imageUrl} alt={entry.title} />
          </div>
        )}
        <div className="entry-content">
          <h1>{entry.title}</h1>
          <span className="entry-date">{entry.date}</span>
          <div className="entry-body">
            {entry.fullContent.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <Link to="/newsletter" className="back-link">
            Volver al Newsletter
          </Link>
        </div>
      </article>
    </div>
  )
}

export default NewsletterEntry 