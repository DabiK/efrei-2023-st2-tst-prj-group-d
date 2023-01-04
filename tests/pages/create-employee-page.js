import { BasePage } from "./base-page";
const { pages } = require("../page-helper");

export class CreateEmployeePage extends BasePage {
  submitButton;

  static CREATE_EMPLOYEE_FIELDS = {
    name: "#id_name",
    email: "#id_email",
    addressLine1: "#id_address_line1",
    addressLine2: "#id_address_line2",
    city: "#id_city",
    zipCode: "#id_zip_code",
    hiringDate: "#id_hiring_date",
    jobTitle: "#id_job_title",
  };

  constructor(page) {
    super(page, pages.ADD_EMPLOYEE, CreateEmployeePage.CREATE_EMPLOYEE_FIELDS);
    this.submitButton = page.locator("[type='submit']");
  }

  async fillCreateEmployeeForm(model) {
    const objectKeys = Object.keys(this.locators);
    for (let i = 0; i < objectKeys.length; i++) {
      const objectKey = objectKeys[i];
      const selector = CreateEmployeePage.CREATE_EMPLOYEE_FIELDS[objectKey];
      await this.scrollOnElement(selector);
      await this.page.waitForSelector(selector);
      await this.locators[objectKey].click();
      await this.locators[objectKey].type(model[objectKey]);
    }
  }

  async submit() {
    await this.submitButton.click();
  }
}
