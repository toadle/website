---
description: "Task list for 001-i18n-now-lang-detection"
---

# Tasks: i18n – Now-Bereich, Artikel-Navigation & persistente Spracherkennung

**Input**: Design documents from `/specs/001-i18n-now-lang-detection/`
**Prerequisites**: spec.md ✅ | plan.md ✗ (Tasks direkt aus Spec + Codebase-Analyse generiert)
**Constitution Version**: 1.0.0

**Tests**: Keine dedizierten Test-Tasks (nicht in Spec angefordert). Validierung über `npm run build` und manuelle Lighthouse-Prüfung.

**Organisation**: Tasks sind nach User Story gruppiert für unabhängige Implementierung und Testbarkeit.

## Format: `[ID] [P?] [Story] Beschreibung`

- **[P]**: Kann parallel laufen (unterschiedliche Dateien, keine offenen Abhängigkeiten)
- **[US]**: Welcher User Story dieser Task zugehört
- Exakte Dateipfade sind in allen Task-Beschreibungen angegeben

---

## Phase 1: Setup

**Zweck**: Keine neue Projektstruktur nötig – Feature modifiziert bestehende Dateien. Einmaliger Smoke-Test.

- [x] T001 Entwicklungsserver starten und prüfen, dass alle bestehenden Seiten ohne Fehler laden (`npm run dev`)

---

## Phase 2: Foundational – Schema- und i18n-Erweiterungen (Blocking)

**Zweck**: Content-Schema-Änderungen und neue i18n-Strings, auf die US3, US4 und US5 aufbauen.

**⚠️ KRITISCH**: US3, US4 und US5 können erst implementiert werden, wenn diese Phase abgeschlossen ist.

- [x] T002 Optionales Feld `lang: z.enum(["de","en"]).optional()` zum Now-Schema hinzufügen in `src/content.config.ts`
- [x] T003 [P] Optionales Feld `alternateLanguageUrl: z.string().optional()` zum Blog-Schema hinzufügen in `src/content.config.ts`
- [x] T004 [P] Blog-Navigations-Strings (`articleNav.prev`, `articleNav.next`, `articleNav.readIn`) für `de` und `en` zu `src/i18n.ts` hinzufügen

**Checkpoint**: Schema und i18n-Strings bereit – User-Story-Implementierung kann beginnen.

---

## Phase 3: User Story 1 – Automatische Spracherkennung (Priority: P1) 🎯 MVP

**Goal**: Root-URL `/` erkennt Browser-Sprache und leitet auf `/de` oder `/en` weiter.

**Independent Test**: Browser-Sprache auf `en` setzen → `toadle.me/` öffnen → landet auf `/en`. Browser-Sprache auf `de` setzen → landet auf `/de`. Unbekannte Sprache (`fr`) → landet auf `/en`.

- [x] T005 [US1] `src/pages/index.astro` von statischem `Astro.redirect("/de")` auf clientseitige Spracherkennung umstellen: Inline-Script liest `localStorage.getItem("lang")`, dann `navigator.language`, leitet auf `/de` oder `/en` weiter; `<noscript>`-Fallback liefert Meta-Refresh auf `/en`

---

## Phase 4: User Story 2 – Persistente Sprachpräferenz (Priority: P2)

**Goal**: Klick auf Sprachschalter speichert Wahl dauerhaft in `localStorage`; nächster Besuch auf `/` nutzt die gespeicherte Präferenz.

**Independent Test**: Sprachschalter auf `/de/about` klicken → landet auf `/en/about` → `localStorage["lang"]` enthält `"en"`. Neuen Tab öffnen, `toadle.me/` aufrufen → landet auf `/en` (nicht `/de`).

- [x] T006 [US2] Klick-Handler des Sprachschalters in `src/components/Header/Header.astro` erweitern: `localStorage.setItem("lang", otherLang)` vor jedem Sprachnavigationslink ausführen (Event-Listener auf `.lang`-Anker im bestehenden `<script>`-Block ergänzen)

---

## Phase 5: User Story 3 – Now-Bereich vollständig i18n (Priority: P2)

**Goal**: Beide Now-Seiten zeigen ausschließlich sprachkorrekte UI-Texte und filtern Einträge nach `lang`-Feld.

**Independent Test**: `/en/now` zeigt englischen Lead-Text aus `i18n.ts`; kein Eintrag mit `lang: de` sichtbar. `/de/now` zeigt deutschen Lead-Text; kein Eintrag mit `lang: en` sichtbar. Eintrag ohne `lang`-Feld erscheint auf beiden Seiten.

- [x] T007 [P] [US3] `src/pages/de/now.astro` anpassen: `rawEntries` nach `!entry.data.lang || entry.data.lang === "de"` filtern; hartkodiertes `"What I'm up to."` durch `{t.now.lead}` ersetzen
- [x] T008 [P] [US3] `src/pages/en/now.astro` anpassen: `rawEntries` nach `!entry.data.lang || entry.data.lang === "en"` filtern; hartkodiertes `"What I'm up to."` durch `{t.now.lead}` ersetzen

---

## Phase 6: User Story 4 – Blog-Artikel-Navigation (Priority: P3)

**Goal**: Blog-Post-Seiten zeigen Prev/Next-Links innerhalb der gleichen Sprache und optional einen Link zur anderssprachigen Version via vollständigem Frontmatter-Link `alternateLanguageUrl`.

**Independent Test**: `/de/blog/[slug]` zeigt am Seitenende „Nächster Artikel"-Link (sofern vorhanden). Ein Post mit `alternateLanguageUrl: "/en/blog/other-slug"` verlinkt korrekt auf die EN-Version trotz abweichendem Slug.

- [x] T009 [US4] `src/components/ArticleNav.astro` neu anlegen: nimmt Props `prev`, `next` (jeweils `{ title, slug, lang }` oder `undefined`) sowie `translationLink` (`{ href, label }` oder `undefined`); rendert semantische `<nav>`-Links mit Strings aus `i18n`
- [x] T010 [US4] `getStaticPaths` in `src/pages/de/blog/[...slug].astro` erweitern: Posts nach `pubDate` sortieren, Index ermitteln, `prevPost` und `nextPost` als Props übergeben; `alternateLanguageUrl` des aktuellen Posts als `translationHref`-Prop weiterreichen
- [x] T011 [P] [US4] `getStaticPaths` in `src/pages/en/blog/[...slug].astro` analog zu T010 erweitern: `alternateLanguageUrl` direkt als `translationHref`-Prop aus dem aktuellen Post übernehmen
- [x] T012 [US4] `ArticleNav`-Komponente in `src/layouts/BlogPost.astro` importieren und nach dem `<article>`-Inhalt einbinden; Props aus `Astro.props` (prevPost, nextPost, translationHref, lang) übergeben

---

## Phase 7: User Story 5 – Content-Migration & englische Beispieleinträge (Priority: P3)

**Goal**: Alle 8 deutschen Now-Einträge erhalten `lang: de`. Für jeden der 4 Inhaltstypen existiert mindestens ein englischer Begleit-Eintrag mit `lang: en`.

**Independent Test**: `/de/now` zeigt weiterhin alle 8 deutschen Einträge. `/en/now` zeigt mindestens 4 englische Einträge (reiner Text, Zitat+Bild, YouTube, Zitat+Meinung).

- [x] T013 [US5] `lang: de` zu allen 8 deutschen Now-Einträgen hinzufügen: `src/content/now/2025-10-18-mix.md`, `2025-11-05-image.md`, `2025-11-22-youtube.md`, `2025-12-05-quote.md`, `2025-12-20-updates.md`, `2026-01-12-prototyp.md`, `2026-01-24-dokumentation.md`, `2026-02-01-startseite.md`
- [x] T014 [P] [US5] Englischen Now-Eintrag vom Typ **Zitat + Bild** anlegen: `src/content/now/2025-10-18-mix-en.md` mit `lang: en`, `label: "Oct 18, 2025"`, englischem `quote`-Text, englischem `image.alt` und englischem Body-Text
- [x] T015 [P] [US5] Englischen Now-Eintrag vom Typ **YouTube-Einbettung** anlegen: `src/content/now/2025-11-22-youtube-en.md` mit `lang: en`, `label: "Nov 22, 2025"`, `youtube`-URL und englischem Body (inhaltliche Entsprechung des deutschen Eintrags)
- [x] T016 [P] [US5] Englischen Now-Eintrag vom Typ **Zitat + Meinung** anlegen: `src/content/now/2025-12-05-quote-en.md` mit `lang: en`, `label: "Dec 5, 2025"`, englischem `quote` und englischer `opinion`
- [x] T017 [P] [US5] Englischen Now-Eintrag vom Typ **reiner Text** anlegen: `src/content/now/2025-12-20-updates-en.md` mit `lang: en`, `label: "Dec 20, 2025"` und englischem Body-Text (Entsprechung der deutschsprachigen Updates)

---

## Phase 8: Polish & Cross-Cutting

**Zweck**: Build-Validierung und Lighthouse-Abnahme vor dem Merge.

- [x] T018 Production-Build ausführen (`npm run build`) und sicherstellen, dass keine TypeScript-Fehler oder Astro-Content-Collection-Fehler auftreten
- [ ] T019 [P] Lighthouse-Scores für `/de/now`, `/en/now` und einen Blog-Post in `/de/blog/` und `/en/blog/` messen; alle vier Kategorien MÜSSEN ≥ 90 erreichen (Constitution Prinzip III)

---

## Abhängigkeitsgraph

```
T001 (Setup)
  └─► T002, T003, T004 (Foundational – parallel)
        ├─► T005 (US1) ──────────────────────────────► T018, T019
        ├─► T006 (US2) ──────────────────────────────► T018, T019
        ├─► T007, T008 (US3 – parallel) ─────────────► T018, T019
        ├─► T009 ──► T010, T011 (parallel) ──► T012 ─► T018, T019
        └─► T013 ──► T014, T015, T016, T017 (parallel)► T018, T019
```

**Story-Reihenfolge für sequenzielle Implementierung:**
1. Phase 2 (T002–T004) — Foundational, blockiert alle anderen
2. Phase 3 (T005) — US1 = MVP, sofort demonstrierbar
3. Phase 4 (T006) — US2, baut auf US1-Mechanik auf
4. Phase 5 (T007–T008) — US3, unabhängig von US1/US2
5. Phase 6 (T009–T012) — US4, unabhängig von US1/US2/US3
6. Phase 7 (T013–T017) — US5, unabhängig, aber requires T002 (lang schema)

---

## Parallele Ausführungsbeispiele

**Foundational (nach T001):**
```
T002 ║ T003 ║ T004
```

**US3 (nach Phase 2):**
```
T007 ║ T008
```

**US4 (nach T009):**
```
T010 ║ T011
     └──────► T012
```

**US5 (nach T013):**
```
T014 ║ T015 ║ T016 ║ T017
```

---

## Implementierungsstrategie

**MVP-Scope (nur US1):** T001 → T005  
2 Tasks – sofort demonstrierbar: Browser-Spracherkennung funktioniert, Besucher mit EN-Browser landen auf `/en`.

**Increment 2 (US2 + US3):** T002 → T003/T004 → T006 → T007/T008  
Sprachpräferenz wird gespeichert; Now-Seiten sind vollständig i18n-bereit.

**Increment 3 (US4 + US5):** T009–T012 + T013–T017  
Blog-Navigation und Content-Migration – kann unabhängig von Increment 2 deployt werden.

**Full feature:** T018 → T019

---

## Zusammenfassung

| Metrik | Wert |
|--------|------|
| **Gesamt-Tasks** | 19 |
| **US1 (P1 – MVP)** | 1 Task (T005) |
| **US2 (P2)** | 1 Task (T006) |
| **US3 (P2)** | 2 Tasks (T007–T008) |
| **US4 (P3)** | 4 Tasks (T009–T012) |
| **US5 (P3)** | 5 Tasks (T013–T017) |
| **Foundational** | 3 Tasks (T002–T004) |
| **Setup + Polish** | 3 Tasks (T001, T018, T019) |
| **Parallelisierbare Tasks** | 12 ([P]-markiert) |
| **Empfohlener MVP-Scope** | T001 + T005 (US1 allein liefert Mehrwert) |
