# Data Model: Sprachgetrennte Content-Ordner

## Entity: LocalizedContentFolder
- Purpose: Definiert einen sprachreinen Inhaltscontainer fuer einen Bereich.
- Fields:
  - `area` (enum: `blog`, `now`)
  - `locale` (enum: `de`, `en`)
  - `path` (string, unique, required)

## Entity: LocalizedContentFile
- Purpose: Einzelne Datei in einem sprachspezifischen Ordner.
- Fields:
  - `area` (enum: `blog`, `now`)
  - `locale` (enum: `de`, `en`)
  - `slug` (string, required)
  - `filePath` (string, unique, required)
  - `title` (string, required)
  - `pubDate` (date, required)

## Entity: BlogSlugFile
- Purpose: Blog-Datei mit Dateiname als finalem URL-Slug.
- Fields:
  - `slug` (string, required, URL-safe)
  - `extension` (enum: `md`, `mdx`)
  - `relativePath` (format: `src/content/blog/<locale>/<slug>.<ext>`)

## Entity: LocalizedContentListing
- Purpose: Ergebnisliste fuer eine Sprachansicht.
- Fields:
  - `area` (enum: `blog`, `now`)
  - `locale` (enum: `de`, `en`)
  - `entries` (array<LocalizedContentFile>, ordered by `pubDate desc`)
  - `pagination` (object, optional for blog)

## Relationships
- `LocalizedContentFolder (1) -> (n) LocalizedContentFile`
- `LocalizedContentFile (blog) -> BlogSlugFile`
- `LocalizedContentListing.entries` referenziert `LocalizedContentFile`

## Validation Rules
- Jede Blog- und Now-Datei muss genau einem Sprachordner (`de` oder `en`) zugeordnet sein.
- Blog-Dateiname muss exakt dem finalen Slug entsprechen (keine Sprachsuffixe im Dateinamen).
- Slug-Kollisionen sind innerhalb derselben Sprache unzulaessig.
- Sprachlisten duerfen nur Eintraege aus dem passenden Sprachordner enthalten.
