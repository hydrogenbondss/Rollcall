import { Routes, Route, useLocation } from 'react-router'
import { useEffect, lazy, Suspense } from 'react'
import Home from './pages/Home'
// Route-level code splitting: each page (and heavy deps like three.js on the
// Exhibition page) loads only when visited. Home stays eager as the landing.
const CollectionPage = lazy(() => import('./pages/CollectionPage'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const ExhibitionPage = lazy(() => import('./pages/ExhibitionPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const EssayPage = lazy(() => import('./pages/EssayPage'))
const SourcesPage = lazy(() => import('./pages/SourcesPage'))
const GrantSummaryPage = lazy(() => import('./pages/GrantSummaryPage'))
const NotFound = lazy(() => import('./pages/NotFound'))
import PageTransition from './components/PageTransition'
import BackToTop from './components/BackToTop'
import CustomCursor from './components/CustomCursor'
import CompareDrawer from './components/CompareDrawer'
import CompareIndicator from './components/CompareIndicator'
import ScrollProgress from './components/ScrollProgress'
import ErrorBoundary from './components/ErrorBoundary'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

// Minimal, layout-stable fallback while a lazy route chunk loads.
function RouteFallback() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center" aria-busy="true">
      <span className="w-2 h-2 rounded-full bg-[#c28223]/70 animate-pulse" />
    </div>
  )
}

export default function App() {
  return (
    <>
      <a href="#/collection" className="skip-link">Skip to the collection</a>
      <div className="grain-overlay" aria-hidden="true" />
      <ScrollProgress />
      <CustomCursor />
      <CompareDrawer />
      <CompareIndicator />
      <ScrollToTop />
      <PageTransition>
        <ErrorBoundary>
        <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/exhibition" element={<ExhibitionPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/essay" element={<EssayPage />} />
          <Route path="/sources" element={<SourcesPage />} />
          <Route path="/grant" element={<GrantSummaryPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        </ErrorBoundary>
      </PageTransition>
      <BackToTop />
    </>
  )
}
