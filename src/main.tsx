import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './contexts/LanguageContext.tsx'
import { CurrencyProvider } from './contexts/CurrencyContext.tsx'
import { CompareProvider } from './contexts/CompareContext.tsx'
import { DarkModeProvider } from './contexts/DarkModeContext.tsx'

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <LanguageProvider>
      <CurrencyProvider>
        <CompareProvider>
          <DarkModeProvider>
            <App />
          </DarkModeProvider>
        </CompareProvider>
      </CurrencyProvider>
    </LanguageProvider>
  </HashRouter>,
)
