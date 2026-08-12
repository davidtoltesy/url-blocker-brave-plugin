# Repo structure and conventions

## Folder structure

```
BrowserPlugin/
├── manifest.json          # MV3 extension manifest (v2)
├── background.js          # service worker — DNR rule generation, one-shot alarm
├── popup.html / popup.js  # settings UI (2 tabs, dark "focus" theme)
├── icon16/48/128.png      # icons
├── _metadata/             # browser-generated (NOT for the repo — see .gitignore)
└── knowledge/             # the project knowledge base (this directory)
```

## Conventions

- **Language:** the product and the documentation are in Hungarian; code variable names stay in English.
- **Date format:** `YYYY-MM-DD`.
- **File naming:** the `knowledge` subfolders use a numbered prefix (`00-`, `01-`, ...) — see the Canvas pattern; files follow the `NN-name.md` pattern.
- **ADR:** `adr-NNN-<short-name>.md`; open ones get **PROPOSED** status.

## Work rules (current project)

1. **Only implement approved backlog items** (see [09-product-backlog](09-product-backlog)).
2. Before starting the v2 work, close the two open ADRs ([001](03-decisions/adr-001-blocking-semantics.md), [002](03-decisions/adr-002-schedule-model.md)) with the user.
3. While coding, follow the lessons in [04-lessons-learned](04-lessons-learned).
4. After every change, update the knowledge documentation (especially the backlog status and the current state).