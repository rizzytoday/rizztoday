import { useState, useEffect } from 'react'
import { VerifiedBadge } from '../../shared/components/VerifiedBadge'

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

export function MenuBar() {
  const [dateStr, setDateStr] = useState('')
  const [timeStr, setTimeStr] = useState('')
  const [notificationActive, setNotificationActive] = useState(false)
  const [spinnerFrame, setSpinnerFrame] = useState(0)

  useEffect(() => {
    const spinnerInterval = setInterval(() => {
      setSpinnerFrame(f => (f + 1) % SPINNER_FRAMES.length)
    }, 80)
    return () => clearInterval(spinnerInterval)
  }, [])

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' }
      const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit', hour12: true }
      setDateStr(now.toLocaleDateString('en-US', dateOptions))
      setTimeStr(now.toLocaleTimeString('en-US', timeOptions))
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleNotificationClick = () => {
    window.open('https://x.com/rizzytoday', '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      {notificationActive && (
        <div className="notification-overlay active" onClick={() => setNotificationActive(false)} />
      )}
      <nav className="menu-bar">
        <div className="menu-bar-left">
          <div className="logo-section">
            <div className="framer-logo">
              <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 22 4 L 22 6.667 L 22 9.333 L 16.5 9.333 L 11 9.333 L 11 4 Z M 11 9.333 L 15.469 9.333 L 22 20 L 22 20 L 19.25 20 L 15.469 14.667 L 15.469 20 L 11 20 Z" fill="rgb(227, 32, 32)"/>
              </svg>
            </div>
            <span className="braille-spinner">{SPINNER_FRAMES[spinnerFrame]}</span>
          </div>
          <div className="nav-links">
            <a href="./archive" className="nav-link archive">Archive</a>
          </div>
        </div>
        <div className="menu-bar-right">
          <div className="menu-bar-icons">
            <a
              href="https://calendar.app.google/mpTJKMqZ8cTz5KD79"
              target="_blank"
              rel="noopener noreferrer"
              className="calendar-icon-link"
              title="Book a call"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="3" width="12" height="11" rx="1" stroke="rgb(255, 255, 255)" strokeWidth="1.2" fill="none"/>
                <line x1="2" y1="6" x2="14" y2="6" stroke="rgb(255, 255, 255)" strokeWidth="1.2"/>
                <line x1="5" y1="1" x2="5" y2="4" stroke="rgb(255, 255, 255)" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="11" y1="1" x2="11" y2="4" stroke="rgb(255, 255, 255)" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </a>
            <svg width="14" height="10" viewBox="0 0 18 13" fill="none">
              <path d="M9 0C6.24 0 3.9 1.23 2.25 3.15L0.75 1.65C2.85 -0.55 5.7 -1.5 9 -1.5C12.3 -1.5 15.15 -0.55 17.25 1.65L15.75 3.15C14.1 1.23 11.76 0 9 0ZM9 4.5C7.35 4.5 5.85 5.25 4.8 6.45L3.3 4.95C4.8 3.3 6.75 2.25 9 2.25C11.25 2.25 13.2 3.3 14.7 4.95L13.2 6.45C12.15 5.25 10.65 4.5 9 4.5ZM9 9C8.4 9 7.8 9.15 7.35 9.45L5.85 7.95C6.75 7.05 7.8 6.75 9 6.75C10.2 6.75 11.25 7.05 12.15 7.95L10.65 9.45C10.2 9.15 9.6 9 9 9ZM11.25 10.5L9 12.75L6.75 10.5H11.25Z" fill="rgb(255, 255, 255)"/>
            </svg>
            <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
              <rect x="2" y="2" width="20" height="8" rx="1" stroke="rgb(255, 255, 255)" strokeWidth="1" fill="none"/>
              <rect x="22" y="4" width="2" height="4" rx="0.5" fill="rgb(255, 255, 255)"/>
              <rect x="4" y="4" width="16" height="4" rx="0.5" fill="rgb(255, 255, 255)"/>
            </svg>
          </div>
          <div
            className="notification-btn"
            onClick={(e) => {
              e.stopPropagation()
              setNotificationActive(!notificationActive)
            }}
          >
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
              <path d="M7 16C8.1 16 9 15.1 9 14H5C5 15.1 5.9 16 7 16ZM12 11V7C12 4.51 10.64 2.39 8.5 1.87V1C8.5 0.17 7.83 -0.5 7 -0.5C6.17 -0.5 5.5 0.17 5.5 1V1.87C3.35 2.39 2 4.51 2 7V11L0 13V14H14V13L12 11Z" fill="rgb(255, 255, 255)"/>
            </svg>
            <span className="notification-badge">4</span>
            <div className={`notification-card ${notificationActive ? 'active' : ''}`} onClick={handleNotificationClick}>
              <div className="notification-section-title">Recently</div>
              <div className="notification-content">
                <div className="notification-header">
                  <img src="/newpfp.png" alt="Profile" className="notification-pfp" />
                  <span className="notification-app">
                    Riz Rose
                    <VerifiedBadge color="red" />
                    <img loading="lazy" src="/content/logos/radiant logo.png" alt="Radiants" className="company-badge" />
                  </span>
                  <span className="notification-time">now</span>
                </div>
                <div className="notification-title">first time filling github as a designer</div>
                <div className="notification-message">already have 207 contribution in 2026 and its January, vibin'! check my <a href="https://github.com/rizzytoday" target="_blank" rel="noopener noreferrer" className="notification-link" onClick={(e) => e.stopPropagation()}>github</a></div>
              </div>
              <div className="notification-content">
                <div className="notification-header">
                  <img src="/newpfp.png" alt="Profile" className="notification-pfp" />
                  <span className="notification-app">
                    Riz Rose
                    <VerifiedBadge color="red" />
                    <img loading="lazy" src="/content/logos/radiant logo.png" alt="Radiants" className="company-badge" />
                  </span>
                  <span className="notification-time">1h ago</span>
                </div>
                <div className="notification-title">OH i just built a web shader</div>
                <div className="notification-message">introducing <a href="https://radshader.vercel.app/" target="_blank" rel="noopener noreferrer" className="notification-link" onClick={(e) => e.stopPropagation()}>radshader</a> v.2</div>
              </div>
              <div className="notification-content">
                <div className="notification-header">
                  <img src="/newpfp.png" alt="Profile" className="notification-pfp" />
                  <span className="notification-app">
                    Riz Rose
                    <VerifiedBadge color="red" />
                    <img loading="lazy" src="/content/logos/radiant logo.png" alt="Radiants" className="company-badge" />
                  </span>
                  <span className="notification-time">2d ago</span>
                </div>
                <div className="notification-title">website v.1 is live</div>
                <div className="notification-message">i kinda like this version so far, let's take this version as a base line to work on. more to go!</div>
              </div>
              <div className="notification-content">
                <div className="notification-header">
                  <img src="/newpfp.png" alt="Profile" className="notification-pfp" />
                  <span className="notification-app">
                    Riz Rose
                    <VerifiedBadge color="red" />
                    <img loading="lazy" src="/content/logos/radiant logo.png" alt="Radiants" className="company-badge" />
                  </span>
                  <span className="notification-time">3d ago</span>
                </div>
                <div className="notification-title">I Just Build My Website in 3 prompt</div>
                <div className="notification-message">It took 1 month to make the original on Framer btw</div>
              </div>
            </div>
          </div>
          <div className="time-date">
            <div className="date">{dateStr}</div>
            <div className="time">{timeStr}</div>
          </div>
        </div>
      </nav>
    </>
  )
}
