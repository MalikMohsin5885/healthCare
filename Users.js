class Users{
    constructor(id,fName,lName,dob,gender,email,password,country,city,postcode,role_id){
        this.id = id;
        this.fName = fName;
        this.lName = lName;
        this.dob = dob;
        this.gender = gender;
        this.email = email;
        this.password = password;
        this.country = country;
        this.city = city;
        this.postcode = postcode;
        this.role_id = role_id;
    }
}

module.exports = Users;