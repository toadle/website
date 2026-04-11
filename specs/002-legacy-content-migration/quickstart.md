# Quickstart: Legacy-Content-Migration

## 1) Quellen prüfen
1. Legacy-About lesen:
   - `../website_old/app/views/about_me/index.html.erb`
   - `../website_old/app/views/about_me/_intro.de.html.erb`
   - `../website_old/app/views/about_me/_intro.en.html.erb`
2. Legacy-Work lesen:
   - `../website_old/app/views/work/index.html.erb`
   - `../website_old/config/locales/de.yml`
   - `../website_old/config/locales/en.yml`
3. Legacy-Projekte lesen:
   - `../website_old/data/projects.yml`

## 2) Zielinhalte in Astro anpassen
1. About DE/EN aktualisieren (`src/pages/de/about.astro`, `src/pages/en/about.astro`).
2. Work DE/EN aktualisieren (`src/pages/de/work.astro`, `src/pages/en/work.astro`).
3. Open Source + Veröffentlichungen sichtbar integrieren.
4. "Das kann ich" in ähnlicher Struktur mit 5 Kategorien übernehmen.
5. About-Hauptinhalt einspaltig halten.

## 3) Blog von Contentful auf statisch migrieren
1. Legacy-Bloginhalte einmalig extrahieren.
2. Inhalte als `src/content/blog/*.md|*.mdx` anlegen.
3. Frontmatter für bestehende Collections vervollständigen.
4. Keine Laufzeitintegration zu Contentful im Zielsystem behalten.

## 4) Übersetzungen vervollständigen
1. Für jeden migrierten DE-Block EN-Version herstellen (und umgekehrt).
2. Sprachvergleich Seite für Seite durchführen (`/de/...` vs `/en/...`).

## 5) Security- und Build-Validierung
1. Sicherstellen, dass keine Secrets in `website` übernommen wurden.
2. Build ausführen:
   - `npm run build`
3. Manuelle Prüfung:
   - `/de/about`, `/en/about` (einspaltig, "Das kann ich")
   - `/de/work`, `/en/work` (Publikationen + Open Source + Projekte)
   - `/de/blog`, `/en/blog` (statischer Inhalt, kein Contentful-Dependency-Verhalten)
