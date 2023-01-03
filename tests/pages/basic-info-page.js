import { BasePage } from "./base-page";


/**
 * Modèle correspondant à la page https://d.hr.dmerej.info/employee/{id}/basic_info
 */
export class BasicInfoPage extends BasePage {

    constructor(page) {
        super(page, []);
    }

    /**
     * Permet de récupérer la valeur du nom préindiquée à l'affichage du formulaire
     * @returns {string}
     */
    async getName() {
        return await this.page.getByLabel('Name').inputValue();
    }

    /**
     * Permet de récupérer la valeur de l'email préindiquée à l'affichage du formulaire
     * @returns {string}
     */
    async getEmail() {
        return await this.page.getByLabel('Email').inputValue();
    }

}