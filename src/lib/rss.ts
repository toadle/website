import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import type { APIContext } from "astro";
import rss from "@astrojs/rss";
import { SITE_TITLE } from "../consts";
import { i18n, type Locale } from "../i18n";
import { isEntryInLocale } from "./contentLocale";
import { normalizeBlogSlug, normalizeNowSlug } from "./contentSlug";
import { sortNowEntries } from "./sortNowEntries";
import { DATE_LOCALE } from "./dates";

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
    description: splitNowLead(t.now.lead).summary,
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

export function splitNowLead(lead: string): { summary: string; updated: string } {
  const markerMatch = lead.match(/(Stand:|Updated)/i);

  if (!markerMatch || markerMatch.index === undefined) {
    return { summary: normalizeWhitespace(lead), updated: "" };
  }

  const markerIndex = markerMatch.index;
  const summary = normalizeWhitespace(lead.slice(0, markerIndex).replace(/[\s.]+$/, "."));
  const updated = lead.slice(markerIndex).trim();
  return { summary, updated };
}

export function buildNowFeedTitle(entry: CollectionEntry<"now">, locale: Locale): string {
  if (entry.data.richlink?.title) {
    return entry.data.richlink.title;
  }

  if (entry.data.quote) {
    return entry.data.quote;
  }

  return entry.data.date.toLocaleDateString(DATE_LOCALE[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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

export function createBlogRSSHandler(locale: Locale) {
  return async function GET(context: APIContext) {
    const posts = (await getCollection("blog"))
      .filter((post) => isEntryInLocale(post.id, locale, post.data.lang))
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

    const metadata = getBlogFeedMetadata(locale);

    return rss({
      title: metadata.title,
      description: metadata.description,
      site: getSiteUrl(context),
      items: posts.map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        ...(post.data.updatedDate
          ? { customData: `<updated>${post.data.updatedDate.toUTCString()}</updated>` }
          : {}),
        link: `/${locale}/blog/${normalizeBlogSlug(post.id)}/`,
      })),
    });
  };
}

export function createNowRSSHandler(locale: Locale) {
  return async function GET(context: APIContext) {
    const entries = sortNowEntries(
      (await getCollection("now")).filter((entry) =>
        isEntryInLocale(entry.id, locale, entry.data.lang)
      )
    );

    const metadata = getNowFeedMetadata(locale);

    return rss({
      title: metadata.title,
      description: metadata.description,
      site: getSiteUrl(context),
      items: entries.map((entry) => ({
        title: buildNowFeedTitle(entry, locale),
        description: buildNowFeedDescription(entry, locale),
        pubDate: entry.data.date,
        link: `/${locale}/now/${normalizeNowSlug(entry.id)}/`,
      })),
    });
  };
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
