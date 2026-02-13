import { useGuestbookStore } from '../../stores/guestbookStore'

export function GuestbookButton() {
  const { open, hasNewEntries } = useGuestbookStore()

  return (
    <div className="guestbook-btn" role="button" tabIndex={0} aria-label="Open guestbook" onClick={open} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open() } }}>
      <svg className="guestbook-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="white" strokeWidth="2"/>
        <path d="M3 7L12 13L21 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {hasNewEntries && <span className="guestbook-badge"></span>}
      <span className="hover-title">leave a note</span>
    </div>
  )
}
