import { pages } from "../page-helper";
import { BasePage } from "./base-page";

/**
 * Modèle correspondant à la page https://d.hr.dmerej.info/employee/{id}
 */
export class EmployeePage extends BasePage {

    /**
     * 
     * @param {object} page 
     * @param {number} employeeId 
     */
    constructor(page, employeeId) {
        super(page, `${pages.EDIT_EMPLOYEE}/${employeeId}`, []);
    }

    /**
     * Récupère le nom affiché sur cette page
     * @returns {string}
     */
    async getName() {
        const content = await this.page.locator('p').first().textContent();
        const [name, _] = content.split(' - ');

        return name.trim();
    }


    /**
     * Récupère l'email affiché sur cette page
     * @returns {string}
     */
    async getEmail() {
        const content = await this.page.locator('p').first().textContent();
        const [_, email] = content.split(' - ');

        return email.trim();
    }

    /**
     * Récupère le jobtitle affiché sur cette page
     * @returns {Promise<string>}
     */
    async getJobTitle() {
        return this.page.locator('p').nth(1).textContent();
    }
}