import { useEffect, useRef } from 'react'

const TRAIL_COUNT = 5
const TRAIL_DELAY = 1 // ~1ms stagger per ghost

export function CursorGlitch() {
  const trailsRef = useRef<HTMLDivElement[]>([])
  const positions = useRef(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 }))
  )
  const mouse = useRef({ x: -100, y: -100 })
  const rafId = useRef(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const tick = () => {
      // Each trail chases the one before it with lerp
      for (let i = TRAIL_COUNT - 1; i >= 0; i--) {
        const target = i === 0 ? mouse.current : positions.current[i - 1]
        const lerp = 0.15 + i * 0.08 // slower for further ghosts
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
          // Initialize position to current mouse
          positions.current[i] = { ...mouse.current }
        }, i * TRAIL_DELAY)
      )
    }

    rafId.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
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
            // furthest trails get slight color shift for glitch feel
            filter: i > 2 ? `hue-rotate(${i * 30}deg)` : undefined,
          }}
        >
          {/* Windows-style arrow cursor SVG */}
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
