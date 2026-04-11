export function normalizeBlogSlug(id: string): string {
  const withoutLocalePrefix = id.replace(/^(de|en)\//, "");
  return withoutLocalePrefix.replace(/--(de|en)$/, "");
}
