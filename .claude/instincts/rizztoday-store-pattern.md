---
id: rizztoday-store-pattern
trigger: "when adding state management in rizztoday"
confidence: 0.90
domain: react
source: local-repo-analysis
analyzed_commits: 150
---

# Use Lightweight useSyncExternalStore Pattern

## Action

Create simple stores using React's `useSyncExternalStore`. Do NOT install external state management libraries.

## Pattern

```tsx
// stores/exampleStore.ts
import { useSyncExternalStore } from 'react'

// 1. Define state type
type StateType = 'value1' | 'value2' | null

// 2. Module-level state and listeners
let state: StateType = null
const listeners: Set<() => void> = new Set()

// 3. Notify function
function notifyListeners() {
  listeners.forEach(listener => listener())
}

// 4. Export store object
export const exampleStore = {
  getState: () => state,

  subscribe: (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },

  // Action methods
  update: (newState: StateType) => {
    state = newState
    notifyListeners()
  },

  toggle: (value: StateType) => {
    state = state === value ? null : value
    notifyListeners()
  },

  reset: () => {
    state = null
    notifyListeners()
  }
}

// 5. Export hook
export function useExampleStore() {
  return useSyncExternalStore(exampleStore.subscribe, exampleStore.getState)
}
```

## Usage

```tsx
import { useExampleStore, exampleStore } from '../stores/exampleStore'

function Component() {
  const state = useExampleStore()

  return (
    <button onClick={() => exampleStore.toggle('value1')}>
      {state}
    </button>
  )
}
```

## Anti-Pattern

```tsx
// Don't use external libraries
import { create } from 'zustand'      // ❌
import { atom } from 'jotai'          // ❌
import { createStore } from 'redux'   // ❌
```

## Evidence

- Pattern in `src/stores/panelStore.ts` (6 commits)
- Pattern in `src/stores/guestbookStore.ts`
- Zero external state management dependencies in package.json
