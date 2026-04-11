# Routing Validation Report

## Build-Validierung

- Befehl: `npm run build`
- Status: erfolgreich

## Gepruefte Routen

- `/de/blog`
- `/en/blog`
- `/en/blog/page/2`
- `/en/blog/page/3`
- `/de/now`
- `/en/now`

## Beobachtungen

- Blog-Detailrouten werden pro Sprache getrennt generiert.
- Pagination-Routen werden pro Sprache separat berechnet.
- Fuer DE wurde keine zusätzliche Paginationsseite erzeugt (aktuell 4 Posts bei `pageSize = 5`).
- Now-Seiten werden fuer DE/EN separat generiert.
- Prev/Next und Blog-Links verwenden normalisierte Slugs ohne Sprachsuffix.

## Fazit

Routing und Pagination sind fuer die sprachgetrennte Content-Struktur konsistent.
