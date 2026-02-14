import { useEffect, useRef } from 'react'

const TRAIL_COUNT = 5
const TRAIL_DELAY = 1 // ~1ms stagger per ghost

export function CursorGlitch() {
  const trailsRef = useRef<HTMLDivElement[]>([])
  const positions = useRef(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 }))
  )
  const mouse = useRef({ x: -100, y: -100 })
  const pressing = useRef(false)
  const rafId = useRef(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    const onDown = () => {
      pressing.current = true
      // Snap all ghosts to cursor position — kills the wobble
      for (let i = 0; i < TRAIL_COUNT; i++) {
        positions.current[i].x = mouse.current.x
        positions.current[i].y = mouse.current.y
      }
      // Press-down scale on lead cursor
      const lead = trailsRef.current[0]
      if (lead) lead.style.scale = '0.85'
    }

    const onUp = () => {
      pressing.current = false
      const lead = trailsRef.current[0]
      if (lead) lead.style.scale = '1'
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    const tick = () => {
      for (let i = TRAIL_COUNT - 1; i >= 0; i--) {
        const target = i === 0 ? mouse.current : positions.current[i - 1]
        // When pressing, snap hard (high lerp) so ghosts stay locked
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

    // Stagger start each trail by TRAIL_DELAY ms
    const timeouts: number[] = []
    for (let i = 0; i < TRAIL_COUNT; i++) {
      timeouts.push(
        window.setTimeout(() => {
          positions.current[i] = { ...mouse.current }
        }, i * TRAIL_DELAY)
      )
    }

    rafId.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(rafId.current)
      timeouts.forEach(clearTimeout)
    }
  }, [])

  return (
    <div
      className="cursor-glitch-layer"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      {Array.from({ length: TRAIL_COUNT }, (_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) trailsRef.current[i] = el
          }}
          className="cursor-ghost"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '20px',
            height: '20px',
            willChange: 'transform',
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
