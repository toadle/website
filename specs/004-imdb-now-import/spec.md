# Feature Specification: IMDb Now Ratings Import

**Feature Branch**: `[004-create-feature-branch]`  
**Created**: 2026-04-12  
**Status**: Draft  
**Input**: User description: "Ich möchte meine letzten 50 Bewertungen von IMDB unter URL https://www.imdb.com/de/user/p.mxc4lokahrb4aaejnlqxv5hvcu/ratings/?ref_=hm_nv_rat für die Now-Section importieren. Dazu sollen einzelne Einträge in content/now angelegt werden, jeweils für de und en. Es soll eine Now-Rating-Componente geben, die meine Bewertung anzeigt. Diese Now-Einträge sollen auch weiterhin einen kurzen Text mit meinem Review supporten. Außerdem sollen sie einen Richlink mit Backlink zum bewerteten Film enthalten. Dieser Richlink soll sich später auch noch anderweitig verwenden lassen, wenn ich z.B. Links in der Now-Section empfehlen will. Es reicht, wenn dieser Import jetzt einmalig durchgeführt wird und später nicht dauerhaft laufen muss." 

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Einmaliger Rating-Import (Priority: P1)

Als Site-Owner möchte ich meine letzten 50 IMDb-Bewertungen einmalig in die Now-Inhalte übernehmen, damit aktuelle Film-Referenzen schnell als lokalisierte Now-Einträge vorliegen.

**Why this priority**: Ohne importierte Datensätze gibt es keine inhaltliche Grundlage für Darstellung und Weiterverarbeitung.

**Independent Test**: Kann vollständig getestet werden, indem ein einmaliger Importlauf ausgeführt wird und anschließend 50 inhaltlich valide Now-Einträge in beiden Sprachen vorhanden sind.

**Acceptance Scenarios**:

1. **Given** die IMDb-Bewertungsseite ist erreichbar, **When** der einmalige Import gestartet wird, **Then** werden für die letzten 50 Bewertungen passende Now-Einträge für `de` und `en` angelegt.
2. **Given** einzelne Bewertungen enthalten unvollständige Metadaten, **When** der Import durchgeführt wird, **Then** werden nur valide Einträge übernommen und fehlerhafte Einträge nachvollziehbar ausgewiesen.
3. **Given** bestehende Now-Einträge und importierte Rating-Einträge haben Erstelldaten, **When** die Now-Section dargestellt wird, **Then** werden beide Typen gemeinsam nach Erstelldatum sortiert und bei Bedarf ineinander gemischt.

---

### User Story 2 - Bewertung in Now anzeigen (Priority: P2)

Als Besucher:in möchte ich in einem Now-Eintrag die persönliche Bewertung klar erkennen und bei Bedarf einen kurzen Kommentar lesen, damit ich den Kontext der Empfehlung schnell verstehe.

**Why this priority**: Die Anzeige der Bewertung stiftet direkten Nutzen für Leser:innen und ist Kern der gewünschten Präsentation.

**Independent Test**: Kann unabhängig geprüft werden, indem ein einzelner importierter Now-Eintrag gerendert wird und Bewertung plus optionaler Kurztext sichtbar sind.

**Acceptance Scenarios**:

1. **Given** ein Now-Eintrag enthält eine Bewertung, **When** der Eintrag aufgerufen wird, **Then** zeigt die Now-Rating-Komponente die Bewertung eindeutig an.
2. **Given** ein Now-Eintrag enthält zusätzlich einen Kurztext, **When** der Eintrag angezeigt wird, **Then** erscheint der Kurztext zusammen mit der Bewertung.

---

### User Story 3 - Wiederverwendbarer Richlink (Priority: P3)

Als Site-Owner möchte ich pro Rating-Eintrag einen Richlink mit Backlink zum Film speichern und denselben Link-Typ später auch für andere Now-Empfehlungen nutzen, damit ich einheitliche Link-Bausteine in der Now-Section verwenden kann.

**Why this priority**: Einheitliche Richlinks sichern Konsistenz und reduzieren zukünftigen Pflegeaufwand bei weiteren Link-basierten Now-Inhalten.

**Independent Test**: Kann separat getestet werden, indem Richlink-Daten aus einem Rating-Eintrag in einem nicht-ratingbasierten Now-Inhalt wiederverwendet werden.

**Acceptance Scenarios**:

1. **Given** ein importierter Rating-Eintrag, **When** der Eintrag angezeigt wird, **Then** ist ein Richlink mit Backlink zum bewerteten Film enthalten.
2. **Given** ein späterer Now-Eintrag ohne Rating-Bezug, **When** er einen Richlink nutzt, **Then** folgt dieser dem gleichen Daten- und Darstellungsmodell wie bei Rating-Einträgen.

---

### Edge Cases

- Die IMDb-Seite liefert weniger als 50 Bewertungen; es werden nur verfügbare Bewertungen importiert und die Abweichung wird festgehalten.
- Mehrere Bewertungen zeigen auf denselben Film; Einträge bleiben eindeutig unterscheidbar.
- Einzelne Bewertungen fehlen Pflichtinformationen für Link oder Bewertung; diese Datensätze werden nicht als vollständige Now-Einträge veröffentlicht.
- Einträge existieren bereits aus einem früheren Importlauf; der einmalige Import erzeugt keine unbeabsichtigten Duplikate.
- Bestehende Now-Einträge und neue Rating-Einträge teilen sich identische oder nahe Erstelldaten; die Sortierung bleibt stabil und nachvollziehbar.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Das System MUST einen einmaligen Import der letzten bis zu 50 Bewertungen aus der angegebenen IMDb-Bewertungsquelle unterstützen.
- **FR-002**: Das System MUST für jede importierte Bewertung je einen Now-Eintrag für `de` und `en` bereitstellen.
- **FR-003**: Das System MUST pro importiertem Eintrag die persönliche Bewertung als strukturierte Information speichern.
- **FR-004**: Nutzer:innen MUST die persönliche Bewertung in der Now-Rating-Komponente eindeutig erkennen können.
- **FR-005**: Das System MUST pro Rating-Eintrag weiterhin einen optionalen kurzen Review-Text unterstützen.
- **FR-006**: Das System MUST pro Rating-Eintrag einen Richlink mit Backlink zum bewerteten Film enthalten.
- **FR-007**: Das Richlink-Modell MUST so definiert sein, dass es auch in anderen Now-Einträgen ohne Rating-Kontext verwendet werden kann.
- **FR-008**: Das System MUST beim Import unvollständige oder fehlerhafte Datensätze nachvollziehbar behandeln, ohne valide Datensätze zu blockieren.
- **FR-009**: Das System MUST die Reihenfolge der importierten Einträge an der IMDb-Quelle orientieren, sodass die zuletzt bewerteten Filme zuerst verfügbar sind.
- **FR-010**: Das Feature MUST keine dauerhafte oder automatische Synchronisierung erfordern; der Import ist ein manuell ausgelöster Einmalvorgang.
- **FR-011**: Das System MUST bestehende Now-Einträge und Rating-Einträge bei der Ausgabe gemeinsam nach Erstelldatum sortieren, sodass beide Inhaltstypen bei Bedarf ineinander eingeordnet werden.

### Key Entities *(include if feature involves data)*

- **Now Rating Entry**: Ein lokalisierter Now-Inhaltseintrag mit Bewertung, optionalem Kurzreview und Referenz auf einen Film.
- **Richlink**: Wiederverwendbarer Link-Baustein mit Linkziel, Linktext und Metadaten zur Darstellung inkl. Backlink-Funktion.
- **Imported Rating Record**: Datensatz einer IMDb-Bewertung, aus dem ein oder mehrere lokalisierte Now-Einträge abgeleitet werden.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In einem Importlauf werden 100% der verfügbaren Bewertungen bis maximal 50 als verwertbare Datensätze verarbeitet oder mit Grund als nicht verwertbar dokumentiert.
- **SC-002**: Für mindestens 95% der erfolgreich verarbeiteten Bewertungen existieren nach dem Import vollständige lokalisierte Now-Einträge in `de` und `en`.
- **SC-003**: 100% der veröffentlichten Rating-Einträge zeigen die persönliche Bewertung in der Now-Rating-Komponente sichtbar und konsistent an.
- **SC-004**: 100% der veröffentlichten Rating-Einträge enthalten einen funktionierenden Richlink mit Backlink zum bewerteten Film.
- **SC-005**: Ein zusätzlicher, nicht-ratingbasierter Now-Eintrag kann denselben Richlink-Typ ohne schema-spezifische Sonderbehandlung verwenden.
- **SC-006**: In einer gemischten Now-Ansicht werden bestehende und importierte Rating-Einträge in 100% der geprüften Fälle korrekt nach Erstelldatum zusammengeführt dargestellt.

## Assumptions

- Die angegebene IMDb-Quelle ist zum Zeitpunkt des einmaligen Imports erreichbar und liefert die benötigten öffentlich sichtbaren Bewertungsdaten.
- Für den einmaligen Import ist keine kontinuierliche Aktualisierung, zeitgesteuerte Ausführung oder Hintergrund-Synchronisation erforderlich.
- Falls lokale Filmtexte (z. B. Titelvarianten) nicht für beide Sprachen differenzierbar sind, darf derselbe Filmbezug in `de` und `en` genutzt werden.
- Bestehende Now-Inhalte außerhalb der importierten Rating-Einträge bleiben unverändert.
