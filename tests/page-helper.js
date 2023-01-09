import { Employee } from "./employee/model/employee";
import { AddressPage } from "./pages/address-page";
import { BasicInfoPage } from "./pages/basic-info-page";
import { ContractPage } from "./pages/contract-page";
import { CreateEmployeePage } from "./pages/create-employee-page";
import { ListEmployeePage } from "./pages/list-employee-page";

export const pages = {
  HOME: "https://d.hr.dmerej.info/",
  RESET_DBB: "https://d.hr.dmerej.info/reset_db",
  EMPLOYEE: "https://d.hr.dmerej.info/employees",
  TEAM: "https://d.hr.dmerej.info/teams",
  ADD_EMPLOYEE: "https://d.hr.dmerej.info/add_employee",
  ADD_TEAM: "https://d.hr.dmerej.info/add_team",
  EDIT_EMPLOYEE: "https://d.hr.dmerej.info/employee", // Need ajout de l'id
};

/**
 * Permet de créer un employé sans avoir à gérer la redirection avant/apres l'appel de la fonction
 * @param {object} page 
 * @param {Employee} employee
 */
export async function createEmployee(page, employee) {
  // Conserver l'url de la page courante
  const urlPreviousPage = await page.url();

  // Gérer l'ajout de l'employé
  await page.goto(pages.ADD_EMPLOYEE);
  const createEmployeePage = new CreateEmployeePage(page);

  await createEmployeePage.fillCreateEmployeeForm(employee);
  await createEmployeePage.submit(); // Provoque une rediction vers /employees

  // Récupérer l'employé qui vient d'être créé (c'est logiquement le dernier de la liste)
  await page.goto(pages.EMPLOYEE);
  const listEmployeePageModel = new ListEmployeePage(page);
  const createdEmployee = await listEmployeePageModel.getLastEmployee();

  // Revenir à la page initiale
  await page.goto(urlPreviousPage);

  return createdEmployee;
}

/**
 * Permet de récupérer un utilisateur précis en fonction de son id
 * @param {object} page
 * @param {number} id
 * 
 * @returns {Promise<Employee>}
 */
export async function getEmployee(page, id) {
  const employee = new Employee();
  employee.id = id;

  // Récupération du nom/email de l'employé
  const basicInfoPageModel = new BasicInfoPage(page, id);
  await page.goto(`${pages.EDIT_EMPLOYEE}/${id}/basic_info`);
  employee.name = await basicInfoPageModel.getName(); 
  employee.email = await basicInfoPageModel.getEmail();

  // Récupération des informations sur l'adresse
  const addressPageModal = new AddressPage(page);
  await page.goto(`${pages.EDIT_EMPLOYEE}/${id}/address`);
  employee.addressLine1 = await addressPageModal.getAddress1();
  employee.addressLine2 = await addressPageModal.getAddress2();
  employee.city = await addressPageModal.getCity();
  employee.zipCode = await addressPageModal.getZipcode();

  // Récupération des informations sur le job
  const jobPageModel = new ContractPage(page);
  await page.goto(`${pages.EDIT_EMPLOYEE}/${id}/contract`);
  employee.hiringDate = await jobPageModel.getHiringDate();
  employee.jobTitle = await jobPageModel.getJobTitle();

  return employee;
}