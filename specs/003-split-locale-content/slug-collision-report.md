# Slug Collision Report

## Scope

- `src/content/blog/de/`
- `src/content/blog/en/`

## Methode

- Dateinamen (`.md`/`.mdx`) pro Sprachordner ohne Endung ausgewertet.
- Duplikate pro Ordner ueber `sort | uniq -d` geprueft.

## Ergebnis

- `de`: keine Kollisionen
- `en`: keine Kollisionen

## Fazit

Es wurden keine Slug-Kollisionen innerhalb derselben Sprache gefunden.
