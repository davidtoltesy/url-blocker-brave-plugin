# Backlog — Scheduled URL Blocker (v1 → v2)

Ideas and fix tasks. **Implementation only with explicit approval.**

The backlog items come from the [08-code-reviews/01-2026-08-12-v1-initial-code-audit.md](08-code-reviews/01-2026-08-12-v1-initial-code-audit.md) code audit, expanded with future feature ideas. The two open strategic decisions ([ADR-001](03-decisions/adr-001-blocking-semantics.md), [ADR-002](03-decisions/adr-002-schedule-model.md)) are prerequisites for the other items.

| # | Date | Item | Status |
|---|-------|-------|-------------------------------------|
| 1 | 2026-08-12 | **ADR-001: Decision on blocking semantics** — block within (current code) or outside (manifest description) the interval; the manifest description must be aligned with the code. | **done (v2, ADR-001)** — blocks *within* the interval + `all_day` mode; the manifest description was fixed |
| 2 | 2026-08-12 | **ADR-002: Decision on the schedule model** — a global time window (current) or a per-URL time window (the storage model already supports it). | **done (v2, ADR-002)** — per-URL modes (`all_day` / `time_window`) |
| 3 | 2026-08-12 | **Midnight-crossing support** — correct handling of `22:00–06:00`-type intervals in the `background.js` rule generation; rework the condition for the `end < start` case. | **done (v2)** — `isBlockedNow` with an overlapping window |
| 4 | 2026-08-12 | **Fix rule cleanup** — remove the actual, known rule ids instead of `removeRuleIds`; examine the 100-item upper limit (the DNR dynamic rule count limit) and the rule-id regeneration logic. | **done (v2)** — diff-based `getDynamicRules()`; no hardcoded range |
| 5 | 2026-08-12 | **Fate of `blocked.html`** — either wire it into a real rule-based solution (checking the DNR `redirect` limits) or remove it; it's dead code in v1. | **done (v2)** — removed; the native `ERR_BLOCKED_BY_CLIENT` remains |
| 6 | 2026-08-12 | **Fix the filename mismatch** — unify `rules.json` vs `Rules.json` (the manifest `path` and the actual file name) so the load also works on Linux/CI. | **done (v2)** — static rule block removed, `Rules.json` deleted |
| 7 | 2026-08-12 | **Robust handling of incomplete data** — `try/catch` plus field-level validation in the `background.js` rule generation, so a bad item doesn't break the whole refresh. | **done (v2)** — `normalizeHost` + field validation on every input |
| 8 | 2026-08-12 | **Fix false-positive urlFilters** — anchored `urlFilter` for domain patterns (`||facebook.com`) so it doesn't block `notfacebook.com`; normalize user input (prefix removal). | **done (v2)** — `urlFilter: "||" + normalizeHost(input)` |
| 9 | 2026-08-12 | **Switch deletion to URL-based** — replace the popup's index-based `splice(index, 1)` deletion with URL-based identification; consolidate the URL-based `removeUrlFromRules` duplication in `background.js` (dead code). | **done (v2)** — id-based deletion; `removeUrlFromRules` removed |
| 10 | 2026-08-12 | **User feedback + validation in the popup** — in-place error messages for empty/malformed URLs, missing fields, and duplicates (not just `console.error`). | **done (v2)** — inline `msg` (error/success) + validation |
| 11 | 2026-08-12 | **Alarm optimization** — the rule refresh should not run every minute when nothing changed; window-transition detection / modification-dependent trigger. | **done (v2)** — one-shot alarm for the next transition; `storage.onChanged` triggers |
| 12 | 2026-08-12 | **Error handling in the rule refresh** — check `chrome.runtime.lastError`; fix the `sendResponse` pattern (`return true`) when the response becomes asynchronous. | **done (v2)** — `onMessage` fully removed (not needed); async/await |
| 13 | 2026-08-12 | **Permission cleanup** — examine the `declarativeNetRequest` + `declarativeNetRequestWithHostAccess` redundancy and remove the unnecessary one. | **done (v2)** — only `declarativeNetRequest`, `storage`, `alarms`, `activeTab`; `WithHostAccess` removed |
| 14 | 2026-08-12 | **Repo hygiene** — add `_metadata/` and `.DS_Store` to `.gitignore`; untrack the tracked `_metadata` files from git. | **done (2026-08-12)** — `.gitignore` + git rm |
| 15 | 2026-08-12 | **Delete dead CSS** — remove the commented-out old `.remove-button` styles in the popup HTML. | **done (v2)** — popup CSS fully rewritten, without the old comments |
| 16 | 2026-08-12 | **TIME VALIDATION in the popup** — normalize "7:30" vs "07:30" caused by the `type="number"` inputs; hour/minute always 2 digits in storage. | **done (v2)** — 15-minute dropdown (00:00–23:45), always 2 digits |
| 17 | 2026-08-12 | **Idea:** per-URL time window + per-day/locally selectable blocking semantics (phasing out the current "global window" UI). | **done (v2, ADR-002)** — implemented |
| 18 | 2026-08-12 | **Idea:** daily/weekly (day-of-week) schedule support — e.g. block differently on weekdays vs. weekends. | pending |
| 19 | 2026-08-12 | **Idea:** data export/import for the `blockedUrls` list (backup/migration possibility). | pending |
| 20 | 2026-08-13 | **Prefill from the active tab** — prefill the "New block" field with the active tab's hostname (`activeTab` permission, optional task). | **done (v2)** |
| 21 | 2026-08-13 | **Dark "focus" visual theme** — v2 modernization (based on the frontend-design skill: `#0F1216`/`#161B22`/`#F85149`). | **done (v2)** |

---

## Notes

- Items **1–2** (the ADRs) were closed with the user in v2.
- Items **3–17** were all implemented in v2 (backlog #14 was already done on 2026-08-12).
- Items **18–19** are future feature ideas (not part of v2).
- Items 20–21 were newly added during the v2 task.