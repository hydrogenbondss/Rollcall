import { createContext, useContext, useState, type ReactNode, useCallback } from 'react'
import { exchangeRates, currencySymbols } from '../data/products'

type CurrencyCode = keyof typeof exchangeRates

interface CurrencyContextType {
  currency: CurrencyCode
  setCurrency: (c: CurrencyCode) => void
  formatPrice: (usdAmount: number) => string
  currencies: typeof exchangeRates
  symbols: typeof currencySymbols
}

const CurrencyContext = createContext<CurrencyContextType | null>(null)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyCode>('HKD')

  const formatPrice = useCallback(
    (usdAmount: number): string => {
      const rate = exchangeRates[currency]
      const converted = usdAmount * rate

      let formatted: string
      if (currency === 'JPY' || currency === 'KRW' || currency === 'IDR' || currency === 'VND') {
        formatted = Math.round(converted).toLocaleString()
      } else if (currency === 'PHP' || currency === 'THB') {
        formatted = converted.toFixed(2)
      } else {
        formatted = converted.toFixed(2)
      }

      return `${currencySymbols[currency]}${formatted}`
    },
    [currency]
  )

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, formatPrice, currencies: exchangeRates, symbols: currencySymbols }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider')
  return ctx
}
