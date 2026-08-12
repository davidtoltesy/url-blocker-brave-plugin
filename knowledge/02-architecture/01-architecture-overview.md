# Architecture — v2.0 (Manifest V3)

## Overview

```
┌─────────────┐  chrome.storage.local  ┌──────────────────┐
│  popup.js   │ ─────────────────────► │  sites[]         │
│  (tab UI)   │  (add/edit/toggle/     │  (general)       │
└─────────────┘   delete)              └────────┬─────────┘
                                               │ storage.onChanged
┌──────────────────────┐ ◄────────────────────▼──────────────┐
│  background.js        │ ◄─────────── updateBlockingRules() │
│  (service worker)     │    ┌─────────────────────────────┐ │
│                       │    │ getDynamicRules → diff      │ │
│                       │    │ updateDynamicRules          │ │
│                       │    │ scheduleNextRefresh (alarm) │ │
└──────────────────────┘    └─────────────────────────────┘ │
   ▲        │                                                │
   │        └──────────────────► declarativeNetRequest ──────┤
   └ alarms (one-shot, only at transitions)                  │
```

## Components

### 1. Popup — `popup.html` / `popup.js`
- Two tabs: **"New block"** (URL + schedule + submit) and **"List"** (managing items).
- Writes only to `chrome.storage.local` (`sites`); there is **no** `chrome.runtime.sendMessage` within the UI — the background reacts to `storage.onChanged`.
- `activeTab` permission: to read the active tab's URL for prefilling the "New block" field.

### 2. Background — `background.js` (service worker)

**`loadSites()`**
- Reads the `sites` array; if it's absent but a legacy `blockedUrls` exists → migrates: every v1 item is imported as `time_window` mode with `active: true`, then the legacy key is deleted.

**`isBlockedNow(site, now)`**
- `active === false` → not blocked (suspended).
- `all_day` → always blocked.
- `time_window` → blocked within the window; midnight crossing (`start > end`) supported; `start === end` → blocks all day.
- The interval `[start, end)` is half-open (clarifying v1's inclusive-`< end` behavior).

**`updateBlockingRules()`**
- Generates `block` rules for the currently active items with `urlFilter: "||" + url` (anchored, to avoid false positives), for `main_frame`.
- **Diff-based refresh:** `getDynamicRules()` → compares the current ids with the desired ones; only calls `updateDynamicRules` if they differ. So no unnecessary update runs when nothing changed.

**`scheduleNextRefresh(sites)`**
- Finds the **next time transition** among the start/end corners of all active `time_window` items.
- **One-shot alarm** (`chrome.alarms.create` with `when`) for the transition time + a 2 s safety margin.
- If no such transition exists, the alarm is cleared. **No periodic execution** — replacing v1's per-minute alarm and drastically reducing memory/CPU load.

### 3. Refresh triggers

- `chrome.storage.onChanged` (on the `sites` / `blockedUrls` keys) — immediate on popup add/delete.
- `chrome.alarms.onAlarm` (`refreshRules`) — on time-window changes.
- `chrome.runtime.onInstalled` + `onStartup`.
- `updateBlockingRules()` called once on startup.

## Permissions (v2)

- `declarativeNetRequest`, `storage`, `alarms`, `activeTab`.
- Removed from v1: `declarativeNetRequestWithHostAccess` (redundant), global `host_permissions` (DNR dynamic rules don't need host permission), and the static `declarative_net_request` block + `Rules.json`.
- `activeTab` — only for the popup to read the active tab's URL; no `tabs` (less invasive).

## Memory / resource optimization

- **No content script**, no `webRequest`, no `onMessage` — blocking is native DNR (browser engine), so JS memory usage is near zero.
- **No periodic alarm**: the service worker stays dormant most of the time; it only wakes at transitions.
- Diff-based rule refresh — doesn't swap the rule set unnecessarily.
- `sites[]` is minimal in size; legacy `blockedUrls` migrated, legacy key deleted.

## Known limitations

- The minimum period of a `when`-based alarm can be 30 s — a small slip is possible despite the +2 s margin, but the subsequent `updateBlockingRules` and rescheduling correct it.
- No custom "blocked page" — the native `ERR_BLOCKED_BY_CLIENT` is shown (MV3 limitation, backlog #5 closed: recommended for deletion, `blocked.html` removed).