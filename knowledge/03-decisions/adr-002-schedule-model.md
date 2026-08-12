# ADR-002 — Ütemterv-modell: globális vs URL-enkénti időablak

**Státusz: PROPOSED (NYITOTT — döntés kell a v2 megkezdése előtt)**
**Dátum:** 2026-08-12

## Kontextus

A jelenlegi UI egy **globális** időintervallumot ad meg, a listán minden URL ugyanahhoz az ablakhoz tartozik. Az **adatmodell** viszont már most is URL-ekenként tárolja a `startTime`/`endTime` mezőket — tehát a háttér támogatná az URL-enkénti ütemtervet, csak a UI nem.

## Lehetőségek

1. **Globális időablak** (a jelenlegi): egyetlen kezdő/végső idő az összes URL-re. Egyszerű UI, kevésbé rugalmas.
2. **URL-enkénti időablak**: minden URL-nek saját kezdő/végső ideje van. Rugalmas (pl. facebook éjjel, youtube munkaidőben), de több UI-elemet igényel.

## Megfontolandó

- A v1 popup-ja az egész listára vonatkozó ablakot állít be egyetlen formmal.
- A storage-modell már készen áll a (2)-re.
- Skálázhatóság / komplexitás tekintetében a (2) egy-két extra inputot és egy-két oszlopot igényel a listában.

## Javaslat

Válaszd a **(2)** opciót: URL-enkénti időablak. Ha a felhasználó továbbra is globális ütemtervet szeretne, az egy "gyorsbeállítás" szinten megőrizhető (pl. felüliró globális érték).

## Döntés (üres — kitöltendő)

> **Döntés:** *(a felhasználó jóváhagyásával kitöltendő)*