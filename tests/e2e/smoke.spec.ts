import { expect, test } from "@playwright/test";

// ---------------------------------------------------------------------------
// Root redirect
// ---------------------------------------------------------------------------

test("root redirects to a locale prefix", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/(de|en)(\/|$)/);
});

// ---------------------------------------------------------------------------
// DE – core pages reachable
// ---------------------------------------------------------------------------

test("DE homepage loads", async ({ page }) => {
  await page.goto("/de");
  await expect(page.locator("header")).toBeVisible();
  await expect(page.locator(".hero")).toBeVisible();
});

test("DE blog index loads", async ({ page }) => {
  await page.goto("/de/blog");
  await expect(page.locator("h1").first()).toBeVisible();
});

test("DE now hub loads with timeline", async ({ page }) => {
  await page.goto("/de/now");
  await expect(page.locator("#now-timeline")).toBeVisible();
  await expect(page.locator("#now-timeline li").first()).toBeVisible();
});

// ---------------------------------------------------------------------------
// EN – core pages reachable
// ---------------------------------------------------------------------------

test("EN homepage loads", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("header")).toBeVisible();
  await expect(page.locator(".hero")).toBeVisible();
});

test("EN blog index loads", async ({ page }) => {
  await page.goto("/en/blog");
  await expect(page.locator("h1").first()).toBeVisible();
});

test("EN now hub loads with timeline", async ({ page }) => {
  await page.goto("/en/now");
  await expect(page.locator("#now-timeline")).toBeVisible();
  await expect(page.locator("#now-timeline li").first()).toBeVisible();
});

// ---------------------------------------------------------------------------
// Header interactions
// ---------------------------------------------------------------------------

test("theme toggle switches body class", async ({ page }) => {
  await page.goto("/de");
  const toggle = page.locator("[data-theme-toggle]");
  await toggle.click();
  await expect(page.locator("body")).toHaveClass(/dark/);
  await toggle.click();
  await expect(page.locator("body")).not.toHaveClass(/dark/);
});

test("language switch on DE homepage points to EN", async ({ page }) => {
  await page.goto("/de");
  await expect(page.locator("a.lang")).toHaveAttribute("href", /^\/en/);
});

test("language switch on EN homepage points to DE", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("a.lang")).toHaveAttribute("href", /^\/de/);
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

test("blog language selector links to translated article for giantbomb post", async ({
  page,
}) => {
  await page.goto("/en/blog/a-new-ruby-gem-for-the-giantbomb-api/");
  await expect(page.locator("a.lang")).toHaveAttribute(
    "href",
    "/de/blog/ein-neues-ruby-gem-fuer-die-giantbomb-api/"
  );
});
