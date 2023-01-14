import { pages } from "../page-helper";
import { BasePage } from "./base-page"

export class ContractPage extends BasePage {

    /**
     * 
     * @param {object} page 
     * @param {number} employeeId 
     */
    constructor(page, employeeId) {
        super(page, `${pages.EDIT_EMPLOYEE}/${employeeId}/contract`, []);
    }


    /**
     * Récupère la valeur de la date d'embauche 
     * @returns {Date|null}
     */
    async getHiringDate() {
        const value = await this.page.locator('input[name="hiring_date"]').inputValue();
        return value ? new Date(value).toLocaleDateString(): null;
    }


    /**
     * Récupère la valeur du job title
     * @returns {Promise<string>}
     */
    getJobTitle() {
        return this.page.locator('input[name="job_title"]').inputValue();
    }


    /**
     * Permet de modifier la date d'embauche, en changeant l'attribut readonly sur le champ
     * @param {string} date
     */
    async editHiringDate(date) {
        await this.removeReadonlyOnDate();
        await this.page.getByLabel("Hiring date").fill(date);
    }

    /**
     * Permet de retirer l'attribut readonly sur l'élément
     */
    async removeReadonlyOnDate() {
        await this.page.waitForNavigation();
        await this.page.evaluate(() => document.querySelector('input[name="hiring_date"]')?.removeAttribute("readonly"));
    }

    /**
     * Rempli le formulaire
     * @param {string} jobTitle 
     */
    async fillForm(jobTitle) {
        await this.page.getByLabel('Job title').fill(jobTitle);
    }

    /**
     * Soumet le formulaire de la page
     */
    async submitForm() {
        const submitBtn = this.page.getByRole('button');
        await submitBtn.click();
    }
}