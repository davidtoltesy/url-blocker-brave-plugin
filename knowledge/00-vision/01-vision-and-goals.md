# Vision and goals — Scheduled URL Blocker

## Problem

The user wants to block websites in their browser tied to a time interval (e.g. blocking social media during work hours and after bedtime). The use pattern must be fast and configurable.

## Goal

A purely local, privacy-preserving Brave/Chrome extension that:
- stores URLs and their associated time intervals,
- blocks `main_frame` navigation with **declarativeNetRequest** at the scheduled times,
- provides a settings interface (popup) for managing the lists.

## Scope (v1.0)

- One global time window for any number of URLs.
- Blocking, per the current code, **within** the interval (see the open decision in the 03-decisions folder).
- Persisting the `blockedUrls` list in `chrome.storage.local`.
- Rule refresh every minute and on any modification.

## Out of scope (for now)

- No collection of browsing-related data.
- No cloud sync or account.
- No handling of midnight-crossing intervals in v1 (known bug, backlog).
- No per-URL time windows differentiated in the current code (though the storage model would already support it).

## Target user

Personal, for the user's own use. The look and the features are optimized for fast, minimal configuration.