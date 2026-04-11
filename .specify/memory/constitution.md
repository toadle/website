<!--
SYNC IMPACT REPORT
==================
Version change:    (none) → 1.0.0  (INITIAL RATIFICATION)
Modified principles: n/a — initial creation
Added sections:
  - Core Principles (I–V)
  - Technology & Design Constraints
  - Content Architecture & Workflow
  - Governance
Removed sections: n/a
Templates reviewed:
  - .specify/templates/plan-template.md   ✅ compatible — Constitution Check section present
  - .specify/templates/spec-template.md   ✅ compatible — no conflicting constraints
  - .specify/templates/tasks-template.md  ✅ compatible — no conflicting constraints
Deferred TODOs: none
-->

# toadle.me Constitution

## Core Principles

### I. Typography-First Design

Typography drives every layout and spacing decision on this site.
Rules that MUST be followed:

- Font selection is intentional and strictly limited to at most two typefaces, both self-hosted.
- Visual hierarchy is created through type scale and whitespace alone — not through decorative chrome.
- No decorative element may be added unless it directly serves the content (pixel art and curated highlight images are the only permitted graphical exceptions).
- Whitespace MUST be purposeful; padding and margin values come from a defined spacing scale in
  `src/styles/theme.css` and are never arbitrary.

**Rationale**: The project draws design inspiration from minimalist typography-driven personal sites (e.g., ky.fyi). The site's credibility as a practitioner's portfolio depends on restraint and craft, not visual noise.

### II. Content Over Chrome

Every page MUST have one clear, singular purpose. Navigation is minimal and never hides content.
Rules that MUST be followed:

- No modal-heavy interaction patterns, flyout menus, or dark-pattern UI.
- Pages MUST be fully readable and meaningful without JavaScript enabled.
- No decorative animations that do not serve user understanding.
- Interaction enhancements are layered progressively on top of a fully functional static baseline.

**Rationale**: The audience is technical and values directness. Complexity in the UI competes with
the content; the content is the product.

### III. Performance & Accessibility (NON-NEGOTIABLE)

All published pages MUST meet the following baseline before being considered shippable:

- Semantic HTML is mandatory — no `<div>` soup for structural elements.
- Every image MUST have meaningful `alt` text; decorative images MUST use `alt=""`.
- No third-party tracking scripts or analytics SDKs. Privacy is a feature, not an afterthought.

**Rationale**: This is a public-facing professional site. Poor performance or accessibility directly
undermines the credibility of someone presenting themselves as a senior technical expert.

### IV. Internationalization-Native

All user-facing copy and UI labels CAN exist in both German (`de`) and English (`en`).

Rules that MUST be followed:
- All content can exist in both German (`de`) and English (`en`). Language parity is not a must, but a possibility. German and English versions of contents can be linked to each other, if they exist. Post in the now section is also available in both languages, but as no way to navigate between them
- URL structure follows the pattern `/de/<page>` and `/en/<page>`; the root `/` redirects to the preferred language.
- Translations MUST live in the centralized i18n module (`src/i18n.ts`); hardcoded strings in component files are forbidden.
- Initial language detection is based on the user's browser settings, but users can manually switch languages via a toggle in the header.

**Rationale**: Tim's audience is mainly German-speaking for his customers, but his projects and content is international (English) .

### V. Static-First, No Unnecessary Complexity

The site is built with Astro in static output mode. Complexity MUST be justified.
Rules that MUST be followed:

- Default to static generation; server-side rendering or client-side islands are only permitted when
  static output provably cannot satisfy the requirement.
- No CSS-in-JS. Styles MUST be plain CSS or Astro scoped styles.
- Design tokens (colors, type scale, spacing, breakpoints) MUST be defined as CSS custom properties
  in `src/styles/theme.css` and reused consistently — never duplicated inline.
- Dependencies are added only when they provide clear, non-trivial value over hand-written code.

**Rationale**: Simplicity is a first-class deliverable. Every additional dependency or runtime
surface increases maintenance burden on a solo-operated project.

## Technology & Design Constraints

**Stack**: Astro 5+, TypeScript (strict mode), plain CSS with CSS custom properties.

**Design tokens**: All colors, font stacks, type scales, spacing values, and breakpoints MUST be
declared as CSS custom properties in `src/styles/theme.css`. Components reference tokens by name,
never by raw value.

**Images & Graphics**: Pixel art or curated, high-quality highlight images only — no stock photography. Image assets MUST be optimized (Astro's built-in image optimization pipeline) before deployment.

**Icons**: SVG only; inline or as Astro components. No icon fonts (performance + accessibility cost).

**Fonts**: Self-hosted exclusively. No Google Fonts or other CDN-delivered typefaces. Maximum two typeface families across the entire site.

**No external tracking**: No analytics SDKs, no advertising pixels, no social sharing widgets that phone home. The site MUST function fully with browser network requests limited to the site's own origin.

## Content Architecture & Workflow

The site comprises three primary content areas:

| Area  | Path                    | Format        | Purpose                                         |
|-------|-------------------------|---------------|-------------------------------------------------|
| Work  | `/de/work`, `/en/work`  | Astro page    | Portfolio, services, and client-facing offering |
| Blog  | `src/content/blog/`     | Markdown/MDX  | Long-form articles and technical writing        |
| Now   | `src/content/now/`      | Markdown      | Micro-posts: updates, ratings, recommendations  |

Rules:

- Blog posts and Now entries MUST include `pubDate` and `title` in frontmatter; `pubDate` drives
  display order and the RSS feed.
- Content changes are committed directly to `main`; there are no content-specific feature flags.
- The RSS feed (`/rss.xml`) MUST remain valid and include all published blog posts.
- "Now" entries are intentionally short (tweet-scale); prose exceeding ~300 words belongs in Blog.

## Hosting & Deployment
The site will be hosted on render.com and deployed via GitHub Actions on push to `main`.

## Governance

This constitution supersedes all other design and development practices for the toadle.me project.
Amendments MUST be documented with a version bump and clear rationale in this file.

- **PATCH** bump: Clarifications, typo fixes, non-semantic wording refinements.
- **MINOR** bump: New principle or section added; existing principle materially expanded.
- **MAJOR** bump: Principle removed, renamed, or redefined in a backward-incompatible way.

All specs, plans, and task documents MUST reference the current constitution version at their head.
Every new feature MUST pass a Constitution Check (see plan-template.md) before Phase 0 research begins
and again after Phase 1 design.

Tim Adler is the sole arbiter of amendments to this constitution.

**Version**: 1.0.0 | **Ratified**: 2026-04-11 | **Last Amended**: 2026-04-11
