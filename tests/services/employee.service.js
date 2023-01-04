import { Employee } from "../employee/model/employee";
import { pages } from "../page-helper";
import { AddressPage } from "../pages/address-page";
import { BasicInfoPage } from "../pages/basic-info-page";
import { ContractPage } from "../pages/contract-page";

export class EmployeeService {

    constructor(page) {
        this.page = page;
    }

    /**
     * Permet de récupérer un utilisateur précis en fonction de son id
     * @param {object} page
     * @param {number} id
     * 
     * @returns {Employee}
     */
    async getEmployee(page, id) {
        const employee = new Employee();
        employee.id = id;

        // Récupération du nom/email de l'employé
        const basicInfoPageModel = new BasicInfoPage(page);
        await page.goto(`${pages.EDIT_EMPLOYEE}/${id}/basic_info`);
        employee.name = await basicInfoPageModel.getName(); 
        employee.email = await basicInfoPageModel.getEmail();

        // Récupération des informations sur l'adresse
        const addressPageModal = new AddressPage(page);
        await page.goto(`${pages.EDIT_EMPLOYEE}/${id}/address`);
        employee.addressLine1 = await addressPageModal.getAddress1();
        employee.addressLine2 = await addressPageModal.getAddress2();
        employee.city = await addressPageModal.getCity();
        employee.zipCode = await addressPageModal.getZipcode();

        // Récupération des informations sur le job
        const jobPageModel = new ContractPage(page);
        await page.goto(`${pages.EDIT_EMPLOYEE}/${id}/contract`);
        employee.hiringDate = await jobPageModel.getHiringDate();
        employee.jobTitle = await jobPageModel.getJobTitle();

        return employee;
    }


    createEmployee() {

    }

}