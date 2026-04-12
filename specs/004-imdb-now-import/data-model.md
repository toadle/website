# Data Model: IMDb Now Ratings Import

## Entity: ImportedImdbRating
- Purpose: Rohdatensatz einer einzelnen IMDb-Bewertung aus dem einmaligen Importlauf.
- Fields:
  - `sourceId` (string, required): stabile Referenz aus der Quelle zur Duplikaterkennung
  - `filmTitle` (string, required)
  - `filmUrl` (string, required, url)
  - `ratingValue` (number, required)
  - `ratingScaleMax` (number, required, default 10)
  - `ratedAt` (date, required)
  - `position` (number, required): Reihenfolge in der Quelle fuer Nachvollziehbarkeit
  - `importStatus` (enum: `valid`, `skipped`)
  - `skipReason` (string, optional)

## Entity: NowRatingEntry
- Purpose: Lokalisierter Now-Eintrag fuer eine importierte Bewertung.
- Fields:
  - `locale` (enum: `de`, `en`, required)
  - `slug` (string, required, unique per locale)
  - `date` (date, required): Erstelldatum fuer globale Timeline-Sortierung
  - `label` (string, required): lokalisiertes Datumslabel
  - `rating` (object, required)
  - `reviewText` (string, optional)
  - `richlink` (Richlink, required)
  - `sourceId` (string, required): Verknuepfung zum importierten Quelldatensatz

## Value Object: Rating
- Purpose: Strukturierte Darstellung einer persoenlichen Bewertung.
- Fields:
  - `value` (number, required)
  - `scaleMax` (number, required)
  - `display` (string, required): z. B. "8/10"

## Entity: Richlink
- Purpose: Wiederverwendbarer Link-Baustein fuer Now-Eintraege mit Backlink-Ziel.
- Fields:
  - `title` (string, required)
  - `url` (string, required, url)
  - `kind` (enum: `movie`, `recommendation`, required)
  - `backlink` (boolean, required, default true)
  - `description` (string, optional)

## Entity: NowTimelineItem
- Purpose: Aggregiertes Anzeigeobjekt in der Now-Timeline unabhaengig vom Ursprungstyp.
- Fields:
  - `date` (date, required)
  - `locale` (enum: `de`, `en`, required)
  - `type` (enum: `standard`, `rating`, required)
  - `entryRef` (string, required)

## Relationships
- `ImportedImdbRating (1) -> (2) NowRatingEntry` (je ein Eintrag fuer `de` und `en`)
- `NowRatingEntry (1) -> (1) Rating`
- `NowRatingEntry (1) -> (1) Richlink`
- `NowTimelineItem` referenziert entweder einen bestehenden Now-Eintrag oder `NowRatingEntry`

## Validation Rules
- Pro `sourceId` und `locale` darf hoechstens ein `NowRatingEntry` existieren.
- `rating.value` muss im Bereich `1..rating.scaleMax` liegen.
- `richlink.url` muss als URL validierbar sein.
- `date` steuert die gemeinsame Sortierung fuer bestehende und importierte Eintraege (`desc`).
- Bei identischem `date` muss eine stabile, nachvollziehbare Reihenfolge angewandt werden.
