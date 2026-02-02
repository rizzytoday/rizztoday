import { lazy, Suspense } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { MenuBar } from './features/menu/MenuBar'
import { Hero } from './features/hero/Hero'
import { MenuButtons } from './features/panels/MenuButtons'
import { CardsStack } from './features/panels/CardsStack'
import { TestimonialsCard } from './features/panels/TestimonialsCard'
import { IpodPlayer } from './features/music/IpodPlayer'
import { StickyNote } from './shared/components/StickyNote'
import { ClickWave } from './shared/components/ClickWave'
import { useFirebase } from './services/firebase'

// Lazy-load Firebase-dependent components to reduce initial bundle
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
        <MenuButtons />
        <Suspense fallback={null}>
          <AboutCard db={db} isFirebaseReady={isReady} />
        </Suspense>
        <CardsStack />
        <TestimonialsCard />
        <IpodPlayer />
        <StickyNote />
      </div>
      <Suspense fallback={null}>
        <Guestbook db={db} isFirebaseReady={isReady} />
      </Suspense>
      <ClickWave />
      <Analytics />
      <SpeedInsights />
    </>
  )
}

export default App
