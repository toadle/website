# Slug Normalization Rules

## Ziel

Blog-Dateiname = finaler URL-Slug.

## Normalisierung

1. Sprachsuffix entfernen: `--de` und `--en` am Dateiende werden entfernt.
2. Sprachordner ignorieren: `de/` oder `en/` sind kein Teil des Slugs.
3. Dateiendung entfernen: `.md` oder `.mdx` sind kein Teil des Slugs.
4. Slug bleibt lowercase-hyphenated, keine Leerzeichen.

## Beispiele

| Input | Finaler Slug | Dateiname |
|---|---|---|
| `terminal-as-launchbar-alfred-alternative-auf-dem-mac--de.md` | `terminal-as-launchbar-alfred-alternative-auf-dem-mac` | `terminal-as-launchbar-alfred-alternative-auf-dem-mac.md` |
| `de/first-post.md` | `first-post` | `first-post.md` |
| `en/using-mdx.mdx` | `using-mdx` | `using-mdx.mdx` |
