import { useEffect } from 'react'

/**
 * Sets the document <title> (and optionally the meta description) for the
 * current route, restoring the previous values on unmount. A lightweight
 * stand-in for per-page <head> management on a HashRouter SPA — no library.
 */
export function useDocumentTitle(title: string, description?: string) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title

    const meta = document.querySelector('meta[name="description"]')
    const prevDesc = meta?.getAttribute('content') ?? null
    if (description && meta) meta.setAttribute('content', description)

    return () => {
      document.title = prevTitle
      if (description && meta && prevDesc !== null) meta.setAttribute('content', prevDesc)
    }
  }, [title, description])
}
