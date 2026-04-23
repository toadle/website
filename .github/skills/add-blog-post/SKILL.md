---
name: add-blog-post
description: "Create new blog post drafts in this repository. Given a title in DE or EN, generate both locale files for today, create locale-specific slugs, and set alternateLanguageUrl cross-links."
argument-hint: "Provide a blog post title in German or English. Optional: both locale titles, description variants, pubDate, and body seed text."
user-invocable: true
---

# Add Blog Post

Use this repository-specific skill to create two linked blog post drafts with minimal input.

## What This Skill Does

- Creates two files by default: one for `de` and one for `en`.
- Accepts a title in either language and derives the missing locale title.
- Uses today for `pubDate` by default.
- Writes schema-compliant blog frontmatter and locale cross-links.

## Repository Rules

1. Schema source: `src/content.config.ts` (`blog` collection).
2. Paths:
   - `src/content/blog/de/`
   - `src/content/blog/en/`
3. Filename pattern: `<slug>.md` (no date prefix in filename).
4. Required frontmatter fields per file:
   - `lang`
   - `title`
   - `description`
   - `pubDate`
5. Locale cross-link field:
   - `alternateLanguageUrl` must be set in both files and point to the opposite locale route.

## Input Handling

Accept natural language input and map it to:

- `title` (single value or `de` and `en` variants)
- optional `description` (`de` and `en` variants)
- optional `pubDate`
- optional markdown body seed text

Locale handling defaults:

- If only one locale title is provided, derive the missing locale title by translation/adaptation.
- Generate German text for `de` and English text for `en`.
- Do not duplicate one locale verbatim into the other locale unless explicitly requested.

Description defaults:

- If description is not provided, set placeholders:
  - `de`: `TODO: Kurzbeschreibung ergaenzen.`
  - `en`: `TODO: Add short description.`

## Slug Rules

Create one slug per locale from that locale title.

- Lowercase ASCII and dash-separated words.
- German transliteration before normalization:
   - `a-umlaut -> ae`
   - `o-umlaut -> oe`
   - `u-umlaut -> ue`
   - `eszett -> ss`
- English slug reflects English wording.
- Locale slugs may differ and must not be force-synchronized.

Collision handling:

- If target file already exists, do not overwrite silently.
- Resolve by appending numeric suffixes (`-2`, `-3`, ...) per locale until both target paths are free.

## File Creation Logic

1. Resolve `pubDate`:
   - default to today,
   - write as full ISO timestamp with local timezone offset.
2. Resolve locale titles (`de`, `en`).
3. Build locale-specific slugs from titles.
4. Apply collision handling and finalize target filenames:
   - `src/content/blog/de/<de-slug>.md`
   - `src/content/blog/en/<en-slug>.md`
5. Build reciprocal locale routes:
   - German file gets `alternateLanguageUrl: /en/blog/<en-slug>/`
   - English file gets `alternateLanguageUrl: /de/blog/<de-slug>/`
6. Create both files with frontmatter and an empty body draft marker.
   - Use `<!-- TODO: Draft content -->` as default body marker.

## Frontmatter Template

For each locale file, write:

- `lang`: locale code (`de` or `en`)
- `title`: locale title
- `description`: locale description or default placeholder
- `pubDate`: ISO timestamp string
- `alternateLanguageUrl`: opposite locale route

Leave `updatedDate` and `heroImage` unset unless explicitly requested.

## Output Requirements

After execution, summarize:

- Created file paths
- Final slug per locale (`de`, `en`)
- Final `alternateLanguageUrl` values
- `pubDate` used
- Any assumptions/fallbacks (translation, placeholders, suffixes)

## Validation

Run repository checks where feasible:

- `npm run lint`
- `npm test`

If full checks are not feasible, run the smallest meaningful validation and state what was skipped.
