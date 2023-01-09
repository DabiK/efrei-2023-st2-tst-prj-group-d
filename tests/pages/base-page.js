export class BasePage {
  locators;
  page;
  path;
  constructor(page, path, locatorConfiguration) {
    this.page = page;
    this.locators = {};
    this.path = path;

    Object.keys(locatorConfiguration).forEach(async (key) => {
      this.locators[key] = await page.locator(locatorConfiguration[key]);
    });
  }

  async wait(time) {
    await this.page.waitForTimeout(time);
  }

  async scrollOnElement(selector) {
    await this.page.$eval(selector, (element) => {
      element.scrollIntoView();
    });
  }

  async goto() {
    this.page.goto(this.path);
  }

  async exist(selector) {
    return (await this.page.locator(selector).count()) > 0;
  }
}
