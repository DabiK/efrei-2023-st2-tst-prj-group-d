export class Employee {

  id;
  name;
  email;
  addressLine1;
  addressLine2;
  city;
  zipCode;
  hiringDate;
  jobTitle;

  constructor(name,email,addressLine1,addressLine2,city,zipCode,hiringDate,jobTitle, id = 0){
    this.id = id;
    this.name = name
    this.email = email;    
    this.addressLine1 = addressLine1;
    this.addressLine2 = addressLine2;
    this.city = city;
    this.zipCode = zipCode;
    this.hiringDate = hiringDate;
    this.jobTitle = jobTitle;
  }
}
