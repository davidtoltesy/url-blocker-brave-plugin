# ADR-001 — Blocking semantics (inside or outside the interval)

**Status: ACCEPTED (2026-08-13, v2)**
**Date:** 2026-08-12

## Context

Per the `manifest.json` description, the extension *"blocks URLs outside the given time intervals"*. The actual code (`background.js`), however, blocks **within the interval**: `if (now < startDate || now > endDate) return null;`. The popup labels ("Blocking Time Interval", "Come back later") also point to blocking within the interval. The implementation and the documentation contradict each other.

## Options

1. **Blocking within the interval** (the current code) — e.g. the site is blocked between 09:00 and 17:00.
2. **Blocking outside the interval** (the current description) — e.g. the site is only reachable between 17:00 and 09:00.
3. **Two-mode**: per URL, selectable on the panel: "block in this window" / "allow only in this window".

## Considerations

- The current UI and data model could actually support both semantics with minimal changes.
- The product name ("Scheduled URL Blocker") leans toward the blocking-centered semantics (1).
- Option (3) requires more UI work but is the most flexible.

## Recommendation

Choose option **(1)** (blocking within the interval), and fold in adapting the `manifest.json` description to the code. If the user wants (2), it's a simple condition inversion.

## Decision (2026-08-13)

> **Decision:** Blocking happens **within the interval**. v2 introduces two schedule modes per URL:
> - `all_day` (**default**): the site is "never again" — always blocked until switched off.
> - `time_window`: blocked only within the given window (with midnight crossing, e.g. 22:00–06:00).
>
> The `manifest.json` description aligned with the code: *"Blocks websites all day, or only within the given time window."*
>
> Rationale: in the v2 task the user asked for a combination of the two modes ("all day should be the default", "or the way it works now, where a site can't be opened during a time interval"). Option (3) — per-URL mode selection — is how it was realized, but the blocking-centered semantics (blocking *within* the interval) was kept.