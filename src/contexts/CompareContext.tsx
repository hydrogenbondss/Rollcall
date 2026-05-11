import { createContext, useContext, useState, type ReactNode, useCallback } from 'react'
import type { Product } from '../data/products'

interface CompareContextType {
  compareList: Product[]
  addToCompare: (product: Product) => void
  removeFromCompare: (id: string) => void
  isComparing: (id: string) => boolean
  clearCompare: () => void
  isOpen: boolean
  setIsOpen: (v: boolean) => void
}

const CompareContext = createContext<CompareContextType | null>(null)

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<Product[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addToCompare = useCallback((product: Product) => {
    setCompareList((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev
      if (prev.length >= 4) return prev // max 4
      return [...prev, product]
    })
  }, [])

  const removeFromCompare = useCallback((id: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const isComparing = useCallback(
    (id: string) => compareList.some((p) => p.id === id),
    [compareList]
  )

  const clearCompare = useCallback(() => {
    setCompareList([])
    setIsOpen(false)
  }, [])

  return (
    <CompareContext.Provider
      value={{ compareList, addToCompare, removeFromCompare, isComparing, clearCompare, isOpen, setIsOpen }}
    >
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const ctx = useContext(CompareContext)
  if (!ctx) throw new Error('useCompare must be used within CompareProvider')
  return ctx
}
