# Időzített URL Blokkoló — Knowledge Base

Ez a könyvtár a **single source of truth** a Brave böngészőhöz készült "Időzített URL Blokkoló" kiegészítő (v1.0, Manifest V3) megértéséhez és a következő verzió (v2) eltervezéséhez.

A mappaszerkezet a Canvas projekt `knowledge/` szerkezetét követi, így a projektek között konzisztens marad a tudásbázis-kezelés.

> **Állapot:** A v1.0 teljes kód-auditja elkészült (2026-08-12). A hibajegyek és fejlesztési lépések a [09-product-backlog/01-backlog.md](09-product-backlog/01-backlog.md) fájlban vannak. A v2 megkezdése előtt két stratégiai döntést kell meghozni (lásd [03-decisions/](03-decisions/)).

---

## Mappa útmutató

- **00-vision/** — Miért létezik a termék: célok, hatókör, megcélzott felhasználó.
- **01-product-specification/** — A jelenlegi (v1.0) működés specifikációja: funkciók, adatmodell, UI-folyamatok.
- **02-architecture/** — Technikai architektúra: Manifest V3, service worker, declarativeNetRequest, storage, alarms.
- **03-decisions/** — Döntési nyilvántartások (ADR). **Itt kezdd a tervezést.** A két nyitott döntés: blokkolási szemantika és ütemterv-modell.
- **04-lessons-learned/** — A v1.0 auditjából levont tanulságok. **Kódírás előtt olvasd el.**
- **07-foundation/** — A repo felépítése, konvenciók, munkafolyamat-szabályok.
- **08-code-reviews/** — A v1.0 teljes kód-auditja (2026-08-12).
- **09-product-backlog/** — A jövőbeli munka backlogja: a hibajavítások és fejlesztési lépések, beleértve az auditból származókat.

---

## Hogyan használd

1. **Tervezés előtt:** olvasd el a [03-decisions/](03-decisions/) nyitott ADR-jeit, majd dönts.
2. **Kódírás előtt:** [04-lessons-learned/](04-lessons-learned/) — a múlt hibáinak elkerülése.
3. **Közben:** a backlog tételeit csak explicit jóváhagyással vidd át "implemented" státuszba.
4. **Kész:** frissítsd a README állapot-sorát, a backlog státuszokat és a döntéseket.

## Terminológia

Lásd a [GLOSSARY.md](GLOSSARY.md) fájlt a knowledge-base-ben használt magyar/angol terminológiához.