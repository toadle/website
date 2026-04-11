# Implementation Plan: Legacy-Content-Migration aus `../website_old`

**Branch**: `002-legacy-content-migration` | **Date**: 2026-04-11 | **Spec**: `/specs/002-legacy-content-migration/spec.md`
**Input**: Feature specification from `/specs/002-legacy-content-migration/spec.md`
**Constitution Version**: 1.0.0

## Summary

Migriere die redaktionell relevanten Inhalte aus der Rails-Legacy-App (`../website_old`) in die statische Astro-Seite: About, Work, Veröffentlichungen, Open Source, Projektbeispiele und Blog-Altbestand. Ergänze fehlende Übersetzungen in DE/EN, setze About einspaltig um, migriere benötigte Bilder in das Zielprojekt (inkl. Alt-Text-Regeln), und entferne jede produktive Contentful-Abhängigkeit aus dem Zielsystem.

## Technical Context

**Language/Version**: TypeScript (Astro 5), Markdown/MDX-Content  
**Primary Dependencies**: Astro Content Collections, Astro Pages/Layout Components, bestehendes i18n-Modul (`src/i18n.ts`)  
**Storage**: Statische Inhalte in `src/content/`, seitennahem Astro-Markup (`src/pages/...`) und migrierten Bildassets (`src/assets/` bzw. `public/`)  
**Testing**: `npm run build`, manuelle Seitenprüfung DE/EN, inhaltliche Stichproben gegen Legacy-Quellen, Bildreferenzprüfung (keine Broken Images)  
**Target Platform**: Statische Website (Render deployment pipeline)  
**Project Type**: Statische Webanwendung  
**Performance Goals**: Keine Verschlechterung gegenüber aktuellem Build; bestehende Lighthouse-Ziele beibehalten (>= 90 als Projektziel)  
**Constraints**: Keine produktive Contentful-Laufzeitabhängigkeit; keine Secrets in Zielrepo; About-Hauptinhalt einspaltig; benötigte Bilder migriert/ersetzt und korrekt referenziert  
**Scale/Scope**: Migration mehrerer Inhaltsbereiche (About/Work/Open Source/Publikationen/Blog) mit DE/EN-Parität inklusive Medienmigration

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Gate Check

1. **Typography-First Design**: PASS  
  Inhaltliche Migration verändert primär Content und IA, keine dekorativen Zusatz-Elemente geplant.
2. **Content Over Chrome**: PASS  
  Fokus auf inhaltliche Übernahme, keine zusätzlichen UI-Komplexitätsmuster.
3. **Performance & Accessibility**: PASS  
  Statische Inhalte statt externer Runtime-Abhängigkeit reduziert Risiko; semantische Struktur wird beibehalten/verbessert.
4. **Internationalization-Native**: PASS  
  DE/EN-Parität ist expliziter Feature-Scope.
5. **Static-First, No Unnecessary Complexity**: PASS  
  Contentful wird nur als Legacy-Quelle für einmalige Migration genutzt, nicht zur Laufzeit.

Gate Result: **PASS**

## Project Structure

### Documentation (this feature)

```text
specs/002-legacy-content-migration/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── content-migration-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── content/
│   └── blog/                 # statische Blog-Inhalte nach Migration
├── assets/                   # migrierte lokale Bilder (bevorzugt)
├── public/
│   └── images/               # ggf. öffentlich referenzierte Bildassets
├── i18n.ts                   # UI- und ggf. strukturierte Textbausteine
├── pages/
│   ├── de/
│   │   ├── about.astro
│   │   └── work.astro
│   └── en/
│       ├── about.astro
│       └── work.astro
└── components/
   └── ...                   # ggf. extrahierte Section-Komponenten

specs/002-legacy-content-migration/
  (plan/research/data-model/contracts/quickstart/tasks)
```

**Structure Decision**: Beibehaltung der bestehenden Astro-Seitenstruktur (`src/pages/de|en`) mit statischem Content in Seiten/Collections. Keine zusätzliche Runtime-Service-Schicht. Bildassets werden zentral migriert und im Zielprojekt statisch referenziert.

## Phase 0: Outline & Research

Research-Artefakt erstellt: `/specs/002-legacy-content-migration/research.md`

Ergebniszusammenfassung:
- Legacy-Quellenkatalog und priorisierte Migrationsstrategie festgelegt.
- Contentful als einmalige Extraktionsquelle bestätigt, nicht als Zielarchitektur.
- Einspaltige About-Umsetzung und strukturähnliche "Das kann ich"-Übernahme als Leitentscheidung dokumentiert.
- Secret-Handling-Regel definiert (keine Übernahme von `.env`-Werten).
- Medienstrategie festgelegt: erforderliche Legacy-Bilder werden inventarisiert, migriert/ersetzt und mit Alt-Text-Regeln validiert.

## Phase 1: Design & Contracts

Design-/Vertragsartefakte erstellt:
- Data Model: `/specs/002-legacy-content-migration/data-model.md`
- Contract: `/specs/002-legacy-content-migration/contracts/content-migration-contract.md`
- Quickstart: `/specs/002-legacy-content-migration/quickstart.md`

Designinhalte:
- Entitäten für Migrationsblöcke, Quellenreferenzen, Projekt-/Publikationsdaten, statische Blogposts.
- Entität für Medienmigration (`MigratedMediaAsset`) inkl. Verwendungsstellen und Alt-Text-Regeln.
- Verbindliches Source-to-Target-Mapping für About/Work/Open Source/Blog.
- Verbindliches Source-to-Target-Mapping für erforderliche Bildassets.
- Security Contract: keine Secret-Übernahme.
- Completion Contract mit klaren Akzeptanzbedingungen.

## Post-Design Constitution Re-Check

1. **Typography-First Design**: PASS  
  Keine konträren Designvorgaben im Plan.
2. **Content Over Chrome**: PASS  
  Inhaltsmigration ohne neue UI-Komplexität.
3. **Performance & Accessibility**: PASS  
  Statische Zielauslieferung unterstützt Performance; semantische Struktur ist Teil des Contracts.
4. **Internationalization-Native**: PASS  
  DE/EN-Parität als Pflicht in Modell, Vertrag und Success-Kriterien.
5. **Static-First, No Unnecessary Complexity**: PASS  
  Keine Contentful-Runtime im Zielsystem.

Gate Result: **PASS**

## Complexity Tracking

Keine konstitutionsrelevanten Violations identifiziert.
