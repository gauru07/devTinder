const validator = require("validator");


// --- PROFILE EDIT VALIDATION ---
// --- SIGNUP VALIDATION ---
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password, age, gender } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is required");
  }
  
  if (firstName.length < 2 || firstName.length > 50) {
    throw new Error("First name should be 2-50 characters");
  }
  
  if (lastName.length < 2 || lastName.length > 50) {
    throw new Error("Last name should be 2-50 characters");
  }
  
  if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email address");
  }
  
  if (!validator.isStrongPassword(password)) {
    throw new Error("Password must be at least 8 characters with uppercase, lowercase, number, and symbol");
  }
  
  if (!age || age < 18) {
    throw new Error("You must be at least 18 years old");
  }
  
  if (!["male", "female", "other"].includes(gender)) {
    throw new Error("Gender must be male, female, or other");
  }
};

// Update the allowed edit fields to match your schema
const validateProfileEditData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "bio",
    "skills",
    "age",
    "gender",
    "photoUrl",
    "photos",
    "sexualOrientation",
    "interestedIn",
    "relationshipType",
    "height",
    "location",
    "education",
    "jobTitle",
    "company",
    "religion",
    "ethnicity",
    "languagesSpoken",
    "drinking",
    "smoking",
    "prompts",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};

// --- PASSWORD VALIDATION ---
const passwordValidator = (req) => {
  const { password } = req.body;

  if (!password) throw new Error("Password is required!");
  if (!validator.isStrongPassword(password)) {
    throw new Error("Password must be at least 8 characters with numbers, symbols, uppercase, and lowercase letters!");
  }
  return true;
};

module.exports = {
  validateSignUpData,
  validateProfileEditData,
  passwordValidator,
};