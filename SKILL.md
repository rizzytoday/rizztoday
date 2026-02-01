---
name: rizztoday-patterns
description: Coding patterns extracted from rizztoday - a premium personal portfolio with liquid glass UI
version: 1.0.0
source: local-git-analysis
analyzed_commits: 150
tech_stack: React 18 + Vite + TypeScript + Firebase
---

# Rizztoday Patterns

Personal portfolio site with Apple iOS 18-inspired liquid glass morphism, premium animations, and mobile-first responsive design.

## Commit Conventions

This project uses **action-first commit messages** (not conventional commits):

| Prefix | Usage | Examples |
|--------|-------|----------|
| `Fix` | Bug fixes (most common - 15 commits) | `Fix mobile labels visibility on first click` |
| `Add` | New features (13 commits) | `Add hire me button with pitchdeck service` |
| `Update` | Modifications (10 commits) | `Update calendar booking link to correct URL` |
| `Mobile:` | Mobile-specific changes (9 commits) | `Mobile: smaller stats font, tighter gaps` |
| `Improve` | Enhancements | `Improve guestbook panel animations` |
| `Remove` | Deletions | `Remove unused onClose prop from ServiceCard` |
| `Revert` | Rollbacks | `Revert CSS modules - broke entire site layout` |

**Key pattern**: Commit messages are descriptive and include the component name + what changed. Example: `Fix StatusButton touch event handling on mobile`

## Code Architecture

```
src/
├── features/           # Feature-based components
│   ├── hero/          # Main hero section
│   │   ├── StatusButton.tsx
│   │   ├── GuestbookButton.tsx
│   │   └── Hero.tsx
│   ├── menu/          # Navigation
│   │   └── MenuBar.tsx
│   ├── panels/        # Slide-out panels
│   │   ├── AboutCard.tsx
│   │   ├── CardsStack.tsx
│   │   ├── TestimonialsCard.tsx
│   │   └── MenuButtons.tsx
│   ├── guestbook/     # Guestbook feature
│   ├── music/         # iPod player
│   └── services/      # Service offerings
├── shared/
│   └── components/    # Reusable UI components
│       ├── ClickWave.tsx      # Ripple effect
│       ├── StickyNote.tsx     # Post-it note
│       └── VerifiedBadge.tsx  # Twitter-style badge
├── stores/            # State management
│   ├── panelStore.ts
│   └── guestbookStore.ts
├── constants/         # Static data
│   ├── projects.ts
│   ├── testimonials.ts
│   └── services.tsx
├── types/             # TypeScript definitions
├── utils/             # Helper functions
├── services/          # External APIs (Firebase)
└── styles.css         # Single CSS file (NOT modules)
```

### Key Architectural Decisions

1. **Single styles.css** - CSS modules were attempted but reverted ("Revert CSS modules - broke entire site layout"). All styles live in one file.

2. **Lightweight stores** - Uses `useSyncExternalStore` for state, not external libraries:
```tsx
// Pattern: stores/panelStore.ts
let state = initialValue
const listeners = new Set<() => void>()

export const store = {
  getState: () => state,
  subscribe: (listener) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  update: (newState) => {
    state = newState
    listeners.forEach(l => l())
  }
}

export function useStore() {
  return useSyncExternalStore(store.subscribe, store.getState)
}
```

3. **Feature-based organization** - Components grouped by feature, not type

## Design System (Liquid Glass)

### CSS Variables (Design Tokens)

```css
:root {
  /* Colors */
  --bg-primary: rgb(0, 0, 0);           /* Pure black */
  --bg-secondary: rgb(59, 3, 3);        /* Deep maroon */
  --text-primary: rgb(255, 255, 255);
  --text-muted: rgba(255, 255, 255, 0.76);
  --divider: rgba(255, 255, 255, 0.08);

  /* Glass Effect */
  --glass-bg: rgba(255, 255, 255, 0.15);
  --glass-border: rgba(255, 255, 255, 0.35);
  --glass-blur: blur(50px) saturate(120%);

  /* Animation Curves */
  --smooth-ease: cubic-bezier(0.4, 0, 0.2, 1);  /* For opacity, color */
  --bounce-ease: cubic-bezier(0.34, 1.56, 0.64, 1);  /* For transforms */

  /* Accents */
  --purple-glow: rgba(168, 85, 247, 0.6);
}
```

### Liquid Glass Button Pattern

```css
.glass-button {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: 50px;  /* Full pill shape */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  transition: all 0.3s var(--smooth-ease);
}

.glass-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}
```

## Animation Patterns

### Two Easing Curves for Everything

1. **Smooth ease** `cubic-bezier(0.4, 0, 0.2, 1)` - For opacity, color, filters (200-300ms)
2. **Bounce ease** `cubic-bezier(0.34, 1.56, 0.64, 1)` - For transforms, scale (300-500ms)

### Status Text Animation (Elastic Slide)

```tsx
// Pattern from StatusButton.tsx
const toggleStatus = () => {
  setIsChanging(true)
  setTextAnimClass('animating-out')

  setTimeout(() => {
    setStatusText(prev => prev === 'active' ? 'new status' : 'active')
    setTextAnimClass('animating-in')

    setTimeout(() => {
      setTextAnimClass('')
      setIsChanging(false)
    }, 200)
  }, 150)
}
```

```css
.status-text.animating-out {
  opacity: 0;
  transform: translateY(-8px);
  filter: blur(4px);
}

.status-text.animating-in {
  animation: slideIn 0.2s var(--bounce-ease) forwards;
}
```

### Animation Iteration Pattern

Many commits show iterative animation refinement:
- `Elastic bounce on pill width stretch`
- `Elastic slide animation for status text`
- `Smoother status stretch + tighter popup tooltips`
- `Simpler, smoother status text animation`

**Pattern**: Start with basic animation, then iterate: elastic → smoother → simpler → unified

## Mobile-First Workflows

### High Mobile Fix Frequency

20+ commits specifically for mobile fixes. Common patterns:

1. **Touch event handling** - Always handle both click and touchend:
```tsx
const handleClick = (e: React.MouseEvent) => {
  if (touchHandledRef.current) {
    touchHandledRef.current = false
    return
  }
  // handle click
}

const handleTouchEnd = (e: React.TouchEvent) => {
  touchHandledRef.current = true
  setTimeout(() => touchHandledRef.current = false, 500)
  // handle touch
}
```

2. **Mobile breakpoints in commit messages**:
   - `Mobile: smaller stats font, tighter gaps`
   - `Mobile: menu button gap 6px`
   - `Move hire-me to top-right on mobile, hide sticky note`

3. **Z-index management**: Multiple commits fixing z-index issues on mobile

### Responsive Breakpoints

```css
@media (max-width: 900px) { /* Tablet */ }
@media (max-width: 768px) { /* Large phone */ }
@media (max-width: 480px) { /* Small phone */ }
```

## Common Workflows

### Adding a New Feature Component

1. Create component in `src/features/[feature-name]/ComponentName.tsx`
2. Add styles to `src/styles.css` (NOT separate CSS file)
3. Add types to `src/types/` if needed
4. Add constants/data to `src/constants/`
5. If stateful, create store in `src/stores/`

### Adding Shared/Reusable Component

1. Create in `src/shared/components/ComponentName.tsx`
2. Export with named export
3. Add styles to main `src/styles.css`

### Mobile Fix Workflow

1. Identify issue on specific device/breakpoint
2. Commit with `Mobile:` or `Fix mobile` prefix
3. Test touch events separately from click events
4. Check z-index conflicts with overlays/modals

## Files That Change Together

| Primary File | Often Changes With |
|--------------|-------------------|
| `src/styles.css` | Any component (89 commits) |
| `src/features/hero/StatusButton.tsx` | `src/styles.css` |
| `src/features/services/ServiceCard.tsx` | `ServicePills.tsx`, `styles.css` |
| `src/features/menu/MenuBar.tsx` | `src/styles.css` |

## Anti-Patterns to Avoid

1. **CSS Modules** - Were attempted and reverted. Use single `styles.css`
2. **External animation libraries** - All animations are pure CSS
3. **Separate mobile/desktop handlers** - Use single handlers with touch/click detection
4. **Over-engineered state** - Simple stores with `useSyncExternalStore`

## Tech Stack

- **React 18** - Functional components, hooks only
- **Vite** - Dev server and build
- **TypeScript** - Strict typing
- **Firebase** - Guestbook backend
- **Vercel** - Hosting with analytics/speed insights
- **Pure CSS** - No Tailwind, no CSS-in-JS, no animation libraries

---

*Generated by /skill-create from 150 commits analyzed on 2026-01-30*
