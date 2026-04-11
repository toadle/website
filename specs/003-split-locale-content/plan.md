# Implementation Plan: Sprachgetrennte Content-Ordner fuer Blog und Now

**Branch**: `003-split-locale-content` | **Date**: 2026-04-11 | **Spec**: `/specs/003-split-locale-content/spec.md`
**Input**: Feature specification from `/specs/003-split-locale-content/spec.md`
**Constitution Version**: 1.0.0

## Summary

Blog- und Now-Content wird in sprachreine Unterordner (`de`, `en`) aufgeteilt. Blog-Dateinamen werden auf finale URL-Slugs normalisiert (ohne Sprachsuffix im Dateinamen). Aggregation, Pagination und Artikelnavigation werden pro Sprache auf die jeweilige Ordnerstruktur umgestellt, sodass keine Sprachmischung in Listen oder Detailnavigation mehr auftritt.

## Technical Context

**Language/Version**: TypeScript (Astro 5), Markdown/MDX Content Collections  
**Primary Dependencies**: Astro Content Collections (`astro:content`), bestehendes i18n-Modul (`src/i18n.ts`)  
**Storage**: Dateibasiert unter `src/content/`  
**Testing**: `npm run build`, manuelle Routen-/Listing-Pruefung fuer DE/EN  
**Target Platform**: Statische Astro-Site (Render deployment)  
**Project Type**: Statische Webanwendung  
**Performance Goals**: Keine Regression gegen aktuellen statischen Build; Seitenaufbau bleibt ohne neue Runtime-Abhaengigkeiten  
**Constraints**: Keine DE/EN-Mischung in denselben Blog/Now-Ordnern; Blog-Dateiname == finaler Slug; vorhandene Links bleiben gueltig  
**Scale/Scope**: Umstrukturierung aller vorhandenen Dateien in `src/content/blog` und `src/content/now` plus Anpassung der betroffenen DE/EN-Seitenrouten

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Gate Check

1. **Typography-First Design**: PASS  
  Keine neue visuelle Komplexitaet; rein strukturelle Content- und Routing-Aenderung.
2. **Content Over Chrome**: PASS  
  Fokus auf Content-Struktur, keine UI-Chrome-Erweiterung.
3. **Performance & Accessibility**: PASS  
  Static-First bleibt unveraendert; keine neuen Drittanbieter-Skripte.
4. **Internationalization-Native**: PASS  
  Feature staerkt Sprachtrennung und Konsistenz von DE/EN.
5. **Static-First, No Unnecessary Complexity**: PASS  
  Umsetzung erfolgt im bestehenden Astro-Content-Modell ohne neue Runtime-Schicht.

Gate Result: **PASS**

## Project Structure

### Documentation (this feature)

```text
specs/003-split-locale-content/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── content-folder-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── content.config.ts
├── content/
│   ├── blog/
│   │   ├── de/
│   │   └── en/
│   └── now/
│       ├── de/
│       └── en/
└── pages/
   ├── de/
   │   ├── blog/
   │   │   ├── index.astro
   │   │   ├── [...slug].astro
   │   │   └── page/[page].astro
   │   └── now.astro
   └── en/
      ├── blog/
      │   ├── index.astro
      │   ├── [...slug].astro
      │   └── page/[page].astro
      └── now.astro
```

**Structure Decision**: Beibehaltung der bestehenden Astro-Struktur; nur Content-Ordnerhierarchie wird sprachrein gemacht und Seitenaggregation auf diese Hierarchie ausgerichtet.

## Phase 0: Outline & Research

Research-Artefakt erstellt: `/specs/003-split-locale-content/research.md`

Ergebniszusammenfassung:
- Sprachtrennung erfolgt ueber Unterordner statt Dateisuffixe.
- Blog-Dateinamen werden als finale Slugs standardisiert.
- Collection- und Seitenfilter werden auf Ordnerkontext ausgerichtet.
- Pagination und Prev/Next bleiben sprachspezifisch.

## Phase 1: Design & Contracts

Design-/Vertragsartefakte erstellt:
- Data Model: `/specs/003-split-locale-content/data-model.md`
- Contract: `/specs/003-split-locale-content/contracts/content-folder-contract.md`
- Quickstart: `/specs/003-split-locale-content/quickstart.md`

Designinhalte:
- Datenmodell fuer sprachreine Ordner, Dateien und Listings.
- Verbindlicher Vertragsrahmen fuer erlaubte Pfade und Dateinamensregeln.
- Routing-/Pagination-Grenzen pro Sprache klar definiert.

## Post-Design Constitution Re-Check

1. **Typography-First Design**: PASS  
  Keine Aenderungen an typografischen Leitlinien.
2. **Content Over Chrome**: PASS  
  Keine neue UI-Komplexitaet, nur Inhaltsstruktur.
3. **Performance & Accessibility**: PASS  
  Keine Runtime-Abhaengigkeiten hinzugefuegt; statische Generierung bleibt Kern.
4. **Internationalization-Native**: PASS  
  Sprachtrennung in Struktur und Listing wird verbessert.
5. **Static-First, No Unnecessary Complexity**: PASS  
  Keine unnötigen Zusatzschichten; Loesung bleibt dateibasiert.

Gate Result: **PASS**

## Complexity Tracking

Keine konstitutionsrelevanten Violations identifiziert.
