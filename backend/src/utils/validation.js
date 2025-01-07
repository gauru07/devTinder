const { validate } = require("../models/user");

//creating function to validate data for our project
const validator = require('validator');

const validateSignUpData = (req) => {
 const {firstName , lastName , emailId , password} = req.body;

      if( !firstName || !lastName){
        throw new error("Name is not valid");
      }
      else if(firstName.length<4 || firstName.length>50){
        throw new Error("firstName should be 4-50 characters");
      }
      else if(lastName.length<4 || lastName.length>50){
        throw new Error("lastName should be 4-50 characters");
      }
      else if (!validator.isEmail(emailId)) {
        throw new Error("Invalid email address");
      }
      else if (!validator.isStrongPassword(password)) {
        throw new Error("please enter strong Password.");
      }
};

module.exports = {
    validateSignUpData,
}