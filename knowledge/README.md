# Scheduled URL Blocker — Knowledge Base

This directory is the **single source of truth** for understanding the "Scheduled URL Blocker" extension built for the Brave browser (v1.0, Manifest V3) and for planning the next version (v2).

The folder structure follows the `knowledge/` structure of the Canvas project, so knowledge-base management stays consistent across projects.

> **Status:** The full code audit of v1.0 is complete (2026-08-12). v2 (2026-08-13) has been implemented: new data model, per-URL scheduling (`all_day` / `time_window`), 15-minute time selection, list management on a separate tab, active-tab prefill, dark "focus" theme, memory-optimized background. The two strategic decisions ([ADR-001](03-decisions/adr-001-blocking-semantics.md), [ADR-002](03-decisions/adr-002-schedule-model.md)) are closed. Current behavior is documented in [01-product-specification/02-v2-current-state.md](01-product-specification/02-v2-current-state.md), and backlog statuses in [09-product-backlog/01-backlog.md](09-product-backlog/01-backlog.md). The v1.0 descriptions are archival.

---

## Folder guide

- **00-vision/** — Why the product exists: goals, scope, target user.
- **01-product-specification/** — Specification of the current (v1.0) behavior: features, data model, UI flows.
- **02-architecture/** — Technical architecture: Manifest V3, service worker, declarativeNetRequest, storage, alarms.
- **03-decisions/** — Decision records (ADR). **Start your planning here.** The two open decisions: blocking semantics and the schedule model.
- **04-lessons-learned/** — Lessons drawn from the v1.0 audit. **Read before writing code.**
- **07-foundation/** — Repo structure, conventions, workflow rules.
- **08-code-reviews/** — The full v1.0 code audit (2026-08-12).
- **09-product-backlog/** — The backlog of future work: bug fixes and feature steps, including those from the audit.

---

## How to use

1. **Before planning:** read the open ADRs in [03-decisions/](03-decisions/), then decide.
2. **Before writing code:** [04-lessons-learned/](04-lessons-learned/) — to avoid past mistakes.
3. **While working:** move backlog items to "implemented" status only with explicit approval.
4. **When done:** update the README status line, the backlog statuses, and the decisions.

## Terminology

See the [GLOSSARY.md](GLOSSARY.md) file for the terminology used in the knowledge base.