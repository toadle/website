# Contentful Migration Runbook (No Secrets)

## Goal

Perform a one-time export of legacy blog entries and required assets from Contentful into static files under `src/content/blog/` and local image folders.

## Preconditions

- A personal/local `.env` file exists outside version control.
- Required variables are available to the process at runtime (for example `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ENVIRONMENT`, `CONTENTFUL_ACCESS_TOKEN`).
- `scripts/migrations/contentful-to-markdown.ts` exists.

## Procedure

1. Export posts and assets metadata.
2. Download required assets to `src/assets/blog/legacy/` or `public/images/blog/legacy/`.
3. Generate markdown/mdx files with complete frontmatter.
4. Rewrite image references to local static paths.
5. Validate collection build and language links.

## Example Execution

```bash
npm run astro -- --version
node --loader tsx scripts/migrations/contentful-to-markdown.ts --dry-run
node --loader tsx scripts/migrations/contentful-to-markdown.ts --write
```

## Security Rules

- Never commit tokens, space IDs tied to private environments, or raw API responses containing secrets.
- Keep `.env*` ignored.
- Keep migration logs free of credentials.

## Done Criteria

- Blog entries exist as local markdown/mdx in `src/content/blog/`.
- Required blog images are stored locally and referenced statically.
- No production code path depends on Contentful runtime access.
