const { test, expect } = require("@playwright/test");
const { createEmployee, pages, getEmployee } = require("../page-helper");
const { ResetDatabasePage } = require("../pages/resetdbb-page");
const { AddressPage } = require("../pages/address-page");
const { Employee } = require("./model/employee");
const { BasicInfoPage } = require("../pages/basic-info-page");
const { EmployeePage } = require("../pages/employee-page");

test.describe.configure({ mode: "serial" });

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


    test("Display correct information of employee address", async ({page}) => {
        const addressPage = new AddressPage(page, createdEmployee.id);
        await addressPage.goto();

        const address1 = await addressPage.getAddress1();
        const address2 = await addressPage.getAddress2();
        const city = await addressPage.getCity();
        const zipcode = await addressPage.getZipcode();

        expect(address1).toEqual(createdEmployee.addressLine1);
        expect(address2).toEqual(createdEmployee.addressLine2);
        expect(city).toEqual(createdEmployee.city);
        expect(zipcode).toEqual(createdEmployee.zipCode);
    })


    test("Can submit form", async ({page}) => {
        const addressPage = new AddressPage(page, createdEmployee.id);
        await addressPage.goto();
        await addressPage.fillForm("1", "2", "3", 123);
        await addressPage.submitForm();

        await expect(page).toHaveURL(`${pages.EDIT_EMPLOYEE}/${createdEmployee.id}`);
    })


    test("Cannot insert string for zipcode", async ({page}) => {
        const addressPage = new AddressPage(page, createdEmployee.id);
        await addressPage.goto();
        console.log(page.url());
        await addressPage.changeZipcodeType();
        await addressPage.fillForm("1", "2", "3", "hello world");
        await addressPage.submitForm();

        // si on est tj sur la meme url, alors le formulaire a été rejeté
        await expect(page).toHaveURL(addressPage.path);
    })

    test("Cannot inject XSS", async ({page}) => {
        const xssInjection1 = "<script>alert('hacked1')</script>";
        const xssInjection2 = "<script>alert('hacked2')</script>";
        const xssInjection3 = "<script>alert('hacked3')</script>";

        const addressPage = new AddressPage(page, createdEmployee.id);
        await addressPage.goto();
        await addressPage.fillForm(xssInjection1, xssInjection2, xssInjection3, 123);
        await addressPage.submitForm();
        // Redirection vers la page /employee
        await addressPage.goto();

        const addressLine1 = await addressPage.getAddress1();
        const addressLine2 = await addressPage.getAddress2();
        const city = await addressPage.getCity();

        expect(addressLine1).toEqual(xssInjection1);
        await expect(addressLine2).toEqual(xssInjection2);
        expect(city).toEqual(xssInjection3);
    })


    test("Cannot inject SQL", async ({page}) => {
        const sqlInjection = `', email = 'Ceci est un email'; '--`;

        const addressPage = new AddressPage(page, createdEmployee.id);
        await addressPage.goto();
        await addressPage.fillForm(sqlInjection, sqlInjection, sqlInjection, 1220);
        await addressPage.submitForm();

        await addressPage.goto();
        const addressLine1 = await addressPage.getAddress1();
        const addressLine2 = await addressPage.getAddress2();
        const city = await addressPage.getCity();

        expect(addressLine1).toEqual(sqlInjection);
        await expect(addressLine2).toEqual(sqlInjection);
        expect(city).toEqual(sqlInjection);
    })


    test("Body fields cannot be empty or whitespaced", async ({page}) => {
        const addressPage = new AddressPage(page, createdEmployee.id);
        await addressPage.goto();
                
        // Vérification sur addressLine1
        await addressPage.fillForm("", "12", "34", 0);
        await addressPage.submitForm();
        await expect(page).toHaveURL(addressPage.path);

        // Vérification sur addresslIne2
        await addressPage.fillForm("12", " ", "34", 0);
        await addressPage.submitForm();
        await expect(page).toHaveURL(addressPage.path);

        // Vérification sur city
        await addressPage.fillForm("12", "34", " ", 0);
        await addressPage.submitForm();
        await expect(page).toHaveURL(addressPage.path);

        // Vérification sur zipcode
        await addressPage.fillForm("12", "34", "56", "");
        await addressPage.submitForm();
        await expect(page).toHaveURL(addressPage.path);
    })


    test("Should update addressLine1, addressLine2, City, ZipCode and only these fields", async ({page}) => {
        const addressPage = new AddressPage(page, createdEmployee.id);
        const newAddress1 = "newAddress1";
        const newAddress2 = "newAddress2";
        const newCity = "newCity";
        const newZipcode = 123456789;

        await addressPage.goto();
        await addressPage.fillForm(newAddress1, newAddress2, newCity, newZipcode);
        await addressPage.submitForm();
        
        const savedEmployee = await getEmployee(page, createdEmployee.id);

        // Vérifier les valeurs du formulaire
        expect(savedEmployee.addressLine1).toEqual(newAddress1);
        expect(savedEmployee.addressLine2).toEqual(newAddress2);
        expect(savedEmployee.city).toEqual(newCity);
        expect(savedEmployee.zipcode).toEqual(newZipcode);

        // Vérifier que seules ses valeurs aient changées
        createdEmployee.address1 = newAddress1;
        createdEmployee.address2 = newAddress2;
        createdEmployee.city = newCity;
        createdEmployee.zipcode = newZipcode;

        expect(savedEmployee).toEqual(createdEmployee);
    })
})