import { BasePage } from "./base-page";

export class HomePage extends BasePage {

    static HOME_PAGE_SELECTORS = [
        'a[href="/reset_db"]', // Lien reset dbb
    ]

    constructor(page) {
        super(page, HomePage.HOME_PAGE_SELECTORS);
    }

    async clickOnReset() {
        const resetLink = this.locators['a[href="/reset_db"]'];
        resetLink.click();
    }
}