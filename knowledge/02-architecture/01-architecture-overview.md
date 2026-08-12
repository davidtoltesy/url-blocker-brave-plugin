# Architektúra — v1.0 (Manifest V3)

## Áttekintés

```
┌─────────────┐   chrome.storage.local   ┌──────────────────┐
│   popup.js  │ ───────────────────────► │  blockedUrls[]   │
│  (popup UI) │ ◄─────────────────────── │                  │
└─────────────┘         list/status       └────────┬─────────┘
                                                   │
┌──────────────────────┐   updateDynamicRules      ▼
│  background.js       │  ─────────────────►  declarativeNetRequest
│  (service worker)    │                        (blokkolás main_frame-re)
└──────────────────────┘
   ▲        │
   │        └─ alarm 1 percenként
   └─ message (updateRules)
```

## Összetevők

### 1. Popup (`popup.html` + `popup.js`)
- Felhasználói felület: URL + óra/perc bevitel, listázás, törlés.
- Közvetlenül a `chrome.storage.local`-t módosítja; a szabályfrissítés a service worker feladata (`updateRules` üzenet).

### 2. Service worker (`background.js`)
- **`updateBlockingRules()`** — beolvassa a `blockedUrls`-t, minden elemhez DNR-szabályt generál, ha az aktuális idő az adott elem intervallumán **belül** van; `updateDynamicRules`-sal cseréli a teljes szabálykészletet.
- **Alarm** — 1 percenként újragenerálja a szabályokat (az időablak-váltás kezelése).
- **Üzenetkezelő** — `updateRules` üzenetre azonnali frissítés.

### 3. declarativeNetRequest
- A sablon a `manifest.json` `declarative_net_request.rule_resources[0]` statikus `rules.json`-ából indul (üres).
- A tényleges blokkolás dinamikus szabályokkal történik.
- A `block` akció **nem** jelenít meg egyedi oldalt (a `blocked.html` nincs is bekötve); a böngésző saját `ERR_BLOCKED_BY_CLIENT` hibája jelenik meg.

## Engedélyek (permissions)

- `declarativeNetRequest`, `declarativeNetRequestWithHostAccess`, `storage`, `alarms`
- `host_permissions: "*://*/*"` — széles, de a dinamikus DNR-szabályokhoz szükséges.
- Megjegyzés: `declarativeNetRequest` + `declarativeNetRequestWithHostAccess` együtt redundánsnak tűnik (vizsgálandó a v2-ben).

## Folyamatok

### Szabályfrissítés menete
1. Trigger: alarm (1 perc) / `updateRules` üzenet / `onInstalled`.
2. `updateBlockingRules()` beolvassa a tárolt listát.
3. Szűrés: mostani idő intervallumon belül van-e.
4. `updateDynamicRules({ removeRuleIds: [1..100], addRules })`.
5. Logolás konzolra.

### Hozzáadás menete (popup)
1. Bemenetek bekérése, alap validáció (nem üres).
2. `chrome.storage.local.set({ blockedUrls: newList })`.
3. `loadURLs()` újrarajzol.

### Törlés menete (popup)
1. Index-alapú: `splice(index, 1)` (a sort – index – alapján).
2. Mentés + újrarajzolás.

## Ismert architekturális hibák (részletek a code review-ban)

- A `removeRuleIds` keménykódolt `[1..100]`, miközben az ID-k `index+1`-et használnak → 100+ szabálynál nem minden szabály kerül eltávolításra.
- A szabálygenerálás nem kezeli a hiányos adatokat (`urlObj.startTime.split()` hibára futhat).
- Az `urlFilter` horgonyozatlan, hamis pozitív lehetséges (`facebook.com` blokkolhatja a `notfacebook.com`-ot is).
- Időintervallum-átlépés (éjfél) nincs kezelve.