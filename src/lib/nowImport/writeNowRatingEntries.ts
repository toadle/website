import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { formatNowLabel } from "./dateLabel";
import { toRichlink } from "./richlink";
import type { ImportedImdbRating } from "./index";

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const buildFrontmatter = (
  rating: ImportedImdbRating,
  locale: "de" | "en"
): string => {
  const dateIso = rating.ratedAt.toISOString().slice(0, 10);
  const richlink = toRichlink({
    title: rating.filmTitle,
    url: rating.filmUrl,
    kind: "movie",
    backlink: true,
  });

  const lines = [
    "---",
    `date: ${dateIso}`,
    `lang: ${locale}`,
    "type: rating",
    `label: \"${formatNowLabel(rating.ratedAt, locale)}\"`,
    `sourceId: \"${rating.sourceId}\"`,
    "rating:",
    `  value: ${rating.ratingValue}`,
    `  scaleMax: ${rating.ratingScaleMax}`,
    `  display: \"${rating.ratingValue}/${rating.ratingScaleMax}\"`,
    "richlink:",
    `  title: \"${richlink.title.replace(/\"/g, "'")}\"`,
    `  url: \"${richlink.url}\"`,
    `  kind: ${richlink.kind}`,
    `  backlink: ${String(richlink.backlink)}`,
    "---",
    "",
    locale === "de"
      ? "Kurzreview folgt."
      : "Short review will be added.",
    "",
  ];

  return lines.join("\n");
};

export const writeNowRatingEntries = (
  ratings: ImportedImdbRating[],
  cwd = process.cwd(),
  dryRun = false
): number => {
  let written = 0;

  for (const rating of ratings) {
    for (const locale of ["de", "en"] as const) {
      const datePrefix = rating.ratedAt.toISOString().slice(0, 10);
      const slugBase = slugify(`${rating.filmTitle}-${rating.sourceId}`);
      const fileName = `${datePrefix}-${slugBase}.md`;
      const relativeDir = path.join("src", "content", "now", locale);
      const absoluteDir = path.resolve(cwd, relativeDir);
      const absolutePath = path.join(absoluteDir, fileName);

      if (existsSync(absolutePath)) {
        continue;
      }

      if (!dryRun) {
        mkdirSync(absoluteDir, { recursive: true });
        writeFileSync(absolutePath, buildFrontmatter(rating, locale), "utf-8");
      }

      written += 1;
    }
  }

  return written;
};
