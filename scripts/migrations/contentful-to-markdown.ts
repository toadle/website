import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

type Locale = "de" | "en";

interface CliOptions {
  dryRun: boolean;
  write: boolean;
  limit: number;
}

interface GraphQlAsset {
  url?: string;
  description?: string;
  width?: number;
  height?: number;
}

interface GraphQlCategory {
  title_en?: string;
  title_de?: string;
  url_en?: string;
  url_de?: string;
}

interface GraphQlPost {
  title_en?: string;
  title_de?: string;
  url_en?: string;
  url_de?: string;
  content_en?: string;
  content_de?: string;
  date?: string;
  meta_description?: string;
  title_image?: GraphQlAsset;
  category?: GraphQlCategory;
}

interface GraphQlResponse {
  data?: {
    posts?: {
      items?: GraphQlPost[];
    };
  };
  errors?: Array<{ message: string }>;
}

interface ExportPost {
  locale: Locale;
  slug: string;
  title: string;
  description: string;
  body: string;
  pubDate: string;
  alternateLanguageUrl?: string;
  heroImage?: string;
}

function parseArgs(argv: string[]): CliOptions {
  const dryRun = argv.includes("--dry-run");
  const write = argv.includes("--write");
  const limitArg = argv.find((arg) => arg.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.split("=")[1]) : 200;

  return {
    dryRun,
    write,
    limit: Number.isFinite(limit) ? limit : 200,
  };
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeAssetUrl(input?: string): string | undefined {
  if (!input) {
    return undefined;
  }
  return input.startsWith("//") ? `https:${input}` : input;
}

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function inferDescription(post: GraphQlPost, locale: Locale): string {
  const explicit = post.meta_description?.trim();
  if (explicit) {
    return explicit;
  }

  const content = locale === "de" ? post.content_de : post.content_en;
  if (!content) {
    return "Legacy migration post";
  }

  const plain = stripHtml(content);
  return plain.slice(0, 160) || "Legacy migration post";
}

function markdownFrontmatter(post: ExportPost): string {
  const heroLine = post.heroImage ? `heroImage: '${post.heroImage}'\n` : "";
  const altLine = post.alternateLanguageUrl
    ? `alternateLanguageUrl: '${post.alternateLanguageUrl}'\n`
    : "";

  return `---\nlang: '${post.locale}'\ntitle: '${post.title.replace(/'/g, "''")}'\ndescription: '${post.description.replace(/'/g, "''")}'\npubDate: '${post.pubDate}'\n${altLine}${heroLine}---\n\n${post.body}\n`;
}

async function fetchGraphQlPosts(
  spaceId: string,
  accessToken: string,
  limit: number,
): Promise<GraphQlPost[]> {
  const endpoint = `https://graphql.contentful.com/content/v1/spaces/${spaceId}`;
  const query = `
    query LegacyPosts($limit: Int!) {
      posts: postCollection(limit: $limit, preview: false, locale: "en") {
        items {
          title_en: title(locale: "en")
          title_de: title(locale: "de")
          url_en: url(locale: "en")
          url_de: url(locale: "de")
          content_en: content(locale: "en")
          content_de: content(locale: "de")
          date
          meta_description: metaDescription(locale: "en")
          title_image: titleImage(locale: "en") {
            url
            description
            width
            height
          }
          category {
            title_en: title(locale: "en")
            title_de: title(locale: "de")
            url_en: url(locale: "en")
            url_de: url(locale: "de")
          }
        }
      }
    }
  `;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { limit } }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as GraphQlResponse;
  if (json.errors && json.errors.length > 0) {
    throw new Error(`GraphQL returned errors: ${json.errors.map((e) => e.message).join("; ")}`);
  }

  return json.data?.posts?.items ?? [];
}

async function downloadAsset(url: string, targetPath: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Asset download failed: ${response.status} ${response.statusText} (${url})`);
  }
  const content = Buffer.from(await response.arrayBuffer());
  await writeFile(targetPath, content);
}

async function run(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const spaceId = requiredEnv("CONTENTFUL_SPACE_ID");
  const accessToken = requiredEnv("CONTENTFUL_ACCESS_TOKEN");

  const legacyPosts = await fetchGraphQlPosts(spaceId, accessToken, options.limit);
  const exportPosts: ExportPost[] = [];

  for (const item of legacyPosts) {
    const slugEn = slugify(item.url_en ?? item.title_en ?? "post-en");
    const slugDe = slugify(item.url_de ?? item.title_de ?? slugEn);
    const date = item.date ?? "2000-01-01";

    if (item.title_de && item.content_de) {
      exportPosts.push({
        locale: "de",
        slug: slugDe,
        title: item.title_de,
        description: inferDescription(item, "de"),
        body: item.content_de,
        pubDate: date,
        alternateLanguageUrl: item.title_en ? `/en/blog/${slugEn}/` : undefined,
        heroImage: normalizeAssetUrl(item.title_image?.url),
      });
    }

    if (item.title_en && item.content_en) {
      exportPosts.push({
        locale: "en",
        slug: slugEn,
        title: item.title_en,
        description: inferDescription(item, "en"),
        body: item.content_en,
        pubDate: date,
        alternateLanguageUrl: item.title_de ? `/de/blog/${slugDe}/` : undefined,
        heroImage: normalizeAssetUrl(item.title_image?.url),
      });
    }
  }

  if (options.dryRun) {
    console.log("[dry-run] GraphQL query successful.");
    console.log(`Legacy posts fetched: ${legacyPosts.length}`);
    console.log(`Localized posts prepared: ${exportPosts.length}`);
    return;
  }

  if (!options.write) {
    console.log("No action selected. Use --dry-run or --write.");
    return;
  }

  const projectRoot = process.cwd();
  const blogDir = path.join(projectRoot, "src/content/blog");
  const imageDir = path.join(projectRoot, "src/assets/blog/legacy");
  await mkdir(blogDir, { recursive: true });
  await mkdir(imageDir, { recursive: true });

  let filesWritten = 0;
  let imagesWritten = 0;

  for (const post of exportPosts) {
    let heroPath: string | undefined;
    if (post.heroImage) {
      const hash = createHash("md5").update(post.heroImage).digest("hex").slice(0, 8);
      const ext = post.heroImage.toLowerCase().includes(".png") ? "png" : "jpg";
      const imageName = `${post.slug}-${hash}.${ext}`;
      const imageTarget = path.join(imageDir, imageName);
      await downloadAsset(post.heroImage, imageTarget);
      heroPath = `../../assets/blog/legacy/${imageName}`;
      imagesWritten += 1;
    }

    const fileName = `${post.slug}--${post.locale}.md`;
    const filePath = path.join(blogDir, fileName);
    const markdown = markdownFrontmatter({ ...post, heroImage: heroPath });
    await writeFile(filePath, markdown, "utf8");
    filesWritten += 1;
  }

  console.log(`Wrote ${filesWritten} markdown file(s).`);
  console.log(`Downloaded ${imagesWritten} image(s).`);
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
