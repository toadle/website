export type ContentLocale = "de" | "en";

const CONTENT_LOCALE_SET = new Set<ContentLocale>(["de", "en"]);

export function getLocaleFromContentId(id: string): ContentLocale | undefined {
  const firstSegment = id.split("/")[0];
  if (CONTENT_LOCALE_SET.has(firstSegment as ContentLocale)) {
    return firstSegment as ContentLocale;
  }

  if (id.endsWith("--de")) {
    return "de";
  }

  if (id.endsWith("--en")) {
    return "en";
  }

  return undefined;
}

export function isEntryInLocale(
  id: string,
  locale: ContentLocale,
  frontmatterLang?: ContentLocale
): boolean {
  const localeFromId = getLocaleFromContentId(id);

  if (localeFromId) {
    return localeFromId === locale;
  }

  if (frontmatterLang) {
    return frontmatterLang === locale;
  }

  return true;
}
