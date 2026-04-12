import { readFileSync } from "node:fs";
import path from "node:path";
import type { RawImdbRating, RawSnapshotPayload } from "./index";

const isRawRating = (value: unknown): value is RawImdbRating => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const row = value as RawImdbRating;

  return (
    typeof row.position === "number" &&
    typeof row.sourceId === "string" &&
    typeof row.filmTitle === "string" &&
    typeof row.filmUrl === "string"
  );
};

export const extractFromSnapshotFile = (
  inputPath: string,
  cwd = process.cwd()
): RawSnapshotPayload => {
  const absolutePath = path.isAbsolute(inputPath)
    ? inputPath
    : path.resolve(cwd, inputPath);

  const source = readFileSync(absolutePath, "utf-8");
  const parsed = JSON.parse(source) as Partial<RawSnapshotPayload>;

  if (!Array.isArray(parsed.ratings)) {
    throw new Error("Snapshot payload is missing ratings array");
  }

  const ratings = parsed.ratings.filter(isRawRating);

  return {
    extractedAt: parsed.extractedAt || new Date().toISOString(),
    sourceUrl: parsed.sourceUrl || "",
    locale: parsed.locale || "de-DE",
    total: ratings.length,
    ratings,
  };
};
