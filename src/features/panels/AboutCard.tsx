import { useState, useEffect, useRef } from 'react'
import { Firestore, doc, getDoc, setDoc, increment } from 'firebase/firestore'
import { usePanelStore, panelStore } from '../../stores/panelStore'
import { VerifiedBadge } from '../../shared/components/VerifiedBadge'
import { EMOJIS, STORAGE_KEY } from '../../constants/emojis'

interface AboutCardProps {
  db: Firestore | null
  isFirebaseReady: boolean
}

function getUserReactions(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('Failed to parse emoji reactions from localStorage:', error)
    localStorage.removeItem(STORAGE_KEY)
    return []
  }
}

function setUserReactions(reactions: string[]) {
  const cb = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(reactions))
  if ('requestIdleCallback' in window) {
    requestIdleCallback(cb)
  } else {
    setTimeout(cb, 0)
  }
}

const COUNTS_CACHE_KEY = 'riz_emoji_counts'

function getCachedCounts(): Record<string, number> {
  try {
    const stored = localStorage.getItem(COUNTS_CACHE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch { return {} }
}

function cacheCounts(counts: Record<string, number>) {
  localStorage.setItem(COUNTS_CACHE_KEY, JSON.stringify(counts))
}

export function AboutCard({ db, isFirebaseReady }: AboutCardProps) {
  const activePanel = usePanelStore()
  const isActive = activePanel === 'about'

  const [counts, setCounts] = useState<Record<string, number>>(getCachedCounts)
  const [selected, setSelected] = useState<string[]>(getUserReactions())
  const [clicked, setClicked] = useState<string | null>(null)
  const [particles, setParticles] = useState<{ id: number; emoji: string; x: number; y: number }[]>([])
  const [spinning, setSpinning] = useState<Record<string, { prev: number; next: number; direction: 'up' | 'down' }>>({})
  const particleTimeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set())
  const clickedTimeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set())
  const spinTimeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set())

  useEffect(() => {
    if (!db || !isFirebaseReady) return

    const loadCounts = async () => {
      try {
        const docRef = doc(db, 'reactions', 'counts')
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data() as Record<string, number>
          setCounts(data)
          cacheCounts(data)
        }
      } catch (error) {
        console.error('Error loading emoji counts from Firebase:', error)
      }
    }

    loadCounts()
  }, [db, isFirebaseReady])

  const handleEmojiClick = async (key: string, emoji: string, e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    const wasSelected = selected.includes(key)
    const newSelected = wasSelected
      ? selected.filter(s => s !== key)
      : [...selected, key]

    setSelected(newSelected)
    setUserReactions(newSelected)
    setClicked(key)
    const clickedTimeout = setTimeout(() => setClicked(null), 500)
    clickedTimeoutsRef.current.add(clickedTimeout)

    if (!wasSelected) {
      const particleId = Date.now()
      setParticles(prev => [...prev, { id: particleId, emoji, x: rect.left + rect.width / 2, y: rect.top }])
      const particleTimeout = setTimeout(() => setParticles(prev => prev.filter(p => p.id !== particleId)), 1000)
      particleTimeoutsRef.current.add(particleTimeout)
    }

    const currentCount = counts[key] || 0
    const nextCount = Math.max(0, currentCount + (wasSelected ? -1 : 1))
    setSpinning(prev => ({ ...prev, [key]: { prev: currentCount, next: nextCount, direction: wasSelected ? 'down' : 'up' } }))
    const spinTimeout = setTimeout(() => {
      setSpinning(prev => {
        const { [key]: _, ...rest } = prev
        return rest
      })
    }, 350)
    spinTimeoutsRef.current.add(spinTimeout)

    setCounts(prev => ({
      ...prev,
      [key]: Math.max(0, (prev[key] || 0) + (wasSelected ? -1 : 1))
    }))

    if (db) {
      try {
        const docRef = doc(db, 'reactions', 'counts')
        await setDoc(docRef, {
          [key]: increment(wasSelected ? -1 : 1)
        }, { merge: true })
      } catch (error) {
        console.error('Error updating emoji count in Firebase:', error)
      }
    }
  }

  useEffect(() => {
    if (!isActive) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.about-card') && !target.closest('[data-panel="about"]')) {
        panelStore.close()
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isActive])

  useEffect(() => {
    return () => {
      particleTimeoutsRef.current.forEach(timeout => clearTimeout(timeout))
      particleTimeoutsRef.current.clear()
      clickedTimeoutsRef.current.forEach(timeout => clearTimeout(timeout))
      clickedTimeoutsRef.current.clear()
      spinTimeoutsRef.current.forEach(timeout => clearTimeout(timeout))
      spinTimeoutsRef.current.clear()
    }
  }, [])

  return (
    <>
      <div className={`about-card ${isActive ? 'active' : ''}`}>
        <div className="about-header">
          <img src="/newpfp.png" width={48} height={48} alt="Riz Rose" className="about-pfp" />
          <div className="about-info">
            <h3 className="about-name">
              Riz Rose
              <VerifiedBadge color="red" />
              <img width={14} height={14} src="/content/logos/radiant-logo.webp" alt="Radiants" className="company-badge" />
            </h3>
            <span className="about-location">Full-Stack Creative</span>
          </div>
        </div>
        <div className="about-bio">
          <p className="about-intro">hi, i'm riz.</p>
          <p>i turn ideas into visuals — pitch decks, brand identities, motion graphics. creative direction mostly for web3 people and indie creators who need to stand out.</p>
          <p className="about-vibes">same suffering as you, just too stubborn to stay down. glad i was born at the right time.</p>
        </div>
        <div className="emoji-reactions">
          {EMOJIS.map(({ key, emoji }) => (
            <button
              key={key}
              className={`emoji-btn ${selected.includes(key) ? 'selected' : ''} ${clicked === key ? 'clicked' : ''}`}
              data-emoji={key}
              onClick={(e) => handleEmojiClick(key, emoji, e)}
            >
              <span className="emoji">{emoji}</span>
              <span className="emoji-count-wrapper">
                {spinning[key] ? (
                  <>
                    <span className={`emoji-count-slot slot-exit-${spinning[key].direction}`}>{spinning[key].prev}</span>
                    <span className={`emoji-count-slot slot-enter-${spinning[key].direction}`}>{spinning[key].next}</span>
                  </>
                ) : (
                  <span className="emoji-count-static">{counts[key] || 0}</span>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
      {particles.map(p => (
        <span
          key={p.id}
          className="emoji-particle"
          style={{ left: p.x, top: p.y }}
        >
          {p.emoji}
        </span>
      ))}
    </>
  )
}
