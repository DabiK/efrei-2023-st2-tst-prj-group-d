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

    /**
     * Permet de remplir le formulaire avec les valeurs indiquées
     * @param {string} name
     * @param {string} email
     */
    async fillForm(name, email) {
        await this.page.getByLabel('Name').fill(name);
        await this.page.getByLabel('Email').fill(email);
    }

    /**
     * Permet de change le type de l'email en un champ texte classique
     */
    async changeEmailType() {
        await this.page.evaluate(() => document.querySelector('input[type="email"]')?.setAttribute("type", "text"));
    }

    /**
     * Permet de faire en sorte que tous les champs du formulaire ne soient pas requis
     */
    async changeAllFieldsToUnrequired() {   
        await this.page.evaluate(() => document.querySelectorAll('input').forEach((inputElement) => inputElement.setAttribute('required', false)));
    }

    /**
     * Soumet le formulaire de la page
     */
    async submitForm() {
        const submitBtn = this.page.getByRole('button');
        await submitBtn.click();
    }


}