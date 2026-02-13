import { useState, useEffect } from 'react'
import {
  Firestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp
} from 'firebase/firestore'
import { useGuestbookStore } from '../../stores/guestbookStore'
import { GuestbookMessage } from '../../types/guestbook'
import { formatTime } from '../../utils/time'
import { escapeHtml } from '../../utils/sanitize'

interface GuestbookProps {
  db: Firestore | null
  isFirebaseReady: boolean
}

export function Guestbook({ db, isFirebaseReady }: GuestbookProps) {
  const { isOpen, close, markAsSeen, setHasNewEntries } = useGuestbookStore()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<GuestbookMessage[]>([])
  const [loading, setLoading] = useState(false)

  // Check for new entries on mount
  useEffect(() => {
    if (!db || !isFirebaseReady) return

    const checkNewEntries = async () => {
      try {
        const q = query(
          collection(db, 'guestbook'),
          orderBy('timestamp', 'desc'),
          limit(1)
        )
        const snapshot = await getDocs(q)
        if (snapshot.empty) return

        const latestDoc = snapshot.docs[0]
        const latestData = latestDoc.data()
        if (!latestData.timestamp) return

        const latestTimestamp = latestData.timestamp.toMillis()
        const lastSeen = parseInt(localStorage.getItem('guestbookLastSeen') || '0')

        if (latestTimestamp > lastSeen) {
          setHasNewEntries(true)
        }
      } catch (error) {
        console.error('Error checking new guestbook entries:', error)
      }
    }

    checkNewEntries()
  }, [db, isFirebaseReady, setHasNewEntries])

  // Load messages when panel opens
  useEffect(() => {
    if (!isOpen || !db || !isFirebaseReady) return

    const loadMessages = async () => {
      setLoading(true)
      try {
        const q = query(
          collection(db, 'guestbook'),
          orderBy('timestamp', 'desc'),
          limit(20)
        )
        const snapshot = await getDocs(q)

        const loadedMessages: GuestbookMessage[] = []
        snapshot.forEach(doc => {
          const data = doc.data()
          loadedMessages.push({
            id: doc.id,
            name: data.name,
            message: data.message,
            timestamp: data.timestamp
          })
        })

        setMessages(loadedMessages)
        markAsSeen()
      } catch (error) {
        console.error('Error loading guestbook messages:', error)
      }
      setLoading(false)
    }

    loadMessages()
  }, [isOpen, db, isFirebaseReady, markAsSeen])

  const handleSubmit = async () => {
    if (!name.trim() || !message.trim() || !db) return

    try {
      await addDoc(collection(db, 'guestbook'), {
        name: name.trim(),
        message: message.trim(),
        timestamp: serverTimestamp()
      })

      setName('')
      setMessage('')

      // Reload messages
      const q = query(
        collection(db, 'guestbook'),
        orderBy('timestamp', 'desc'),
        limit(20)
      )
      const snapshot = await getDocs(q)

      const loadedMessages: GuestbookMessage[] = []
      snapshot.forEach(doc => {
        const data = doc.data()
        loadedMessages.push({
          id: doc.id,
          name: data.name,
          message: data.message,
          timestamp: data.timestamp
        })
      })

      setMessages(loadedMessages)
    } catch (error) {
      console.error('Error adding guestbook message:', error)
    }
  }

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        !target.closest('.guestbook-btn') &&
        !target.closest('.guestbook-input-panel') &&
        !target.closest('.guestbook-comments-panel')
      ) {
        close()
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [close])

  return (
    <>
      {isOpen && <div className="guestbook-overlay active" onClick={close} />}

      <div className={`guestbook-input-panel ${isOpen ? 'active' : ''}`}>
        <div className="input-panel-title">Leave a Note</div>
        <input
          type="text"
          id="guestbook-name"
          name="name"
          autoComplete="name"
          placeholder="your name"
          maxLength={30}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          id="guestbook-message"
          name="message"
          autoComplete="off"
          placeholder="your message..."
          maxLength={240}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="guestbook-footer">
          <span className="char-count"><span>{message.length}</span>/240</span>
          <button className="guestbook-submit" onClick={handleSubmit}>send</button>
        </div>
      </div>

      <div className={`guestbook-comments-panel ${isOpen ? 'active' : ''}`}>
        <div className="comments-title">Comments</div>
        <div className="guestbook-messages">
          {loading ? (
            <div className="no-messages">loading...</div>
          ) : messages.length === 0 ? (
            <div className="no-messages">be the first to leave a note!</div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className="guest-message-wrapper">
                <div className="guest-header">
                  <span className="guest-name">{escapeHtml(msg.name)}</span>
                  {msg.timestamp && (
                    <span className="guest-time">{formatTime(msg.timestamp.toDate())}</span>
                  )}
                </div>
                <div className="guest-message">
                  <div className="guest-text">{escapeHtml(msg.message)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
