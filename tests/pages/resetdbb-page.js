import { BasePage } from "./base-page";

export class ResetDatabasePage extends BasePage {

    static RESET_DATABASE_SELECTORS = ['button']

    resetDatabaseButton;

    constructor(page) {
        super(page, ResetDatabasePage.RESET_DATABASE_SELECTORS);
        this.resetDatabaseButton = this.page.getByRole('button');
    }

    async resetDatabase() {
        await this.resetDatabaseButton.click();
    }
}