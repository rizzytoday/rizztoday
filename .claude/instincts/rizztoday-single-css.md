---
id: rizztoday-single-css
trigger: "when adding styles or creating components in rizztoday"
confidence: 0.95
domain: css
source: local-repo-analysis
analyzed_commits: 150
---

# Use Single styles.css File

## Action

Add all styles to `src/styles.css`. Do NOT create CSS modules or separate CSS files.

## Why

CSS modules were attempted and explicitly reverted:
- Commit `591901866`: "Phase 4: Split CSS into modules"
- Commit `a1a8f9f49`: "Revert CSS modules - broke entire site layout"

## Pattern

```
src/
├── styles.css          ✅ Single file (89 commits touched this)
├── features/
│   └── hero/
│       └── StatusButton.tsx   ✅ No .module.css
└── shared/
    └── components/
        └── ClickWave.tsx      ✅ No .module.css
```

## Anti-Pattern

```
src/
├── features/
│   └── hero/
│       ├── StatusButton.tsx
│       └── StatusButton.module.css  ❌ Don't create
```

## Evidence

- `styles.css` changed in 89 of 150 commits (59%)
- CSS modules revert is documented in git history
- All current components reference classes from single styles.css
