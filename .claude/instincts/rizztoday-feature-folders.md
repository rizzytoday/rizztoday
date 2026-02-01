---
id: rizztoday-feature-folders
trigger: "when creating new components or features in rizztoday"
confidence: 0.88
domain: architecture
source: local-repo-analysis
analyzed_commits: 150
---

# Use Feature-Based Folder Structure

## Action

Organize components by feature, not by type. Place new components in the appropriate feature folder.

## Structure

```
src/
├── features/              # Feature-specific components
│   ├── hero/             # Main hero section
│   │   ├── Hero.tsx
│   │   ├── StatusButton.tsx
│   │   └── GuestbookButton.tsx
│   ├── menu/             # Navigation
│   │   └── MenuBar.tsx
│   ├── panels/           # Slide-out panels
│   │   ├── AboutCard.tsx
│   │   ├── CardsStack.tsx
│   │   ├── TestimonialsCard.tsx
│   │   └── MenuButtons.tsx
│   ├── guestbook/        # Guestbook feature
│   │   └── Guestbook.tsx
│   ├── music/            # iPod player
│   │   └── IpodPlayer.tsx
│   └── services/         # Service offerings
│       ├── ServicePills.tsx
│       └── ServiceCard.tsx
│
├── shared/               # Reusable across features
│   └── components/
│       ├── ClickWave.tsx
│       ├── StickyNote.tsx
│       └── VerifiedBadge.tsx
│
├── stores/               # State management
├── constants/            # Static data
├── types/                # TypeScript definitions
├── utils/                # Helper functions
└── services/             # External APIs
```

## Decision Tree

**New component needed:**

1. Is it specific to one feature? → `src/features/{feature}/`
2. Is it reusable across features? → `src/shared/components/`
3. Is it static data? → `src/constants/`
4. Is it a TypeScript type? → `src/types/`
5. Is it external API code? → `src/services/`

## Anti-Pattern

```
src/
├── components/           # ❌ Don't group by type
│   ├── buttons/
│   ├── cards/
│   └── inputs/
```

## Evidence

- Consistent pattern across 150 commits
- Features folder has 6 sub-features
- Shared components are clearly separated
