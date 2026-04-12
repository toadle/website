# Implementation Plan: IMDb Now Ratings Import

**Branch**: `004-create-feature-branch` | **Date**: 2026-04-12 | **Spec**: `/specs/004-imdb-now-import/spec.md`
**Input**: Feature specification from `/specs/004-imdb-now-import/spec.md`
**Constitution Version**: 1.0.0

## Summary

Ein einmaliger, manueller Import uebernimmt bis zu 50 IMDb-Bewertungen in lokalisierte Now-Eintraege (`de`/`en`). Die Eintraege enthalten strukturierte Nutzerbewertung, optionalen Kurzreview und einen wiederverwendbaren Richlink mit Backlink zum Film. In der Now-Ausgabe werden bestehende und importierte Eintraege gemeinsam nach Erstelldatum sortiert und bei Bedarf ineinander dargestellt.

## Technical Context

**Language/Version**: TypeScript (Astro 5), Markdown Content Collections  
**Primary Dependencies**: `astro:content`, bestehende i18n-Utilities (`src/i18n.ts`, `src/lib/contentLocale.ts`)  
**Storage**: Dateibasiert unter `src/content/now/{de,en}/`  
**Testing**: `npm run build` + manuelle Validierung von `/de/now` und `/en/now` inkl. Reihenfolge, Rating-Anzeige und Richlink-Verhalten  
**Target Platform**: Statische Astro-Site (Render deployment)  
**Project Type**: Statische Webanwendung  
**Performance Goals**: Keine Runtime-Regression in Now-Rendering; keine zusaetzlichen clientseitigen Datenabrufe fuer importierte Eintraege  
**Constraints**: IMDb blockiert einfachen HTTP-Abruf ohne JavaScript/WAF-Token; Import muss daher ueber JS-faehigen Lauf (z. B. Browser/Playwright) oder vorbereiteten Quelldump erfolgen; keine Dauer-Synchronisierung  
**Scale/Scope**: Einmalig bis zu 50 Ratings, jeweils 2 lokalisierte Eintraege (max. 100 neue Dateien) plus neue Rating-Komponente und Richlink-Wiederverwendung

### Verified Source Signals (exemplarischer Abruf)

- Zugriff auf die konkrete IMDb-Ratings-Seite war im Browser erfolgreich.
- Sichtbare Felder pro Eintrag: Titel + Titel-Link, `Nutzerbewertung`, `Bewertet am`.
- Default-Sortierung der Seite ist `Neueste`, damit sind die letzten Bewertungen direkt verfuegbar.
- Reiner Nicht-JS-Webabruf liefert Robot-Check-Seite; dieser Pfad ist fuer den Import ungeeignet.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Gate Check

1. **Typography-First Design**: PASS  
  Feature erweitert Content und Komponenten semantisch, ohne dekorative UI-Last.
2. **Content Over Chrome**: PASS  
  Fokus liegt auf inhaltlicher Erweiterung der Now-Timeline, keine modal-/chrome-lastigen Interaktionen.
3. **Performance & Accessibility**: PASS  
  Statische Ausgabe bleibt erhalten; Rating/Richlink werden als semantische Inhalte gerendert.
4. **Internationalization-Native**: PASS  
  Pro importiertem Datensatz werden `de`- und `en`-Eintraege erzeugt.
5. **Static-First, No Unnecessary Complexity**: PASS  
  Kein Dauerdienst, kein externer Runtime-Tracker; Import als einmaliger Workflow.

Gate Result: **PASS**

## Project Structure

### Documentation (this feature)

```text
specs/004-imdb-now-import/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── now-rating-richlink-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── content.config.ts
├── components/
│   └── NowRating.astro
├── content/
│   └── now/
│       ├── de/
│       └── en/
├── pages/
│   ├── de/now.astro
│   └── en/now.astro
└── lib/
    ├── nowImport/
    └── contentLocale.ts

scripts/
└── migrations/
    └── imdb-now-import.ts
```

**Structure Decision**: Bestehende Astro-Struktur bleibt erhalten; Feature wird durch neue Komponenten-/Import-Utilities plus lokalisierte Content-Dateien integriert.

## Phase 0: Outline & Research

Research-Artefakt erstellt: `/specs/004-imdb-now-import/research.md`

Ergebniszusammenfassung:
- Import ist bewusst einmalig und manuell.
- Zielstruktur sind lokalisierte Now-Eintraege fuer `de` und `en`.
- Richlink ist generisch wiederverwendbar und nicht auf Ratings beschraenkt.
- Gemeinsame Sortierung bestehender und neuer Eintraege erfolgt ueber Erstelldatum.
- Exemplarischer Live-Abruf bestaetigt extrahierbare Felder (`Nutzerbewertung`, `Bewertet am`, Titel-Link) im Browser-Kontext.

## Phase 1: Design & Contracts

Design-/Vertragsartefakte erstellt:
- Data Model: `/specs/004-imdb-now-import/data-model.md`
- Contract: `/specs/004-imdb-now-import/contracts/now-rating-richlink-contract.md`
- Quickstart: `/specs/004-imdb-now-import/quickstart.md`

Designinhalte:
- Datenmodell fuer Import-Record, lokalisierte Rating-Eintraege und wiederverwendbaren Richlink.
- Vertrag fuer Importinput, Rendering, Fehlertoleranz und gemeinsame Timeline-Sortierung.
- Quickstart fuer einmaligen End-to-End-Import mit Validierung auf DE/EN-Now-Seiten.

## Post-Design Constitution Re-Check

1. **Typography-First Design**: PASS  
  Keine Aufweichung der gestalterischen Leitplanken, semantische Komponentenerweiterung.
2. **Content Over Chrome**: PASS  
  Inhaltlicher Mehrwert ohne UI-Ueberkomplexitaet.
3. **Performance & Accessibility**: PASS  
  Statische Auslieferung bleibt unangetastet; Inhalte bleiben ohne JS lesbar.
4. **Internationalization-Native**: PASS  
  Zweisprachige Eintraege und Sprachrouting bleiben konsistent.
5. **Static-First, No Unnecessary Complexity**: PASS  
  Keine Dauerprozesse oder externen Tracker; Einmalimport als kontrollierter Workflow.

Gate Result: **PASS**

## Complexity Tracking

Keine konstitutionsrelevanten Violations identifiziert.
