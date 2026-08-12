# v1.0 Full code audit — 2026-08-12

> **Status (2026-08-13):** v2 is done, and every bug listed here is fixed (see the statuses in [09-product-backlog/01-backlog.md](../09-product-backlog/01-backlog.md)). This document is archival — it records the actual state of v1.0.

Source: the "Status assessment: Scheduled URL Blocker (v1.0)" analysis, prepared before v2 was started. We keep this file in the knowledge base as the official code review of v1.0.

---

# 📋 Status assessment: "Scheduled URL Blocker" (v1.0)

**Type:** Manifest V3 Chrome/Brave extension, based on `declarativeNetRequest`

**Files:**

| File | Role | Status |
|---|---|---|
| `manifest.json` | Configuration (MV3) | ✅ OK, but 1 bug |
| `background.js` | Service worker – rule management | ⚠️ Several logic bugs |
| `popup.html` / `popup.js` | Settings UI | ⚠️ Fragile, no validation |
| `blocked.html` | "Blocked page" message | ❌ **Dead code, not used** |
| `Rules.json` | Static DNR rules | ⚠️ Name mismatch, empty |
| `_metadata/` | Browser-generated artifact | ⚠️ Should be ignored in git |

---

## 🐛 Critical problems

**1. The blocking logic contradicts the description**
- `manifest.json` description: *"Blocks URLs **outside** the given time intervals"*
- `background.js` (line 19): `if (now < startDate || now > endDate) return null;` → **only blocks within the interval**
- The code and the UI are consistent with each other (blocking *within* the interval); only the description is wrong — but this must be clarified, because it's the basis of the feature. → **Open ADR-001.**

**2. Midnight crossing doesn't work**
- For a `22:00 – 06:00` interval the code puts the start and end time on the same day, so it never blocks after midnight. This is a typical, common use case (e.g. an evening social-media block).

**3. Rule ids above 100 lose their cleanup**
- `removeRuleIds` is hardcoded to `1..100` (line 37), but the ids grow based on `index+1`. With more than 100 URLs, the old 101+ rules **stay in the DNR forever**.

**4. `blocked.html` isn't wired in anywhere**
- The DNR `block` action doesn't display a custom page, only the browser's `ERR_BLOCKED_BY_CLIENT` error. The file is currently dead code.

**5. Filename mismatch: `rules.json` vs `Rules.json`**
- The manifest references `path: "rules.json"`, the file is `Rules.json`. On macOS (case-insensitive FS) it happens to work, but on **Linux / CI the load would fail**.

---

## ⚠️ More significant problems

1. **Runs on raw upstream data:** if a saved item is incomplete (`startTime` missing), `split()` throws and the whole refresh collapses.
2. **False-positive rules:** `urlFilter: "facebook.com"` also blocks `notfacebook.com`. Due to the missing domain anchor (`||`).
3. **The popup uses index-based deletion** (`splice(index, 1)`), which is fragile; `background.js` also has a URL-based `removeUrlFromRules` that is never called (dead code, duplication).
4. **No user feedback:** on error there's only a `console.error`; the popup silently does nothing (invalid/empty URL, duplicate).
5. **No URL validation or duplicate filtering** on add.

---

## 🔧 Minor / code-quality notes

1. **1-minute alarm:** `updateDynamicRules` runs even when nothing changed; it needlessly wakes the service worker.
2. **No error handling:** `chrome.runtime.lastError` is never checked anywhere.
3. `declarativeNetRequest` + `declarativeNetRequestWithHostAccess` together are redundant given the current permissions.
4. `sendResponse` is a synchronous fire-and-forget, without `return true` — it works for now, but it's a dangerous pattern.
5. `_metadata/` is a browser-generated binary state file — **it doesn't belong in the repo**, it should be in `.gitignore` (this is exactly the unstaged modification in `git status`).
6. The commented-out old CSS in the popup HTML is dead code.

---

## 💡 What's a good foundation though

- Correct **MV3 architecture** (service worker + DNR) — this is the modern direction, much better than `webRequest` blocking.
- The **storage-based, dynamic rule** model scales well.
- **No XSS:** the popup uses `textContent` (not `innerHTML`); input never reaches HTML.
- The storage model (`url + startTime + endTime`) would already support a **per-domain schedule** — only the UI doesn't use it (global interval).

---

## 🔄 Next steps (recorded in the backlog)

Before starting v2, two things are worth deciding:

1. **Blocking semantics** – should it block *within* or *outside* the interval? (Code = within, description = outside) → [ADR-001](../03-decisions/adr-001-blocking-semantics.md)
2. **Schedule model** – a global time window for all URLs (as now), or individual per-URL windows (which storage already supports)? → [ADR-002](../03-decisions/adr-002-schedule-model.md)

The concrete fixes and feature tasks are in the [09-product-backlog/01-backlog.md](../09-product-backlog/01-backlog.md) file.