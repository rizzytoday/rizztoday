import { useState, useEffect } from 'react'
import type { Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAnQKWdREyUYXZKlVweg5HBZx0-vcMZs0g",
  authDomain: "rizztoday.firebaseapp.com",
  projectId: "rizztoday",
  storageBucket: "rizztoday.firebasestorage.app",
  messagingSenderId: "806144736906",
  appId: "1:806144736906:web:5074b4e0bc78e39a7cb773"
}

export function useFirebase() {
  const [db, setDb] = useState<Firestore | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Lazy-load Firebase after page load to reduce initial bundle
    const loadFirebase = async () => {
      try {
        const [{ initializeApp }, { getFirestore }] = await Promise.all([
          import('firebase/app'),
          import('firebase/firestore')
        ])
        const app = initializeApp(firebaseConfig)
        const firestore = getFirestore(app)
        setDb(firestore)
        setIsReady(true)
      } catch (error) {
        console.error('Firebase initialization error:', error)
      }
    }

    // Defer until after page is interactive
    if (document.readyState === 'complete') {
      loadFirebase()
    } else {
      window.addEventListener('load', loadFirebase, { once: true })
    }
  }, [])

  return { db, isReady }
}
