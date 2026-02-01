---
id: rizztoday-animation-easing
trigger: "when adding animations or transitions in rizztoday"
confidence: 0.92
domain: css
source: local-repo-analysis
analyzed_commits: 150
---

# Use Two Easing Curves for Animations

## Action

Use the predefined CSS variables for all animations:

1. **`--smooth-ease`** `cubic-bezier(0.4, 0, 0.2, 1)` - For opacity, color, filters (200-300ms)
2. **`--bounce-ease`** `cubic-bezier(0.34, 1.56, 0.64, 1)` - For transforms, scale (300-500ms)

## Pattern

```css
/* Opacity/color changes - smooth ease */
.element {
  transition: opacity 0.3s var(--smooth-ease),
              color 0.35s var(--smooth-ease),
              filter 0.2s var(--smooth-ease);
}

/* Transform/scale changes - bounce ease */
.element:hover {
  transform: translateY(-2px) scale(1.02);
  transition: transform 0.3s var(--bounce-ease);
}

/* Combined - use both appropriately */
.button {
  transition:
    opacity 0.3s var(--smooth-ease),
    transform 0.3s var(--bounce-ease),
    box-shadow 0.3s var(--smooth-ease);
}
```

## Anti-Pattern

```css
/* Don't use generic ease or linear */
.element {
  transition: all 0.3s ease;        /* ❌ */
  transition: transform 0.3s linear; /* ❌ */
}

/* Don't use single transition for everything */
.element {
  transition: all 0.3s var(--smooth-ease); /* ❌ */
}
```

## Evidence

- 20+ animation-related commits refining easing curves
- Variables defined in `:root` of styles.css
- Commits: "Elastic status animation", "Smoother status stretch", "Elastic slide animation"
