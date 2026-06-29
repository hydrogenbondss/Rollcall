import { Routes, Route, useLocation } from 'react-router'
import { useEffect } from 'react'
import Home from './pages/Home'
import CollectionPage from './pages/CollectionPage'
import ProductDetail from './pages/ProductDetail'
import ExhibitionPage from './pages/ExhibitionPage'
import AboutPage from './pages/AboutPage'
import EssayPage from './pages/EssayPage'
import SourcesPage from './pages/SourcesPage'
import GrantSummaryPage from './pages/GrantSummaryPage'
import NotFound from './pages/NotFound'
import BackToTop from './components/BackToTop'

import CustomCursor from './components/CustomCursor'
import CompareDrawer from './components/CompareDrawer'
import CompareIndicator from './components/CompareIndicator'
import PageTransition from './components/PageTransition'
import ScrollProgress from './components/ScrollProgress'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
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
      </PageTransition>
      <BackToTop />
    </>
  )
}
