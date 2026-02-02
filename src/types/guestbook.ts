import type { Timestamp } from 'firebase/firestore'

export interface GuestbookMessage {
  id: string
  name: string
  message: string
  timestamp: Timestamp | null
}

export interface GuestbookStore {
  isOpen: boolean
  hasNewEntries: boolean
  open: () => void
  close: () => void
  markAsSeen: () => void
  setHasNewEntries: (value: boolean) => void
}
