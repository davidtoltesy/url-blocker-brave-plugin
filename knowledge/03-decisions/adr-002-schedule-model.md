# ADR-002 — Schedule model: global vs per-URL time window

**Status: ACCEPTED (2026-08-13, v2)**
**Date:** 2026-08-12

## Context

The current UI specifies a **global** time interval, with every URL on the list belonging to the same window. The **data model**, however, already stores `startTime`/`endTime` per URL — so the background could support a per-URL schedule, only the UI can't.

## Options

1. **Global time window** (the current one): a single start/end time for all URLs. Simple UI, less flexible.
2. **Per-URL time window**: each URL has its own start/end time. Flexible (e.g. social media at night, video streaming during work hours), but requires more UI elements.

## Considerations

- v1's popup sets a window for the whole list with a single form.
- The storage model is already ready for (2).
- In terms of scalability/complexity, (2) requires one or two extra inputs and one or two extra columns in the list.

## Recommendation

Choose option **(2)**: a per-URL time window. If the user still wants a global schedule, that can be preserved at a "quick setting" level (e.g. an overriding global value).

## Decision (2026-08-13)

> **Decision:** The **per-URL** schedule model. Each list item has its own schedule mode:
> - `all_day` — no time fields, always blocked.
> - `time_window` — its own `start`/`end` window (in 15-minute steps, 00/15/30/45).
>
> The v1 global "one window for everything" approach is removed; the data model (`sites[]`) stores the schedule per item. The `startTime`/`endTime` string fields are migrated from the old model (imported as `time_window` mode).
>
> Rationale: in the v2 task the user explicitly asked for per-URL differentiated scheduling (e.g. blocking a site from 10 AM to 4 PM, or never again). The storage model already supported this in v1 — only the UI didn't use it.