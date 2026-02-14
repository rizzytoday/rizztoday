import { lazy, Suspense } from 'react'
import { MenuBar } from './features/menu/MenuBar'
import { Hero } from './features/hero/Hero'
import { ClickWave } from './shared/components/ClickWave'
import { CursorGlitch } from './shared/components/CursorGlitch'
import { useFirebase } from './services/firebase'

const Analytics = lazy(() => import('@vercel/analytics/react').then(m => ({ default: m.Analytics })))
const SpeedInsights = lazy(() => import('@vercel/speed-insights/react').then(m => ({ default: m.SpeedInsights })))

// Lazy-load offscreen panels and decorative elements (not visible at first paint)
const MenuButtons = lazy(() => import('./features/panels/MenuButtons').then(m => ({ default: m.MenuButtons })))
const CardsStack = lazy(() => import('./features/panels/CardsStack').then(m => ({ default: m.CardsStack })))
const TestimonialsCard = lazy(() => import('./features/panels/TestimonialsCard').then(m => ({ default: m.TestimonialsCard })))
const IpodPlayer = lazy(() => import('./features/music/IpodPlayer').then(m => ({ default: m.IpodPlayer })))
const StickyNote = lazy(() => import('./shared/components/StickyNote').then(m => ({ default: m.StickyNote })))
const AboutCard = lazy(() => import('./features/panels/AboutCard').then(m => ({ default: m.AboutCard })))
const Guestbook = lazy(() => import('./features/guestbook/Guestbook').then(m => ({ default: m.Guestbook })))

function App() {
  const { db, isReady } = useFirebase()

  return (
    <>
      <MenuBar />
      <div className="container">
        <main className="main-content">
          <Hero />
        </main>
        <Suspense fallback={null}>
          <MenuButtons />
          <AboutCard db={db} isFirebaseReady={isReady} />
          <CardsStack />
          <TestimonialsCard />
          <IpodPlayer />
          <StickyNote />
        </Suspense>
      </div>
      <Suspense fallback={null}>
        <Guestbook db={db} isFirebaseReady={isReady} />
      </Suspense>
      <ClickWave />
      <CursorGlitch />
      <Suspense fallback={null}>
        <Analytics />
        <SpeedInsights />
      </Suspense>
    </>
  )
}

export default App
