import { useState, useEffect, useRef } from 'react'
import { usePanelStore, panelStore } from '../../stores/panelStore'
import { PROJECTS } from '../../constants/projects'

export function CardsStack() {
  const activePanel = usePanelStore()
  const isActive = activePanel === 'cards'
  const [cardOrder, setCardOrder] = useState([0, 1, 2, 3])
  const [showTooltip, setShowTooltip] = useState(false)
  const stackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isActive) {
      setShowTooltip(true)
      const timer = setTimeout(() => setShowTooltip(false), 3000)
      return () => clearTimeout(timer)
    } else {
      setShowTooltip(false)
    }
  }, [isActive])

  useEffect(() => {
    if (!isActive) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.cards-stack') && !target.closest('[data-panel="cards"]')) {
        panelStore.close()
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isActive])

  const handleCardClick = (displayIndex: number, e: React.MouseEvent) => {
    if (displayIndex !== 0) return
    e.stopPropagation()
    setShowTooltip(false)

    setCardOrder(prev => {
      const newOrder = [...prev]
      const first = newOrder.shift()!
      newOrder.push(first)
      return newOrder
    })
  }

  return (
    <>
      {showTooltip && stackRef.current && (
        <div
          className="cards-instruction-tooltip visible"
          style={{
            position: 'fixed',
            right: window.innerWidth - stackRef.current.getBoundingClientRect().right - 36,
            top: stackRef.current.getBoundingClientRect().top - 25,
            textAlign: 'right'
          }}
        >
          click to shift cards
        </div>
      )}
      <div ref={stackRef} className={`cards-stack ${isActive ? 'active' : ''}`}>
        {cardOrder.map((projectIndex, displayIndex) => {
          const project = PROJECTS[projectIndex]
          return (
            <div
              key={projectIndex}
              className="project-card"
              data-index={displayIndex}
              onClick={(e) => handleCardClick(displayIndex, e)}
            >
              <div className="card-content">
                {project.type === 'grid' ? (
                  <div className="card-grid-horizontal">
                    {project.type === 'grid' && project.images && project.images.map((img, i) => (
                      <img key={i} loading="lazy" src={img} alt={`${project.title} ${i + 1}`} />
                    ))}
                  </div>
                ) : (
                  <video src={project.video} autoPlay loop muted playsInline />
                )}
              </div>
              <div className="card-caption">
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="card-title">
                  {project.title}
                </a>
                {project.logo && (
                  <img loading="lazy" src={project.logo} alt={project.logoAlt} className="card-logo" />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
