import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Newsletter.css'

interface NewsletterEntry {
  id: number
  title: string
  date: string
  content: string
  imageUrl?: string
}

const Newsletter = () => {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí se puede agregar la lógica para enviar el email a un backend
    console.log('Email suscrito:', email)
    setEmail('')
    alert('¡Gracias por suscribirte a nuestra newsletter!')
  }

  const entries: NewsletterEntry[] = [
    {
      id: 1,
      title: 'Introducción a Web3: El Futuro de Internet',
      date: '15 de abril, 2024',
      content: 'En esta edición exploramos los fundamentos de Web3 y cómo está transformando la forma en que interactuamos con internet. Desde la descentralización hasta los contratos inteligentes, te llevamos a través de los conceptos básicos que todo entusiasta de blockchain debe conocer.',
      imageUrl: 'src/constants/images/web3-intro.jpg'
    },
    {
      id: 2,
      title: 'Bitcoin Halving 2024: ¿Qué Significa para el Mercado?',
      date: '10 de abril, 2024',
      content: 'Analizamos el próximo halving de Bitcoin y sus posibles implicaciones en el mercado de criptomonedas. Incluimos perspectivas de expertos y datos históricos para entender mejor este importante evento en el ecosistema Bitcoin.',
      imageUrl: 'src/constants/images/bitcoin-halving.jpg'
    },
    {
      id: 3,
      title: 'NFTs en la Educación: Casos de Uso Innovadores',
      date: '5 de abril, 2024',
      content: 'Descubre cómo las universidades y centros educativos están utilizando NFTs para certificar logros académicos, crear colecciones digitales y revolucionar la forma en que se comparte el conocimiento.',
      imageUrl: 'src/constants/images/nft-education.jpg'
    }
  ]

  return (
    <div className="newsletter-page">
      <header className="newsletter-header">
        <h1>Newsletter CriptoUNAM</h1>
        <p>Mantente informado sobre las últimas novedades en blockchain y Web3</p>
      </header>

      <section className="newsletter-entries">
        {entries.map((entry) => (
          <article key={entry.id} className="newsletter-entry">
            {entry.imageUrl && (
              <div className="entry-image">
                <img src={entry.imageUrl} alt={entry.title} />
              </div>
            )}
            <div className="entry-content">
              <h2>{entry.title}</h2>
              <span className="entry-date">{entry.date}</span>
              <p>{entry.content}</p>
              <Link to={`/newsletter/${entry.id}`} className="read-more">
                Leer más
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="newsletter-subscription">
        <h2>Suscríbete a Nuestra Newsletter</h2>
        <p>Recibe las últimas actualizaciones directamente en tu correo</p>
        <form onSubmit={handleSubscribe} className="subscription-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu correo electrónico"
            required
          />
          <button type="submit">Suscribirse</button>
        </form>
      </section>
    </div>
  )
}

export default Newsletter 