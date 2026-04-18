import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { isEntryInLocale } from "../../../lib/contentLocale";
import { normalizeNowSlug } from "../../../lib/contentSlug";
import { buildNowFeedDescription, getNowFeedMetadata, getSiteUrl } from "../../../lib/rss";
import { sortNowEntries } from "../../../lib/sortNowEntries";

const locale = "de";

const buildNowFeedTitle = (entry) => {
  const richlinkTitle = entry.data.richlink?.title;
  const quote = entry.data.quote;

  if (richlinkTitle) {
    return richlinkTitle;
  }

  if (quote) {
    return quote;
  }

  return entry.data.date.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export async function GET(context) {
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
      title: buildNowFeedTitle(entry),
      description: buildNowFeedDescription(entry, locale),
      pubDate: entry.data.date,
      link: `/${locale}/now/${normalizeNowSlug(entry.id)}/`,
    })),
  });
}