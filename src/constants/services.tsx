import { ReactNode } from 'react'

export interface Service {
  id: string
  title: string
  icon: ReactNode
  preview: string
  description: string
  cta: string
  ctaLink: string
  visible: boolean
}

// Service Icons as inline SVGs
const WebIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M2 12h20"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
)

const BrandIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)

const VideoIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <polygon points="10 9 16 12 10 15 10 9" fill="currentColor" stroke="none"/>
  </svg>
)

const PitchIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"/>
    <path d="M18 9l-5 5-4-4-3 3"/>
  </svg>
)

export const SERVICES: Service[] = [
  {
    id: 'web',
    title: 'Web Design & UI',
    icon: WebIcon,
    preview: '/content/radiants-web.mp4',
    description: 'websites, landing pages, apps — the smooth kind with nice animations. i make it feel right.',
    cta: "let's talk",
    ctaLink: 'https://calendar.app.google/mpTJKMqZ8cTz5KD79',
    visible: false
  },
  {
    id: 'brand',
    title: 'Brand & Visual',
    icon: BrandIcon,
    preview: '/content/we-split-animation.mp4',
    description: 'logos, visual identity, the whole vibe. making sure people remember you.',
    cta: "let's talk",
    ctaLink: 'https://calendar.app.google/mpTJKMqZ8cTz5KD79',
    visible: false
  },
  {
    id: 'video',
    title: 'Video & Motion',
    icon: VideoIcon,
    preview: '/content/solana.mp4',
    description: 'motion graphics, promo videos, animated stuff that actually moves people.',
    cta: "let's talk",
    ctaLink: 'https://calendar.app.google/mpTJKMqZ8cTz5KD79',
    visible: false
  },
  {
    id: 'pitch',
    title: 'Pitchdecks',
    icon: PitchIcon,
    preview: '/content/PITCHDECK-2.webp',
    description: "i'm free for a pitchdeck design, let's make sure you're getting that raise.",
    cta: "let's talk",
    ctaLink: 'https://calendar.app.google/mpTJKMqZ8cTz5KD79',
    visible: true
  }
]
