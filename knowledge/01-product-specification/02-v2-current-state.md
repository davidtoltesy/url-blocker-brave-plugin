# v2.0 Current behavior — Specification

This document records the implemented v2.0 behavior, as of 2026-08-13. The v1 specification (`01-v1-current-state.md`) is archival.

## Features

1. **Add URL** — On the "New block" tab you enter a URL pattern. On add, an item is appended to the `sites[]` array (id generation: max+1).
2. **Schedule mode** — Selectable per item:
   - `all_day` (**default**): always blocked ("never again").
   - `time_window`: only within the given `start`–`end` window (midnight crossing supported).
3. **Time selection in 15-minute steps** — In `time_window` mode, `start` and `end` are chosen from dropdowns (00:00–23:45, 15-minute increments: 00/15/30/45). The "all day" mode hides the time fields.
4. **On/off toggle** — A toggle button next to each list item for **suspending** the blocking (`active: false`) and re-enabling it. Suspended items appear struck through and dimmed in the list.
5. **Edit** — The ✎ button brings the item back to the "New block" form pre-filled, and the button switches to "Save".
6. **Delete** — ✕ button plus a `confirm` confirmation.
7. **Prefill from the active tab** — When the popup opens, the hostname of the active tab is placed in the URL field (if http/https and the field is empty). Requires the `activeTab` permission.
8. **Separate "List" tab** — The list of blocked sites lives on a separate tab and is edited there.

## Data model

```
chrome.storage.local / sites: [
  {
    id: number,          // positive integer, max+1 — also the id of the DNR rule
    url: string,         // normalized hostname (protocol and "www." stripped, lowercase)
    mode: "all_day" | "time_window",
    start?: "HH:MM",     // only for time_window
    end?: "HH:MM",       // only for time_window
    active: boolean      // false = suspended
  }
]
```

Legacy key: `blockedUrls` — the v1 migration import (see `loadSites` in `background.js`).

## Changes compared to v1

| Aspect | v1 | v2 |
|---|---|---|
| Time selection | free hour/minute | 15-minute steps (00/15/30/45) |
| Scheduling | global (single window) | per-URL (`all_day` / `time_window`) |
| Modes | interval only | `all_day` (default) + `time_window` |
| List | same place, delete only | separate tab, on/off + edit + delete |
| Prefill | none | active-tab hostname |
| Theme | base style | dark "focus" theme |
| Midnight crossing | broken / unsupported | supported |

## Correct blocking

- Unlike v1, there is no unanchored plain `urlFilter` issue anymore: v2 uses an **anchored** (`||`) filter, so `facebook.com` does not block `notfacebook.com`.
- The popup prevents adding duplicates (identical normalized URLs).