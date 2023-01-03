// @ts-check
const { test, expect } = require("@playwright/test");
const { cp } = require("fs");
const { pages } = require("../page-helper");
const { HomePage } = require("../pages/home-page");

test.describe("Basic informations edition tests", () => {

  test.afterEach(async ({page}) => {
    const homePageMode = new HomePage(page);
    await homePageMode.clickOnReset();
  })

  test("should display correct informations", async ({ page }) => {});

  test("should verify email type", async ({ page }) => {});

  test("Server should receives correct body", async ({ page }) => {});

  test("body field cannot be empty or whitespaced", async ({ page }) => {});

  test("Cannot inject XSS", async ({ page }) => {});

  test("Cannot inject SQL", async ({ page }) => {});

  test("Should update only name and email", async ({ page }) => {});

  test("Should verify antiforgery token", async ({ page }) => {});
});
