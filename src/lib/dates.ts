import type { Locale } from "../i18n";

const DATE_LOCALE: Record<Locale, string> = {
  de: "de-DE",
  en: "en-US",
};

export function formatNowDate(date: Date, locale: Locale): string {
  return date.toLocaleDateString(DATE_LOCALE[locale], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatNowDateLong(date: Date, locale: Locale): string {
  return date.toLocaleDateString(DATE_LOCALE[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatBlogDate(date: Date, locale: Locale): string {
  return date.toLocaleDateString(DATE_LOCALE[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export { DATE_LOCALE };
