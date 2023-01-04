// @ts-check
const { test, expect } = require("@playwright/test");
const { pages } = require("../page-helper");
const { Employee } = require("./model/employee");
const { CreateEmployeePage } = require("../pages/create-employee-page");

test.describe("create employee tests", () => {
  let createEmployeePage;
  test.beforeEach(async ({ page }) => {
    await page.goto(pages.ADD_EMPLOYEE);
    createEmployeePage = new CreateEmployeePage(page);
  });

  test("should create employee", async ({ page }) => {
    //Given
    const employee = new Employee(
      "toto",
      "toto@gmail.com",
      "1 rue de paris",
      "",
      "Paris",
      "75020",
      new Date("2023-01-01").toLocaleDateString(),
      "developer"
    );
    //When
    await createEmployeePage.fillCreateEmployeeForm(employee);
    await createEmployeePage.submit();
    //Then
    await expect(page.url().includes(pages.EMPLOYEE)).toBeTruthy();
  });

  // Create a parametrized test that fill all the input except one
  const requiredFields = [
    "name",
    "email",
    "addressLine1",
    "city",
    "zipCode",
    "hiringDate",
    "jobTitle",
  ];

  for (const field of requiredFields) {
    test(`should not create employee with missing property: ${field}`, async ({
      page,
    }) => {
      //Given
      const employee = new Employee(
        "toto",
        "toto@gmail.com",
        "1 rue de paris",
        "",
        "Paris",
        "-75020",
        new Date("2023-01-01").toLocaleDateString(),
        "developer"
      );
      employee[field] = "";
      //When
      await createEmployeePage.fillCreateEmployeeForm(employee);
      await createEmployeePage.submit();
      //Then
      await expect(page.url().includes(pages.EMPLOYEE)).toBeFalsy();
    });
  }

  test("should not create employee when negative zip code", async ({
    page,
  }) => {
    //Given
    const employee = new Employee(
      "toto",
      "toto@gmail.com",
      "1 rue de paris",
      "",
      "Paris",
      "-75020",
      new Date("2023-01-01").toLocaleDateString(),
      "developer"
    );
    //When
    await createEmployeePage.fillCreateEmployeeForm(employee);
    await createEmployeePage.submit();
    //Then
    await expect(page.url().includes(pages.EMPLOYEE)).toBeFalsy();
  });

  test("should not create employee when zip code length greater than X", async ({
    page,
  }) => {
    //Given
    const employee = new Employee(
      "toto",
      "toto@gmail.com",
      "1 rue de paris",
      "",
      "Paris",
      "75020000000000000000000000000000000000000000000000000000000000000000000000000",
      new Date("2023-01-01").toLocaleDateString(),
      "developer"
    );
    //When
    await createEmployeePage.fillCreateEmployeeForm(employee);
    await createEmployeePage.submit();
    //Then
    await expect(page.url().includes(pages.EMPLOYEE)).toBeFalsy();
  });

  test("should not create employee when hire date not valid", async ({
    page,
  }) => {
    //Given
    const employee = new Employee(
      "toto",
      "toto@gmail.com",
      "1 rue de paris",
      "",
      "Paris",
      "75020",
      "01/13/2020",
      "developer"
    );
    //When
    await createEmployeePage.fillCreateEmployeeForm(employee);
    await createEmployeePage.submit();
    //Then
    await expect(page.url().includes(pages.EMPLOYEE)).toBeFalsy();
  });

  test("should not create employee with invalid address", async ({ page }) => {
    //Given
    const employee = new Employee(
      "toto",
      "toto@gmail.com",
      "1 rue de paris oisjqdiqsjdoqsdjoq",
      "",
      "Paris",
      "75020",
      "01/13/2020",
      "developer"
    );
    //When
    await createEmployeePage.fillCreateEmployeeForm(employee);
    await createEmployeePage.submit();
    //Then
    await expect(page.url().includes(pages.EMPLOYEE)).toBeFalsy();
  });

  test("should not create 2 employee with same email", async ({ page }) => {
    //Given
    const employee1 = new Employee(
      "toto",
      "toto@gmail.com",
      "1 rue de paris",
      "",
      "Paris",
      "75020",
      "01/13/2020",
      "developer"
    );

    const employee2 = new Employee(
      "toto",
      "toto@gmail.com",
      "1 rue de paris",
      "",
      "Paris",
      "75020",
      "01/13/2020",
      "developer"
    );
    //When
    await createEmployeePage.fillCreateEmployeeForm(employee1);
    await createEmployeePage.submit();
    await createEmployeePage.goto();
    await createEmployeePage.fillCreateEmployeeForm(employee1);
    await createEmployeePage.submit();
    //Then
    await expect(page.url().includes(pages.EMPLOYEE)).toBeFalsy();
  });

  test("should have 2 input for the name (firstname and lastname)", async ({
    page,
  }) => {
    expect(await createEmployeePage.exist("#id_firstname")).toBeTruthy();
    expect(await createEmployeePage.exist("#id_lastname")).toBeTruthy();
  });

  test("should not create 2 employee with same city but different zip code", async ({
    page,
  }) => {
    //Given
    const employee1 = new Employee(
      "toto",
      "toto@gmail.com",
      "1 rue de paris",
      "",
      "Paris",
      "75020",
      "01/13/2020",
      "developer"
    );

    const employee2 = new Employee(
      "toto",
      "toto@gmail.com",
      "1 rue de paris",
      "",
      "Paris",
      "93160",
      "01/13/2020",
      "developer"
    );
    //When
    await createEmployeePage.fillCreateEmployeeForm(employee1);
    await createEmployeePage.submit();
    await createEmployeePage.goto();
    await createEmployeePage.fillCreateEmployeeForm(employee1);
    await createEmployeePage.submit();
    //Then
    await expect(page.url().includes(pages.EMPLOYEE)).toBeFalsy();
  });
});
