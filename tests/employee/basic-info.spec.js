// @ts-check
const { test, expect } = require("@playwright/test");
const { cp } = require("fs");
const { pages } = require("../page-helper");
const { HomePage } = require("../pages/home-page");
const { ResetDatabasePage } = require("../pages/resetdbb-page");

test.describe("Basic informations edition tests", () => {

  test.afterEach(async ({page}) => {
    await page.goto(pages.RESET_DBB);
    const homePageMode = new ResetDatabasePage(page);
    await homePageMode.resetDatabase();
  })

  test("should display correct informations", async ({ page }) => {
    console.log("ok");
  });

  test("should verify email type", async ({ page }) => {});

  test("Server should receives correct body", async ({ page }) => {});

  test("body field cannot be empty or whitespaced", async ({ page }) => {});

  test("Cannot inject XSS", async ({ page }) => {});

  test("Cannot inject SQL", async ({ page }) => {});

  test("Should update only name and email", async ({ page }) => {});

  test("Should verify antiforgery token", async ({ page }) => {});
});
