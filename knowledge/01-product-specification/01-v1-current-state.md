# v1.0 Current behavior — Specification

This document records the actual (surveyed) behavior of the v1.0 code, as of 2026-08-12.

## Features

1. **Add URL** — In the popup you enter a URL pattern (`url`) and the start/end hours and minutes (`startHour`, `startMinute`, `endHour`, `endMinute`). On add, a `{ url, startTime, endTime }` object is appended to the `blockedUrls` array.
2. **Listing** — The popup lists the saved items, each with a delete (`X`) button (index-based deletion).
3. **Blocking** — From `blockedUrls`, the service worker creates DNR dynamic rules with the `block` action for the `main_frame` type.
4. **Scheduling** — The rules are regenerated every minute (alarm) and on every modification (items within the current time interval are active).

## Data model

```
blockedUrls: [
  { url: string, startTime: "HH:MM", endTime: "HH:MM" }
]
```

- `url`: free-text pattern (e.g. `facebook.com`), no validation.
- `startTime` / `endTime`: strings in "HH:MM" format; the inputs (`type="number"`) can also yield shapes like `"7:30"`.

## UI flows

- **Add:** every field must be filled in; on error there is only a `console.error` — the user gets no feedback.
- **Delete:** `splice(index, 1)` by row index, then re-rendering.
- **Load:** `loadURLs()` when the popup is assembled.

## Rule-generation logic for stored items

Condition in the code (`background.js`): if the current time does **not** fall within the `[start, end]` interval, the rule is omitted. If it does, the rule is created. (So the current code blocks **within** the interval — contrary to the `manifest.json` description, which says "outside". Open decision: [03-decisions](03-decisions).)

## Known design limitations (v1)

- A single global time window applies to all URLs.
- No duplicate check, no URL-format validation, and no user-facing error feedback.
- No midnight-crossing handling.
- `blocked.html` is not wired into any flow.