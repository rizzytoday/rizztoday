import { useEffect, useRef } from 'react'

const TRAIL_COUNT = 4
// SVG arrow tip offset — must match the CSS cursor hotspot (3 2)
const TIP_X = 3
const TIP_Y = 2

export function CursorGlitch() {
  const trailsRef = useRef<HTMLDivElement[]>([])
  const positions = useRef(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: 0, y: 0 }))
  )
  const mouse = useRef({ x: 0, y: 0 })
  const visible = useRef(false)
  const pressing = useRef(false)
  const rafId = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

  useEffect(() => {
    if (isTouch) return
    const showAll = () => {
      if (visible.current) return
      visible.current = true
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const el = trailsRef.current[i]
        if (el) el.style.visibility = 'visible'
      }
    }

    const setTransform = (el: HTMLElement, x: number, y: number) => {
      el.style.transform = `translate(${x - TIP_X}px, ${y - TIP_Y}px)`
    }

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
      if (!visible.current) {
        for (let i = 0; i < TRAIL_COUNT; i++) {
          positions.current[i].x = e.clientX
          positions.current[i].y = e.clientY
          const el = trailsRef.current[i]
          if (el) setTransform(el, e.clientX, e.clientY)
        }
        showAll()
      }
    }

    const onDown = (e: MouseEvent) => {
      pressing.current = true
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
      for (let i = 0; i < TRAIL_COUNT; i++) {
        positions.current[i].x = e.clientX
        positions.current[i].y = e.clientY
        const el = trailsRef.current[i]
        if (el) setTransform(el, e.clientX, e.clientY)
      }

      // Click wave ripple
      const container = containerRef.current
      if (container) {
        const wave = document.createElement('div')
        wave.className = 'click-wave'
        wave.style.left = e.clientX + 'px'
        wave.style.top = e.clientY + 'px'
        container.appendChild(wave)
        wave.addEventListener('animationend', () => wave.remove())
      }
    }

    const onUp = () => {
      pressing.current = false
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

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
          setTransform(el, positions.current[i].x, positions.current[i].y)
        }
      }
      rafId.current = requestAnimationFrame(tick)
    }

    rafId.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  if (isTouch) return null

  return (
    <div
      ref={containerRef}
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
