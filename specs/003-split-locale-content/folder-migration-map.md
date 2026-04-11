# Folder Migration Map

## Zielstruktur

```text
src/content/
  blog/
    de/
      <slug>.md|.mdx
    en/
      <slug>.md|.mdx
  now/
    de/
      <slug>.md
    en/
      <slug>.md
```

## Regeln

- Blog- und Now-Inhalte liegen ausschliesslich in den Sprachunterordnern `de` und `en`.
- Root-Dateien unter `src/content/blog/` und `src/content/now/` werden nach der Migration entfernt.
- Dateinamen in `blog/de` und `blog/en` entsprechen dem finalen Slug.
- Dateinamen in `now/de` und `now/en` bleiben datum-/slug-basiert, aber ohne Sprachsuffix.
