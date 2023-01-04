// @ts-check
const { test, expect } = require("@playwright/test");
const { cp } = require("fs");
const { pages } = require("../page-helper");
const { BasicInfoPage } = require("../pages/basic-info-page");
const { EmployeePage } = require("../pages/employee-page");
const { HomePage } = require("../pages/home-page");
const { ResetDatabasePage } = require("../pages/resetdbb-page");
const { EmployeeService } = require("../services/employee.service");
const { Employee } = require("./model/employee");

// Créer l'employé
const newEmployee = new Employee("Manaranche", "manaranche@gmail.com", "AdressLine1", "AddressLine2", "City", "53270", "2022-01-01", "Chef de projet");

test.describe("Basic informations edition tests", () => {

  // test.afterEach(async ({page}) => {
  //   await page.goto(pages.RESET_DBB);
  //   const homePageMode = new ResetDatabasePage(page);
  //   await homePageMode.resetDatabase();
  // })

  /**
   * Check if all fields contains the correct employee values
   */
  test("Should display correct informations", async ({ page }) => {
    const employeeId = 30; // TODO
    await page.goto(`${pages.EDIT_EMPLOYEE}/${employeeId}/basic_info`);

    const basicInfoPageModel = new BasicInfoPage(page);

    const name = await basicInfoPageModel.getName();
    const email = await basicInfoPageModel.getEmail();

    expect(name).toEqual("starf");
    expect(email).toEqual("fulah@gmail.com");
  });


  /**
   * We try to submit the form while our email is not in an email format.
   * Normally, client side should block the submission and the page should not change
   */
  test("Should verify email type (client side)", async ({ page }) => {
    const employeeId = 30; // TODO
    await page.goto(`${pages.EDIT_EMPLOYEE}/${employeeId}/basic_info`);
    
    const basicInfoPageModel = new BasicInfoPage(page);
    await basicInfoPageModel.fillForm("name", "newEmail");
    await basicInfoPageModel.submitForm();
    
    await expect(page).toHaveURL(`${pages.EDIT_EMPLOYEE}/${employeeId}/basic_info`);
  });


  /**
   * If the user edit the email input and transform it into text type, the client side wont be able to see if the email is well formated and
   * will allow the submission to the server. If the page remains, it means that server side is controlling the email format, otherwise its not
   */
  test("Should verify email type (server side)", async ({ page }) => {
    const employeeId = 30; // TODO
    await page.goto(`${pages.EDIT_EMPLOYEE}/${employeeId}/basic_info`);
    
    const basicInfoPageModel = new BasicInfoPage(page);
    await basicInfoPageModel.fillForm("name", "newEmail");
    await basicInfoPageModel.changeEmailType();
    await basicInfoPageModel.submitForm();

    await expect(page).toHaveURL(`${pages.EDIT_EMPLOYEE}/${employeeId}/basic_info`);
  });



  test("Body fields cannot be empty or whitespaced", async ({ page }) => {
    const employeeId = 30; // TODO

    const basicInfoURL = `${pages.EDIT_EMPLOYEE}/${employeeId}/basic_info`;
    await page.goto(basicInfoURL);

    const basicInfoPageModel = new BasicInfoPage(page);
    
    await basicInfoPageModel.fillForm(" ", "email@notEmpty.com");
    await basicInfoPageModel.changeAllFieldsToUnrequired();
    await basicInfoPageModel.submitForm();
    await expect(page).toHaveURL(basicInfoURL);

    await basicInfoPageModel.fillForm("nameNotEmpty", " ");
    await basicInfoPageModel.changeEmailType();
    await basicInfoPageModel.changeAllFieldsToUnrequired();
    await basicInfoPageModel.submitForm();
    await expect(page).toHaveURL(basicInfoURL);
  });


  /**
   * Via ce test, on vérifie si la page /employee affiche une valeur pour name
   * Si ce n'est pas le cas, c'est que notre injection à fonctionnée et est interprétée
   */
  test("Cannot inject XSS", async ({ page }) => {
    const employeeId = 30; // TODO
    const xssInjection = "<script>alert('hacked')</script>";

    const basicInfoURL = `${pages.EDIT_EMPLOYEE}/${employeeId}/basic_info`;
    await page.goto(basicInfoURL);

    const basicInfoPageModel = new BasicInfoPage(page);
    await basicInfoPageModel.fillForm(xssInjection, "email@email.com")
    await basicInfoPageModel.submitForm();

    await page.goto(`${pages.EDIT_EMPLOYEE}/${employeeId}`);

    const employeePageModel = new EmployeePage(page);
    const displayedName = await employeePageModel.getName();
    await expect(xssInjection).toEqual(displayedName);
  });


  /**
   * Nous tentons d'executer une attaque par injection SQL qui vise à rendre le nom de l'employé vide et
   * rendre l'email dans un format qui ne devrait pas être autorisé
   */
  test("Cannot inject SQL", async ({ page }) => {
    const employeeId = 30; // TODO
    const sqlInjection = `', email = 'Ceci est un email'; '--`;

    const basicInfoURL = `${pages.EDIT_EMPLOYEE}/${employeeId}/basic_info`;
    await page.goto(basicInfoURL);

    const basicInfoPageModel = new BasicInfoPage(page);
    await basicInfoPageModel.fillForm(sqlInjection, "email@email.com")
    await basicInfoPageModel.submitForm();

    await page.goto(`${pages.EDIT_EMPLOYEE}/${employeeId}`);

    const employeePageModel = new EmployeePage(page);
    const displayedName = await employeePageModel.getName();
    await expect(sqlInjection).toEqual(displayedName);
  });

  
  test("Should update only name and email", async ({ page }) => {
    const employeeId = 30; // TODO
    await page.goto(`${pages.EDIT_EMPLOYEE}/${employeeId}/basic_info`);

    const basicInfoPageModel = new BasicInfoPage(page);

    const newName = "nameV2";
    const newEmail = "email@email.comV2";
    await basicInfoPageModel.fillForm(newName, newEmail);
    await basicInfoPageModel.submitForm();

    const employeeService = new EmployeeService(page);
    const savedEmployee = await employeeService.getEmployee(page, employeeId);

    // Vérifier que seul name et email aient changés
    newEmployee.name = newName;
    newEmployee.email = newEmail;
    await expect(newEmployee).toEqual(savedEmployee);
  });
});
