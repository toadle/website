# Contract: Locale Folder & Slug Naming

## Purpose
Verbindliches Vertragsdokument fuer sprachgetrennte Content-Ablage in Blog und Now.

## Folder Contract

### Blog
- Allowed source roots:
  - `src/content/blog/de/`
  - `src/content/blog/en/`
- Forbidden:
  - Sprachgemischte Dateien direkt unter `src/content/blog/`

### Now
- Allowed source roots:
  - `src/content/now/de/`
  - `src/content/now/en/`
- Forbidden:
  - Sprachgemischte Dateien direkt unter `src/content/now/`

## Naming Contract (Blog)
- Dateiname ist finaler URL-Slug.
- Dateiname enthaelt keine Sprachsuffixe (`--de`, `--en`, `.de`, `.en`).
- Zulässige Formate:
  - `src/content/blog/de/<slug>.md`
  - `src/content/blog/de/<slug>.mdx`
  - `src/content/blog/en/<slug>.md`
  - `src/content/blog/en/<slug>.mdx`

## Routing Contract
- DE-Seiten aggregieren nur Inhalte aus `/de/`-Contentpfaden.
- EN-Seiten aggregieren nur Inhalte aus `/en/`-Contentpfaden.
- Blog-Pagination wird pro Sprache berechnet.
- Prev/Next-Navigation bleibt innerhalb derselben Sprache.

## Completion Contract
Die Umstellung gilt als abgeschlossen, wenn:
1. Blog- und Now-Dateien ausschliesslich in Sprachunterordnern liegen,
2. Blog-Dateinamen den finalen Slugs entsprechen,
3. DE/EN-Listen keine gemischten Eintraege enthalten,
4. Build ohne Routing- oder Collection-Fehler erfolgreich ist.
