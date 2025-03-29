import React from 'react'
import { useTheme } from '../context/ThemeContext'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button 
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Cambiar tema"
    >
      {theme === 'light' ? (
        <i className="fas fa-moon"></i>
      ) : (
        <i className="fas fa-sun"></i>
      )}
    </button>
  )
}

export default ThemeToggle 