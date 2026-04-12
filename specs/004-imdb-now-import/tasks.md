# Tasks: IMDb Now Ratings Import

**Input**: Design documents from /specs/004-imdb-now-import/
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/now-rating-richlink-contract.md, quickstart.md

**Tests**: Es wurden keine expliziten TDD- oder separaten Testaufgaben in der Spezifikation gefordert. Validierung erfolgt ueber Build und definierte manuelle Akzeptanzpruefungen.

**Organization**: Aufgaben sind pro User Story gruppiert, damit jede Story unabhaengig implementiert und verifiziert werden kann.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Grundgeruest fuer einmaligen Import-Workflow und Feature-Dateistruktur bereitstellen.

- [x] T001 Create import module directory and entrypoint in src/lib/nowImport/index.ts
- [x] T002 Create one-time migration script scaffold in scripts/migrations/imdb-now-import.ts
- [x] T003 [P] Add one-time import npm script in package.json
- [x] T004 [P] Add import usage section for manual execution in README.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Gemeinsame Daten- und Rendering-Bausteine, die alle User Stories voraussetzen.

**CRITICAL**: Keine User-Story-Umsetzung vor Abschluss dieser Phase.

- [x] T005 Extend now collection schema for rating and richlink fields in src/content.config.ts
- [x] T006 [P] Implement shared richlink mapper and validator in src/lib/nowImport/richlink.ts
- [x] T007 [P] Implement locale-aware date label formatter for imported entries in src/lib/nowImport/dateLabel.ts
- [x] T008 Implement stable merged timeline sorting helper (date desc + tie-break) in src/lib/nowImport/sortNowEntries.ts
- [x] T009 Integrate merged timeline sorting helper in src/pages/de/now.astro
- [x] T010 Integrate merged timeline sorting helper in src/pages/en/now.astro

**Checkpoint**: Foundation ready, User Stories koennen umgesetzt werden.

---

## Phase 3: User Story 1 - Einmaliger Rating-Import (Priority: P1) MVP

**Goal**: Bis zu 50 IMDb-Ratings einmalig abrufen und als lokalisierte Now-Eintraege erzeugen.

**Independent Test**: Importlauf ausfuehren und verifizieren, dass valide Ratings als DE/EN-Eintraege erstellt und fehlerhafte Datensaetze protokolliert werden.

### Implementation for User Story 1

- [x] T011 [US1] Capture browser snapshot and persist normalized rating payload in specs/004-imdb-now-import/imdb-ratings-snapshot.json
- [x] T012 [US1] Implement browser-context IMDb extraction (title, title link, user rating, rated date) in src/lib/nowImport/extractFromImdb.ts
- [x] T013 [US1] Implement normalization and skip-reason classification for imported ratings in src/lib/nowImport/normalizeRatings.ts
- [x] T014 [P] [US1] Implement markdown writer for localized rating entries in src/lib/nowImport/writeNowRatingEntries.ts
- [x] T015 [US1] Implement one-time import orchestrator with max-50 limit and dedupe by sourceId+locale in src/lib/nowImport/runImport.ts
- [x] T016 [US1] Wire migration script to orchestrator and CLI args in scripts/migrations/imdb-now-import.ts
- [x] T017 [US1] Implement import result summary output (processed, created, skipped, failed) in src/lib/nowImport/runImport.ts
- [x] T018 [US1] Generate localized imported entries into src/content/now/de/
- [x] T019 [US1] Generate localized imported entries into src/content/now/en/

**Checkpoint**: User Story 1 liefert einen vollstaendigen, einmaligen Importfluss.

---

## Phase 4: User Story 2 - Bewertung in Now anzeigen (Priority: P2)

**Goal**: Nutzerbewertung und optionaler Kurzreview werden in der Now-Ansicht klar dargestellt.

**Independent Test**: Einen importierten Eintrag in DE und EN aufrufen und pruefen, dass Bewertung und optionaler Kurzreview korrekt gerendert werden.

### Implementation for User Story 2

- [x] T020 [US2] Create reusable NowRating component for structured rating display in src/components/NowRating.astro
- [x] T021 [US2] Render rating component and optional review text for rating entries in src/pages/de/now.astro
- [x] T022 [US2] Render rating component and optional review text for rating entries in src/pages/en/now.astro
- [x] T023 [US2] Add non-rating fallback behavior so existing now entries remain unchanged in src/pages/de/now.astro
- [x] T024 [US2] Add non-rating fallback behavior so existing now entries remain unchanged in src/pages/en/now.astro

**Checkpoint**: User Story 2 ist eigenstaendig funktionsfaehig, ohne bestehende Now-Eintraege zu brechen.

---

## Phase 5: User Story 3 - Wiederverwendbarer Richlink (Priority: P3)

**Goal**: Richlink mit Backlink bei Rating-Eintraegen anzeigen und dieselbe Struktur fuer andere Now-Eintraege nutzbar machen.

**Independent Test**: Rating-Eintrag und Nicht-Rating-Eintrag mit Richlink in DE/EN rendern und funktionierende Links pruefen.

### Implementation for User Story 3

- [x] T025 [US3] Create reusable Richlink component with backlink presentation in src/components/Richlink.astro
- [x] T026 [US3] Render richlink component for rating entries in src/pages/de/now.astro
- [x] T027 [US3] Render richlink component for rating entries in src/pages/en/now.astro
- [x] T028 [US3] Enable richlink rendering for non-rating now entries using same schema in src/pages/de/now.astro
- [x] T029 [US3] Enable richlink rendering for non-rating now entries using same schema in src/pages/en/now.astro
- [x] T030 [US3] Add reusable richlink example entry in src/content/now/de/2026-04-12-richlink-empfehlung.md
- [x] T031 [US3] Add reusable richlink example entry in src/content/now/en/2026-04-12-richlink-recommendation.md

**Checkpoint**: User Story 3 stellt Richlinks konsistent fuer Rating- und Nicht-Rating-Eintraege bereit.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Endabnahme, Dokumentation und Abschlussvalidierung.

- [x] T032 Update feature quickstart with final command examples and verification notes in specs/004-imdb-now-import/quickstart.md
- [x] T033 [P] Run full build validation and record result in specs/004-imdb-now-import/acceptance-report.md
- [x] T034 [P] Document import run outcome against SC-001 to SC-006 in specs/004-imdb-now-import/acceptance-report.md
- [x] T035 Perform final manual DE/EN now checks for sorting, rating, review, and richlink behavior in specs/004-imdb-now-import/acceptance-report.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 Setup: Keine Abhaengigkeiten.
- Phase 2 Foundational: Haengt von Phase 1 ab und blockiert alle User Stories.
- Phase 3 US1: Startet nach Phase 2.
- Phase 4 US2: Startet nach Phase 2, nutzt typischerweise importierte Daten aus US1 fuer End-to-End-Validierung.
- Phase 5 US3: Startet nach Phase 2, sollte nach US2 abgeschlossen werden, um Rendering-Pipeline konsistent zu erweitern.
- Phase 6 Polish: Nach Abschluss der gewuenschten User Stories.

### User Story Dependencies

- US1 (P1): Keine Abhaengigkeit auf andere Stories.
- US2 (P2): Funktional unabhaengig entwickelbar, End-to-End-Validierung bevorzugt mit US1-Importdaten.
- US3 (P3): Funktional unabhaengig entwickelbar, baut in der finalen Integration auf der Rendering-Struktur aus US2 auf.

### Within Each User Story

- Datenmodell/Parsing vor Persistenz.
- Persistenz vor Seitenrendering.
- Komponenten vor Seitenintegration.
- Story-Checkpoint vor naechster Story-Abnahme.

---

## Parallel Opportunities

- Setup parallel: T003 und T004.
- Foundational parallel: T006 und T007.
- US1 parallel: T014 kann nach T013 parallel zu Teilen von T015 umgesetzt werden.
- US3 parallel: T030 und T031 koennen parallel erstellt werden.
- Polish parallel: T033 und T034.

---

## Parallel Example: User Story 1

- Task T014 in src/lib/nowImport/writeNowRatingEntries.ts
- Task T015 in src/lib/nowImport/runImport.ts

Diese Aufgaben koennen parallel bearbeitet werden, sobald Snapshot, Parsing und Normalisierung aus T011 bis T013 definiert sind.

---

## Parallel Example: User Story 3

- Task T030 in src/content/now/de/2026-04-12-richlink-empfehlung.md
- Task T031 in src/content/now/en/2026-04-12-richlink-recommendation.md

Diese Aufgaben sind dateiseitig getrennt und ohne Konflikt parallel umsetzbar.

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1 abschliessen.
2. Phase 2 abschliessen.
3. US1 komplett umsetzen (T011-T019).
4. Importergebnis pruefen und als MVP abnehmen.

### Incremental Delivery

1. MVP mit US1 liefern.
2. US2 fuer sichtbare Bewertung und Kurzreview ausrollen.
3. US3 fuer wiederverwendbare Richlinks ausrollen.
4. Abschliessend Phase 6 fuer Dokumentation und Endvalidierung.

### Suggested MVP Scope

- Fuer den fruehesten nutzbaren Release reicht US1 (einmaliger Import plus korrekte Timeline-Einordnung).
