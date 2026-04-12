import type { ImportOptions, ImportRunSummary } from "./index";
import { extractFromSnapshotFile } from "./extractFromImdb";
import { normalizeRatings } from "./normalizeRatings";
import { writeNowRatingEntries } from "./writeNowRatingEntries";

const fallbackOptions: ImportOptions = {
  inputPath: "specs/004-imdb-now-import/imdb-ratings-snapshot.json",
  limit: 50,
  dryRun: false,
  featureDir: "specs/004-imdb-now-import",
};

export const runImport = (options: Partial<ImportOptions> = {}): ImportRunSummary => {
  const merged: ImportOptions = {
    ...fallbackOptions,
    ...options,
  };

  const snapshot = extractFromSnapshotFile(merged.inputPath);
  const { valid, skipped } = normalizeRatings(snapshot.ratings, merged.limit);

  const created = writeNowRatingEntries(valid, process.cwd(), merged.dryRun);

  return {
    processed: snapshot.ratings.length,
    created,
    skipped: skipped.length,
    failed: 0,
  };
};
