import { BasePage } from "./base-page";

export class HomePage extends BasePage {

    selectors = [
        'a[href="/reset_db"]', // Lien reset dbb
    ]

    constructor(page) {
        super(page, this.selectors);
    }

    async clickOnReset() {
        const resetLink = this.locators[''];
        resetLink.click();
    }
}