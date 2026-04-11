# Research: Legacy-Content-Migration

## Decision 1: Legacy-Inhalte aus Views/Locales/YAML als primäre Quelle verwenden
- Decision: Für About/Work/Open-Source/Veröffentlichungen werden die Legacy-Quellen `app/views/about_me/*`, `app/views/work/index.html.erb`, `config/locales/{de,en}.yml` und `data/projects.yml` als maßgebliche Inhaltsquelle genutzt.
- Rationale: Diese Quellen enthalten bereits redaktionell kuratierte DE/EN-Texte und strukturierte Projektdaten.
- Alternatives considered: Direkte Copy-Paste-Übernahme aus gerenderter Seite (verworfen wegen Strukturverlust), selektive manuelle Umschreibung ohne Quellbezug (verworfen wegen Rückverfolgbarkeit).

## Decision 2: Contentful nur für einmalige Blog-Migration, keine Zielabhängigkeit
- Decision: Contentful wird ausschließlich als temporäre Legacy-Quelle genutzt; die neue Seite liefert Blog-Content statisch aus `src/content/blog/`.
- Rationale: Entspricht FR-008 und der Constitution (Static-First, minimale Laufzeitkomplexität).
- Alternatives considered: Dauerhafte Contentful-Anbindung in Astro (verworfen wegen zusätzlicher Runtime-Komplexität und Betriebsabhängigkeit).

## Decision 3: About-Seite einspaltig mit Abschnittsblöcken
- Decision: About wird als einspaltige Lesestrecke umgesetzt; bisherige Bootstrap-Spalten werden in sequenzielle Abschnittsblöcke überführt.
- Rationale: Explizite Produktanforderung + bessere Leseführung.
- Alternatives considered: Responsives 2→1-Spalten-Hybridlayout (verworfen, da Anforderung "keine Zweispaltigkeit mehr").

## Decision 4: "Das kann ich" strukturell ähnlich, semantisch modernisiert
- Decision: Legacy-Kategorien (Frontend, Backend, Datenbanken, Third Parties, Methoden) bleiben erhalten; Umsetzung als semantische Section mit Listen.
- Rationale: Inhaltliche Kontinuität bei gleichzeitig konstitutionskonformer Struktur.
- Alternatives considered: Vollständiges Redesign ohne Kategorien (verworfen wegen Scope und Wiedererkennbarkeit).

## Decision 5: Übersetzungslücken zielsprachlich ergänzen
- Decision: Fehlende DE/EN-Inhalte werden manuell redaktionell ergänzt (nicht maschinell 1:1), mit gleicher Kernbotschaft.
- Rationale: Qualität, Tonalität und Konsistenz für zweisprachige Seite.
- Alternatives considered: Automatische Übersetzung ohne Review (verworfen wegen Qualitätsrisiko).

## Decision 6: Secrets strikt aus Zielrepo fernhalten
- Decision: Keine Übernahme von `.env`-Inhalten oder Tokens in `website`; Migrationsdokumentation beschreibt nur Vorgehen, keine Werte.
- Rationale: Security-Anforderung FR-010 und SC-006.
- Alternatives considered: Temporäre Ablage im Repo für Migration (verworfen wegen Sicherheitsrisiko).
