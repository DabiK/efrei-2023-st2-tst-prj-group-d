import { BasePage } from "./base-page"

export class ContractPage extends BasePage {

    constructor(page) {
        super(page, []);
    }


    /**
     * Récupère la valeur de la date d'embauche 
     * @returns {Date|null}
     */
    async getHiringDate() {
        const value = await this.page.locator('input[name="hiring_date"]').inputValue();
        return value ? new Date(value): null;
    }


    /**
     * Récupère la valeur du job title
     * @returns {string}
     */
    async getJobTitle() {
        return await this.page.locator('input[name="job_title"]').inputValue();
    }
}