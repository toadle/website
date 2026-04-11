# Feature Specification: i18n – Now-Bereich, Artikel-Navigation & persistente Spracherkennung

**Feature Branch**: `001-i18n-now-lang-detection`  
**Created**: 2026-04-11  
**Status**: Draft  
**Constitution Version**: 1.0.0  

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 – Sprache beim ersten Besuch automatisch erkennen (Priority: P1)

Ein neuer Besucher öffnet die Website ohne gespeicherte Präferenz. Die Website erkennt anhand der Browser-Sprache, ob Deutsch oder Englisch die bevorzugte Sprache ist, und leitet ihn direkt auf die passende Sprachversion (`/de` oder `/en`) weiter – ohne dass der Besucher manuell wechseln muss.

**Why this priority**: Erster Eindruck entscheidet über Absprung oder Engagement. Englische Besucher, die auf einer deutschen Startseite landen, verlassen die Seite sofort.

**Independent Test**: Eine neue Browser-Sitzung mit Sprache „en" öffnet `toadle.me/` und landet auf `/en/`. Eine Sitzung mit Sprache „de" landet auf `/de/`. Beide Szenarien liefern die korrekte Sprachversion vollständig ohne manuelle Aktion.

**Acceptance Scenarios**:

1. **Given** ein Besucher ohne gespeicherte Sprachpräferenz mit Browser-Sprache `en-US`, **When** er `toadle.me/` aufruft, **Then** wird er auf `/en` weitergeleitet.
2. **Given** ein Besucher ohne gespeicherte Sprachpräferenz mit Browser-Sprache `de-DE`, **When** er `toadle.me/` aufruft, **Then** wird er auf `/de` weitergeleitet.
3. **Given** die Browser-Sprache ist weder `de` noch `en` (z. B. `fr`), **When** er `toadle.me/` aufruft, **Then** landet er auf `/en` (Fallback Englisch).

---

### User Story 2 – Sprachpräferenz aktiv wählen und dauerhaft speichern (Priority: P2)

Ein Besucher sieht im Header einen Sprachschalter (z. B. „DE / EN"). Ein Klick darauf wechselt zur anderen Sprachversion der aktuellen Seite und speichert diese Wahl dauerhaft, sodass künftige Besuche sofort zur bevorzugten Sprache weiterleiten – auch wenn die Browser-Sprache abweicht.

**Why this priority**: Internationale Nutzer, die bevorzugt Deutsch lesen, obwohl ihr Browser auf Englisch eingestellt ist (oder umgekehrt), brauchen eine persistente Opt-in-Möglichkeit.

**Independent Test**: Sprachschalter auf `/de/about` angeklickt → Weiterleitung auf `/en/about`. Zweiter Besuch auf `toadle.me/` → Weiterleitung direkt auf `/en`, nicht auf `/de`. Sprachpräferenz bleibt auch nach Browser-Neustart bestehen.

**Acceptance Scenarios**:

1. **Given** Besucher ist auf `/de/about`, **When** er den Sprachschalter betätigt, **Then** landet er auf `/en/about` (identische Seite, andere Sprache).
2. **Given** Sprachpräferenz `en` wurde gespeichert, **When** Besucher `toadle.me/` in einem neuen Tab öffnet, **Then** wird er auf `/en` weitergeleitet ohne erneute Browser-Spracherkennung.
3. **Given** Besucher hat `en` gespeichert und wechselt manuell zurück zu `de`, **Then** wird `de` als neue gespeicherte Präferenz übernommen.
4. **Given** Besucher löscht Browser-Daten, **When** er die Seite neu öffnet, **Then** greift wieder die automatische Spracherkennung aus US1.

---

### User Story 3 – Now-Bereich vollständig internationalisiert (Priority: P2)

Der Now-Bereich (`/de/now` und `/en/now`) zeigt korrekte UI-Texte (Titel, Lead-Text, Zeitstempel-Label) in der jeweiligen Sprache. Now-Einträge können optional ein Sprachfeld (`lang`) im Frontmatter tragen, das angibt, in welcher Sprache der Inhalt verfasst ist. Die jeweilige Sprachversion der Now-Seite zeigt bevorzugt Einträge der passenden Sprache; Einträge ohne Sprachangabe erscheinen in beiden Versionen.

**Why this priority**: Die Now-Seite ist Teil des Portfolio-Auftritts. Englische Besucher sollten englische UI-Labels sehen; deutschsprachige Einträge erscheinen dann nur im deutschen Now-Bereich.

**Independent Test**: `/en/now` zeigt „What I'm up to" als Lead-Text. Ein Now-Eintrag mit `lang: de` erscheint ausschließlich auf `/de/now`. Ein Eintrag ohne `lang`-Feld erscheint auf beiden Seiten.

**Acceptance Scenarios**:

1. **Given** Besucher öffnet `/en/now`, **Then** sind alle UI-Texte auf Englisch (kein deutsches Label sichtbar).
2. **Given** ein Now-Eintrag hat `lang: de` im Frontmatter, **Then** erscheint er auf `/de/now`, aber nicht auf `/en/now`.
3. **Given** ein Now-Eintrag hat kein `lang`-Feld, **Then** erscheint er auf `/de/now` und `/en/now`.
4. **Given** ein Now-Eintrag hat `lang: en`, **Then** erscheint er nur auf `/en/now`.

---

### User Story 4 – Artikel-Navigation zwischen Blog-Posts (Priority: P3)

Auf einer Blog-Post-Detailseite gibt es am Ende des Artikels Vor-/Zurück-Links zu benachbarten Artikeln (nach Datum geordnet). Wenn ein Artikel im Frontmatter einen vollständigen Link zur anderssprachigen Version enthält (`alternateLanguageUrl`), wird zusätzlich ein „Diesen Artikel auf [Sprache] lesen"-Link angezeigt. Die Slugs von Deutsch und Englisch sind bewusst unterschiedlich für SEO; die Verknüpfung erfolgt daher über den expliziten Ziel-Link, nicht über einen gemeinsamen Key.

**Why this priority**: Verbessert Lesbarkeit und Verweildauer; bietet doppelsprachigen Lesern einen direkten Weg zur anderssprachigen Version eines Artikels.

**Independent Test**: Blog-Post-Seite auf `/de/blog/[slug]` zeigt „Nächster Artikel" / „Voriger Artikel" Links. Ein Artikel mit `alternateLanguageUrl: "/en/blog/my-english-slug"` zeigt einen Link zur englischen Version mit anderem Slug.

**Acceptance Scenarios**:

1. **Given** Besucher liest einen Blog-Post auf `/de/blog/[slug]`, **Then** sieht er am Seitenende einen Link zum nächst-älteren und nächst-neueren Artikel (sofern vorhanden), jeweils innerhalb der gleichen Sprache.
2. **Given** der aktuelle Post enthält `alternateLanguageUrl: "/en/blog/some-other-slug"`, **Then** erscheint auf der deutschen Seite ein Hinweis „Read in English" mit genau diesem Ziel-Link und umgekehrt.
3. **Given** ein Post enthält kein `alternateLanguageUrl`, **Then** erscheint kein Sprachversions-Link (kein leerer Hinweis).
4. **Given** es gibt keinen älteren Artikel, **Then** erscheint der „Voriger Artikel"-Bereich nicht (kein toter Link).

---

### User Story 5 – Bestehende Now-Einträge exemplarisch für beide Sprachen aufbereiten (Priority: P3)

Alle vorhandenen Now-Einträge sind ausschließlich auf Deutsch verfasst. Im Rahmen dieses Features werden sie mit einem `lang: de`-Feld versehen, sodass sie nur noch im deutschen Now-Bereich erscheinen. Für jeden Inhaltstyp (reiner Text, Zitat, Bild, YouTube-Einbettung, Meinung) wird mindestens ein repräsentativer englischer Begleit-Eintrag angelegt, der denselben Informationsgehalt in englischer Sprache trägt. Diese Beispiel-Einträge dienen als Referenz für künftige zweisprachige Ergänzungen.

**Why this priority**: Ohne exemplarische EN-Einträge bleibt der englische Now-Bereich leer – ein deutlich schlechteres Nutzererlebnis für englischsprachige Besucher.

**Independent Test**: `/en/now` zeigt nach der Änderung mindestens vier Einträge (je ein Beispiel für Texteintrag, Zitat, Bildpost und YouTube-Post). `/de/now` zeigt weiterhin alle deutschen Einträge.

**Acceptance Scenarios**:

1. **Given** die Migration abgeschlossen ist, **When** `/de/now` geöffnet wird, **Then** sind alle 8 ursprünglichen Einträge sichtbar und tragen `lang: de`.
2. **Given** die Migration abgeschlossen ist, **When** `/en/now` geöffnet wird, **Then** sind mindestens vier englische Einträge sichtbar (kein leerer Bereich).
3. **Given** ein Now-Eintrag hat `lang: de`, **Then** erscheint er nicht auf `/en/now`.
4. **Given** ein englischer Begleit-Eintrag hat `lang: en` und dasselbe Datum wie sein deutsches Pendant, **Then** erscheint er nur auf `/en/now`.

---

### Edge Cases

- Browser-Sprache ist nicht verfügbar oder kann nicht ausgelesen werden → Fallback auf Englisch (`/en`).
- Now-Eintrag hat ungültigen `lang`-Wert (z. B. `lang: fr`) → Eintrag erscheint auf beiden Sprachversionen als Fallback.
- Direktlink auf `/de/blog/[slug]` für einen Artikel, der nur in Englisch existiert → keine Weiterleitung, Seite bleibt in Deutsch (kein 404).
- Besucher deaktiviert JavaScript → automatische Spracherkennung (clientseitig) greift nicht; die gespeicherte Präferenz kann nicht gelesen werden. Die Root-Seite `/` muss in diesem Fall auf eine sinnvolle Standardsprache (Englisch) fallen.
- Gespeicherte Sprachpräferenz ist ein unbekannter Wert (manipulierte localStorage-Daten) → wird ignoriert, Fallback auf Browser-Sprache / Englisch.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Die Root-URL (`/`) MUSS die bevorzugte Sprache des Besuchers ermitteln und auf `/de` oder `/en` weiterleiten.
- **FR-002**: Die Sprachermittlung MUSS eine dauerhaft gespeicherte Benutzerpräferenz vorrangig gegenüber der Browser-Sprache verwenden.
- **FR-003**: Der Sprachschalter im Header MUSS beim Wechsel die neue Sprachpräferenz dauerhaft persistieren.
- **FR-004**: Der Sprachschalter MUSS zur semantisch entsprechenden Seite in der anderen Sprache wechseln (z. B. `/de/about` → `/en/about`), nicht zur Startseite der anderen Sprache.
- **FR-005**: Die Now-Seite (`/de/now` und `/en/now`) MUSS alle UI-Labels aus der zentralen i18n-Quelle (`src/i18n.ts`) beziehen, kein hartkodierter Text.
- **FR-006**: Das Content-Schema für Now-Einträge MUSS ein optionales `lang`-Feld (`"de"` | `"en"`) unterstützen.
- **FR-007**: Die Now-Seiten MÜSSEN Einträge nach `lang`-Feld filtern: Einträge der passenden Sprache + Einträge ohne `lang`-Feld werden angezeigt; Einträge der anderen Sprache werden ausgeblendet.
- **FR-008**: Blog-Post-Seiten MÜSSEN am Ende des Artikels Navigationslinks (Voriger / Nächster Artikel) innerhalb derselben Sprachversion anzeigen.
- **FR-009**: Das Blog-Post-Frontmatter MUSS ein optionales Feld `alternateLanguageUrl` unterstützen, das den vollständigen internen Link zur anderssprachigen Version enthält.
- **FR-010**: Blog-Post-Seiten MÜSSEN, wenn `alternateLanguageUrl` gesetzt ist, einen Link zur anderen Sprachversion mit genau diesem Ziel anzeigen, auch wenn der Slug der Zielseite vom Ursprungsslug abweicht.
- **FR-011**: Alle neuen i18n-Strings (Navigationsbezeichnungen, Accessibility-Labels) MÜSSEN in beiden Sprachen in `src/i18n.ts` gepflegt sein.
- **FR-012**: Alle bestehenden Now-Einträge MÜSSEN das Feld `lang: de` erhalten, sodass sie ausschließlich auf der deutschen Now-Seite erscheinen.
- **FR-013**: Für jeden vorhandenen Now-Inhaltstyp (reiner Text, Zitat + Bild, YouTube-Einbettung, Zitat + Meinung) MUSS mindestens ein englischer Begleit-Eintrag mit `lang: en` in `src/content/now/` angelegt werden.
- **FR-014**: Das `label`-Feld englischer Now-Einträge MUSS ein englisches Datumsformat verwenden (z. B. „Oct 18, 2025" statt „18. Okt 2025").

### Key Entities

- **Sprachpräferenz** (clientseitig gespeichert): Wert `"de"` oder `"en"`, persistiert über Browser-Neustarts hinaus. Wird beim Language-Switch gesetzt, beim Root-Redirect ausgelesen.
- **Now-Eintrag**: Markdown-Dokument in `src/content/now/`. Trägt optional das Feld `lang: "de" | "en"`. Einträge ohne Feld gelten als sprachunabhängig.
- **Blog-Post**: Markdown/MDX-Dokument in `src/content/blog/`. Trägt optional das Feld `alternateLanguageUrl: string`, das direkt auf die anderssprachige Version verweist.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Ein Besucher mit Browser-Sprache `en` landet nach dem ersten Aufruf von `toadle.me/` auf der englischen Startseite, ohne manuelle Aktion.
- **SC-002**: Ein Besucher, der die Sprache über den Schalter aktiv gewählt hat, sieht beim nächsten Besuch sofort die zuletzt gewählte Sprachversion.
- **SC-003**: Auf `/en/now` sind 100 % der sichtbaren UI-Texte (Titel, Lead, Zeitstempel-Labels) auf Englisch.
- **SC-004**: Now-Einträge mit `lang: de` erscheinen ausschließlich auf `/de/now`, gemessen an vollständiger Abwesenheit auf `/en/now`.
- **SC-005**: Blog-Posts mit gesetztem `alternateLanguageUrl` zeigen auf 100 % dieser Seiten einen funktionierenden Sprachversions-Link mit dem exakt im Frontmatter hinterlegten Zielpfad.
- **SC-006**: Prev/Next-Navigation auf Blog-Post-Seiten zeigt niemals Links zu Posts einer anderen Sprachversion.
- **SC-007**: Die Lighthouse-Scores für alle geänderten Seiten bleiben ≥ 90 in allen vier Kategorien (vgl. Prinzip III der Constitution).
- **SC-008**: Alle neuen UI-Strings existieren in `src/i18n.ts` für `de` und `en` — kein hartcodierter String in Komponenten-Dateien (Constitution Prinzip IV).
- **SC-009**: `/en/now` zeigt nach Abschluss des Features mindestens vier Einträge, die alle vier Now-Inhaltstypen abdecken.

---

## Assumptions

- Die Browser-Spracherkennung erfolgt clientseitig (JavaScript `navigator.language`). Bei deaktiviertem JavaScript wird `/` weiterhin auf `/en` weitergeleitet (statischer Fallback).
- Die Persistierung der Sprachpräferenz erfolgt über `localStorage` (keine Cookies notwendig, da kein Server-State erforderlich).
- Now-Einträge sind primär deutschsprachig; das `lang`-Feld ist optional und wird schrittweise beim Anlegen neuer Einträge gesetzt. Bestehende Einträge ohne `lang` erscheinen weiterhin in beiden Sprachversionen.
- Blog-Posts ohne `alternateLanguageUrl` erhalten keine anderssprachige Verlinkung – das ist bewusstes Verhalten, kein Fehler.
- Der Sprachschalter im Header existiert bereits (`src/components/Header/Header.astro`) und erzeugt bereits einen Link zur anderen Sprachversion; er muss um die Persistierungs-Logik erweitert werden.
- Prev/Next-Navigation wird ausschließlich auf Blog-Post-Seiten eingeführt. Now-Einträge erhalten keine Einzel-Detailseite und keine Artikel-Navigation.
- `alternateLanguageUrl` verweist auf einen internen Seitenpfad (`/de/...` oder `/en/...`) und wird redaktionell pro Artikel gepflegt.
- Die englischen Now-Begleit-Einträge sind inhaltliche Paraphrasen, keine maschinellen Übersetzungen. Sie müssen nicht wortgetreu sein, aber denselben Informationsgehalt transportieren.
- Bestehende Now-Einträge ohne englisches Pendant werden nicht übersetzt; nur die vier Inhaltstypen werden exemplarisch abgedeckt.
