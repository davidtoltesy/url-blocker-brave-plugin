# Repo felépítése és konvenciók

## Mappaszerkezet

```
BrowserPlugin/
├── manifest.json          # MV3 kiegészítő manifest
├── background.js          # service worker — szabálygenerálás és ütemezés
├── popup.html / popup.js  # beállító felület
├── blocked.html           # (v1: holt kód — nem bekötött)
├── rules.json             # statikus DNR szabályok (üres helyőrző)
├── icon16/48/128.png      # ikonok
├── _metadata/             # böngésző-generált (NEM a repóba való — lásd .gitignore)
└── knowledge/             # projekt tudásbázisa (ez a könyvtár)
```

## Konvenciók

- **Nyelv:** magyar a termék és a dokumentáció; a kódváltozó-nevek maradjanak angolul.
- **Dátumformátum:** `YYYY-MM-DD`.
- **Fájlnév-magyarázat:** a knowledge almappák előtagja számozott (`00-`, `01-`, ...) — lásd a Canvas mintáját; a fájlok `NN-nev.md` mintát követnek.
- **ADR:** `adr-NNN-<kisszavú-név>.md`; a nyitottak **PROPOSED** státuszt kapnak.

## Munka-szabályok (jelen projekt)

1. **Csak jóváhagyott backlog elemeket** valósítsunk meg (lásd [09-product-backlog](09-product-backlog)).
2. A v2 munka megkezdése előtt a két nyitott ADR-t ([001](03-decisions/adr-001-blocking-semantics.md), [002](03-decisions/adr-002-schedule-model.md)) zárjuk le a felhasználóval.
3. Kódolás közben tartsuk be a [04-lessons-learned](04-lessons-learned) tanulságait.
4. Minden változás után frissítsük a knowledge dokumentációt (különösen a backlog státuszt és a jelen állapotot).