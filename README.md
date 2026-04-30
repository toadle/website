# Astro Starter Kit: Blog

```sh
npm create astro@latest -- --template blog
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

Features:

- ✅ Minimal styling (make it your own!)
- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly with canonical URLs and OpenGraph data
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown & MDX support

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
| `npm run import:imdb-now` | Run one-time IMDb Now import scaffold            |

### One-Time IMDb Import

Run the one-time import scaffold with optional flags:

```sh
npm run import:imdb-now -- --input=specs/004-imdb-now-import/imdb-ratings-snapshot.json --limit=50 --dry-run
```

- `--input`: Path to the captured browser snapshot payload JSON.
- `--limit`: Maximum number of ratings to process.
- `--dry-run`: Print options without writing content files.

## � Mastodon Now Mirror

Every new DE now-post that is pushed to `main` is automatically mirrored to Mastodon via the `.github/workflows/mastodon-now-post.yml` workflow.

### How it works

1. The **Test** workflow runs first (build + E2E).
2. On success, the **Mastodon Now Mirror** job starts.
3. It diffs `HEAD~1..HEAD` for newly added files under `src/content/now/de/`.
4. For each new file the toot text is composed directly from the frontmatter and body — no rewriting.
5. Movie richlinks include the film URL so Mastodon renders a preview card.

### Required GitHub secrets

| Secret | Description |
| :--- | :--- |
| `MASTODON_BASE_URL` | Your instance URL, e.g. `https://mastodon.social` |
| `MASTODON_ACCESS_TOKEN` | App access token with `write:statuses` scope |

Set these under **Settings → Secrets and variables → Actions → Secrets**.

### Optional GitHub variables

| Variable | Default | Description |
| :--- | :--- | :--- |
| `MASTODON_VISIBILITY` | `public` | `public`, `unlisted`, or `private` |
| `MASTODON_DRY_RUN` | `true` | Set to `false` to enable live posting |

Set these under **Settings → Secrets and variables → Actions → Variables**.

> **Start with Dry-Run.** The default configuration never posts. Check the workflow summary to see what would be posted, then set `MASTODON_DRY_RUN` to `false` when ready.

### Local test

```sh
DRY_RUN=true node scripts/mastodon-now-publisher.mjs
```

### Manual run in GitHub Actions

You can also start the workflow manually via **Actions → Mastodon Now Mirror → Run workflow**.

- Leave `commit_sha` empty to mirror the latest commit on the selected branch.
- Set `commit_sha` to a specific commit if you want to replay or retry an older now-post addition.
- `dry_run` defaults to `true` for manual runs, so you can safely test first.

## �👀 Want to learn more?

Check out [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Credit

This theme is based off of the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).
