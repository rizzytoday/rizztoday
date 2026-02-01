---
id: rizztoday-touch-click-handling
trigger: "when handling click events on interactive elements in rizztoday"
confidence: 0.90
domain: react
source: local-repo-analysis
analyzed_commits: 150
---

# Handle Both Touch and Click Events

## Action

Always handle both `onClick` and `onTouchEnd` for interactive elements. Use a ref to prevent duplicate firing.

## Pattern

```tsx
const touchHandledRef = useRef(false)

const handleClick = (e: React.MouseEvent) => {
  // Prevent duplicate handling if touch was already processed
  if (touchHandledRef.current) {
    touchHandledRef.current = false
    return
  }
  // Handle click logic
}

const handleTouchEnd = (e: React.TouchEvent) => {
  // Mark that touch was handled to prevent click from also firing
  touchHandledRef.current = true
  setTimeout(() => {
    touchHandledRef.current = false
  }, 500)
  // Handle touch logic (can differ from click)
}

return (
  <button
    onClick={handleClick}
    onTouchEnd={handleTouchEnd}
  >
    ...
  </button>
)
```

## Why

Mobile devices fire both touch and click events. Without this pattern:
- Actions fire twice on mobile
- Touch-specific behavior (like showing actions) doesn't work

## Evidence

- 8 commits fixing StatusButton touch/click issues
- Pattern established in `src/features/hero/StatusButton.tsx:31-54`
- 20+ mobile-specific commits in history
