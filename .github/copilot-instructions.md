# website Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-12

## Active Technologies
- TypeScript (Astro 5), Markdown/MDX Content Collections + Astro Content Collections (`astro:content`), bestehendes i18n-Modul (`src/i18n.ts`) (003-split-locale-content)
- Dateibasiert unter `src/content/` (003-split-locale-content)
- TypeScript (Astro 5), Markdown Content Collections + `astro:content`, bestehende i18n-Utilities (`src/i18n.ts`, `src/lib/contentLocale.ts`) (004-create-feature-branch)
- Dateibasiert unter `src/content/now/{de,en}/` (004-create-feature-branch)

- TypeScript (Astro 5), Markdown/MDX-Conten + Astro Content Collections, Astro Pages/Layout Components, bestehendes i18n-Modul (`src/i18n.ts`) (main)

## Project Structure

```text
src/
tests/
```

## Commands

npm test

## Code Style

TypeScript (Astro 5), Markdown/MDX-Conten: Follow standard conventions

## Recent Changes
- 004-create-feature-branch: Added TypeScript (Astro 5), Markdown Content Collections + `astro:content`, bestehende i18n-Utilities (`src/i18n.ts`, `src/lib/contentLocale.ts`)
- 003-split-locale-content: Added TypeScript (Astro 5), Markdown/MDX Content Collections + Astro Content Collections (`astro:content`), bestehendes i18n-Modul (`src/i18n.ts`)

- main: Added TypeScript (Astro 5), Markdown/MDX-Conten + Astro Content Collections, Astro Pages/Layout Components, bestehendes i18n-Modul (`src/i18n.ts`)

<!-- MANUAL ADDITIONS START -->
## Testing & Verification

After changes that affect routing, layout, navigation, language switching, or any page that is covered by the E2E suite, run the smoke tests to verify nothing is broken:

```sh
# Full cycle (build + run E2E):
npm test

# Quick run against a running preview server:
npm run test:e2e

# Interactive UI mode for local debugging:
npm run test:e2e:ui
```

The E2E suite lives in `tests/e2e/smoke.spec.ts` and is configured via `playwright.config.ts`.
It covers: `/`, `/de`, `/en`, `/de/blog`, `/en/blog`, `/de/now`, `/en/now`, theme toggle, and language switching.

> For a future GitHub Actions integration: add a workflow that runs `npm ci`, `npx playwright install --with-deps chromium`, and `npm test`. No script changes needed — the npm scripts are already CI-ready.
<!-- MANUAL ADDITIONS END -->
