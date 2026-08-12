# Tanulságok — v1.0 kód-auditból

> **Olvasás előtt kötelező.** Ez a dokumentum azokat a tanulságokat tartalmazza, amelyek a korábbi (v1.0) kód hibáiból fakadnak. A v2 tervezésekor ezeket a mintákat kerülni kell.

## 1. A dokumentáció és a kód nem feszülhet szét

A `manifest.json` leírása ("intervallumokon kívül") ellentmond a `background.js` tényleges működésének ("intervallumon belül"). **Tanulság:** bármely verzióban a leírásnak és a kódnak ugyanazt a szemantikát kell tükröznie; a v2 előtt a [ADR-001](03-decisions/adr-001-blocking-semantics.md) döntést le kell zárni.

## 2. Az időkezelés a legérzékenyebb része az ütemező kiegészítőknek

A v1 nem kezelte az éjfél-átlépést (22:00–06:00), ezért éjfél után sosem blokkolt. **Tanulság:** a v2-ben az intervallum-ütemezést mindig éjfél-átlépés-tudatosan kell megírni (pl. az end < start eset átfordításával) — és ehhez tesztet is kell írni.

## 3. A DNR szabálykezelést nem szabad keménykódolt számokkal tisztázni

A `removeRuleIds: [1..100]` akkor törött, ha a szabályok száma meghaladja a 100-at. **Tanulság:** a tisztítandó szabályok listáját mindig a tényleges/ismert ID-kből kell előállítani, nem konstans tömbből.

## 4. A dinamikus szabályok életciklusa és a "blocked.html" kapcsolata

A DNR `block` akció nem jelenít meg saját oldalt; a `blocked.html` a v1-ben lényegében holt kód. **Tanulság:** a v2-ben vagy törölni kell a fájlt, vagy egy olyan megoldást választani, ami tényleg beköti (ehhez meg kell érteni a DNR redirect korlátait).

## 5. Minden bejövő adatot validálni kell, mielőtt feldolgoztatnánk

A `blockedUrls` elemeinek mezői nincsenek ellenőrizve; a `urlObj.startTime.split()` azonnal eldobható hibát okozhat a lefagyott storage-mal. **Tanulság:** a storage-olvasásnál mindig `try/catch` + mező-szintű validálás kell.

## 6. Az urlFilter horgonyozása fontos a hamis pozitívok ellen

A puszta `urlFilter: "facebook.com"` szövegminta a `notfacebook.com`-ot is blokkolja. **Tanulság:** domain-mintákhoz `||` horgonyozást kell használni, és ezt dokumentálni a felhasználói bevitelhez.

## 7. A hibaüzenetek felhasználói visszajelzés nélkül nevetségesek

A v1 hiba esetén csak `console.error`-t írt; a felhasználó nem tudta, miért nem működik. **Tanulság:** a popup minden hibáját (ürés mező, rossz formátum, duplikátum) in-place üzenetként kell megjeleníteni.

## 8. Az alarm-ok nem ébreszthetik feleslegesen a service workert

A v1 percenként `updateDynamicRules`-t hívott akkor is, ha semmi nem változott. **Tanulság:** a v2-ben a frissítést állapot-változás alapján kell triggerelni (ha lehetséges), nem fix periodikusan.

## 9. A böngésző-műtermékek nem valók a repóba

A `_metadata/` a böngésző által generált bináris ruleset-állapot; a repo-ból ki kell venni (`.gitignore`), különben állandó "módosítás" jelenik meg a git status-ban.