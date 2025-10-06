import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { registerServiceWorker, preloadCriticalResources } from './utils/optimization'

import Home from './pages/Home'
import Cursos from './pages/Cursos'
import Comunidad from './pages/Comunidad'
import Perfil from './pages/Perfil'
import RegistroCurso from './pages/RegistroCurso'
import Newsletter from './pages/Newsletter'
import NewsletterEntry from './pages/NewsletterEntry'
import ProyectosDestacados from './pages/ProyectosDestacados'
import { WalletProvider } from './context/WalletContext'
import './styles/global.css'

const App = () => {
  useEffect(() => {
    // Registrar Service Worker para cache
    registerServiceWorker()
    
    // Precargar recursos críticos
    preloadCriticalResources()
    
    // Prefetch de rutas importantes
    const prefetchRoutes = ['/cursos', '/comunidad', '/newsletter', '/proyectos']
    prefetchRoutes.forEach(route => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = route
      document.head.appendChild(link)
    })
  }, [])

  return (
    <HelmetProvider>
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
                <Route path="/proyectos" element={<ProyectosDestacados />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/registro-curso/:id" element={<RegistroCurso />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </WalletProvider>
    </HelmetProvider>
  )
}

export default App
