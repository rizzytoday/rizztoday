---
id: rizztoday-animation-iteration
trigger: "when refining animations in rizztoday"
confidence: 0.85
domain: css
source: local-repo-analysis
analyzed_commits: 150
---

# Iterate Animations: Elastic → Smoother → Simpler

## Action

Animations are refined through multiple commits. Follow this iteration pattern:

1. **Start elastic** - Add bounce/overshoot for personality
2. **Make smoother** - Reduce jank, improve timing
3. **Simplify** - Remove unnecessary complexity
4. **Unify** - Match with other similar animations

## Evidence from StatusButton Animation

```
8e989d3 Elastic status animation + design rules doc
70113bf Simpler, smoother status text animation
4a9c135 Faster status switch animation
3be799b Pill stretches smoothly on status change
4db863d Smoother status stretch + tighter popup tooltips
23b7207 Elastic slide animation for status text like menu buttons
0ff4ef8 Elastic bounce on pill width stretch
cb0ac8e v1.0 - FLIP animation for status button + optimized CSS
c4d67e6 Fix popup stretching during status button FLIP animation
c7c2e55 Use width animation instead of scaleX for status button
0e3c2f7 Unify mobile/desktop status animation + fix text overflow
```

## Naming Pattern in Commits

Include animation characteristic in commit message:
- `Elastic` - Has overshoot/bounce
- `Smooth/Smoother` - Refined timing
- `Simpler` - Reduced complexity
- `Unify` - Matched with other animations

## Don't Over-Engineer First Pass

Start simple, then iterate based on feel. The history shows 11 commits refining one animation - this is normal.

## Evidence

- StatusButton animation: 11 refinement commits
- Guestbook panel: 4 animation commits
- Pattern: start with feature, then multiple polish commits
