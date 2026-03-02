import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Hace scroll al inicio de la página cada vez que cambia la ruta.
 * Debe estar dentro de Router para que useLocation funcione.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop
