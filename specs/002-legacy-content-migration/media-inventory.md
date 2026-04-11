# Media Inventory

## Rules

- Prefer checked-in local assets for deterministic builds.
- Keep naming stable and descriptive.
- Every migrated image must have explicit alt text in target pages.
- Remote publication thumbnails should be downloaded and referenced locally.

## Inventory

| Source | Source Type | Target Path | Used In | Alt Text Rule |
|---|---|---|---|---|
| `../website_old/app/assets/images/ich.png` | local file | `src/assets/legacy/ich.png` | `/de/about`, `/en/about` | Portrait of Tim Adler |
| `../website_old/app/assets/images/productish.jpg` | local file | `src/assets/legacy/productish.jpg` | `/de/work`, `/en/work` publication section | Cover image for Productish podcast |
| `https://media.springernature.com/w306/springer-static/cover-hires/book/978-3-658-30629-8` | external URL | `public/images/legacy/publications/digitales-produktmanagement.jpg` | `/de/work`, `/en/work` publication section | Cover of "Digitales Produktmanagement" |
| `https://admin.programmier.bar/assets/8069773d-ac49-43c2-8635-4176323bdc2a?width=512&height=512&fit=cover` | external URL | `public/images/legacy/publications/programmierbar-cto-special-18.jpg` | `/de/work`, `/en/work` publication section | Artwork for programmier.bar CTO-SPECIAL #18 |
| Contentful blog entry assets (legacy) | Contentful asset | `src/assets/blog/legacy/*` or `public/images/blog/legacy/*` | migrated blog posts in `src/content/blog/` | Alt text from entry metadata, fallback to descriptive title |

## Validation Checklist

- [ ] Target file exists
- [ ] Page references local target path
- [ ] Alt text set
- [ ] Image loads in dev/build output
