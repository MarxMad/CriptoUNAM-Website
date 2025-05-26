import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord, faTelegram, faTwitter } from '@fortawesome/free-brands-svg-icons'

const Footer = () => {
  return (
    <footer className="section">
      <div className="flex flex-center gap-2">
        <div className="flex gap-2">
          <Link to="/" className="text-primary-gold">Home</Link>
          <Link to="/cursos" className="text-primary-gold">Cursos</Link>
          <Link to="/comunidad" className="text-primary-gold">Comunidad</Link>
          <Link to="/newsletter" className="text-primary-gold">Newsletter</Link>
        </div>
        <div className="flex gap-2">
          <a href="https://discord.gg/Pmu4JQeNR6" target="_blank" rel="noopener noreferrer" className="text-primary-gold">
            <FontAwesomeIcon icon={faDiscord} />
          </a>
          <a href="https://t.me/+tPgjd4cOxG05NmVh" target="_blank" rel="noopener noreferrer" className="text-primary-gold">
            <FontAwesomeIcon icon={faTelegram} />
          </a>
          <a href="https://x.com/Cripto_UNAM" target="_blank" rel="noopener noreferrer" className="text-primary-gold">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
        </div>
      </div>
      <p className="text-center mt-2">© 2024 CriptoUNAM. Todos los derechos reservados.</p>
    </footer>
  )
}

export default Footer 