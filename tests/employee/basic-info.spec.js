// @ts-check
const { test, expect } = require("@playwright/test");
const { cp } = require("fs");
const { pages } = require("../page-helper");
const { BasicInfoPage } = require("../pages/basic-info-page");
const { HomePage } = require("../pages/home-page");
const { ResetDatabasePage } = require("../pages/resetdbb-page");
const { Employee } = require("./model/employee");

test.describe("Basic informations edition tests", () => {

  // test.afterEach(async ({page}) => {
  //   await page.goto(pages.RESET_DBB);
  //   const homePageMode = new ResetDatabasePage(page);
  //   await homePageMode.resetDatabase();
  // })

  test("should display correct informations", async ({ page }) => {

    // Créer l'employé
    const employee = new Employee("Manaranche", "manaranche@gmail.com", "AdressLine1", "AddressLine2", "City", "53270", "2022-01-01", "Chef de projet");

    const employeeId = 30; // TODO
    await page.goto(`${pages.EDIT_EMPLOYEE}/${employeeId}/basic_info`);

    const basicInfoPageModel = new BasicInfoPage(page);

    const name = await basicInfoPageModel.getName();
    const email = await basicInfoPageModel.getEmail();

    expect(name).toEqual("starf");
    expect(email).toEqual("fulah@gmail.com");
  });

  test("should verify email type", async ({ page }) => {});

  test("Server should receives correct body", async ({ page }) => {});

  test("body field cannot be empty or whitespaced", async ({ page }) => {});

  test("Cannot inject XSS", async ({ page }) => {});

  test("Cannot inject SQL", async ({ page }) => {});

  test("Should update only name and email", async ({ page }) => {});

  test("Should verify antiforgery token", async ({ page }) => {});
});
