type RichlinkLike = {
  url: string;
  kind?: "movie" | "recommendation";
  title: string;
  cover?: {
    src: string;
    alt: string;
  };
};

const coverCache = new Map<string, string | null>();

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
      d?: Array<{ i?: { imageUrl?: string } }>;
    };

    return parsed.d?.[0]?.i?.imageUrl ?? null;
  } catch {
    return null;
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
  if (link.cover?.src) {
    return link.cover;
  }

  const src = await fetchImdbCover(link.url);

  if (!src) {
    return undefined;
  }

  return {
    src,
    alt: `Cover zu ${link.title}`,
  };
};
