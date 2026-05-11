import { createContext, useContext, useState, type ReactNode } from 'react'
import { type LanguageCode, translations, languageNames } from '../data/translations'

interface LanguageContextType {
  lang: LanguageCode
  setLang: (lang: LanguageCode) => void
  t: (key: string) => string
  languages: typeof languageNames
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LanguageCode>('en')

  const t = (key: string): string => {
    return translations[lang]?.[key] ?? translations.en[key] ?? key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, languages: languageNames }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
