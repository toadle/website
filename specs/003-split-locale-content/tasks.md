---
description: "Task list for 003-split-locale-content"
---

# Tasks: Sprachgetrennte Content-Ordner fuer Blog und Now

**Input**: Design documents from `/specs/003-split-locale-content/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md
**Constitution Version**: 1.0.0

**Tests**: Keine dedizierten Test-Tasks angefordert; Validierung erfolgt ueber Build und manuelle DE/EN-Listing-/Routing-Pruefung.

**Organisation**: Tasks sind nach User Story gruppiert, damit jede Story unabhängig implementiert und verifiziert werden kann.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Parallelisierbar (keine Abhängigkeit auf unvollständige Aufgaben in derselben Datei)
- **[Story]**: Zuordnung zu User Story (`[US1]` ... `[US3]`)
- Jede Task enthält einen konkreten Dateipfad.

---

## Phase 1: Setup

**Purpose**: Zielstruktur und Migrationsinventar für sprachgetrennte Content-Ordner vorbereiten.

- [X] T001 Migrationsinventar fuer Blog/Now-Dateien mit Zielpfad in `specs/003-split-locale-content/migration-inventory.md` anlegen
- [X] T002 Zielordnerstruktur dokumentieren in `specs/003-split-locale-content/folder-migration-map.md` anlegen
- [X] T003 Blog-Slug-Namenskonvention (Dateiname = finaler Slug) in `specs/003-split-locale-content/slug-normalization-rules.md` festhalten

---

## Phase 2: Foundational (Blocking)

**Purpose**: Gemeinsame technische Grundlage fuer sprachgetrennte Content-Aggregation.

**CRITICAL**: User-Story-Implementierung beginnt erst nach Abschluss dieser Phase.

- [X] T004 Verzeichnisse `src/content/blog/de`, `src/content/blog/en`, `src/content/now/de`, `src/content/now/en` erstellen
- [X] T005 [P] Collection-Loader fuer verschachtelte Sprachpfade in `src/content.config.ts` auf neue Blog-/Now-Struktur anpassen
- [X] T006 [P] Hilfsfunktion zur Sprachableitung aus Content-Pfaden in `src/lib/contentLocale.ts` erstellen
- [X] T007 [P] Slug-Normalisierung fuer Blog-IDs in `src/lib/contentSlug.ts` erstellen
- [X] T008 Blog- und Now-Seitenimporte auf neue Hilfsfunktionen vorbereiten in `src/pages/de/blog/index.astro`, `src/pages/en/blog/index.astro`, `src/pages/de/blog/[...slug].astro`, `src/pages/en/blog/[...slug].astro`, `src/pages/de/now.astro`, `src/pages/en/now.astro`

**Checkpoint**: Loader, Hilfsfunktionen und Zielordner sind bereit.

---

## Phase 3: User Story 1 - Blog und Now nach Sprache trennen (Priority: P1)

**Goal**: Blog- und Now-Dateien liegen strikt sprachgetrennt in Unterordnern.

**Independent Test**: In `src/content/blog/` und `src/content/now/` existieren nur sprachreine Unterordner mit passenden Dateien.

- [X] T009 [US1] Deutsche Blog-Dateien in `src/content/blog/de/` verschieben
- [X] T010 [P] [US1] Englische Blog-Dateien in `src/content/blog/en/` verschieben
- [X] T011 [US1] Deutsche Now-Dateien in `src/content/now/de/` verschieben
- [X] T012 [P] [US1] Englische Now-Dateien in `src/content/now/en/` verschieben
- [X] T013 [US1] Alte gemischte Root-Dateien bereinigen in `src/content/blog/` und `src/content/now/`

---

## Phase 4: User Story 2 - Blog-Dateinamen folgen finalem Slug (Priority: P1)

**Goal**: Blog-Dateinamen entsprechen finalen Slugs ohne Sprachsuffixe.

**Independent Test**: Dateiname jeder Datei unter `src/content/blog/de/` und `src/content/blog/en/` ist URL-Slug-konform und enthaelt kein Sprachsuffix.

- [X] T014 [US2] Deutsche Blog-Dateien unter `src/content/blog/de/` auf finalen Slug-Dateinamen umbenennen
- [X] T015 [P] [US2] Englische Blog-Dateien unter `src/content/blog/en/` auf finalen Slug-Dateinamen umbenennen
- [X] T016 [US2] Slug-Kollisionen innerhalb `src/content/blog/de/` und `src/content/blog/en/` pruefen und in `specs/003-split-locale-content/slug-collision-report.md` dokumentieren
- [X] T017 [US2] Interne Cross-Language-Links (`alternateLanguageUrl`) in Dateien unter `src/content/blog/de/` und `src/content/blog/en/` auf die finalen Slugs angleichen

---

## Phase 5: User Story 3 - Sprachreine Auslieferung ohne Mischlisten (Priority: P2)

**Goal**: DE- und EN-Listen/Navigation aggregieren nur Inhalte ihrer Sprache.

**Independent Test**: `/de/blog` und `/de/now` zeigen nur DE-Inhalte; `/en/blog` und `/en/now` zeigen nur EN-Inhalte; Prev/Next bleibt innerhalb derselben Sprache.

- [X] T018 [US3] DE-Blog-Index-Listing auf Pfadsprachfilter aktualisieren in `src/pages/de/blog/index.astro`
- [X] T019 [P] [US3] EN-Blog-Index-Listing auf Pfadsprachfilter aktualisieren in `src/pages/en/blog/index.astro`
- [X] T020 [US3] DE-Blog-Detailrouting inkl. Prev/Next auf Pfadsprachfilter und Slug-Normalisierung aktualisieren in `src/pages/de/blog/[...slug].astro`
- [X] T021 [P] [US3] EN-Blog-Detailrouting inkl. Prev/Next auf Pfadsprachfilter und Slug-Normalisierung aktualisieren in `src/pages/en/blog/[...slug].astro`
- [X] T022 [US3] DE-Blog-Pagination auf sprachreine Datengrundlage aktualisieren in `src/pages/de/blog/page/[page].astro`
- [X] T023 [P] [US3] EN-Blog-Pagination auf sprachreine Datengrundlage aktualisieren in `src/pages/en/blog/page/[page].astro`
- [X] T024 [US3] DE-Now-Listing auf Pfadsprachfilter aktualisieren in `src/pages/de/now.astro`
- [X] T025 [P] [US3] EN-Now-Listing auf Pfadsprachfilter aktualisieren in `src/pages/en/now.astro`

---

## Phase 6: Polish & Cross-Cutting

**Purpose**: Endvalidierung und Nachweis gegen die Success Criteria.

- [X] T026 `npm run build` ausführen und notwendige Fixes in `src/content.config.ts`, `src/pages/**`, `src/lib/**` einarbeiten
- [X] T027 [P] Sprachreinheitspruefung (Blog/Now Ordner) in `specs/003-split-locale-content/folder-purity-report.md` dokumentieren
- [X] T028 [P] Routing- und Pagination-Verifikation fuer `/de/blog`, `/en/blog`, `/de/now`, `/en/now` in `specs/003-split-locale-content/routing-validation-report.md` dokumentieren
- [X] T029 [P] Spec-Abnahme gegen SC-001..SC-005 in `specs/003-split-locale-content/acceptance-report.md` dokumentieren

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 (Setup): startet sofort.
- Phase 2 (Foundational): hängt von Phase 1 ab und blockiert alle User Stories.
- Phase 3 (US1) und Phase 4 (US2): starten nach Phase 2; US2 nutzt Ergebnisse aus US1-Dateiverschiebung.
- Phase 5 (US3): startet nach Abschluss von US1 und US2.
- Phase 6 (Polish): nach allen Stories.

### User Story Dependencies

- US1: keine Story-Abhängigkeit (nur Foundational).
- US2: abhängig von US1.
- US3: abhängig von US1 und US2.

### Within Each Story

- Dateiverschiebung vor Dateiumbenennung.
- Dateiumbenennung vor Routing-/Listing-Anpassung.
- Validierung und Reports am Ende.

---

## Parallel Execution Examples

### US1 Parallelisierung

- T009 und T010 parallel (Blog DE/EN verschieben)
- T011 und T012 parallel (Now DE/EN verschieben)

### US2 Parallelisierung

- T014 und T015 parallel (Slug-Umbenennung DE/EN)

### US3 Parallelisierung

- T018 und T019 parallel (Blog Index DE/EN)
- T020 und T021 parallel (Detailrouting DE/EN)
- T022 und T023 parallel (Pagination DE/EN)
- T024 und T025 parallel (Now DE/EN)

---

## Implementation Strategy

### MVP First

1. Phase 1 + Phase 2 abschliessen.
2. US1 (sprachreine Ordner) umsetzen.
3. US2 (Slug-Dateinamen) umsetzen.
4. Erste Abnahme auf Content-Struktur und Dateibenennung.

### Incremental Delivery

1. Increment A: US1 (Ordnertrennung)
2. Increment B: US2 (Slug-Dateinamen)
3. Increment C: US3 (sprachreine Auslieferung inkl. Pagination/Prev-Next)
4. Increment D: Polish + Abnahmereports

### Suggested MVP Scope

- US1 + US2 als erstes Lieferinkrement, da damit die Kernanforderung (strukturierte sprachreine Ablage + slug-konforme Dateinamen) unmittelbar erfüllt ist.
