# Contract: Content Migration to Static Astro Content

## Purpose
Definiert den verbindlichen Migrationsvertrag von `../website_old` in die statische Astro-Seite.

## Source-to-Target Mapping Contract

### About
- Sources:
  - `website_old/app/views/about_me/index.html.erb`
  - `website_old/app/views/about_me/_intro.de.html.erb`
  - `website_old/app/views/about_me/_intro.en.html.erb`
- Targets:
  - `website/src/pages/de/about.astro`
  - `website/src/pages/en/about.astro`
  - ggf. `website/src/i18n.ts` für lokalisierte UI-Texte
- Rules:
  - Einspaltige Hauptstruktur
  - "Das kann ich" mit 5 Kategorien
  - DE/EN inhaltlich gleichwertig

### Work + Publications + Open Source
- Sources:
  - `website_old/app/views/work/index.html.erb`
  - `website_old/config/locales/de.yml`
  - `website_old/config/locales/en.yml`
  - `website_old/data/projects.yml`
- Targets:
  - `website/src/pages/de/work.astro`
  - `website/src/pages/en/work.astro`
  - ggf. `website/src/content/` bei auslagerbaren Teilinhalten
- Rules:
  - Veröffentlichungen, Open Source, Projektbeispiele sichtbar
  - Open-Source-Mindestmenge: `giant_bomb_api`, `select(bf)`, `lit`

### Blog (Legacy Contentful -> Static)
- Sources:
  - Legacy-Blog über Contentful (`website_old/app/controllers/blog_controller.rb`, `website_old/app/services/contentful_service.rb`)
- Targets:
  - `website/src/content/blog/*.md|*.mdx`
- Rules:
  - Keine Runtime-/Hosting-Abhängigkeit mehr zu Contentful
  - Blog wird vollständig statisch ausgeliefert

## Security Contract
- Secret-Daten (z. B. `.env` Tokens) dürfen nicht in Zielrepo übernommen werden.
- Migrationsdokumentation darf nur Prozess-Infos enthalten, keine Credentials.

## Completion Contract
Migration gilt als erfüllt, wenn:
1. About/Work/Open Source/Veröffentlichungen in DE+EN vorhanden sind,
2. About einspaltig umgesetzt ist,
3. Blog statisch vorliegt,
4. keine Contentful-Runtime-Abhängigkeit im Zielsystem existiert.
