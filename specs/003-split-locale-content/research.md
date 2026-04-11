# Research: Sprachgetrennte Content-Ordner fuer Blog und Now

## Decision 1: Sprachtrennung ueber Unterordner statt Dateisuffixe
- Decision: Blog und Now werden in getrennte Sprachordner strukturiert (`src/content/blog/de`, `src/content/blog/en`, `src/content/now/de`, `src/content/now/en`), statt Sprache im Dateinamen zu codieren.
- Rationale: Entspricht der neuen Produktanforderung, reduziert Parsing-Logik und verhindert Mischordner.
- Alternatives considered: Sprachsuffixe (`--de`, `--en`) beibehalten (verworfen wegen Mischordner und schwacher Redaktionsfuehrung).

## Decision 2: Blog-Dateiname ist immer der finale Slug
- Decision: Jede Blog-Datei wird als `<slug>.md|mdx` gespeichert, Sprache nur ueber Ordner.
- Rationale: Dateiname und oeffentliche URL bleiben 1:1 nachvollziehbar.
- Alternatives considered: Zusatztoken im Dateinamen (verworfen, weil URL-Drift und Nacharbeit).

## Decision 3: Astro-Collection-Loader auf verschachtelte Sprachpfade umstellen
- Decision: Content-Loader fuer Blog und Now bleiben collection-basiert, nutzen aber rekursive Patterns in sprachgetrennten Unterordnern.
- Rationale: Minimale Aenderung am Architekturprinzip "Static-First" und kompatibel mit bestehender Astro-Content-Pipeline.
- Alternatives considered: Custom Loader / externe Indexdatei (verworfen als unnötige Komplexitaet).

## Decision 4: Sprachfilter ueber Pfadkontext, nicht nur Frontmatter
- Decision: Seitenaggregation fuer `/de/*` und `/en/*` basiert primaer auf Ordnerpfad (`/de/` vs `/en/`) und optional auf bestehendem `lang`-Feld als Guard.
- Rationale: Pfad gibt die neue Source-of-Truth fuer Sprache vor.
- Alternatives considered: Nur Frontmatter-basiert filtern (verworfen, da fehleranfaelliger bei manuellen Bearbeitungen).

## Decision 5: Pagination bleibt sprachspezifisch
- Decision: Pagination wird pro Sprache auf Basis der jeweiligen Sprachordner berechnet.
- Rationale: Verhindert vermischte Seiten und erfuellt SC-004.
- Alternatives considered: Globale Pagination mit nachtraeglichem Filter (verworfen, da inkonsistente Seitengroessen pro Sprache).
