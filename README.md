# Scheduled URL Blocker

A lightweight Manifest V3 browser extension for Brave/Chrome that blocks distracting websites — all day, or only during a configured time window.

![Version](https://img.shields.io/badge/version-2.0-blue)
![Manifest](https://img.shields.io/badge/Manifest-V3-green)

## Features

- **Per-site scheduling** — each blocked site gets its own schedule:
  - **All day** — always blocked until you turn it off.
  - **Time window** — blocked only between a start and end time (midnight-crossing windows like `22:00–06:00` are supported).
- **15-minute granularity** — time pickers in `00:00–23:45` steps (`:00/:15/:30/:45`).
- **List management** — toggle blocking on/off, edit, and delete from a dedicated list tab.
- **Active-tab prefill** — the current tab's hostname is suggested when adding a new block.
- **Sorting & pagination** — sort by name or date added; pages of 10 with a compact pagination bar.
- **Per-site masking** — hide sensitive entries in the list behind a custom label (falls back to "Hidden site"); only the display is masked, blocking still uses the real address, which stays in your local storage.
- **Private by design** — everything stays in `chrome.storage.local`; no cloud, no account, no tracking.

## How it works

Blocks are enforced natively by the browser using the `declarativeNetRequest` API, so the extension consumes almost no memory and does not inspect your traffic. A service worker keeps the rules in sync, waking up only when a schedule changes.

## Installation (developer mode)

1. Download or clone this repository.
2. Open `brave://extensions` (or `chrome://extensions`).
3. Enable **Developer mode** (top-right).
4. Click **Load unpacked** and select the repository folder.

## Usage

1. Open the extension from the toolbar.
2. On the **New block** tab, enter a website address (e.g. `facebook.com`).
3. Choose **All day** or set a **Time window**, then press **Block**.
4. Manage, suspend, edit, or delete entries on the **List** tab.

> No blocked sites are shipped with the extension. Your block list lives only in your browser's local storage.

## Private / Incognito mode

Extensions are **disabled in private windows by default** — this is a deliberate browser security feature, so it cannot be switched on from code. Enable it once per browser:

**Brave**
1. Open `brave://extensions`.
2. Find **Scheduled URL Blocker** and click **Details**.
3. Turn on **Allow in Private**.

**Chrome**
1. Open `chrome://extensions`.
2. Find **Scheduled URL Blocker** and click **Details**.
3. Turn on **Allow in Incognito**.

Once enabled, the block list and schedules are **shared** between regular and private windows — there is no separate list for private mode. The popup shows a banner with an **Enable** shortcut whenever private access is off.

## Project structure

```
manifest.json          # MV3 extension manifest
background.js          # service worker — rule generation, one-shot alarm
popup.html / popup.js  # settings UI (two tabs, dark "focus" theme)
icon16/48/128.png      # icons
knowledge/             # project knowledge base (English)
```

## Known limitations

- Blocked requests show the browser's native `ERR_BLOCKED_BY_CLIENT` page (a Manifest V3 constraint of the `block` action); no custom page is shown.