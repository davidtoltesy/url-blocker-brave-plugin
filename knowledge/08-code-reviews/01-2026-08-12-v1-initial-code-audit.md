# v1.0 Teljes kód-audit — 2026-08-12

Forrás: az "Állapotfelmérés: Időzített URL Blokkoló (v1.0)" elemzés, ami a v2 megkezdése előtt készült. Ezt a fájlt a knowledge-base-ben tartjuk mint a v1.0 hivatalos code review-ját.

---

# 📋 Állapotfelmérés: "Időzített URL Blokkoló" (v1.0)

**Típus:** Manifest V3 Chrome/Brave extension, `declarativeNetRequest`-en alapul

**Fájlok:**

| Fájl | Szerep | Állapot |
|---|---|---|
| `manifest.json` | Konfiguráció (MV3) | ✅ Megfelelő, de van 1 hiba |
| `background.js` | Service worker – szabálykezelés | ⚠️ Több logikai hiba |
| `popup.html` / `popup.js` | Beállító felület | ⚠️ Törékeny, validáció nélkül |
| `blocked.html` | "Blokkolt oldal" üzenet | ❌ **Holt kód, nem használódik** |
| `Rules.json` | Statikus DNR szabályok | ⚠️ Név-eltérés, üres |
| `_metadata/` | Böngésző-generált műtermék | ⚠️ Git-ben kellene ignorálni |

---

## 🐛 Kritikus problémák

**1. A blokkolási logika ellentmond a leírásnak**
- `manifest.json` leírása: *"Blokkolja az URL-eket a megadott időintervallumokon **kívül**"*
- `background.js` (19. sor): `if (now < startDate || now > endDate) return null;` → **csak az intervallumon belül blokkol**
- A kód és a UI konzisztens egymással (intervallumon *belül* blokkol), csak a leírás rossz — de ezt tisztázni kell, mert ez a funkció alapja. → **Nyitott ADR-001.**

**2. Éjfél-átlépés nem működik**
- `22:00 – 06:00` intervallumnál a kód ugyanarra a napra teszi a kezdő- és végidőt, ezért éjfél után soha nem blokkol. Ez tipikus, gyakori használati eset (pl. esti social media blokk).

**3. A szabály-ID-k 100 fölötti esetben elvesztik a tisztítást**
- `removeRuleIds` keménykódolt `1..100` (37. sor), de az ID-k `index+1` alapján nőnek. Ha 100-nál több URL van, a régi 101+ szabályok **örökre bennmaradnak** a DNR-ben.

**4. `blocked.html` sehol nincs bekötve**
- A DNR `block` action nem jelenít meg egyedi oldalt, csak a böngésző `ERR_BLOCKED_BY_CLIENT` hibáját. A fájl jelenleg holt kód.

**5. Fájlnév eltérés: `rules.json` vs `Rules.json`**
- A manifest `path: "rules.json"`-ra hivatkozik, a fájl `Rules.json`. macOS-en (case-insensitive FS) véletlenül működik, de **Linuxon / CI-n elhasalna a betöltés**.

---

## ⚠️ Fontosabb problémák

1. **Upstream adatok nélkül is fut:** ha egy mentett elem hiányos (`startTime` hiányzik), a `split()` hibára fut és az egész frissítés elszáll.
2. **Hamis pozitív szabályok:** `urlFilter: "facebook.com"` a `notfacebook.com`-ot is blokkolja. Domain-anchor (`||`) hiánya miatt.
3. **A popup index-alapú törlést használ** (`splice(index, 1)`), ami törékeny; a `background.js`-ben ott van egy URL-alapú `removeUrlFromRules` is, ami sosem hívódik (holt kód, duplikáció).
4. **Nincs felhasználói visszajelzés:** hiba esetén csak `console.error`, a popup csendben nem csinál semmit (hibás/üres URL, duplikátum).
5. **Nincs URL-validáció és duplikátum-szűrés** a felvételkor.

---

## 🔧 Kisebb / kódminőségi megjegyzések

1. **1 perces alarm:** a `updateDynamicRules` akkor is fut, ha semmi nem változott; feleslegesen ébreszti a service workert.
2. **Nincs hibakezelés:** `chrome.runtime.lastError` sehol nincs ellenőrizve.
3. `declarativeNetRequest` + `declarativeNetRequestWithHostAccess` együtt redundáns a mostani jogosultságok mellett.
4. `sendResponse` szinkron tűz-és-felejt, `return true` nincs — jelenleg működik, de veszélyes minta.
5. `_metadata/` a böngésző által generált bináris állapotfájl — **nem tartozik a repo-ba**, `.gitignore`-ba kellene (épp ez a ki nem staged módosítás a `git status`-ban).
6. A popup HTML-ben kommentelt régi CSS halott kód.

---

## 💡 Ami viszont jó alap

- Helyes **MV3 architektúra** (service worker + DNR) — ez modern irány, a `webRequest` blokkolásnál sokkal jobb.
- A **storage-alapú, dinamikus szabály** modell jól skálázható.
- **Nincs XSS:** a popup `textContent`-et használ (nem `innerHTML`), a bevitel nem jut HTML-be.
- A tárolós modell (`url + startTime + endTime`) már most támogatná a **per-domain ütemtervet** — csak a UI nem használja ki (globális intervallum).

---

## 🔄 Következő lépések (rögzítve a backlogban)

Mielőtt a v2-t elkezdenénk, két dolgot érdemes eldönteni:

1. **Blokkolási szemantika** – az intervallumon *belül* vagy *kívül* blokkoljon? (Kód = belül, leírás = kívül) → [ADR-001](../03-decisions/adr-001-blocking-semantics.md)
2. **Ütemterv modell** – globális időablak az összes URL-re (mint most), vagy URL-enként egyedi ablakok (amit a storage már tud)? → [ADR-002](../03-decisions/adr-002-schedule-model.md)

A konkrét javítási és fejlesztési feladatok a [09-product-backlog/01-backlog.md](../09-product-backlog/01-backlog.md) fájlban találhatók.