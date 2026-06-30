import { useState, lazy, Suspense } from 'react'
import MatrixLanding from '../components/MatrixLanding'

// The post-landing homepage (nav, sections, data, gsap) is split out so the
// landing gate ships a minimal critical bundle. It loads while/after the
// visitor is on the MatrixLanding screen.
const HomeContent = lazy(() => import('./HomeContent'))

export default function Home() {
  const [entered, setEntered] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('rollcall-entered') === 'true'
    }
    return false
  })

  const handleEnter = () => {
    setEntered(true)
    sessionStorage.setItem('rollcall-entered', 'true')
  }

  if (!entered) {
    return <MatrixLanding onEnter={handleEnter} />
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0d0d0d]" />}>
      <HomeContent />
    </Suspense>
  )
}
