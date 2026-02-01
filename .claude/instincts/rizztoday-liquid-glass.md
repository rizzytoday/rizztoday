---
id: rizztoday-liquid-glass
trigger: "when creating buttons, cards, or interactive elements in rizztoday"
confidence: 0.88
domain: css
source: local-repo-analysis
analyzed_commits: 150
---

# Apply Liquid Glass Morphism Style

## Action

Use the Apple iOS 18-inspired liquid glass effect for buttons, cards, tooltips, and panels.

## Pattern

```css
.glass-element {
  /* Glass background */
  background: var(--glass-bg);  /* rgba(255, 255, 255, 0.15) */

  /* Frosted effect - ALWAYS include webkit prefix */
  backdrop-filter: var(--glass-blur);  /* blur(50px) saturate(120%) */
  -webkit-backdrop-filter: var(--glass-blur);

  /* Subtle border */
  border: 1px solid var(--glass-border);  /* rgba(255, 255, 255, 0.35) */

  /* Full pill shape for buttons */
  border-radius: 50px;

  /* Soft shadow */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
}

/* Hover state - lift and brighten */
.glass-element:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}
```

## CSS Variables

```css
:root {
  --glass-bg: rgba(255, 255, 255, 0.15);
  --glass-border: rgba(255, 255, 255, 0.35);
  --glass-blur: blur(50px) saturate(120%);
}
```

## Evidence

- Commits: "Apple liquid glass style for status button and popups"
- Commits: "Crystal clear Apple liquid glass status button"
- Commits: "Smooth status text animation + liquid glass tooltips"
- Pattern consistent across StatusButton, MenuBar, panels
