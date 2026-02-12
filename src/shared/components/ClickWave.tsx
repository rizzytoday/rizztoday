import { useEffect } from 'react'

export function ClickWave() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const wave = document.createElement('div')
      wave.className = 'click-wave'
      wave.style.left = e.clientX + 'px'
      wave.style.top = e.clientY + 'px'
      document.body.appendChild(wave)
      wave.addEventListener('animationend', () => wave.remove())
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return null
}
