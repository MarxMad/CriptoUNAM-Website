// Componente selector de idioma
import React from 'react'
import { useI18n } from '../utils/i18n'

export const LanguageSelector: React.FC = () => {
  const { getCurrentLanguage, getSupportedLanguages, setLanguage } = useI18n()
  const currentLang = getCurrentLanguage()
  const languages = getSupportedLanguages()

  return (
    <select
      value={currentLang}
      onChange={(e) => setLanguage(e.target.value)}
      style={{
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        backgroundColor: 'white',
        fontSize: '14px',
        cursor: 'pointer'
      }}
    >
      {languages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.nativeName}
        </option>
      ))}
    </select>
  )
}

export default LanguageSelector
