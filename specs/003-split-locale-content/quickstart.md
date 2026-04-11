# Quickstart: Locale Folder Split fuer Blog und Now

## 1) Zielstruktur herstellen
1. Blog-Unterordner anlegen:
   - `src/content/blog/de/`
   - `src/content/blog/en/`
2. Now-Unterordner anlegen:
   - `src/content/now/de/`
   - `src/content/now/en/`

## 2) Inhalte migrieren
1. Blog-Dateien in passenden Sprachordner verschieben.
2. Blog-Dateien auf finale Slug-Dateinamen umbenennen.
3. Now-Dateien in passende Sprachordner verschieben.

## 3) Collection- und Seitenlogik aktualisieren
1. Loader und Globs fuer verschachtelte Sprachordner pruefen/anpassen.
2. DE/EN-Filter in Blog- und Now-Seiten auf Sprachordner ausrichten.
3. Blog-Pagination und Prev/Next-Navigation pro Sprache validieren.

## 4) Verifikation
1. Build ausfuehren:
   - `npm run build`
2. Manuelle Pruefung:
   - `/de/blog`, `/en/blog` inkl. paginierter Seiten
   - `/de/now`, `/en/now`
   - Blog-Post-Detailseiten mit Prev/Next
3. Sicherstellen:
   - keine gemischten DE/EN-Ordnerinhalte
   - Blog-Dateiname = finaler Slug
