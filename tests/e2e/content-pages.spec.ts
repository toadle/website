import { readdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { expect, test } from "@playwright/test";

const __dirname = dirname(fileURLToPath(import.meta.url));

function blogSlug(filename: string): string {
  return filename
    .replace(/\.(md|mdx)$/, "")
    .replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

const contentDir = join(__dirname, "../../src/content/blog");

const blogEntries: { lang: string; slug: string }[] = [];
for (const lang of ["en", "de"]) {
  for (const file of readdirSync(join(contentDir, lang))) {
    blogEntries.push({ lang, slug: blogSlug(file) });
  }
}

for (const { lang, slug } of blogEntries) {
  test(`blog/${lang}/${slug}`, async ({ page }) => {
    const response = await page.goto(`/${lang}/blog/${slug}/`);
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator("h1").first()).toBeVisible();
  });
}

function nowSlug(filename: string): string {
  return filename.replace(/\.(md|mdx)$/, "");
}

const nowDir = join(__dirname, "../../src/content/now");

const nowEntries: { lang: string; slug: string }[] = [];
for (const lang of ["en", "de"]) {
  for (const file of readdirSync(join(nowDir, lang))) {
    nowEntries.push({ lang, slug: nowSlug(file) });
  }
}

for (const { lang, slug } of nowEntries) {
  test(`now/${lang}/${slug}`, async ({ page }) => {
    const response = await page.goto(`/${lang}/now/${slug}/`);
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator("header").first()).toBeVisible();
  });
}
