# Migration Inventory

## Scope

- About: `../website_old/app/views/about_me/index.html.erb`
- About Intro DE: `../website_old/app/views/about_me/_intro.de.html.erb`
- About Intro EN: `../website_old/app/views/about_me/_intro.en.html.erb`
- Work: `../website_old/app/views/work/index.html.erb`
- Locale DE: `../website_old/config/locales/de.yml`
- Locale EN: `../website_old/config/locales/en.yml`
- Projects/Open Source: `../website_old/data/projects.yml`
- Legacy Blog Runtime Integration: `../website_old/app/controllers/blog_controller.rb`
- Legacy Contentful Service: `../website_old/app/services/contentful_service.rb`

## Source to Target Mapping

## About

- Legacy headline/intro and image section from `about_me/index.html.erb` -> `src/pages/de/about.astro`, `src/pages/en/about.astro`
- Locale-specific intro paragraphs from `_intro.de.html.erb` and `_intro.en.html.erb` -> localized intro content in About pages
- "Das kann ich" keyword blocks (Frontend, Backend, Databases, Third Parties, Methods) from `about_me/index.html.erb` -> sectioned lists on About pages
- Career timeline from `about_me/index.html.erb` + locale labels from `config/locales/{de,en}.yml` -> structured experience section in About pages

## Work / Publications / Open Source / Projects

- Work topline/headline/intro and publication/open-source/startups section ordering from `work/index.html.erb` -> `src/pages/de/work.astro`, `src/pages/en/work.astro`
- Publication texts and labels from `config/locales/{de,en}.yml` -> localized publication copy in Work pages
- Open-source and project data from `data/projects.yml` -> normalized static dataset in `src/content/work/projects.json`

## Blog (Contentful to Static)

- Legacy runtime fetch flow (`blog_controller.rb` + `contentful_service.rb`) -> one-time export script under `scripts/migrations/`
- Exported entries -> static markdown/mdx files in `src/content/blog/`
- Runtime dependency removal verification -> `specs/002-legacy-content-migration/contentful-decommission-check.md`

## Notes

- This inventory intentionally tracks only source-of-truth files used for migration.
- Deprecated/unused legacy templates are excluded until needed by a specific task.
