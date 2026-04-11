---
description: "Task list for 002-legacy-content-migration"
---

# Tasks: Legacy-Content-Migration aus `../website_old`

**Input**: Design documents from `/specs/002-legacy-content-migration/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md
**Constitution Version**: 1.0.0

**Tests**: Keine dedizierten Test-Tasks angefordert; Validierung erfolgt über Build, inhaltliche Abnahme und Bildreferenzprüfung.

**Organisation**: Tasks sind nach User Story gruppiert, damit jede Story unabhängig umgesetzt und geprüft werden kann.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Parallelisierbar (keine Abhängigkeit auf unvollständige Aufgaben in derselben Datei)
- **[Story]**: Zuordnung zu User Story (`[US1]` ... `[US5]`)
- Jede Task-Beschreibung enthält konkrete Dateipfade.

---

## Phase 1: Setup

**Purpose**: Migrationsrahmen und Arbeitsgrundlagen für Legacy-Inhalte erstellen.

- [X] T001 Legacy-Quelleninventar für About/Work/Blog/Open-Source in `specs/002-legacy-content-migration/migration-inventory.md` anlegen
- [X] T002 Bildinventar (Quelle → Zielpfad → Verwendung → Alt-Text-Regel) in `specs/002-legacy-content-migration/media-inventory.md` anlegen
- [X] T003 Contentful-Migrations-Runbook ohne Secrets in `specs/002-legacy-content-migration/contentful-migration-runbook.md` erstellen

---

## Phase 2: Foundational (Blocking)

**Purpose**: Gemeinsame Grundlagen für alle Stories (Daten- und Komponentenbasis).

**CRITICAL**: User-Story-Implementierung startet erst nach Abschluss dieser Phase.

- [X] T004 Verzeichnisstruktur für migrierte Assets erstellen und dokumentieren in `src/assets/legacy/README.md` und `public/images/legacy/README.md`
- [X] T005 [P] Normalisierte Datenbasis für Work/Open-Source/Publikationen in `src/content/work/projects.json` aus `../website_old/data/projects.yml` anlegen
- [X] T006 [P] Wiederverwendbare Darstellungsbausteine für Inhaltssektionen in `src/components/ContentSection.astro` und `src/components/ProjectList.astro` erstellen
- [X] T007 [P] Einheitliche i18n-Labels für neue Sektionen in `src/i18n.ts` ergänzen (About/Work/Open Source/Publikationen)
- [X] T008 One-time Contentful-Exportskript-Grundgerüst in `scripts/migrations/contentful-to-markdown.ts` erstellen (ohne hardcodierte Credentials)

**Checkpoint**: Daten-, Komponenten- und Migrationsbasis steht.

---

## Phase 3: User Story 1 - About-Inhalte aus Legacy übernehmen (Priority: P1)

**Goal**: About-Inhalte aus Legacy in DE/EN vollständig und konsistent übertragen.

**Independent Test**: `/de/about` und `/en/about` enthalten Intro, "Das kann ich"-Bereich sowie konsolidierte Berufserfahrung aus Legacy.

- [X] T009 [US1] Deutsche About-Inhalte aus `../website_old/app/views/about_me/index.html.erb` und `_intro.de.html.erb` in `src/pages/de/about.astro` migrieren
- [X] T010 [P] [US1] Englische About-Inhalte aus `../website_old/app/views/about_me/index.html.erb` und `_intro.en.html.erb` in `src/pages/en/about.astro` migrieren
- [X] T011 [US1] Konsolidierte Berufserfahrungssektion auf Deutsch in `src/pages/de/about.astro` einarbeiten
- [X] T012 [P] [US1] Konsolidierte Berufserfahrungssektion auf Englisch in `src/pages/en/about.astro` einarbeiten
- [X] T013 [US1] "Das kann ich"-Kategorien (Frontend/Backend/Datenbanken/Third Parties/Methoden) auf Deutsch in `src/pages/de/about.astro` übernehmen
- [X] T014 [P] [US1] "Das kann ich"-Kategorien (Frontend/Backend/Databases/Third Parties/Methods) auf Englisch in `src/pages/en/about.astro` übernehmen

---

## Phase 4: User Story 2 - About einspaltig gestalten (Priority: P1)

**Goal**: About-Hauptinhalt in DE/EN vollständig einspaltig umsetzen.

**Independent Test**: Keine zweispaltigen Hauptinhaltsbereiche auf `/de/about` und `/en/about`.

- [X] T015 [US2] Mehrspaltige About-Struktur in `src/pages/de/about.astro` auf einspaltige Leseführung refaktorisieren
- [X] T016 [P] [US2] Mehrspaltige About-Struktur in `src/pages/en/about.astro` auf einspaltige Leseführung refaktorisieren
- [X] T017 [US2] Section-Reihenfolge und vertikale Rhythmik für einspaltige About-Seiten in `src/pages/de/about.astro` und `src/pages/en/about.astro` harmonisieren

---

## Phase 5: User Story 3 - Work, Veröffentlichungen, Open Source und Bilder übernehmen (Priority: P1)

**Goal**: Work-Inhalte inkl. Publikationen/Open Source/Projekte und benötigte Bilder migrieren.

**Independent Test**: `/de/work` und `/en/work` zeigen Legacy-Inhalte vollständig; benötigte Bilder sind vorhanden und korrekt eingebunden.

- [X] T018 [US3] Deutsche Work-Inhalte (Topline/Headline/Intro/Bereiche) aus `../website_old/app/views/work/index.html.erb` und `../website_old/config/locales/de.yml` in `src/pages/de/work.astro` migrieren
- [X] T019 [P] [US3] Englische Work-Inhalte aus `../website_old/app/views/work/index.html.erb` und `../website_old/config/locales/en.yml` in `src/pages/en/work.astro` migrieren
- [X] T020 [US3] Open-Source- und Projektsektionen in `src/pages/de/work.astro` und `src/pages/en/work.astro` an `src/content/work/projects.json` anbinden
- [X] T021 [US3] Notwendige lokale Bilder (`ich.png`, `productish.jpg`) aus `../website_old/app/assets/images/` nach `src/assets/legacy/` migrieren
- [X] T022 [P] [US3] Externe Publikationsbilder in stabile lokale Zielassets unter `public/images/legacy/` überführen und in `src/pages/de/work.astro`/`src/pages/en/work.astro` referenzieren
- [X] T023 [US3] Alt-Text-Regeln für alle migrierten Bilder in `src/pages/de/about.astro`, `src/pages/en/about.astro`, `src/pages/de/work.astro`, `src/pages/en/work.astro` umsetzen

---

## Phase 6: User Story 4 - Blog von Contentful auf statisch migrieren (Priority: P2)

**Goal**: Legacy-Blog-Content statisch in `src/content/blog/` übernehmen, ohne Contentful-Runtime.

**Independent Test**: Blog-Content liegt lokal als Markdown/MDX vor; keine produktive Contentful-Abhängigkeit im Website-Code.

- [X] T024 [US4] Mapping-Datei für Legacy-Blogfelder in `scripts/migrations/contentful-map.json` definieren
- [X] T025 [US4] Exportskript in `scripts/migrations/contentful-to-markdown.ts` vervollständigen (Input über ENV, keine Tokens im Code)
- [X] T026 [US4] Benötigte Blog-Bilder aus Contentful in statische Zielpfade unter `src/assets/blog/legacy/` oder `public/images/blog/legacy/` herunterladen
- [X] T027 [US4] Exportierten Legacy-Blog als statische Posts in `src/content/blog/` anlegen
- [X] T028 [US4] Frontmatter und Cross-Language-Verweise (`alternateLanguageUrl`) in migrierten Dateien unter `src/content/blog/` ergänzen
- [X] T029 [US4] Laufzeitfreiheit von Contentful verifizieren und dokumentieren in `specs/002-legacy-content-migration/contentful-decommission-check.md`

---

## Phase 7: User Story 5 - Übersetzungen vervollständigen (Priority: P2)

**Goal**: DE/EN-Parität für alle migrierten Inhaltsblöcke herstellen.

**Independent Test**: Für jede migrierte Section existieren DE und EN ohne Platzhalter oder Mischsprache.

- [X] T030 [US5] Übersetzungs-Paritätsmatrix in `specs/002-legacy-content-migration/translation-parity.md` erstellen
- [X] T031 [US5] Fehlende Übersetzungen für About/Work in `src/pages/de/about.astro`, `src/pages/en/about.astro`, `src/pages/de/work.astro`, `src/pages/en/work.astro` ergänzen
- [X] T032 [US5] Fehlende DE/EN-Metadaten und Teasertexte in migrierten Dateien unter `src/content/blog/` ergänzen

---

## Phase 8: Polish & Cross-Cutting

**Purpose**: Endvalidierung, Qualitätsnachweis und Abschlussdokumentation.

- [X] T033 `npm run build` ausführen und notwendige Fixes in `src/pages/**`, `src/content/**`, `src/i18n.ts` einarbeiten
- [X] T034 [P] Broken-Image-Prüfung dokumentieren in `specs/002-legacy-content-migration/media-validation-report.md`
- [X] T035 [P] Spec-Abnahme gegen SC-001..SC-008 in `specs/002-legacy-content-migration/acceptance-report.md` dokumentieren

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 (Setup): startet sofort.
- Phase 2 (Foundational): hängt von Phase 1 ab und blockiert alle User Stories.
- Phase 3/4/5 (US1/US2/US3): starten nach Phase 2; US2 setzt inhaltlich auf US1-Resultat auf.
- Phase 6 (US4): startet nach Phase 2, unabhängig von US1/US2/US3.
- Phase 7 (US5): startet nach Abschluss von US1/US3/US4.
- Phase 8 (Polish): nach allen Stories.

### User Story Dependencies

- US1: keine Story-Abhängigkeit (nur Foundational).
- US2: abhängig von US1 (einspaltige Finalform der migrierten About-Inhalte).
- US3: keine Story-Abhängigkeit (nur Foundational).
- US4: keine Story-Abhängigkeit (nur Foundational).
- US5: abhängig von US1, US3, US4.

### Within Each Story

- Inhaltsmigration vor Übersetzungs-Finalisierung.
- Daten-/Asset-Erstellung vor Seitenintegration.
- Dokumentations-/Verifikationsschritte am Ende jeder Story.

---

## Parallel Execution Examples

### US1 Parallelisierung

- T009 und T010 parallel (DE/EN About-Basismigration)
- T011 und T012 parallel (DE/EN Berufserfahrung)
- T013 und T014 parallel (DE/EN "Das kann ich")

### US3 Parallelisierung

- T018 und T019 parallel (DE/EN Work-Inhalte)
- T022 parallel zu T020/T021 nach Datenbasis

### US5 Parallelisierung

- T032 kann parallel zu finalen Seitenübersetzungen laufen, wenn Blogmigration (US4) abgeschlossen ist.

---

## Implementation Strategy

### MVP First

1. Phase 1 + Phase 2 abschließen.
2. US1 (About-Inhalte) abschließen.
3. US2 (Einspaltigkeit About) abschließen.
4. Erste fachliche Abnahme mit `/de/about` und `/en/about`.

### Incremental Delivery

1. Increment A: US1 + US2 (About vollständig, einspaltig)
2. Increment B: US3 (Work + Bilder)
3. Increment C: US4 (Blog statisch, Contentful-runtimefrei)
4. Increment D: US5 + Polish (Übersetzungsparität, finale Qualitätsnachweise)

### Suggested MVP Scope

- US1 + US2 als erstes sichtbares Lieferinkrement, da dies die explizite Anforderung an About direkt erfüllt und früh verifizierbar macht.
