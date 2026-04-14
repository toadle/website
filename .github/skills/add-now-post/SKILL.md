---
name: add-now-post
description: 'Create new now posts in this repository. By default, generate DE and EN entries for today and infer the post shape from the provided content (YouTube, IMDb/rating, richlink, quote, image, or standard).'
argument-hint: 'Describe the now post content. Optional fields: date, locale variants, urls, quote, opinion, review text, rating, richlink, image.'
user-invocable: true
---

# Add Now Post

Use this repository-specific skill to create new now posts with minimal friction.

## What This Skill Does

- Creates two files by default: one for `de` and one for `en`.
- Uses today's date unless a specific date is provided.
- Infers the post pattern from user-provided content.
- Writes schema-compliant frontmatter for `now` entries.

## Repository Rules

1. Schema source: `src/content.config.ts` (`now` collection).
2. Paths:
   - `src/content/now/de/`
   - `src/content/now/en/`
3. Filename pattern: `YYYY-MM-DD-slug.md`
4. No schema extension in this skill:
   - Keep existing `type` enum values.
   - Treat YouTube/IMDb/richlink/quote as field patterns, not new enum types.

## Input Handling

Accept natural language input and map it to fields like:

- `date`
- `label` (`de` and `en` variant if provided)
- `quote`
- `opinion`
- `reviewText`
- `rating`
- `richlink`
- `youtube`
- `image`
- markdown body

Locale handling is strict by default:

- Generate German copy for `de` and English copy for `en`.
- If only one locale text is provided, derive the missing locale by translation/adaptation before writing files.
- Do not duplicate one locale verbatim into the other locale unless the user explicitly asks for identical text.

## Pattern Inference

Infer the post shape from content signals:

- Rating/IMDb-like: rating data and/or IMDb-like link with review context
- YouTube-like: YouTube URL present
- Richlink-like: richlink object/url present
- Quote-like: quote present
- Otherwise: standard post

Then map to valid schema fields only.

## File Creation Logic

1. Resolve date (default: today).
2. Build a locale-specific slug basis from each locale's best available content (`title`, then `quote`, then `label`).
3. Generate and normalize one slug per locale to lowercase ASCII and dashes.
4. Create locale files with locale-matching slugs:
   - `src/content/now/de/YYYY-MM-DD-<de-slug>.md`
   - `src/content/now/en/YYYY-MM-DD-<en-slug>.md`
5. Stop and ask before overwriting existing files.

Slug quality rules:

- `de` slug should reflect the German wording (e.g. umlaut transliteration like `ä -> ae`, `ö -> oe`, `ü -> ue`, `ß -> ss`).
- `en` slug should reflect the English wording.
- Slugs may differ across locales and should not be force-synchronized.

## Output Requirements

After execution, summarize:

- Inferred post pattern
- Paths of created files
- Final date + slug per locale (`de`, `en`)
- Any fallback assumptions used
- Validation commands and results

## Validation

Run repository checks where feasible:

- `npm run lint`
- `npm test`

If full checks are not feasible, run the smallest meaningful validation and state what was skipped.
