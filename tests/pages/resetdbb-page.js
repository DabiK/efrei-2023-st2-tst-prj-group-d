import { BasePage } from "./base-page";

export class ResetDatabasePage extends BasePage {

    static RESET_DATABASE_SELECTORS = ['button']

    constructor(page) {
        super(page, ResetDatabasePage.RESET_DATABASE_SELECTORS);
    }

    async resetDatabase() {
        await this.page.getByRole('button').click();
    }
}