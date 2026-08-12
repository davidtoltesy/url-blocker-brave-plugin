# Backlog — Időzített URL Blokkoló (v1 → v2)

Ötletek és javítási feladatok. **Megvalósítás csak explicit jóváhagyással.**

A backlog tételei az [08-code-reviews/01-2026-08-12-v1-initial-code-audit.md](08-code-reviews/01-2026-08-12-v1-initial-code-audit.md) kód-auditból származnak, kibővítve a jövőbeli fejlesztési ötletekkel. A két nyitott stratégiai döntés ([ADR-001](03-decisions/adr-001-blocking-semantics.md), [ADR-002](03-decisions/adr-002-schedule-model.md)) előfeltétele a többi tételnek.

| # | Dátum | Tétel | Státusz |
|---|-------|-------|---------|
| 1 | 2026-08-12 | **ADR-001: Blokkolási szemantika döntése** — intervallumon belül (jelenlegi kód) vagy kívül (manifest leírása) blokkoljon; a manifest leírását hozzá kell igazítani a kódhoz. | **~nyitott (döntés kell)** |
| 2 | 2026-08-12 | **ADR-002: Ütemterv-modell döntése** — globális időablak (jelenlegi) vagy URL-enkénti időablak (a storage-modell már támogatja). | **~nyitott (döntés kell)** |
| 3 | 2026-08-12 | **Éjfél-átlépés támogatása** — `22:00–06:00` típusú intervallumok helyes kezelése a `background.js` szabálygenerálásában; a feltétel átdolgozása `end < start` esetre. | pending |
| 4 | 2026-08-12 | **Szabály-tisztítás javítása** — a `removeRuleIds` helyett a tényleges, ismert szabály-ID-k eltávolítása; vizsgálandó a 100-as felső limit (a DNR dinamikus szabályszám-limitje), és a szabály-ID-k újragenerálásának logikája. | pending |
| 5 | 2026-08-12 | **`blocked.html` sorsa** — vagy bekötés egy valódi szabály-alapú megoldásba (megnézve a DNR `redirect` korlátait), vagy eltávolítás; a v1-ben holt kód. | pending |
| 6 | 2026-08-12 | **Fájlnév-eltérés javítása** — `rules.json` vs `Rules.json` egyesítése (a manifest `path`-je és a tényleges fájl neve), hogy a betöltés Linux-on/CI-n is működjön. | pending |
| 7 | 2026-08-12 | **Hiányos adatok robusztus kezelése** — a `background.js` szabálygenerálásában `try/catch` + mező-szintű validálás, hogy egy hibás elem ne szakítsa meg az egész frissítést. | pending |
| 8 | 2026-08-12 | **Hamis pozitív urFilter javítása** — domain-mintákhoz horgonyozott `urlFilter` (`||facebook.com`), hogy ne blokkolja a `notfacebook.com`-ot; a felhasználói bevitel normalizálása (prefix/ffejezés). | pending |
| 9 | 2026-08-12 | **Törlés URL-alapra váltása** — a popup index-alapú `splice(index, 1)` törlését cseréld URL-alapú azonosításra; a `background.js`-ben lévő URL-alapú `removeUrlFromRules` duplikációt konszolidálni (holt kód). | pending |
| 10 | 2026-08-12 | **Felhasználói visszajelzés + validáció a popupban** — üres/rossz formátumú URL, hiányzó mezők és duplikátum esetén in-place hibaüzenet (nem csak `console.error`). | pending |
| 11 | 2026-08-12 | **Alarm-optimalizálás** — a szabályfrissítés ne fusson percenként, ha semmi nem változott; időablakon való átlépés-érzékelés / módosítás-függő trigger. | pending |
| 12 | 2026-08-12 | **Hibakezelés a szabályfrissítésnél** — `chrome.runtime.lastError` ellenőrzése; a `sendResponse` mintájának javítása (`return true`), ha a válasz aszinkron lesz. | pending |
| 13 | 2026-08-12 | **Permissziók takarítása** — `declarativeNetRequest` + `declarativeNetRequestWithHostAccess` redundancia vizsgálata és a felesleges tétel eltávolítása. | pending |
| 14 | 2026-08-12 | **Repo-higiénia** — `_metadata/` és `.DS_Store` a `.gitignore`-ba; a tracked `_metadata` fájlok kivétele a git-ből. | pending |
| 15 | 2026-08-12 | **Halott CSS törlése** — a popup HTML-ben a kommentelt régi `.remove-button` stílusok eltávolítása. | pending |
| 16 | 2026-08-12 | **IDŐ-VALIDÁCIÓ a popupban** — az inputok `type="number"` jellegéből adódó "7:30" vs "07:30" normalizálás; az óra/perc mindig 2-jegyű legyen a tárolásban. | pending |
| 17 | 2026-08-12 | **Ötlet:** URL-enkénti időablak + napi/helyi közben választott blokkolási szemantika (a jelenlegi "globális ablak" UI kivezetése). | pending |
| 18 | 2026-08-12 | **Ötlet:** nazivási/hétnapos (day-of-week) időcímke-támogatás — pl. hétköznap/névnap máshogy blokkoljon. | pending |
| 19 | 2026-08-12 | **Ötlet:** adatexport/import a `blockedUrls` listához (backup/áttelepítés lehetősége). | pending |

---

## Jegyzetek

- A **1–2** tételek (ADR-ek) megkezdése előtt a felhasználóval mindenképp le kell zárni; ezek határozzák meg a többi tétel megoldási alakját.
- A **3–15** tételek a v1.0 auditjavításaiból állnak (hibajavítások vagy kódminőség).
- A **16** az adatmodell konzisztenciáját javítja.
- A **17–19** jövőbeli funkció-ötletek (nem az audit része).