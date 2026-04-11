# Feature Specification: Sprachgetrennte Content-Ordner fuer Blog und Now

**Feature Branch**: `[003-split-locale-content]`  
**Created**: 2026-04-11  
**Status**: Draft  
**Input**: User description: "EN and DE content should not be mixed in the same folders for blog and now. There should be subfolders de and en with just the files in that language. Files in blog should be named as their slug later on the website"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Blog und Now nach Sprache trennen (Priority: P1)

Als Content-Verantwortlicher moechte ich, dass Blog- und Now-Inhalte je Sprache getrennt organisiert sind, damit Inhalte leichter gepflegt werden und keine Sprachmischung mehr entsteht.

**Why this priority**: Das ist die direkte Kernanforderung und reduziert sofort Pflegefehler.

**Independent Test**: Kann vollstaendig getestet werden, indem fuer Blog und Now nur sprachreine Unterordner verwendet werden und im jeweiligen Ordner ausschliesslich passende Sprachinhalte liegen.

**Acceptance Scenarios**:

1. **Given** bestehende gemischte Inhalte in Blog oder Now, **When** die Struktur angepasst ist, **Then** liegen Inhalte nur noch in sprachspezifischen Unterordnern.
2. **Given** ein deutscher Inhalt, **When** ich die Ordnerstruktur pruefe, **Then** liegt er nur im deutschen Unterordner und nicht im englischen.
3. **Given** ein englischer Inhalt, **When** ich die Ordnerstruktur pruefe, **Then** liegt er nur im englischen Unterordner und nicht im deutschen.

---

### User Story 2 - Blog-Dateinamen folgen dem spaeteren Slug (Priority: P1)

Als Editor moechte ich, dass Blog-Dateinamen bereits dem spaeteren URL-Slug entsprechen, damit Dateiname und oeffentliche URL konsistent sind.

**Why this priority**: Das minimiert Mapping-Aufwand und vermeidet spaetere Umbenennungsfehler.

**Independent Test**: Kann vollstaendig getestet werden, indem jeder Blog-Dateiname mit dem finalen Slug uebereinstimmt und keine zusaetzlichen Namenssuffixe fuer Sprache enthaelt.

**Acceptance Scenarios**:

1. **Given** ein Blogpost mit einem finalen Slug, **When** ich den Dateinamen pruefe, **Then** entspricht der Dateiname genau diesem Slug.
2. **Given** DE- und EN-Versionen eines Blogposts, **When** ich beide Dateinamen pruefe, **Then** ist der Slug-Name identisch und die Sprachtrennung erfolgt ueber den jeweiligen Sprachordner.

---

### User Story 3 - Sprachreine Auslieferung ohne Mischlisten (Priority: P2)

Als Leser moechte ich pro Sprachbereich nur Inhalte meiner Sprache sehen, damit ich keine gemischten Listen oder Verweise erhalte.

**Why this priority**: Verbessert die Nutzerfuehrung und verhindert Verwirrung in der Navigation.

**Independent Test**: Kann vollstaendig getestet werden, indem Blog- und Now-Listen pro Sprache aufgerufen und auf sprachreine Ergebnisse geprueft werden.

**Acceptance Scenarios**:

1. **Given** die deutsche Inhaltsansicht, **When** ich Blog- oder Now-Listen oeffne, **Then** werden nur deutsche Inhalte angezeigt.
2. **Given** die englische Inhaltsansicht, **When** ich Blog- oder Now-Listen oeffne, **Then** werden nur englische Inhalte angezeigt.

### Edge Cases

- Ein Inhalt hat keine eindeutige Sprachzuordnung und muss vor Migration einer Sprache zugewiesen werden.
- Zwei Inhalte derselben Sprache wuerden auf denselben Slug-Dateinamen kollidieren.
- Einzelne Legacy-Dateien nutzen Sonderzeichen oder uneinheitliche Benennung und muessen auf slug-konforme Namen normalisiert werden.
- Vorhandene interne Verweise zeigen noch auf alte gemischte Pfade.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Das System MUSS fuer Blog-Inhalte getrennte Sprachunterordner fuer Deutsch und Englisch verwenden.
- **FR-002**: Das System MUSS fuer Now-Inhalte getrennte Sprachunterordner fuer Deutsch und Englisch verwenden.
- **FR-003**: Ein Inhalt DARF nicht gleichzeitig in mehreren Sprachordnern liegen, ausser es existiert bewusst eine sprachspezifische Variante je Ordner.
- **FR-004**: Blog-Dateinamen MUESSEN dem finalen Slug der spaeteren Website-URL entsprechen.
- **FR-005**: Blog-Dateinamen DUERFEN keine zusaetzlichen Sprachsuffixe enthalten, wenn die Sprache bereits durch den Ordner bestimmt wird.
- **FR-006**: Inhaltslisten und Detailseiten MUESSEN pro Sprache nur Inhalte aus dem passenden Sprachordner verwenden.
- **FR-007**: Bestehende interne Verlinkungen MUESSEN nach der Umstrukturierung weiterhin gueltig sein.
- **FR-008**: Die Umstrukturierung MUSS ohne Vermischung von DE- und EN-Inhalten in denselben Blog- oder Now-Ordnern abgeschlossen werden.

### Key Entities *(include if feature involves data)*

- **LocalizedContentFolder**: Sprachspezifischer Inhaltsordner fuer einen Bereich (Blog oder Now) mit genau einer Sprache.
- **LocalizedContentFile**: Einzelne Inhaltsdatei mit eindeutigem Sprachkontext durch den Ordner.
- **BlogSlugFile**: Blog-Inhaltsdatei, deren Dateiname dem finalen Slug der oeffentlichen URL entspricht.
- **LocalizedContentListing**: Sprachgebundene Liste von Inhalten, die ausschliesslich passende Sprachdateien aggregiert.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100 % der Blog-Dateien liegen in sprachspezifischen Unterordnern, ohne gemischte DE/EN-Dateien im selben Ordner.
- **SC-002**: 100 % der Now-Dateien liegen in sprachspezifischen Unterordnern, ohne gemischte DE/EN-Dateien im selben Ordner.
- **SC-003**: 100 % der migrierten Blog-Dateinamen entsprechen dem finalen Slug-Namen der jeweiligen URL.
- **SC-004**: In DE-Ansichten erscheinen 0 EN-Eintraege und in EN-Ansichten erscheinen 0 DE-Eintraege.
- **SC-005**: 100 % der betroffenen Blog- und Now-Seiten bauen und rendern ohne Routing- oder Verlinkungsfehler.

## Assumptions

- Die gewuenschten Unterordner sind `de` und `en`; die zweite Nennung `de` in der Anfrage ist ein Tippfehler.
- Bestehende Slugs koennen eindeutig auf Dateinamen abgebildet werden.
- Fuer Blog und Now ist eine sprachgetrennte Ordnerstruktur innerhalb der bestehenden Content-Bereiche zulaessig.
- Existierende Inhalte mit unklarem Sprachstatus werden vor finaler Ablage redaktionell einer Sprache zugeordnet.
