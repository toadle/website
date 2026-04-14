---
description: Create new now posts for de and en using today's date by default and infer the post shape from provided content.
---

## User Input

```text
$ARGUMENTS
```

You MUST consider the user input before proceeding.

## Goal

Create one new now post in German and one in English in:

- `src/content/now/de/`
- `src/content/now/en/`

Use the current date by default unless an explicit date is provided by the user.

## Source of Truth

1. Validate fields against `src/content.config.ts` (`now` collection schema).
2. Keep file naming conventions used in `src/content/now/{de,en}/`: `YYYY-MM-DD-slug.md`.
3. Do not introduce new `type` enum values. Only existing schema values are allowed.

## Workflow

1. Parse user input
   - Extract optional date, title/theme, quote, opinion, review text, youtube URL, richlink data, rating data, and image data.
   - Accept locale-specific variants when provided (`de`, `en`).

2. Resolve defaults
   - If no date is provided, use today's date in ISO format (`YYYY-MM-DD`).
   - If only one text variant is provided, use it as fallback for both locales.
   - Ensure each locale has at least a useful `label`.

3. Infer post shape from content
   - Use content signals to decide the post pattern. Do not rely on a hard global priority list.
   - Map pattern to schema fields:
     - IMDb/rating-like content -> `type: rating` plus `rating` and optional `richlink` movie metadata.
     - YouTube content -> `youtube` field.
     - Richlink content -> `richlink` field.
     - Quote content -> `quote` field.
     - Otherwise -> standard fields (`label`, optional body/opinion/image).
   - Preserve optional fields only when provided. Do not write empty placeholders.

4. Build filenames
   - Create a shared slug from best available content (`title`, `quote`, then `label`).
   - Normalize to lowercase ASCII slug with dashes.
   - Target files:
     - `src/content/now/de/YYYY-MM-DD-slug.md`
     - `src/content/now/en/YYYY-MM-DD-slug.md`

5. Safety checks
   - If either target file already exists, stop and ask for explicit overwrite confirmation.
   - Ensure frontmatter remains schema-compliant.

6. Write both files
   - Include frontmatter with `date`, `lang`, `label`, and inferred optional fields.
   - Include markdown body content only when meaningful content is present.

7. Validate
   - Run relevant checks for this repo after creation:
     - `npm run lint`
     - `npm test`
   - If those are too heavy for the current context, at minimum run `npm run build` or explain why validation could not run.

8. Report back
   - Detected pattern and mapped fields
   - Created file paths for de/en
   - Date used and slug
   - Validation commands executed and outcomes

## Guardrails

- Repo-specific scope only; do not write outside this repository.
- Never change unrelated files.
- Keep style consistent with existing now content files.
- Ask concise follow-up questions only when required input is genuinely missing.
