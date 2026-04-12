import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("has title", async ({ page }) => {
  await expect(page).toHaveTitle("Tim Adler");
});

test("changes theme", async ({ page }) => {
  const themeToggle = page.locator("[data-theme-toggle]");
  await themeToggle.click();
  await expect(page.locator("body")).toHaveClass("dark");
  await themeToggle.click();
  await expect(page.locator("body")).not.toHaveClass("dark");
});

test("blog language selector links to translated article when available", async ({
  page,
}) => {
  await page.goto("/en/blog/terminal-as-an-app-launcher-alternative-on-the-mac/");
  await expect(page.locator("a.lang")).toHaveAttribute(
    "href",
    "/de/blog/terminal-as-launchbar-alfred-alternative-auf-dem-mac/"
  );
});

test("blog language selector falls back to other locale blog index", async ({
  page,
}) => {
  await page.goto("/en/blog/a-new-ruby-gem-for-the-giantbomb-api/");
  await expect(page.locator("a.lang")).toHaveAttribute("href", "/de/blog");
});
