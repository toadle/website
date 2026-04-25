import { getCollection } from "astro:content";
import type { Locale } from "../i18n";
import { isEntryInLocale } from "./contentLocale";
import { normalizeBlogSlug, normalizeNowSlug } from "./contentSlug";
import { sortNowEntries } from "./sortNowEntries";

const PAGE_SIZE_BLOG = 5;
const PAGE_SIZE_NOW = 10;

export async function getBlogStaticPaths(locale: Locale) {
  const posts = (await getCollection("blog"))
    .filter((post) => isEntryInLocale(post.id, locale, post.data.lang))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return posts.map((post, index) => {
    const prev = posts[index - 1];
    const next = posts[index + 1];
    const normalizedSlug = normalizeBlogSlug(post.id);

    return {
      params: { slug: normalizedSlug },
      props: {
        ...post,
        lang: locale,
        prevPost: prev
          ? { title: prev.data.title, slug: normalizeBlogSlug(prev.id) }
          : undefined,
        nextPost: next
          ? { title: next.data.title, slug: normalizeBlogSlug(next.id) }
          : undefined,
        translationHref: post.data.alternateLanguageUrl,
      },
    };
  });
}

export async function getBlogPaginatedPaths(locale: Locale) {
  const posts = (await getCollection("blog"))
    .filter((post) => isEntryInLocale(post.id, locale, post.data.lang))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const totalPages = Math.ceil(posts.length / PAGE_SIZE_BLOG);
  return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) => ({
    params: { page: String(index + 2) },
    props: {
      posts: posts.slice((index + 1) * PAGE_SIZE_BLOG, (index + 2) * PAGE_SIZE_BLOG),
      currentPage: index + 2,
      prevUrl: index === 0 ? `/${locale}/blog` : `/${locale}/blog/page/${index + 1}`,
      nextUrl:
        index + 2 < totalPages ? `/${locale}/blog/page/${index + 3}` : undefined,
    },
  }));
}

export async function getNowDetailPaths(locale: Locale) {
  const otherLocale: Locale = locale === "de" ? "en" : "de";

  const entries = sortNowEntries(
    (await getCollection("now")).filter((entry) =>
      isEntryInLocale(entry.id, locale, entry.data.lang)
    )
  );
  const otherEntries = sortNowEntries(
    (await getCollection("now")).filter((entry) =>
      isEntryInLocale(entry.id, otherLocale, entry.data.lang)
    )
  );

  return entries.map((entry) => {
    const normalizedSlug = normalizeNowSlug(entry.id);
    const directMatch = otherEntries.find(
      (candidate) => normalizeNowSlug(candidate.id) === normalizedSlug
    );

    const dateKey = entry.data.date.valueOf();
    const sameDateEntries = entries.filter(
      (candidate) => candidate.data.date.valueOf() === dateKey
    );
    const sameDateIndex = sameDateEntries.findIndex(
      (candidate) => candidate.id === entry.id
    );
    const sameDateOtherEntries = otherEntries.filter(
      (candidate) => candidate.data.date.valueOf() === dateKey
    );
    const dateIndexMatch =
      sameDateIndex >= 0 && sameDateIndex < sameDateOtherEntries.length
        ? sameDateOtherEntries[sameDateIndex]
        : undefined;

    const translatedEntry = directMatch ?? dateIndexMatch;
    const languageSwitchHref = translatedEntry
      ? `/${otherLocale}/now/${normalizeNowSlug(translatedEntry.id)}/`
      : `/${otherLocale}/now/`;

    return {
      params: { slug: normalizedSlug },
      props: { entry, languageSwitchHref },
    };
  });
}

export async function getNowPartialPaths(locale: Locale) {
  const rawEntries = sortNowEntries(
    (await getCollection("now")).filter((entry) =>
      isEntryInLocale(entry.id, locale, entry.data.lang)
    )
  );

  const totalPages = Math.ceil(rawEntries.length / PAGE_SIZE_NOW);

  return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) => {
    const pageNum = index + 2;
    const start = (pageNum - 1) * PAGE_SIZE_NOW;
    const end = start + PAGE_SIZE_NOW;
    return {
      params: { page: String(pageNum) },
      props: { pageEntries: rawEntries.slice(start, end) },
    };
  });
}
