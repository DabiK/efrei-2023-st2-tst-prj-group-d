import { pages } from "../page-helper";
import { BasePage } from "./base-page";

export class ResetDatabasePage extends BasePage {

    static RESET_DATABASE_SELECTORS = ['button']

    constructor(page) {
        super(page, pages.RESET_DBB, ResetDatabasePage.RESET_DATABASE_SELECTORS);
    }

    async resetDatabase() {
        await this.page.getByRole('button').click();
    }
}