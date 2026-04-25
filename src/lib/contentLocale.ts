import type { Locale } from "../i18n";

const CONTENT_LOCALE_SET = new Set<Locale>(["de", "en"]);

export function getLocaleFromContentId(id: string): Locale | undefined {
  const firstSegment = id.split("/")[0];
  if (CONTENT_LOCALE_SET.has(firstSegment as Locale)) {
    return firstSegment as Locale;
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
  locale: Locale,
  frontmatterLang?: Locale
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
