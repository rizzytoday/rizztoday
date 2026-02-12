import { useEffect, useRef, useState } from 'react'
import { StatusButton } from './StatusButton'
import { GuestbookButton } from './GuestbookButton'
import { VerifiedBadge } from '../../shared/components/VerifiedBadge'
import { ServicePills } from '../services/ServicePills'
import { ASCII_CONFIG, ASCII_IMAGE_CONFIG } from '../../constants/ascii'

export function Hero() {
  const canvasRef = useRef<HTMLPreElement>(null)
  const imageCanvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [projectCount, setProjectCount] = useState(0)
  const [isGlitching, setIsGlitching] = useState(false)
  const [isPfpSpinning, setIsPfpSpinning] = useState(false)
  const imageDataRef = useRef<ImageData | null>(null)
  const mouseRef = useRef({ x: 0, y: 0, isHovering: false })
  const [asciiReady, setAsciiReady] = useState(false)

  const asciiChars = ASCII_CONFIG.chars
  const asciiWidth = ASCII_CONFIG.width
  const asciiHeight = ASCII_CONFIG.height
  const padding = ASCII_CONFIG.padding
  const imageWidth = ASCII_IMAGE_CONFIG.width
  const imageHeight = ASCII_IMAGE_CONFIG.height

  const animationIdRef = useRef<number>(0)

  // ASCII animation - hover-gated, only runs RAF when mouse is over the area
  useEffect(() => {
    const img = new Image()
    img.src = '/rizzyrose.png'

    const renderStaticFrame = () => {
      if (!canvasRef.current || !imageDataRef.current) return
      const imageData = imageDataRef.current
      let output = ''
      for (let y = 0; y < asciiHeight; y++) {
        for (let x = 0; x < asciiWidth; x++) {
          const index = (y * asciiWidth + x) * 4
          const r = imageData.data[index]
          const g = imageData.data[index + 1]
          const b = imageData.data[index + 2]
          const a = imageData.data[index + 3]
          const brightness = ((r + g + b) / 3) * (a / 255)
          const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1))
          output += asciiChars[charIndex]
        }
        output += '\n'
      }
      canvasRef.current.textContent = output
      setAsciiReady(true)
    }

    img.onload = () => {
      const canvas = imageCanvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = asciiWidth
      canvas.height = asciiHeight
      ctx.clearRect(0, 0, asciiWidth, asciiHeight)
      ctx.drawImage(img, padding, padding, imageWidth, imageHeight)
      imageDataRef.current = ctx.getImageData(0, 0, asciiWidth, asciiHeight)

      renderStaticFrame()
    }

    return () => cancelAnimationFrame(animationIdRef.current)
  }, [])

  const renderAnimatedFrame = () => {
    if (!canvasRef.current || !imageDataRef.current) return
    const imageData = imageDataRef.current
    const time = Date.now() * 0.001
    let output = ''

    for (let y = 0; y < asciiHeight; y++) {
      for (let x = 0; x < asciiWidth; x++) {
        const index = (y * asciiWidth + x) * 4
        const r = imageData.data[index]
        const g = imageData.data[index + 1]
        const b = imageData.data[index + 2]
        const a = imageData.data[index + 3]

        let brightness = ((r + g + b) / 3) * (a / 255)

        const dx = x - mouseRef.current.x
        const dy = y - mouseRef.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const wave = Math.sin(distance * 0.3 - time * 3) * 0.5 + 0.5
        const intensity = Math.max(0, 1 - distance / 15)
        brightness = brightness + (wave * intensity * 100)

        brightness = Math.max(0, Math.min(255, brightness))
        const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1))
        output += asciiChars[charIndex]
      }
      output += '\n'
    }

    canvasRef.current.textContent = output
  }

  const startAnimation = () => {
    renderAnimatedFrame() // instant first frame, no waiting for RAF tick
    const loop = () => {
      if (!mouseRef.current.isHovering) return
      renderAnimatedFrame()
      animationIdRef.current = requestAnimationFrame(loop)
    }
    animationIdRef.current = requestAnimationFrame(loop)
  }

  const stopAnimation = () => {
    cancelAnimationFrame(animationIdRef.current)
    // Re-render static frame
    if (!canvasRef.current || !imageDataRef.current) return
    const imageData = imageDataRef.current
    let output = ''
    for (let y = 0; y < asciiHeight; y++) {
      for (let x = 0; x < asciiWidth; x++) {
        const index = (y * asciiWidth + x) * 4
        const r = imageData.data[index]
        const g = imageData.data[index + 1]
        const b = imageData.data[index + 2]
        const a = imageData.data[index + 3]
        const brightness = ((r + g + b) / 3) * (a / 255)
        const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1))
        output += asciiChars[charIndex]
      }
      output += '\n'
    }
    canvasRef.current.textContent = output
  }

  // Project counter animation — limited to 3 glitch cycles
  useEffect(() => {
    const targetCount = 19
    const maxGlitchCycles = 3
    let current = 0
    let glitchCycle = 0
    const stepTime = 2800 / targetCount
    let countUpInterval: NodeJS.Timeout | null = null
    let glitchTimeout1: NodeJS.Timeout | null = null
    let glitchTimeout2: NodeJS.Timeout | null = null
    let glitchLoopTimeout: NodeJS.Timeout | null = null

    countUpInterval = setInterval(() => {
      current++
      setProjectCount(current)
      if (current >= targetCount) {
        clearInterval(countUpInterval!)
        glitchTimeout1 = setTimeout(startGlitchLoop, 300)
      }
    }, stepTime)

    const startGlitchLoop = () => {
      if (glitchCycle >= maxGlitchCycles) return
      glitchCycle++
      setProjectCount(20)
      setIsGlitching(true)
      glitchTimeout2 = setTimeout(() => {
        setProjectCount(19)
        setIsGlitching(false)
        glitchLoopTimeout = setTimeout(startGlitchLoop, 1500)
      }, 200)
    }

    return () => {
      if (countUpInterval) clearInterval(countUpInterval)
      if (glitchTimeout1) clearTimeout(glitchTimeout1)
      if (glitchTimeout2) clearTimeout(glitchTimeout2)
      if (glitchLoopTimeout) clearTimeout(glitchLoopTimeout)
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * asciiWidth
    mouseRef.current.y = ((e.clientY - rect.top) / rect.height) * asciiHeight
    if (!mouseRef.current.isHovering) {
      mouseRef.current.isHovering = true
      startAnimation()
    }
  }

  return (
    <div className="hero">
      <div
        className={`ascii-rose ${asciiReady ? 'ready' : ''}`}
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { mouseRef.current.isHovering = false; stopAnimation() }}
      >
        <pre ref={canvasRef}></pre>
      </div>
      <canvas ref={imageCanvasRef} style={{ display: 'none' }} />

      <StatusButton />
      <GuestbookButton />
      <ServicePills />

      <div className="name-tagline">
        <img
          src="/newpfp.png"
          alt="Riz Rose"
          className={`hero-pfp ${isPfpSpinning ? 'spin' : ''}`}
          fetchPriority="high"
          onClick={() => {
            setIsPfpSpinning(true)
            setTimeout(() => setIsPfpSpinning(false), 600)
          }}
        />
        <h1 className="name">
          Riz Rose
          <VerifiedBadge color="red" />
          <img loading="lazy" src="/content/logos/radiant logo.png" alt="Radiants" className="company-badge" />
        </h1>
        <p className="tagline">translating ideas into visuals</p>

        <div className="project-stats">
          <span className="stats-label">worked with</span>
          <span className={`stats-counter ${isGlitching ? 'glitch' : ''}`}>{projectCount}</span>
          <span className="stats-label">web3 projects</span>
        </div>

        <div className="client-logos">
          <img loading="lazy" src="/content/logos/hydex logo.png" alt="Hydex" className="logo-hydex" />
          <img loading="lazy" src="/content/logos/rad-BLACK.png" alt="Radiants" className="logo-radiants" />
          <img loading="lazy" src="/content/logos/Solana Logomark - Color.svg" alt="Solana" className="logo-solana" />
          <img loading="lazy" src="/content/logos/soladex.svg" alt="Soladex" className="logo-soladex" />
          <img loading="lazy" src="/content/logos/skr-seeker.png" alt="Seeker" className="logo-skr" />
          <img loading="lazy" src="/content/logos/solana-mobile.svg" alt="Solana Mobile" className="logo-solana-mobile" />
        </div>
      </div>
    </div>
  )
}
