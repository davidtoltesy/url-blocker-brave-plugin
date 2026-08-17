# Privacy Policy — Scheduled URL Blocker

**Last updated:** 2026-08-17

Scheduled URL Blocker is a browser extension that blocks websites according to schedules you configure. This policy explains what happens to your data.

## Data collection

**None.** The extension does not collect, store, or transmit any personal data, browsing history, or usage statistics.

## Where your data lives

Everything you configure — the list of blocked sites and their schedules — is stored **only on your device**, inside the browser's own `chrome.storage.local` storage. Nothing is uploaded to a server, a cloud, or a third party.

## Data transmission

The extension sends **nothing** to any server. It has no analytics, no tracking, no advertising, and no remote code. The only network behaviour is the blocking itself, which is handled natively by the browser's `declarativeNetRequest` API — the extension never inspects or records the content of your traffic.

## Permissions

The extension requests the minimum permissions needed to work:

- `declarativeNetRequest` — to enforce blocks natively in the browser.
- `storage` — to save your block list locally on your device.
- `alarms` — to refresh rules when a schedule changes.
- `activeTab` — to prefill the address of the current tab when you add a new block.

None of these permissions transmit data anywhere.

## Private / incognito windows

If you enable the extension for private windows, the block list is shared between regular and private windows. There is no separate list for private mode, and no additional data is collected.

## Changes

If this policy changes, this page will be updated with a new date.

## Contact

For questions, open an issue in this repository.