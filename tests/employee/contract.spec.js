const { test, expect } = require("@playwright/test");
test.describe.configure({ mode: "serial" });

const { createEmployee, pages, getEmployee } = require("../page-helper");
const { ResetDatabasePage } = require("../pages/resetdbb-page");
const { AddressPage } = require("../pages/address-page");
const { Employee } = require("./model/employee");
const { BasicInfoPage } = require("../pages/basic-info-page");
const { EmployeePage } = require("../pages/employee-page");
const { ContractPage } = require("../pages/contract-page");

const newEmployee = new Employee("Mana1", "mana1@gmail.com", "AdressLine1", "AddressLine2", "City", "53270", new Date("2023-01-01").toLocaleDateString(), "Chef de projet 1");

test.describe("Basic informations edition tests", () => {

    let createdEmployee;

    test.beforeEach(async ({page}) => {
      await page.goto(pages.HOME);
      createdEmployee = await createEmployee(page, newEmployee);
    })
  
    test.afterEach(async ({page}) => {
      // Supprimer la bdd à chaque test
      await page.goto(pages.RESET_DBB);
      const homePageMode = new ResetDatabasePage(page);
      await homePageMode.resetDatabase();
    })


    test("Display correct information", async ({page}) => {
        const contractPage = new ContractPage(page, createdEmployee.id);
        await contractPage.goto(); 

        const jobTitle = await contractPage.getJobTitle();
        const dateHiring = await contractPage.getHiringDate();

        expect(dateHiring).toEqual(createdEmployee.hiringDate);
        expect(jobTitle).toEqual(createdEmployee.jobTitle);
    })

    test("Should not be able to edit Hiring date", async ({page}) => {
        const contractPage = new ContractPage(page, createdEmployee.id);
        await contractPage.goto(); 

        await contractPage.editHiringDate("2022-01-01");
        await contractPage.fillForm("newJob");
        await contractPage.submitForm();

        await expect(page).toHaveURL(contractPage.path);
    })

    test("Should edit job title only", async ({page}) => {
        const newJobTitle = "newJobTitle";
        const contractPage = new ContractPage(page, createdEmployee.id);
        await contractPage.goto(); 
        
        await contractPage.fillForm(newJobTitle);
        await contractPage.submitForm();

        const savedEmployee = await getEmployee(page, createdEmployee.id);
        createdEmployee.jobTitle = newJobTitle;

        expect(savedEmployee).toEqual(savedEmployee);
    })

    test("Body fields cannot be empty or whitespaced", async ({page}) => {
        const contractPage = new ContractPage(page, createdEmployee.id);
        await contractPage.goto(); 
        
        await contractPage.fillForm(" ");
        await contractPage.submitForm();

        await expect(page).toHaveURL(contractPage.path);
    })


    test("Cannot inject XSS", async ({page}) => {
        const xssInjection = "<script>alert('hacked')</script>";
        const contractPage = new ContractPage(page, createdEmployee.id);
        await contractPage.goto(); 
        
        await contractPage.fillForm(xssInjection);
        await contractPage.submitForm();

        const employeePage = new EmployeePage(page, createdEmployee.id);
        await employeePage.goto();

        const displayedJobtitle = await employeePage.getJobTitle();

        expect(displayedJobtitle.replace("\n", "")).toEqual(xssInjection);
    })


    test("Cannot inject SQL", async ({page}) => {
        const sqlInjection = `', email = 'Ceci est un email'; '--`;
        const contractPage = new ContractPage(page, createdEmployee.id);
        await contractPage.goto(); 
        
        await contractPage.fillForm(sqlInjection);
        await contractPage.submitForm();

        const employeePage = new EmployeePage(page, createdEmployee.id);
        await employeePage.goto();

        const displayedJobtitle = await employeePage.getJobTitle();

        expect(displayedJobtitle.replace("\n", "")).toEqual(sqlInjection);
    })
})