# v1.0 Jelenlegi működés — Specifikáció

A dokumentum a v1.0 kódjának tényleges (felmért) működését rögzíti 2026-08-12 állapot alapján.

## Funkciók

1. **URL hozzáadása** — A popupban megadunk egy URL-mintát (`url`), a kezdő- és végórákat/perceket (`startHour`, `startMinute`, `endHour`, `endMinute`). Hozzáadáskor a `blockedUrls` tömbhöz kerül egy `{ url, startTime, endTime }` objektum.
2. **Listázás** — A popup felsorolja a mentett elemeket, mindegyik mellett törlés (`X`) gombbal (index-alapú törlés).
3. **Blokkolás** — A service worker a `blockedUrls` alapján DNR dinamikus szabályokat hoz létre `block` akcióval, `main_frame` típusra.
4. **Ütemezés** — A szabályok 1 percenként (alarm) és minden módosításkor újragenerálódnak (az aktuális időintervallumon belüli elemek érvényesek).

## Adatmodell

```
blockedUrls: [
  { url: string, startTime: "HH:MM", endTime: "HH:MM" }
]
```

- `url`: szabad szöveges minta (pl. `facebook.com`), nincs validáció.
- `startTime` / `endTime`: string "HH:MM" formátumban, az inputok (`type="number"`) leadhatnak `"7:30"` stb. alakot is.

## UI-folyamatok

- **Hozzáadás:** minden mező kitöltése kötelező; hiba esetén csak `console.error`, a felhasználó nem kap visszajelzést.
- **Törlés:** a sor indexe alapján `splice(index, 1)`, majd újrarajzolás.
- **Betöltés:** `loadURLs()` a popup összeállításakor.

## Tárolt szabálygenerálás logikája

Feltétel a kódban (`background.js`): ha az aktuális idő **nem** esik a `[start, end]` intervallumba, a szabály kimarad. Ha beleesik, létrejön a szabály. (Tehát a jelenlegi kód az intervallumon **belül** blokkol — ellentétben a `manifest.json` leírásával, ami "kívül"-t mond. Nyitott döntés: [03-decisions](03-decisions).)

## Ismert tervezési korlátok (v1)

- Egyedüli, globális időablak érvényesül minden URL-re.
- Nincs dupilált-ellenőrzés, URL-formátum validáció, sem felhasználói hibavisszajelzés.
- Nincs éjfél-átlépés kezelés.
- A `blocked.html` nincs bekötve semmilyen folyamatba.