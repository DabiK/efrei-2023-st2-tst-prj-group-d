import { pages } from "../page-helper";
import { BasePage } from "./base-page";


/**
 * Page modèle de la page d'accueil (https://d.hr.dmerej.info/)
 */
export class HomePage extends BasePage {

    static HOME_PAGE_SELECTORS = [
        'a[href="/reset_db"]', // Lien reset dbb
    ]

    constructor(page) {
        super(page, pages.HOME, HomePage.HOME_PAGE_SELECTORS);
    }

    async clickOnReset() {
        const resetLink = this.locators['a[href="/reset_db"]'];
        resetLink.click();
    }
}