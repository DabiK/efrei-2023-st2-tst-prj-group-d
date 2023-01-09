import { pages } from "../page-helper";
import { BasePage } from "./base-page";

/**
 * Page Modal de la page basée sur l'url https://d.hr.dmerej.info/employee/{id}/address
 */
export class AddressPage extends BasePage {

    /**
     * 
     * @param {object} page 
     * @param {number} employeeId 
     */
    constructor(page, employeeId) {
        super(page, `${pages.EDIT_EMPLOYEE}/${employeeId}/address`, []);
    }

    /**
     * Récupère la première ligne de l'adresse
     * @returns {string}
     */
    async getAddress1() {
        return await this.page.locator('input[name="address_line1"]').inputValue();
    }

    /**
     * Récupère la seconde ligne de l'adresse
     * @returns {string}
     */
    async getAddress2() {
        return await this.page.locator('input[name="address_line2"]').inputValue();
    }

    /**
     * Récupère la valeur du champ city
     * @returns {string}
     */
    async getCity() {
        return await this.page.locator('input[name="city"]').inputValue();
    }

    /**
     * Récupère la valeur du champ ZipCode
     * @returns {string}
     */
    async getZipcode() {
        return await this.page.locator('input[name="zip_code"]').inputValue();
    }
}