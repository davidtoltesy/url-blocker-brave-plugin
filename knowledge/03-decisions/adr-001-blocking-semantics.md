# ADR-001 — Blokkolási szemantika (intervallumon belül vagy kívül)

**Státusz: PROPOSED (NYITOTT — döntés kell a v2 megkezdése előtt)**
**Dátum:** 2026-08-12

## Kontextus

A `manifest.json` leírása szerint a kiegészítő *"Blokkolja az URL-eket a megadott időintervallumokon kívül"*. A tényleges kód (`background.js`) viszont **az intervallumon belül** blokkol: `if (now < startDate || now > endDate) return null;`. A popup feliratai ("Blokkolási Időintervallum", "Térj vissza később") szintén az intervallumon belüli blokkolásra utalnak. Az implementáció és a dokumentáció ellentmond egymásnak.

## Lehetőségek

1. **Blokkolás az intervallumon belül** (a jelenlegi kód) — pl. 09:00–17:00 között blokkolt a facebook.
2. **Blokkolás az intervallumon kívül** (a jelenlegi leírás) — pl. a facebook csak 17:00–09:00 között érhető el.
3. **Kétfunkciós**: URL-enként, panelen választható "blokkold ebben az ablakban" / "csak ebben az ablakban engedélyezd".

## Megfontolandó

- A jelenlegi UI és az adatmodell igazából mindkét szemantikát támogatná minimális módosítással.
- A termék név ("Időzített URL Blokkoló") a blokkolás-központú szemantikára (1) hajlik.
- A (3) verzió több UI-munkát igényel, de a legrugalmasabb.

## Javaslat

Válaszd az **(1)** opciót (intervallumon belüli blokkolás), és foldd be úgy, hogy a `manifest.json` leírását igazítsuk a kódhoz. Ha a felhasználó a (2)-t akarja, az egyszerű feltételfordítás.

## Döntés (üres — kitöltendő)

> **Döntés:** *(a felhasználó jóváhagyásával kitöltendő)*