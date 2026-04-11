# Data Model: Legacy-Content-Migration

## Entity: LegacySourceDocument
- Purpose: Referenziert eine konkrete Legacy-Datei als Quelle.
- Fields:
  - `id` (string, unique)
  - `path` (string, required)
  - `type` (enum: `about_view`, `work_view`, `locale_file`, `projects_yaml`, `contentful_blog`)
  - `locale` (enum: `de`, `en`, `mixed`)
  - `notes` (string, optional)

## Entity: MigratedContentBlock
- Purpose: Kleinste migrierte inhaltliche Einheit auf Zielseiten.
- Fields:
  - `id` (string, unique)
  - `targetPage` (enum: `about_de`, `about_en`, `work_de`, `work_en`, `blog_de`, `blog_en`)
  - `section` (string, required)
  - `locale` (enum: `de`, `en`)
  - `sourceRefs` (array<LegacySourceDocument.id>, required)
  - `content` (rich text/markdown, required)
  - `translationStatus` (enum: `original`, `translated`, `reviewed`)

## Entity: CapabilitySection
- Purpose: Modell für "Das kann ich".
- Fields:
  - `id` (string, unique)
  - `locale` (enum: `de`, `en`)
  - `category` (enum: `frontend`, `backend`, `databases`, `third_parties`, `methods`)
  - `items` (array<string>, min length 1)

## Entity: ProjectReference
- Purpose: Übernommene Projekt-/Open-Source-Einträge aus `data/projects.yml`.
- Fields:
  - `id` (string, unique)
  - `group` (enum: `all`, `open_source`)
  - `title` (localized string, required)
  - `subtitle` (localized string, optional)
  - `description` (localized string, required)
  - `url` (string, required)
  - `year` (number, optional)
  - `technologies` (array<{text: string}>, optional)

## Entity: PublicationEntry
- Purpose: Veröffentlichungen aus Legacy-Work.
- Fields:
  - `id` (string, unique)
  - `locale` (enum: `de`, `en`)
  - `title` (string, required)
  - `subtitle` (string, optional)
  - `description` (string, required)
  - `url` (string, optional)
  - `mediaType` (enum: `book`, `podcast`, `article`)

## Entity: StaticBlogPost
- Purpose: Zielzustand für ehemals Contentful-basierte Blogeinträge.
- Fields:
  - `slug` (string, unique)
  - `locale` (enum: `de`, `en`)
  - `title` (string, required)
  - `pubDate` (date, required)
  - `description` (string, required)
  - `body` (markdown/mdx, required)
  - `alternateLanguageUrl` (string, optional)

## Relationships
- `MigratedContentBlock.sourceRefs -> LegacySourceDocument.id` (many-to-many)
- `CapabilitySection` ist spezialisierter `MigratedContentBlock` auf About.
- `ProjectReference` und `PublicationEntry` werden als Blöcke in Work eingebettet.
- `StaticBlogPost` referenziert optional Gegenstück über `alternateLanguageUrl`.

## Validation Rules
- Für jeden DE-Block muss ein EN-Block mit gleicher `section` existieren (außer explizit als nicht übersetzbar markiert).
- About darf keine zweispaltigen Inhaltscontainer enthalten (Layout-Regel außerhalb Datenmodell).
- `StaticBlogPost` darf keine Runtime-Abhängigkeit zu Contentful benötigen.
- Keine Secret-Werte dürfen in migrierte Inhalte aufgenommen werden.
