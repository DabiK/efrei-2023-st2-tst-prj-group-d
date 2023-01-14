import { pages } from "../page-helper";
import { BasePage } from "./base-page";

/**
 * Page Modal de la page basée sur l'url https://d.hr.dmerej.info/employee/{id}/address
 */
export class AddressPage extends BasePage {

    const 

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
     * @returns {Promise<string>}
     */
    getAddress1() {
        return this.page.locator('input[name="address_line1"]').inputValue();
    }

    /**
     * Récupère la seconde ligne de l'adresse
     * @returns {Promise<string>}
     */
    getAddress2() {
        return this.page.locator('input[name="address_line2"]').inputValue();
    }

    /**
     * Récupère la valeur du champ city
     * @returns {Promise<string>}
     */
    getCity() {
        return this.page.locator('input[name="city"]').inputValue();
    }

    /**
     * Récupère la valeur du champ ZipCode
     * @returns {Promise<string>}
     */
    getZipcode() {
        return this.page.locator('input[name="zip_code"]').inputValue();
    }


    /**
     * Permet de change le type du zipcode en un champ texte classique
     * @returns {Promise}
     */
    async changeZipcodeType() {
        await this.page.waitForNavigation();
        await this.page.evaluate(() => document.querySelector('input[type="number"]')?.setAttribute("type", "text"));
    }

    /**
     * Rempli le formulaire
     * @param {string} addressLine1 
     * @param {string} addressLine2 
     * @param {string} city 
     * @param {number} zipcode 
     */
    async fillForm(addressLine1, addressLine2, city, zipcode) {
        await this.page.locator('input[name="address_line1"]').fill(addressLine1);
        await this.page.locator('input[name="address_line2"]').fill(addressLine2);
        await this.page.getByLabel('City').fill(city);
        await this.page.getByLabel('Zip code').fill(zipcode + "");
    }


    /**
     * Soumet le formulaire de la page
     */
    async submitForm() {
        const submitBtn = this.page.getByRole('button');
        await submitBtn.click();
    }
}