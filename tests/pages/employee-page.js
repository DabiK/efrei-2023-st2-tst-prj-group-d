import { BasePage } from "./base-page";

/**
 * Modèle correspondant à la page https://d.hr.dmerej.info/employee/{id}
 */
export class EmployeePage extends BasePage {

    constructor(page) {
        super(page, []);
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

}