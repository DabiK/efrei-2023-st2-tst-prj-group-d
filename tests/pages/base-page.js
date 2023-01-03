

export class BasePage {
    locators;
    page;

    constructor(page,locatorConfiguration){
        this.page = page;
        this.locators = {}
        Object.keys(locatorConfiguration).forEach(key => {
            this.locators[key] = page.locator(locatorConfiguration[key]);
        })
    }

    async wait(time){
        await this.page.waitForTimeout(time);
    }
}