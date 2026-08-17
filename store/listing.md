# Chrome Web Store listing — copy-paste draft

Dashboard → **Item listing**. All fields in English.

---

## Name

Scheduled URL Blocker

## Summary

(≤ 132 characters)

> Block distracting websites all day or during a set time window — natively, privately, and without any data leaving your device.

(116 characters)

## Detailed description

### Why I built this

Browsers already block websites natively — but in a way that always felt too complicated. One URL-blocking plugin I tried once took up 1.5 GB of storage on my machine, which made me suspicious enough to uninstall it immediately.

I have ADHD, and certain sites easily pull me away while I'm trying to work. With this extension, I just type the address, I see a blocked message, and the tab closes — it saves me time and keeps me on track.

I also filter out political and negative news portals. They had a bad effect on me; cutting them out helped me feel calmer and more focused.

That's why this plugin is built entirely on simplicity and privacy: it collects no data, transmits nothing to any server, and just does its job.

### Features

- **Per-site scheduling** — each blocked site gets its own schedule:
  - **All day** — always blocked until you turn it off.
  - **Time window** — blocked only between a start and end time; midnight-crossing windows like `22:00–06:00` are supported.
- **15-minute granularity** — time pickers in `00:00–23:45` steps.
- **List management** — toggle blocking on/off, edit, and delete from a dedicated list tab.
- **Active-tab prefill** — the current tab's hostname is suggested when adding a new block.
- **Sorting & pagination** — sort by name or date added; pages of 10 with a compact pagination bar.
- **Per-site masking** — hide sensitive entries in the list behind a custom label (falls back to "Hidden site").
- **Private by design** — everything stays in `chrome.storage.local`; no cloud, no account, no tracking. The extension collects no data and sends nothing to any server.

### How it works

Blocks are enforced natively by the browser using the `declarativeNetRequest` API, so the extension consumes almost no memory and does not inspect your traffic. A service worker keeps the rules in sync, waking up only when a schedule changes.

---

## Category

Productivity

## Single purpose

Block websites on a schedule, all day or during a configurable time window, and manage the list locally.

## Permissions justification

| Permission | Why it is needed |
| --- | --- |
| `declarativeNetRequest` | Enforces the blocks natively in the browser (no traffic inspection, no remote code). |
| `storage` | Saves the block list locally on the user's device (`chrome.storage.local`). |
| `alarms` | Wakes the service worker only when a schedule change needs a rule refresh. |
| `activeTab` | Prefills the address of the currently active tab when the user adds a new block. |

The extension requests no `host_permissions` and no data is transmitted anywhere.

## Data usage / Privacy

**Data collection:** none. No personal data, browsing history, or usage statistics are collected or transmitted.

Privacy policy: <https://github.com/davidtoltesy/url-blocker-brave-plugin/blob/main/PRIVACY.md>