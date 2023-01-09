import { Employee } from "../employee/model/employee";
import { getEmployee, pages } from "../page-helper";
import { BasePage } from "./base-page";

/**
 * Représente le page model pour l'url https://d.hr.dmerej.info/employees
 */
export class ListEmployeePage extends BasePage {

    constructor(page) {
        super(page, pages.EMPLOYEE, []);
    }

    /**
     * Permet de récupérer le dernier employé enregistré
     * @returns {Promise<Employee>}
     */
    async getLastEmployee() {
        const lastEmployeeTR = await this.page.locator('tr').last();
        const editBtn = await lastEmployeeTR.locator('td:nth-child(4) a');
        const href = await editBtn.getAttribute("href");
        const id = href.replace("/employee/", "");
        const employee = await getEmployee(this.page, id);
        return employee;
    }

}