import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { isEntryInLocale } from "../../../lib/contentLocale";
import { normalizeBlogSlug } from "../../../lib/contentSlug";
import { getBlogFeedMetadata, getSiteUrl } from "../../../lib/rss";

const locale = "en";

export async function GET(context) {
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
      ...(post.data.updatedDate ? { customData: `<updated>${post.data.updatedDate.toUTCString()}</updated>` } : {}),
      link: `/${locale}/blog/${normalizeBlogSlug(post.id)}/`,
    })),
  });
}