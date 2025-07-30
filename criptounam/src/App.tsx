import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home'
import Cursos from './pages/Cursos'
import Comunidad from './pages/Comunidad'
import Perfil from './pages/Perfil'
import RegistroCurso from './pages/RegistroCurso'
import Newsletter from './pages/Newsletter'
import NewsletterEntry from './pages/NewsletterEntry'
import Juegos from './pages/Juegos'
import JuegoIndividual from './pages/JuegoIndividual'
import { WalletProvider } from './context/WalletContext'
import './styles/global.css'

const App = () => {
  // Event listeners globales para los modales de admin
  useEffect(() => {
    // Event listener para Newsletter
    const handleNewsletterModal = () => {
      window.location.href = '/newsletter?openModal=true';
    };

    // Event listener para Cursos
    const handleCursosModal = () => {
      window.location.href = '/cursos?openModal=true';
    };

    // Event listener para Comunidad
    const handleComunidadModal = () => {
      window.location.href = '/comunidad?openModal=true';
    };

    // Registrar event listeners
    window.addEventListener('openNewsletterModal', handleNewsletterModal);
    window.addEventListener('openCursosModal', handleCursosModal);
    window.addEventListener('openComunidadModal', handleComunidadModal);

    return () => {
      window.removeEventListener('openNewsletterModal', handleNewsletterModal);
      window.removeEventListener('openCursosModal', handleCursosModal);
      window.removeEventListener('openComunidadModal', handleComunidadModal);
    };
  }, []);

  return (
    <WalletProvider>
    <Router>
        <div className="app">
          <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/comunidad" element={<Comunidad />} />
            <Route path="/newsletter" element={<Newsletter />} />
            <Route path="/newsletter/:id" element={<NewsletterEntry />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/registro-curso/:id" element={<RegistroCurso />} />
            <Route path="/juegos" element={<Juegos />} />
            <Route path="/juegos/:id" element={<JuegoIndividual />} />
          </Routes>
        </main>
          <Footer />
      </div>
    </Router>
      </WalletProvider>
  )
}

export default App
