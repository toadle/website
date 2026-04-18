import type { CollectionEntry } from "astro:content";
import type { APIContext } from "astro";
import { SITE_TITLE } from "../consts";
import { i18n, type Locale } from "../i18n";

type FeedLink = {
  title: string;
  href: string;
};

export type AlternateFeedLink = FeedLink;

const LOCALE_LABEL: Record<Locale, string> = {
  de: "DE",
  en: "EN",
};

export function buildFeedTitle(locale: Locale, sectionTitle: string): string {
  return `${SITE_TITLE} · ${sectionTitle} (${LOCALE_LABEL[locale]})`;
}

export function getBlogFeedMetadata(locale: Locale) {
  const t = i18n[locale];

  return {
    title: buildFeedTitle(locale, t.blog.title),
    description: t.blog.lead,
  };
}

export function getNowFeedMetadata(locale: Locale) {
  const t = i18n[locale];

  return {
    title: buildFeedTitle(locale, t.now.title),
    description: splitLeadText(t.now.lead),
  };
}

export function getSectionFeedLinks(locale: Locale, section: "blog" | "now"): FeedLink[] {
  const currentLocaleTitle = section === "blog" ? i18n[locale].blog.title : i18n[locale].now.title;
  const otherLocale: Locale = locale === "de" ? "en" : "de";
  const otherLocaleTitle = section === "blog" ? i18n[otherLocale].blog.title : i18n[otherLocale].now.title;

  return [
    {
      title: `${currentLocaleTitle} RSS (${LOCALE_LABEL[locale]})`,
      href: `/${locale}/${section}/rss.xml`,
    },
    {
      title: `${otherLocaleTitle} RSS (${LOCALE_LABEL[otherLocale]})`,
      href: `/${otherLocale}/${section}/rss.xml`,
    },
  ];
}

export function getSiteUrl(context: APIContext): URL {
  return context.site ?? new URL(context.url.origin);
}

export function buildNowFeedDescription(entry: CollectionEntry<"now">, locale: Locale): string {
  const parts: string[] = [];

  if (entry.data.quote) {
    parts.push(`"${entry.data.quote}"`);
  }

  const bodyText = normalizeWhitespace(stripMarkdown(entry.body ?? ""));
  if (bodyText) {
    parts.push(bodyText);
  }

  if (entry.data.reviewText) {
    parts.push(entry.data.reviewText);
  }

  if (entry.data.opinion) {
    parts.push(entry.data.opinion);
  }

  if (entry.data.rating) {
    const label = locale === "de" ? "Bewertung" : "Rating";
    const display = entry.data.rating.display?.trim();
    parts.push(
      display
        ? `${label}: ${display}`
        : `${label}: ${entry.data.rating.value}/${entry.data.rating.scaleMax}`
    );
  }

  if (entry.data.richlink) {
    const richlinkParts = [entry.data.richlink.title, entry.data.richlink.description, entry.data.richlink.url]
      .filter(Boolean)
      .map((value) => normalizeWhitespace(String(value)));

    if (richlinkParts.length > 0) {
      parts.push(richlinkParts.join(" · "));
    }
  }

  if (entry.data.youtube) {
    parts.push(entry.data.youtube);
  }

  if (entry.data.image?.alt) {
    const label = locale === "de" ? "Bild" : "Image";
    parts.push(`${label}: ${entry.data.image.alt}`);
  }

  return parts.filter(Boolean).join("\n\n");
}

function splitLeadText(lead: string): string {
  const markerMatch = lead.match(/(Stand:|Updated)/i);

  if (!markerMatch || markerMatch.index === undefined) {
    return normalizeWhitespace(lead);
  }

  return normalizeWhitespace(lead.slice(0, markerMatch.index));
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function stripMarkdown(value: string): string {
  return value
    .replace(/^---[\s\S]*?---\s*/m, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^>\s?/gm, "")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/[*_~]+/g, "")
    .replace(/<[^>]+>/g, " ");
}