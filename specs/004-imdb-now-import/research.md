# Research: IMDb Now Ratings Import

## Decision 1: Einmaliger, manueller Importlauf
- Decision: Der IMDb-Ratings-Import wird als einmalig manuell ausgeloester Lauf umgesetzt, ohne Scheduler oder dauerhafte Synchronisation.
- Rationale: Entspricht FR-010, reduziert Betriebsaufwand und vermeidet unnötige Runtime-Komplexitaet.
- Alternatives considered: Regelmaessige Synchronisierung (verworfen wegen explizit out-of-scope), on-demand Live-Fetch beim Seitenaufruf (verworfen wegen Static-First-Prinzip).

## Decision 2: Importziel sind lokalisierte Now-Inhalte in beiden Sprachen
- Decision: Jede importierte Bewertung erzeugt je einen Now-Eintrag fuer `de` und `en` unter `src/content/now/de/` und `src/content/now/en/`.
- Rationale: Erfuellt FR-002 und bleibt kompatibel zum bestehenden i18n- und Content-Ordner-Modell.
- Alternatives considered: Nur eine Sprache importieren (verworfen wegen fehlender Paritaet), gemeinsame sprachneutrale Datei (verworfen wegen bestehender Locale-Struktur).

## Decision 3: Bewertung und Kurzreview als strukturierte Rating-Daten
- Decision: Now-Rating-Eintraege enthalten die persoenliche Bewertung als Pflichtfeld und optionalen Kurzreview-Text.
- Rationale: Erfuellt FR-003 bis FR-005 und erlaubt klare Darstellung in einer dedizierten Komponente.
- Alternatives considered: Bewertung nur im Fliesstext (verworfen wegen schlechter maschineller Auswertbarkeit), kein Kurzreview-Support (verworfen wegen Produktanforderung).

## Decision 4: Richlink als wiederverwendbarer, generischer Link-Baustein
- Decision: Ein separates Richlink-Datenmodell mit Backlink zum Film wird definiert und so gestaltet, dass es auch fuer nicht-ratingbasierte Now-Empfehlungen genutzt werden kann.
- Rationale: Erfuellt FR-006 und FR-007; verhindert Spezialfaelle nur fuer IMDb-Ratings.
- Alternatives considered: IMDb-Link direkt als einfacher Textlink im Rating-Eintrag (verworfen wegen fehlender Wiederverwendbarkeit).

## Decision 5: Gemeinsame Timeline-Sortierung nach Erstelldatum
- Decision: Bestehende Now-Eintraege und neue Rating-Eintraege werden in derselben Ausgabe strikt nach Erstelldatum zusammengefuehrt.
- Rationale: Erfuellt FR-011 und das Szenario der ineinander sortierten Eintraege.
- Alternatives considered: Getrennte Listen pro Typ (verworfen, da Anforderung explizit gemischte Sortierung fordert).

## Decision 6: Fehlerhafte Quelldaten werden dokumentiert, valide Daten nicht blockiert
- Decision: Unvollstaendige Quelldatensaetze werden beim Import protokolliert/markiert; valide Datensaetze laufen weiter durch.
- Rationale: Erfuellt FR-008 und stellt robuste Einmallaeufe sicher.
- Alternatives considered: Importabbruch beim ersten Fehler (verworfen wegen schlechter Nutzbarkeit und niedriger Daten-Ausbeute).

## Decision 7: Datenextraktion im Browser-Kontext statt Plain-HTTP
- Decision: Die Extraktion erfolgt ueber einen JS-faehigen Browser-Kontext, nicht ueber einen simplen HTTP-Fetch.
- Rationale: Exemplarischer Abruf zeigte, dass Plain-HTTP auf der IMDb-URL in einen WAF/Robot-Check laeuft, waehrend im Browser die benoetigten Felder sichtbar sind.
- Verified signals: Pro Rating-Eintrag sind mindestens `Titel-Link`, `Nutzerbewertung` und `Bewertet am` verfuegbar.
- Alternatives considered: Nur serverseitiger HTML-Download ohne JS (verworfen wegen Blockierung und fehlender Zuverlaessigkeit).
