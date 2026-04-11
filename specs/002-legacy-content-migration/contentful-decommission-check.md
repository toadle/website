# Contentful Decommission Check

## Scope

Validation that website runtime does not depend on Contentful and that Contentful is only used as one-time migration input.

## Runtime Check

Search command used:

```bash
rg -n "contentful|CONTENTFUL" src scripts specs/002-legacy-content-migration -S
```

Result summary:

- `src/`: no runtime Contentful client, no runtime env access.
- `scripts/migrations/contentful-to-markdown.ts`: migration-only usage of Contentful env variables.
- `specs/002-legacy-content-migration/*`: documentation and task references only.

## Conclusion

- Website runtime is static and does not require Contentful.
- Contentful access is isolated to migration tooling.
- No tokens are committed in repository files.

## Migration Execution Evidence

- Export script executed with env values sourced from `../website_old/.env`.
- Result: 10 localized markdown posts written under `src/content/blog/`.
- Result: 6 blog images downloaded under `src/assets/blog/legacy/`.

## Follow-up

- Execute migration script with local env variables to export legacy entries.
- Remove temporary migration script only after final migration is accepted (optional cleanup).
