---
id: rizztoday-mobile-first
trigger: "when working on responsive design or mobile issues in rizztoday"
confidence: 0.92
domain: css
source: local-repo-analysis
analyzed_commits: 150
---

# Mobile-First Development with Iterative Fixes

## Action

1. Always test on mobile after changes
2. Use standard breakpoints
3. Prefix mobile-specific commits with `Mobile:`
4. Watch for z-index conflicts with overlays

## Breakpoints

```css
/* Mobile-first: base styles are mobile */

@media (min-width: 480px) {
  /* Small phones → larger phones */
}

@media (min-width: 768px) {
  /* Phones → tablets */
}

@media (min-width: 900px) {
  /* Tablets → desktop */
}
```

## Common Mobile Issues (from commit history)

| Issue | Fix |
|-------|-----|
| Touch + click double-fire | Use `touchHandledRef` pattern |
| Elements hidden under overlays | Check z-index hierarchy |
| Labels not visible | Move CSS rules outside media queries if needed |
| Popup disappearing | Check transform-origin and z-index |
| Buttons too small | Minimum 44px touch target |
| Text overflow | Use `overflow: hidden` and `text-overflow: ellipsis` |

## Commit Message Pattern

```
Mobile: smaller stats font, tighter gaps in name section
Mobile: menu button gap 6px
Fix mobile labels visibility on first click
Fix StatusButton touch event handling on mobile
```

## Evidence

- 20+ mobile-specific commits
- 9 commits with `Mobile:` prefix
- Multiple fix iterations for same components (StatusButton: 8 commits)
- Documented pattern of iterative mobile refinement
