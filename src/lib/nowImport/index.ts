export type ImportedImdbRating = {
  sourceId: string;
  filmTitle: string;
  filmUrl: string;
  ratingValue: number;
  ratingScaleMax: number;
  ratedAt: Date;
  position: number;
};

export type RawImdbRating = {
  position: number;
  sourceId: string;
  filmTitle: string;
  filmUrl: string;
  userRating: number | null;
  ratedAtText: string | null;
};

export type RawSnapshotPayload = {
  extractedAt: string;
  sourceUrl: string;
  locale: string;
  total: number;
  ratings: RawImdbRating[];
};

export type SkippedImdbRating = {
  raw: RawImdbRating;
  reason: string;
};

export type ImportRunSummary = {
  processed: number;
  created: number;
  skipped: number;
  failed: number;
};

export type ImportOptions = {
  inputPath: string;
  limit: number;
  dryRun: boolean;
  featureDir: string;
};

export const defaultImportOptions: ImportOptions = {
  inputPath: "specs/004-imdb-now-import/imdb-ratings-snapshot.json",
  limit: 50,
  dryRun: false,
  featureDir: "specs/004-imdb-now-import",
};

export { extractFromSnapshotFile } from "./extractFromImdb";
export { normalizeRatings } from "./normalizeRatings";
export { writeNowRatingEntries } from "./writeNowRatingEntries";
export { runImport } from "./runImport";
