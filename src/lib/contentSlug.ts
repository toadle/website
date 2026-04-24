export function normalizeBlogSlug(id: string): string {
  const withoutLocalePrefix = id.replace(/^(de|en)\//, "");
  const withoutLocaleSuffix = withoutLocalePrefix.replace(/--(de|en)$/, "");
  return withoutLocaleSuffix.replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

export function normalizeNowSlug(id: string): string {
  const withoutLocalePrefix = id.replace(/^(de|en)\//, "");
  return withoutLocalePrefix.replace(/--(de|en)$/, "");
}
