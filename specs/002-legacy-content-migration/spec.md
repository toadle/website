# Feature Specification: Legacy-Content-Migration aus `../website_old`

**Feature Branch**: `[002-legacy-content-migration]`  
**Created**: 2026-04-11  
**Status**: Draft  
**Input**: User description zur Übernahme von About/Work/Open Source/Veröffentlichungen inkl. Übersetzungen und einspaltiger About-Seite

## User Scenarios & Testing *(mandatory)*

### User Story 1 - About-Inhalte aus Legacy übernehmen (Priority: P1)

Als Besucher möchte ich die inhaltlich starken About-Inhalte aus der Legacy-Seite wiederfinden, damit mein Eindruck der Person, Erfahrung und Arbeitsweise vollständig bleibt.

**Why this priority**: About ist ein zentraler Vertrauens- und Conversion-Bereich.

**Independent Test**: Die Inhalte aus den Legacy-Quellen sind in der neuen About-Seite vorhanden: Introtext (DE/EN), berufliche Stationen, "Das kann ich"-Bereich mit den Kategorien Frontend/Backend/Datenbanken/Third Parties/Methoden.

**Acceptance Scenarios**:

1. **Given** die Quellen `app/views/about_me/_intro.de.html.erb` und `app/views/about_me/_intro.en.html.erb`, **When** ich `/de/about` und `/en/about` lese, **Then** sind die Kernaussagen der Introtexte in beiden Sprachen enthalten.
2. **Given** die Quelle `app/views/about_me/index.html.erb`, **When** ich die neue About-Seite öffne, **Then** finde ich die "Das kann ich"-Sektion in ähnlicher Struktur mit den fünf Legacy-Kategorien.
3. **Given** die Legacy-CV-Stationen in `app/views/about_me/index.html.erb`, **When** ich die neue About-Seite lese, **Then** sind diese Stationen als konsolidierte Berufserfahrung abgebildet.

---

### User Story 2 - About einspaltig gestalten (Priority: P1)

Als Besucher möchte ich auf About eine klare einspaltige Leseführung ohne Zweispaltigkeit, damit die Seite ruhiger und besser lesbar ist.

**Why this priority**: Das ist eine explizite inhaltlich-visuelle Anforderung.

**Independent Test**: Auf `/de/about` und `/en/about` gibt es im Hauptinhalt keine zweispaltige Aufteilung mehr.

**Acceptance Scenarios**:

1. **Given** das Legacy-Layout basiert auf Bootstrap-Spalten (`col-md-*`), **When** ich die neue About-Seite öffne, **Then** wird der Content einspaltig geführt.
2. **Given** Desktop- und Mobile-Ansicht, **When** ich scrolle, **Then** bleibt die inhaltliche Reihenfolge ohne Spaltenwechsel konsistent.

---

### User Story 3 - Work, Veröffentlichungen und Open Source übernehmen (Priority: P1)

Als Besucher möchte ich die Legacy-Inhalte zu Arbeitsansatz, Veröffentlichungen und Open-Source-Projekten auf der neuen Seite sehen, damit das Profil fachlich vollständig ist.

**Why this priority**: Diese Inhalte sind zentral für Glaubwürdigkeit und Differenzierung.

**Independent Test**: Work-Seite enthält den Legacy-Topline/Headline/Intro-Inhalt sowie die Bereiche Veröffentlichungen, Open Source und Startup-/Projektbeispiele inkl. repräsentativer Einträge aus `data/projects.yml`, inklusive der dafür benötigten Bilder.

**Acceptance Scenarios**:

1. **Given** `app/views/work/index.html.erb` und `config/locales/{de,en}.yml`, **When** ich `/de/work` und `/en/work` öffne, **Then** sind Headline, Intro und Bereichstexte inhaltlich übernommen.
2. **Given** Legacy-Publikationen (Buch + Podcasts) in `app/views/work/index.html.erb`, **When** ich die neue Work-Seite lese, **Then** ist ein Veröffentlichungsbereich mit diesen Inhalten vorhanden.
3. **Given** Open-Source-Daten in `data/projects.yml` (`giant_bomb_api`, `select(bf)`, `lit`), **When** ich den Open-Source-Bereich öffne, **Then** sind diese Projekte mit Titel, Kurzbeschreibung und Link sichtbar.
4. **Given** Projektbeispiele in `data/projects.yml` (`all`), **When** ich die Projektsektion öffne, **Then** sind repräsentative Referenzen mit Jahr und Kurzbeschreibung integriert.
5. **Given** Legacy-Inhalte enthalten benötigte Bilder (z. B. About-Portrait und Publikationsbilder), **When** ich die neue Seite öffne, **Then** sind diese Bilder verfügbar, korrekt referenziert und nicht als fehlende Assets sichtbar.

---

### User Story 4 - Blog-Inhalte aus Contentful in die neue Seite migrieren (Priority: P2)

Als Leser möchte ich, dass die bisherigen Blog-Inhalte aus dem Legacy-Setup in der neuen Seite verfügbar sind, damit kein redaktioneller Verlust entsteht.

**Why this priority**: Blog ist zentraler Content-Bestandteil; Altbestand darf nicht verloren gehen.

**Independent Test**: Die neue Blog-Sektion enthält den migrierten Altbestand (inkl. Metadaten), und die Contentful-Abhängigkeit ist für den neuen Betrieb nicht mehr erforderlich.

**Acceptance Scenarios**:

1. **Given** Legacy-Blog ist über Contentful angebunden (`app/controllers/blog_controller.rb`, `app/services/contentful_service.rb`), **When** die Migration abgeschlossen ist, **Then** liegen die Inhalte in der neuen Website lokal vor.
2. **Given** Legacy-Zugangsdaten liegen in `../website_old/.env`, **When** die Migration dokumentiert wird, **Then** werden keine Secrets in Repository-Dateien der neuen Website übernommen oder angezeigt.
3. **Given** migrierte Blogposts, **When** ich `/de/blog` und `/en/blog` öffne, **Then** sind Inhalte konsistent auffindbar und lesbar.

---

### User Story 5 - Fehlende Übersetzungen vervollständigen (Priority: P2)

Als deutsch- oder englischsprachiger Besucher möchte ich die migrierten Inhalte vollständig in meiner Sprache sehen, damit die Seite in beiden Sprachversionen gleichwertig ist.

**Why this priority**: Zweisprachigkeit ist laut Projektprinzipien zwingender Qualitätsfaktor.

**Independent Test**: Für alle übernommenen Inhaltsblöcke aus About/Work/Open Source/Veröffentlichungen/Blog existieren DE- und EN-Fassungen ohne Platzhalter.

**Acceptance Scenarios**:

1. **Given** ein Legacy-Inhaltsblock existiert nur in einer Sprache, **When** die Migration abgeschlossen ist, **Then** ist die fehlende Übersetzung ergänzt.
2. **Given** Sprachwechsel zwischen `/de/*` und `/en/*`, **When** ich korrespondierende Seiten vergleiche, **Then** stimmen Struktur und Kernaussagen überein.

### Edge Cases

- Legacy-Texte enthalten sprachliche Qualitätsschwächen oder Tippfehler und müssen redaktionell bereinigt werden, ohne Aussageverlust.
- Legacy-Daten sind über View-Templates, Locale-Dateien und YAML verteilt und müssen vor Übernahme dedupliziert werden.
- Einträge in `data/projects.yml` enthalten uneinheitliche Formulierungen zwischen DE und EN.
- Blog-Migration erfordert Zugriff auf Altinhalte, darf aber keine Zugangsdaten in die neue Codebasis übernehmen.
- Legacy-Bilder liegen teils lokal, teils extern referenziert und müssen vor der Migration auf Vollständigkeit, Rechte und Zielpfad geprüft werden.
- Einzelne Bilddateien können in Legacy-Views referenziert sein, aber im Zielprojekt noch fehlen.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Inhalte aus `../website_old/app/views/about_me/index.html.erb` sowie den Intro-Partials (`_intro.de.html.erb`, `_intro.en.html.erb`) MÜSSEN in die neue About-Seite übernommen werden.
- **FR-002**: Die About-Seite MUSS im Hauptinhalt einspaltig umgesetzt werden.
- **FR-003**: Die "Das kann ich"-Sektion MUSS in ähnlicher Form mit den Legacy-Kategorien Frontend, Backend, Datenbanken, Third Parties und Methoden enthalten sein.
- **FR-004**: Inhalte aus `../website_old/app/views/work/index.html.erb` MÜSSEN in die neue Work-Seite übernommen werden, einschließlich Bereiche Veröffentlichungen, Open Source und Projekt-/Startup-Beispiele.
- **FR-005**: Open-Source-Projekte aus `../website_old/data/projects.yml` (`open_source`) MÜSSEN übernommen werden.
- **FR-006**: Repräsentative Projektbeispiele aus `../website_old/data/projects.yml` (`all`) MÜSSEN übernommen werden.
- **FR-007**: Blog-Inhalte aus dem Legacy-Contentful-Setup MÜSSEN in die neue Website migriert werden.
- **FR-008**: Die neue Website DARF Contentful nicht mehr als Laufzeit- oder Hosting-Quelle nutzen; Inhalte MÜSSEN statisch in der neuen Website enthalten sein.
- **FR-009**: Für alle migrierten Inhalte MÜSSEN deutsche und englische Versionen vorliegen; fehlende Übersetzungen MÜSSEN ergänzt werden.
- **FR-010**: Es DÜRFEN keine Zugangsdaten oder Tokens aus `../website_old/.env` in die neue Website übernommen oder veröffentlicht werden.
- **FR-011**: Migrierte Inhalte MÜSSEN konsistent strukturiert, navigierbar und ohne Platzhalter auf den Zielseiten sichtbar sein.
- **FR-012**: Für die migrierten Inhalte benötigte Bilder MÜSSEN aus der Legacy-Quelle in das neue statische Projekt übernommen oder durch gleichwertige, zulässige Zielassets ersetzt werden.
- **FR-013**: Alle migrierten Bilder MÜSSEN auf den Zielseiten korrekt eingebunden sein und aussagekräftige Alternativtexte erhalten (dekorative Bilder mit leerem Alt-Text).

### Key Entities *(include if feature involves data)*

- **Legacy-About-Content**: Introtexte, Skills/Kategorien, CV-/Erfahrungsblöcke aus den About-Views.
- **Legacy-Work-Content**: Topline/Headline/Intro, Veröffentlichungsblöcke, Open-Source- und Startup-/Projektsektionen aus Work-View + Locale-Texten.
- **Legacy-Projektdatensatz**: Einträge aus `data/projects.yml` mit Titel, Text, Link, Jahr und Technologien.
- **Legacy-Blog-Post**: Inhaltseinheit aus Contentful-basiertem Legacy-Blog inkl. Metadaten.
- **Sprachvariante**: DE/EN-Fassung einer migrierten Inhaltseinheit.
- **MigratedMediaAsset**: Migriertes Bild-Asset mit Quelle, Zielpfad, Verwendungsstellen und Alt-Text-Regel.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100 % der definierten About-Kerninhalte (Intro, "Das kann ich", Berufserfahrung) sind auf `/de/about` und `/en/about` vorhanden.
- **SC-002**: 0 zweispaltige Hauptinhaltsbereiche auf den About-Seiten in DE und EN.
- **SC-003**: 100 % der übernommenen Work-Inhaltsblöcke (Headline/Intro, Veröffentlichungen, Open Source, Projekte) sind in DE und EN vorhanden.
- **SC-004**: Mindestens die drei Legacy-Open-Source-Projekte (`giant_bomb_api`, `select(bf)`, `lit`) sind in der neuen Seite sichtbar.
- **SC-005**: 100 % der migrierten Inhaltsblöcke besitzen eine DE- und EN-Version ohne Platzhaltertexte.
- **SC-006**: 0 Secrets aus Legacy-`.env` in der neuen Codebasis oder Spezifikationsartefakten.
- **SC-007**: 0 produktive Laufzeitabhängigkeiten zu Contentful in der neuen Website; alle migrierten Inhalte werden statisch ausgeliefert.
- **SC-008**: 100 % der für About/Work/Publikationen/Open Source benötigten Bildreferenzen zeigen auf gültige, im Zielprojekt verfügbare Assets (keine Broken Images).

## Assumptions

- `../website_old` bleibt während der Migration lokal verfügbar.
- Legacy-Blog-Inhalte sind technisch extrahierbar; konkrete Extraktionsmethode wird in der Planungsphase festgelegt.
- Contentful wird ausschließlich als einmalige Legacy-Quelle für die Migration verwendet, nicht als Zielarchitektur der neuen Seite.
- "In ähnlicher Form" bei "Das kann ich" bedeutet ähnliche Informationsarchitektur und Lesbarkeit, nicht 1:1 visuelle Kopie.
- Inhaltliche Qualität hat Vorrang vor wortwörtlicher Übernahme; redaktionelle Glättung ist zulässig, solange Kernaussagen erhalten bleiben.
