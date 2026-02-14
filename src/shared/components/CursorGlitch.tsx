import { useEffect, useRef } from 'react'

const TRAIL_COUNT = 5

export function CursorGlitch() {
  const trailsRef = useRef<HTMLDivElement[]>([])
  const positions = useRef(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: 0, y: 0 }))
  )
  const mouse = useRef({ x: 0, y: 0 })
  const visible = useRef(false)
  const pressing = useRef(false)
  const rafId = useRef(0)

  useEffect(() => {
    // Hide all ghosts until first mouse move
    const showAll = () => {
      if (visible.current) return
      visible.current = true
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const el = trailsRef.current[i]
        if (el) el.style.visibility = 'visible'
      }
    }

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
      if (!visible.current) {
        // First move: teleport all ghosts to mouse, then show
        for (let i = 0; i < TRAIL_COUNT; i++) {
          positions.current[i].x = e.clientX
          positions.current[i].y = e.clientY
          const el = trailsRef.current[i]
          if (el) el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
        }
        showAll()
      }
    }

    const onDown = (e: MouseEvent) => {
      pressing.current = true
      const x = e.clientX
      const y = e.clientY
      // Sync mouse.current so ghost 0 doesn't drift to stale position
      mouse.current.x = x
      mouse.current.y = y
      for (let i = 0; i < TRAIL_COUNT; i++) {
        positions.current[i].x = x
        positions.current[i].y = y
        const el = trailsRef.current[i]
        if (el) el.style.transform = `translate(${x}px, ${y}px)`
      }
      const lead = trailsRef.current[0]
      if (lead) lead.style.scale = '0.85'
    }

    const onUp = () => {
      pressing.current = false
      const lead = trailsRef.current[0]
      if (lead) lead.style.scale = '1'
    }

    // Force cursor:none on every clicked element (capture phase)
    const onDownCapture = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target?.style) target.style.setProperty('cursor', 'none', 'important')
    }

    document.documentElement.style.setProperty('cursor', 'none', 'important')
    document.body.style.setProperty('cursor', 'none', 'important')

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('mousedown', onDownCapture, true)

    const tick = () => {
      if (!visible.current) {
        rafId.current = requestAnimationFrame(tick)
        return
      }
      for (let i = TRAIL_COUNT - 1; i >= 0; i--) {
        const target = i === 0 ? mouse.current : positions.current[i - 1]
        const lerp = pressing.current ? 0.8 : 0.15 + i * 0.08
        positions.current[i].x += (target.x - positions.current[i].x) * lerp
        positions.current[i].y += (target.y - positions.current[i].y) * lerp

        const el = trailsRef.current[i]
        if (el) {
          el.style.transform = `translate(${positions.current[i].x}px, ${positions.current[i].y}px)`
        }
      }
      rafId.current = requestAnimationFrame(tick)
    }

    rafId.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('mousedown', onDownCapture, true)
      cancelAnimationFrame(rafId.current)
      document.documentElement.style.removeProperty('cursor')
      document.body.style.removeProperty('cursor')
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2147483647,
      }}
    >
      {Array.from({ length: TRAIL_COUNT }, (_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) trailsRef.current[i] = el
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '20px',
            height: '20px',
            willChange: 'transform',
            visibility: 'hidden',
            zIndex: TRAIL_COUNT - i,
            opacity: 0.85 - i * 0.15,
            transition: 'scale 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: i > 2 ? `hue-rotate(${i * 30}deg)` : undefined,
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 2L3 17L7.5 12.5L11 18L13.5 16.5L10 11L16 11L3 2Z"
              fill="white"
              stroke="black"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ))}
    </div>
  )
}
