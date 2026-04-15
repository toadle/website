type RichlinkLike = {
  url: string;
  kind?: "movie" | "recommendation";
  title?: string;
  description?: string;
  cover?: {
    src: string;
    alt: string;
  };
};

type RichlinkDiscovery = {
  title?: string;
  description?: string;
  cover?: string;
};

const coverCache = new Map<string, string | null>();
const discoveryCache = new Map<string, RichlinkDiscovery | null>();

const isImdbTitleUrl = (value: string): boolean => {
  return /https?:\/\/(www\.)?imdb\.com\/[a-z]{2}\/title\/tt\d+/i.test(value) || /https?:\/\/(www\.)?imdb\.com\/title\/tt\d+/i.test(value);
};

const readOgImage = (html: string): string | null => {
  const patterns = [
    /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i,
    /<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);

    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

const readMetaContent = (html: string, key: string): string | null => {
  const escapedKey = key.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta\\s+property=["']${escapedKey}["']\\s+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta\\s+content=["']([^"']+)["']\\s+property=["']${escapedKey}["']`, "i"),
    new RegExp(`<meta\\s+name=["']${escapedKey}["']\\s+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta\\s+content=["']([^"']+)["']\\s+name=["']${escapedKey}["']`, "i"),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return null;
};

const readTitleTag = (html: string): string | null => {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1]?.trim() ?? null;
};

const readImdbId = (url: string): string | null => {
  const match = url.match(/tt\d+/i);
  return match ? match[0].toLowerCase() : null;
};

const fetchSuggestionCover = async (imdbId: string): Promise<string | null> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const key = imdbId[0];
    const endpoint = `https://v3.sg.media-imdb.com/suggestion/${key}/${imdbId}.json`;

    const response = await fetch(endpoint, {
      headers: {
        "accept-language": "de-DE,de;q=0.9,en;q=0.8",
        "user-agent": "Mozilla/5.0 (compatible; ToadleRichlinkBot/1.0)",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return null;
    }

    const parsed = (await response.json()) as {
      d?: Array<{ l?: string; i?: { imageUrl?: string } }>;
    };

    return parsed.d?.[0]?.i?.imageUrl ?? null;
  } catch {
    return null;
  }
};

const fetchSuggestionData = async (
  imdbId: string
): Promise<{ title?: string; cover?: string } | null> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const key = imdbId[0];
    const endpoint = `https://v3.sg.media-imdb.com/suggestion/${key}/${imdbId}.json`;

    const response = await fetch(endpoint, {
      headers: {
        "accept-language": "de-DE,de;q=0.9,en;q=0.8",
        "user-agent": "Mozilla/5.0 (compatible; ToadleRichlinkBot/1.0)",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return null;
    }

    const parsed = (await response.json()) as {
      d?: Array<{ l?: string; i?: { imageUrl?: string } }>;
    };

    const first = parsed.d?.[0];
    if (!first) {
      return null;
    }

    return {
      title: first.l,
      cover: first.i?.imageUrl,
    };
  } catch {
    return null;
  }
};

const discoverFromPage = async (url: string): Promise<RichlinkDiscovery | null> => {
  if (discoveryCache.has(url)) {
    return discoveryCache.get(url) ?? null;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(url, {
      headers: {
        "accept-language": "de-DE,de;q=0.9,en;q=0.8",
        "user-agent": "Mozilla/5.0 (compatible; ToadleRichlinkBot/1.0)",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      discoveryCache.set(url, null);
      return null;
    }

    const html = await response.text();
    const discovery: RichlinkDiscovery = {
      title:
        readMetaContent(html, "og:title") ??
        readMetaContent(html, "twitter:title") ??
        readTitleTag(html) ??
        undefined,
      description:
        readMetaContent(html, "og:description") ??
        readMetaContent(html, "twitter:description") ??
        readMetaContent(html, "description") ??
        undefined,
      cover: readOgImage(html) ?? undefined,
    };

    discoveryCache.set(url, discovery);
    return discovery;
  } catch {
    discoveryCache.set(url, null);
    return null;
  }
};

const fallbackTitleFromUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./i, "");
  } catch {
    return url;
  }
};

const fetchImdbCover = async (url: string): Promise<string | null> => {
  if (coverCache.has(url)) {
    return coverCache.get(url) ?? null;
  }

  const imdbId = readImdbId(url);

  if (imdbId) {
    const suggestionCover = await fetchSuggestionCover(imdbId);

    if (suggestionCover) {
      coverCache.set(url, suggestionCover);
      return suggestionCover;
    }
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(url, {
      headers: {
        "accept-language": "de-DE,de;q=0.9,en;q=0.8",
        "user-agent": "Mozilla/5.0 (compatible; ToadleRichlinkBot/1.0)",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      coverCache.set(url, null);
      return null;
    }

    const html = await response.text();
    const cover = readOgImage(html);
    coverCache.set(url, cover);
    return cover;
  } catch {
    coverCache.set(url, null);
    return null;
  }
};

export const resolveRichlinkCover = async (
  link: RichlinkLike
): Promise<{ src: string; alt: string } | undefined> => {
  const details = await resolveRichlinkDetails(link);
  return details.cover;
};

export const resolveRichlinkDetails = async (
  link: RichlinkLike
): Promise<{
  title: string;
  description?: string;
  cover?: { src: string; alt: string };
}> => {
  const pageDiscovery = await discoverFromPage(link.url);
  const imdbId = readImdbId(link.url);
  const imdbDiscovery = imdbId ? await fetchSuggestionData(imdbId) : null;

  const title =
    link.title?.trim() || imdbDiscovery?.title || pageDiscovery?.title || fallbackTitleFromUrl(link.url);
  const description = link.description?.trim() || pageDiscovery?.description || undefined;

  if (link.cover?.src) {
    return {
      title,
      description,
      cover: link.cover,
    };
  }

  const src = imdbDiscovery?.cover || pageDiscovery?.cover || (await fetchImdbCover(link.url));

  if (!src) {
    return {
      title,
      description,
    };
  }

  return {
    title,
    description,
    cover: {
      src,
      alt: `Cover zu ${title}`,
    },
  };
};
