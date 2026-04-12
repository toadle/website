export type RichlinkInput = {
  title: string;
  url: string;
  kind?: "movie" | "recommendation";
  backlink?: boolean;
  description?: string;
  cover?: {
    src: string;
    alt: string;
  };
};

export type Richlink = {
  title: string;
  url: string;
  kind: "movie" | "recommendation";
  backlink: boolean;
  description?: string;
  cover?: {
    src: string;
    alt: string;
  };
};

export const isValidHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const toRichlink = (input: RichlinkInput): Richlink => {
  if (!input.title.trim()) {
    throw new Error("Richlink title is required");
  }

  if (!isValidHttpUrl(input.url)) {
    throw new Error(`Invalid richlink URL: ${input.url}`);
  }

  return {
    title: input.title.trim(),
    url: input.url,
    kind: input.kind ?? "movie",
    backlink: input.backlink ?? true,
    description: input.description?.trim() || undefined,
    cover: input.cover,
  };
};
