# Acceptance Report (SC-001 bis SC-005)

## SC-001: Sprachtrennung Blog/Now

Erfuellt. Inhalte liegen in `blog/de`, `blog/en`, `now/de`, `now/en`.

## SC-002: Blog-Dateiname entspricht finalem Slug

Erfuellt. Sprachsuffixe `--de`/`--en` wurden aus Blog-Dateinamen entfernt.

## SC-003: Sprachreine Auslieferung in Listen

Erfuellt. DE/EN-Listings nutzen sprachbezogene Filter ueber Content-Pfad.

## SC-004: Sprachreine Prev/Next-Navigation

Erfuellt. Detailseiten filtern pro Sprache und normalisieren Slugs zentral.

## SC-005: Build/Routes valide nach Umstellung

Erfuellt. `npm run build` lief erfolgreich, inkl. DE/EN-Blog und DE/EN-Now.

## Gesamtfazit

Alle definierten Success Criteria sind erfuellt.
