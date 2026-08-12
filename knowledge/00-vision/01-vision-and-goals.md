# Vízió és célok — Időzített URL Blokkoló

## Probléma

A felhasználó időintervallumhoz kötve szeretne weboldalakat blokkolni a böngészőjében (pl. munkaidőben a facebookot, lefekvés után a közösségi médiát). A használati módnak gyorsnak és konfigurálhatónak kell lennie.

## Cél

Egy tisztán lokális, adatvédelmet megőrző Brave/Chrome kiegészítő, amely:
- URL-eket és hozzájuk tartozó időintervallumokat tárol,
- a megadott időben **declarativeNetRequest**-tel blokkolja a main_frame navigációt,
- beállító felületet (popup) ad a listák kezeléséhez.

## Hatókör (v1.0)

- Egy globális időablak, tetszőleges számú URL mellé.
- Blokkolás a jelenlegi kód szerint az intervallumon **belül** (lásd a nyitott döntést a 03-decisions mappában).
- A `blockedUrls` lista perzisztálása `chrome.storage.local`-ban.
- Szabályfrissítés 1 percenként és bármilyen módosításkor.

## Nem cél (most)

- Nem végez a böngészéshez kapcsolódó adatgyűjtést.
- Nem kínál felhő-szinkronizációt vagy fiókot.
- Nem kezeli az éjfél-átlépő intervallumokat a v1-ben (hibaként ismert, backlog).
- Nem differenciál URL-enkénti időablakot a jelenlegi kódban (a storage-modell viszont már támogatná).

## Megcélzott felhasználó

Saját, személyes használatú. A megjelenés és a funkciók a gyors, minimális konfigurációra optimalizáltak.