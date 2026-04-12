# Contract: Now Rating + Richlink

## Purpose
Verbindlicher Vertrag fuer importierte IMDb-Rating-Eintraege in der Now-Section inklusive wiederverwendbarem Richlink.

## Input Contract (Import)
- Quelle: IMDb-Ratings-Seite des Owners.
- Umfang: bis zu 50 zuletzt bewertete Eintraege.
- Zugriff: Importfaehiger Abruf muss im JS-faehigen Browser-Kontext erfolgen, da Plain-HTTP-Abrufe auf der Quelle durch Robot-/WAF-Checks blockiert sein koennen.
- Jeder Importdatensatz muss enthalten:
  - Filmreferenz (`filmTitle`, `filmUrl`)
  - persoenliche Bewertung (`ratingValue`, `ratingScaleMax`)
  - zeitliche Einordnung (`ratedAt` oder gleichwertiges Erstelldatum)

## Content Contract (Now Entry)
Fuer jeden gueltigen Datensatz entstehen zwei lokalisierte Eintraege (`de`, `en`) mit:
- `date` (sortierfaehiges Erstelldatum)
- `label` (lokalisiertes Datumslabel)
- strukturierter `rating`
- optionalem Kurzreview
- `richlink` mit Backlink zum bewerteten Film

## Richlink Contract
Ein Richlink besteht mindestens aus:
- `title` (Anzeigetext)
- `url` (Ziel-URL)
- `kind` (Typklassifikation)
- `backlink` (Rueckverweis aktiv)

Richlinks muessen auch ausserhalb von Rating-Eintraegen in der Now-Section nutzbar sein, ohne Schemaaenderung.

## Rendering Contract
- Die Now-Rating-Komponente zeigt die persoenliche Bewertung konsistent und eindeutig an.
- Der optionale Kurzreview wird nur angezeigt, wenn Inhalt vorhanden ist.
- Richlink wird als klickbarer Verweis auf das Filmziel ausgegeben.

## Ordering Contract
- Bestehende Now-Eintraege und Rating-Eintraege werden in einer gemeinsamen Timeline dargestellt.
- Sortierung erfolgt absteigend nach Erstelldatum.
- Bei Datums-Gleichstand ist eine stabile Tie-Break-Regel verpflichtend.

## Error Handling Contract
- Unvollstaendige Datensaetze werden als `skipped` markiert und mit Grund dokumentiert.
- Valide Datensaetze muessen trotz einzelner Fehler weiter verarbeitet werden.

## Completion Contract
Das Feature gilt als vertragskonform, wenn:
1. Der einmalige Import bis zu 50 Datensaetze verarbeitet,
2. pro gueltigem Datensatz lokalisierte Eintraege erzeugt sind,
3. Bewertung, Kurzreview (optional) und Richlink dargestellt werden,
4. die gemeinsame Datums-Sortierung mit bestehenden Now-Eintraegen korrekt ist,
5. Richlinks in mindestens einem nicht-ratingbasierten Now-Kontext wiederverwendbar sind.
