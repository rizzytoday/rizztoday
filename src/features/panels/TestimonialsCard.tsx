import { useState, useEffect } from 'react'
import { usePanelStore, panelStore } from '../../stores/panelStore'
import { VerifiedBadge } from '../../shared/components/VerifiedBadge'
import { TESTIMONIALS } from '../../constants/testimonials'

export function TestimonialsCard() {
  const activePanel = usePanelStore()
  const isActive = activePanel === 'testimonials'
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!isActive) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.testimonials-card') && !target.closest('[data-panel="testimonials"]')) {
        panelStore.close()
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isActive])

  const showTestimonial = (index: number) => {
    const total = TESTIMONIALS.length
    setCurrentIndex(((index % total) + total) % total)
  }

  return (
    <div className={`testimonials-card ${isActive ? 'active' : ''}`}>
      <button className="testimonial-arrow prev" aria-label="Previous testimonial" onClick={() => showTestimonial(currentIndex - 1)}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button className="testimonial-arrow next" aria-label="Next testimonial" onClick={() => showTestimonial(currentIndex + 1)}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {TESTIMONIALS.map((testimonial, index) => (
        <div
          key={testimonial.id}
          className={`testimonial-slide ${index === currentIndex ? 'active' : ''}`}
          data-index={index}
        >
          <div className="testimonial-header">
            <img loading="lazy" width={36} height={36} src={testimonial.pfp} alt={testimonial.name} className="testimonial-pfp" />
            <div className="testimonial-info">
              <h3 className="testimonial-name">
                {testimonial.name}
                <VerifiedBadge color="orange" />
                <img loading="lazy" width={14} height={14} src={testimonial.badge} alt={testimonial.title} className="company-badge" />
              </h3>
              <span className="testimonial-title">{testimonial.title}</span>
            </div>
          </div>
          <div className="testimonial-quote">
            <p>{testimonial.quote}</p>
          </div>
          <div className={`job-done-tag ${testimonial.job.type}`}>
            <img loading="lazy" width={16} height={16} src={testimonial.job.logo} alt={testimonial.job.type} className="job-brand-logo" />
            <span className="job-text">{testimonial.job.text}</span>
            {testimonial.job.duration && (
              <span className="job-duration">{testimonial.job.duration}</span>
            )}
            {testimonial.job.ongoing && <span className="ongoing-dot"></span>}
          </div>
        </div>
      ))}
    </div>
  )
}
