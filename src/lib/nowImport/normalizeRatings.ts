import type {
  ImportedImdbRating,
  RawImdbRating,
  SkippedImdbRating,
} from "./index";

const monthMap: Record<string, number> = {
  jan: 0,
  januar: 0,
  feb: 1,
  februar: 1,
  maerz: 2,
  märz: 2,
  marz: 2,
  apr: 3,
  april: 3,
  mai: 4,
  jun: 5,
  juni: 5,
  jul: 6,
  juli: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  okt: 9,
  oktober: 9,
  nov: 10,
  november: 10,
  dez: 11,
  dezember: 11,
};

const parseGermanDate = (value: string | null): Date | null => {
  if (!value) {
    return null;
  }

  const cleaned = value
    .replace(/\./g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  const parts = cleaned.split(" ");

  if (parts.length < 3) {
    return null;
  }

  const day = Number(parts[0]);
  const year = Number(parts[parts.length - 1]);
  const monthToken = parts.slice(1, -1).join("");
  const month = monthMap[monthToken];

  if (!Number.isFinite(day) || !Number.isFinite(year) || month === undefined) {
    return null;
  }

  return new Date(Date.UTC(year, month, day));
};

const normalizeSingleRating = (
  row: RawImdbRating
): ImportedImdbRating | SkippedImdbRating => {
  if (!row.sourceId) {
    return { raw: row, reason: "missing_source_id" };
  }

  if (!row.filmTitle.trim()) {
    return { raw: row, reason: "missing_film_title" };
  }

  if (!row.filmUrl.startsWith("http")) {
    return { raw: row, reason: "invalid_film_url" };
  }

  if (!row.userRating || row.userRating < 1 || row.userRating > 10) {
    return { raw: row, reason: "invalid_user_rating" };
  }

  const ratedAt = parseGermanDate(row.ratedAtText);

  if (!ratedAt) {
    return { raw: row, reason: "invalid_rated_at" };
  }

  return {
    sourceId: row.sourceId,
    filmTitle: row.filmTitle.trim(),
    filmUrl: row.filmUrl,
    ratingValue: row.userRating,
    ratingScaleMax: 10,
    ratedAt,
    position: row.position,
  };
};

export const normalizeRatings = (
  ratings: RawImdbRating[],
  limit: number
): { valid: ImportedImdbRating[]; skipped: SkippedImdbRating[] } => {
  const valid: ImportedImdbRating[] = [];
  const skipped: SkippedImdbRating[] = [];
  const seen = new Set<string>();

  for (const row of ratings) {
    if (valid.length >= limit) {
      break;
    }

    const normalized = normalizeSingleRating(row);

    if ("reason" in normalized) {
      skipped.push(normalized);
      continue;
    }

    if (seen.has(normalized.sourceId)) {
      skipped.push({ raw: row, reason: "duplicate_source_id" });
      continue;
    }

    seen.add(normalized.sourceId);
    valid.push(normalized);
  }

  return { valid, skipped };
};
