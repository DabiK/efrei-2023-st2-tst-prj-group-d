// @ts-check
const { test, expect } = require("@playwright/test");
const { pages, getEmployee, createEmployee } = require("../page-helper");
const { BasicInfoPage } = require("../pages/basic-info-page");
const { EmployeePage } = require("../pages/employee-page");
const { ListEmployeePage } = require("../pages/list-employee-page");
const { ResetDatabasePage } = require("../pages/resetdbb-page");
const { Employee } = require("./model/employee");

// Créer l'employé
const newEmployee = new Employee("Manaranche", "manaranche@gmail.com", "AdressLine1", "AddressLine2", "City", "53270", new Date("2023-01-01").toLocaleDateString(), "Chef de projet");

test.describe("Basic informations edition tests", () => {

  test.beforeEach(async ({page}) => {
    await page.goto(pages.HOME);
  })

  test.afterEach(async ({page}) => {
    // Supprimer la bdd à chaque test
    await page.goto(pages.RESET_DBB);
    const homePageMode = new ResetDatabasePage(page);
    await homePageMode.resetDatabase();
  })

  /**
   * Check if all fields contains the correct employee values
   */
  test("Should display correct informations", async ({ page }) => {
    const createdEmployee = await createEmployee(page, newEmployee);
    const basicInfoPageModel = new BasicInfoPage(page, createdEmployee.id);
    await basicInfoPageModel.goto();

    const name = await basicInfoPageModel.getName();
    const email = await basicInfoPageModel.getEmail();

    expect(name).toEqual(newEmployee.name);
    expect(email).toEqual(newEmployee.email);
  });


  /**
   * We try to submit the form while our email is not in an email format.
   * Normally, client side should block the submission and the page should not change
   */
  test("Should verify email type (client side)", async ({ page }) => { 
    const createdEmployee = await createEmployee(page, newEmployee);

    const basicInfoPageModel = new BasicInfoPage(page, createdEmployee.id);
    await basicInfoPageModel.goto();
    await basicInfoPageModel.fillForm("name", "newEmail");
    await basicInfoPageModel.submitForm();
    
    await expect(page).toHaveURL(`${pages.EDIT_EMPLOYEE}/${createdEmployee.id}/basic_info`);
  });


  /**
   * If the user edit the email input and transform it into text type, the client side wont be able to see if the email is well formated and
   * will allow the submission to the server. If the page remains, it means that server side is controlling the email format, otherwise its not
   */
  test("Should verify email type (server side)", async ({ page }) => {   
    const createdEmployee = await createEmployee(page, newEmployee);

    const basicInfoPageModel = new BasicInfoPage(page, createdEmployee.id);
    await basicInfoPageModel.goto();
    await basicInfoPageModel.fillForm("name", "newEmail");
    await basicInfoPageModel.changeEmailType();
    await basicInfoPageModel.submitForm();

    await expect(page).toHaveURL(`${pages.EDIT_EMPLOYEE}/${createdEmployee.id}/basic_info`);
  });



  test("Body fields cannot be empty or whitespaced", async ({ page }) => {
    const createdEmployee = await createEmployee(page, newEmployee);

    const basicInfoPageModel = new BasicInfoPage(page, createdEmployee.id);
    await basicInfoPageModel.goto();
    
    await basicInfoPageModel.fillForm(" ", "email@notEmpty.com");
    await basicInfoPageModel.changeAllFieldsToUnrequired();
    await basicInfoPageModel.submitForm();
    await expect(page).toHaveURL(basicInfoPageModel.path);

    await basicInfoPageModel.fillForm("nameNotEmpty", " ");
    await basicInfoPageModel.changeEmailType();
    await basicInfoPageModel.changeAllFieldsToUnrequired();
    await basicInfoPageModel.submitForm();
    await expect(page).toHaveURL(basicInfoPageModel.path);
  });


  /**
   * Via ce test, on vérifie si la page /employee affiche une valeur pour name
   * Si ce n'est pas le cas, c'est que notre injection à fonctionnée et est interprétée
   */
  test("Cannot inject XSS", async ({ page }) => {
    const createdEmployee = await createEmployee(page, newEmployee);

    const xssInjection = "<script>alert('hacked')</script>";

    const basicInfoPageModel = new BasicInfoPage(page, createdEmployee.id);
    await basicInfoPageModel.goto();
    await basicInfoPageModel.fillForm(xssInjection, "email@email.com")
    await basicInfoPageModel.submitForm();

    const employeePageModel = new EmployeePage(page, createdEmployee.id);
    await employeePageModel.goto();
    const displayedName = await employeePageModel.getName();
    await expect(displayedName).toEqual(xssInjection);
  });


  /**
   * Nous tentons d'executer une attaque par injection SQL qui vise à rendre le nom de l'employé vide et
   * rendre l'email dans un format qui ne devrait pas être autorisé
   */
  test("Cannot inject SQL", async ({ page }) => {
    const createdEmployee = await createEmployee(page, newEmployee);
    const sqlInjection = `', email = 'Ceci est un email'; '--`;

    const basicInfoPageModel = new BasicInfoPage(page, createdEmployee.id);
    await basicInfoPageModel.goto();
    await basicInfoPageModel.fillForm(sqlInjection, "email@email.com")
    await basicInfoPageModel.submitForm();

    const employeePageModel = new EmployeePage(page, createdEmployee.id);
    await employeePageModel.goto();
    const displayedName = await employeePageModel.getName();
    await expect(displayedName).toEqual(sqlInjection);
  });

  
  /**
   * A la soumission du formulaire seul le nom et l'email doivent être modifié. 
   * Aucun des autres champs de l'Employee doivent être modifiés
   */
  test("Should update only name and email", async ({ page }) => {
    const createdEmployee = await createEmployee(page, newEmployee);
    const basicInfoPageModel = new BasicInfoPage(page, createdEmployee.id);
    await basicInfoPageModel.goto();

    const newName = "nameV2";
    const newEmail = "email@email.comV2";
    await basicInfoPageModel.fillForm(newName, newEmail);
    await basicInfoPageModel.submitForm();

    const savedEmployee = await getEmployee(page, createdEmployee.id);

    // Vérifier que seul name et email aient changés
    createdEmployee.name = newName;
    createdEmployee.email = newEmail;
    await expect(savedEmployee).toEqual(createdEmployee);
  });
});
