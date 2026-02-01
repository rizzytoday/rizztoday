---
id: rizztoday-commit-style
trigger: "when writing a commit message for rizztoday"
confidence: 0.85
domain: git
source: local-repo-analysis
analyzed_commits: 150
---

# Use Action-First Commit Messages

## Action

Start commit messages with action verbs, NOT conventional commit prefixes:

**Use these prefixes:**
- `Fix` - Bug fixes (most common)
- `Add` - New features
- `Update` - Modifications to existing code
- `Mobile:` - Mobile-specific changes
- `Improve` - Enhancements
- `Remove` - Deletions
- `Revert` - Rollbacks

**Format:** `{Action} {component/area} {what changed}`

## Examples

```
Fix StatusButton touch event handling on mobile
Add hire me button with pitchdeck service and UI improvements
Update calendar booking link to correct URL
Mobile: smaller stats font, tighter gaps in name section
Improve guestbook panel animations with smooth Apple-style transitions
Remove unused onClose prop from ServiceCard
Revert CSS modules - broke entire site layout
```

## Anti-Pattern

Do NOT use conventional commits format:
- ❌ `feat: add hire me button`
- ❌ `fix(StatusButton): touch handling`
- ✅ `Add hire me button with pitchdeck service`
- ✅ `Fix StatusButton touch event handling on mobile`

## Evidence

- Analyzed 150 commits
- 47% use action-first format (Fix: 15, Add: 13, Update: 10, Mobile: 9)
- Zero commits use conventional commit format (feat:, fix:, chore:)
