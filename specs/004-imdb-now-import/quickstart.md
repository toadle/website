# Quickstart: IMDb Ratings in Now importieren

## 1) Import vorbereiten
1. IMDb-Quell-URL und Importumfang (maximal 50 Eintraege) festlegen.
2. Zielstruktur pruefen:
   - `src/content/now/de/`
   - `src/content/now/en/`
3. Sicherstellen, dass bestehende Now-Eintraege weiterhin gueltige `date`-Werte besitzen.
4. Browser-Snapshot als JSON ablegen:
   - `specs/004-imdb-now-import/imdb-ratings-snapshot.json`

## 2) Einmaligen Import ausfuehren
1. Import manuell starten.
   - `npm run import:imdb-now -- --input=specs/004-imdb-now-import/imdb-ratings-snapshot.json --limit=50`
2. Pro gueltigem Quelldatensatz je einen `de`- und `en`-Now-Eintrag erzeugen.
3. Bewertung als strukturierte Rating-Daten und optionalen Kurzreview uebernehmen.
4. Richlink mit Backlink auf den bewerteten Film pro Eintrag anlegen.

## 3) Timeline-Verhalten verifizieren
1. DE-Now-Seite oeffnen und Reihenfolge pruefen.
2. EN-Now-Seite oeffnen und Reihenfolge pruefen.
3. Sicherstellen, dass bestehende und neue Rating-Eintraege gemeinsam nach Erstelldatum sortiert sind und bei Bedarf ineinander erscheinen.

## 4) Komponentendarstellung pruefen
1. In einem importierten Eintrag wird die Bewertung sichtbar dargestellt.
2. Optionaler Kurzreview wird dargestellt, wenn vorhanden.
3. Richlink ist sichtbar und fuehrt auf den bewerteten Film.

## 5) Fehler- und Vollstaendigkeitspruefung
1. Uebersicht der verarbeiteten, uebersprungenen und fehlgeschlagenen Datensaetze erstellen.
2. Sicherstellen, dass valide Datensaetze nicht durch fehlerhafte blockiert wurden.
3. Ergebnis gegen die Success Criteria in der Spezifikation pruefen.
4. Build-Check ausfuehren:
   - `npm run build`
