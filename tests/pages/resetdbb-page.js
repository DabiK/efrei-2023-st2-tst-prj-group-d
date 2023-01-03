import { BasePage } from "./base-page";

export class ResetDatabasePage extends BasePage {

    selectors = []

    constructor(page) {
        super(page, this.selectors);
    }

    async resetDatabase() {
        await page.goto("https://d.hr.dmerej.info/reset_db");

        const button = page.getByRole('button');
        await button.click();
    }

}