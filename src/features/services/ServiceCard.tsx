import { useState, useEffect } from 'react'
import type { Service } from '../../constants/services'

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const isVideo = service.preview.endsWith('.mp4')

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(true)
      })
    })
  }, [])

  return (
    <div className={`service-card ${isVisible ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
      <div className="service-card-preview">
        {isVideo ? (
          <video src={service.preview} autoPlay loop muted playsInline />
        ) : (
          <img src={service.preview} width={300} height={169} alt={service.title} />
        )}
      </div>
      <h3 className="service-card-title">{service.title}</h3>
      <p className="service-card-description">{service.description}</p>
      <a
        href={service.ctaLink}
        target="_blank"
        rel="noopener noreferrer"
        className="service-card-cta"
      >
        {service.cta}
      </a>
    </div>
  )
}
