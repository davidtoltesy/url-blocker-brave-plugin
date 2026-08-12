# Szójegyzék — Időzített URL Blokkoló

A knowledge-base-ben használt fogalmak kanonikus megnevezései. A magyar a munkanyelv, az angol a kódban/API-kban használt kifejezés.

## Termék

| Magyar | Angol (kód/API) | Definíció |
|---|---|---|
| **Blokkolt URL** | Blocked URL | A felhasználó által felvett domain/minta, amelyet a kiegészítő blokkol. |
| **Időintervallum** | Time window | Kezdő- és végidőpont (óra:perc), amelyben az adott URL-re a szabály érvényes. |
| **Blokkolási szemantika** | Blocking semantics | Nyitott döntés: az intervallumon *belül* vagy *kívül* blokkoljon-e a kiegészítő. |
| **Ütemterv-modell** | Schedule model | Nyitott döntés: globális időablak (jelenlegi) vagy URL-enkénti egyedi ablakok. |
| **PopUp** | Popup | A kiegészítő ikonjára kattintva megjelenő beállító felület. |

## Technika

| Magyar | Angol | Definíció |
|---|---|---|
| **Manifest V3** | MV3 | A jelenlegi Chrome/Brave kiegészítő formátum; service worker-alapú. |
| **Szolgáltató dolgozó** | Service worker | A háttérben futó JS-folyamat, amely itt a szabályfrissítéseket végzi. |
| **Deklaratív hálózati szabály** | DeclarativeNetRequest (DNR) | API, amellyel a böngésző (nem a JS) szűri a hálózati forgalmat. |
| **Szabály** | Rule | Egy `urlFilter` + `action` pár a DNR-ben (pl. `block`). |
| **Dinamikus szabály** | Dynamic rule | Futásidőben, JS-ből hozzáadott DNR-szabály. |
| **Statikus szabály** | Static rule | A `rules.json` fájlban előre definiált DNR-szabály. |
| **URL-szűrő** | urlFilter | A DNR minta-illesztője; contains-alapú, horgonyok nélkül hamis pozitívokat adhat. |
| **Horgony** | Anchor | `|` / `||` jelek az urlFilter-ben, pl. `||facebook.com`. |
| **Éjfél-átlépés** | Midnight crossing | Intervallum, amely átnyúlik éjfélen (pl. 22:00–06:00); a v1 nem kezeli. |
| **Alarm** | Alarm | MV3 háttér-ütemező; a v1 1-percenként frissíti a szabályokat. |
| **Beállítások tár** | `chrome.storage.local` | A `blockedUrls` lista perzisztens tárolója. |
| **Súgófájl (műtermék)** | `_metadata/` | A böngésző által generált indexelt ruleset melléktermék; nem tartozik a repóba. |

## Folyamat

| Magyar | Angol | Definíció |
|---|---|---|
| **Felmérés / audit** | Code audit / review | A meglévő kód ellenőrzése; jelen projektnél a v1.0-ra elkészítve. |
| **Backlog** | Backlog | A jövőbeli munka rögzített tételei (hibajavítások, fejlesztések); csak jóváhagyással valósulnak meg. |
| **Döntési nyilvántartás** | ADR (Architecture Decision Record) | Rögzített technikai/termék döntés okokkal, alternatívákkal. |