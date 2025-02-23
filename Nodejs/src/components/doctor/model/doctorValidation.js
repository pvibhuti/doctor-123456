const Validator = require("validatorjs");
const validator = require("../../validate.js");
const commonfun = require("../../Utils/CommonUtils.js");

async function validateDoctorInput(req, res, next) {

  let rules = {
    fullName: "required|string|min:3|max:15|regex:/^[A-Za-z ]+$/",
    email: ["required", "emailExist", "email", "regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/"],
    phone: ["required", "uniqueNo", "regex:/^[0-9]{10}$/"],
    password: ["required", "string", "min:8", "max:15"],
    gender: "required|string|min:3|max:15|regex:/^[A-Za-z]+$/|in:MALE,Male,male,female,Female,FEMALE",
    address: ["required", "string", "min:3", "max:35", "regex:/^[a-zA-Z0-9 ,.#/:()-]+$/"],
    // shiftStartTime:"required",
    // shiftEndTime:"required"
  };

  console.log("Rules:", rules);

  await validator(req.body, rules, async (errors, status) => {
    if (!status) {
      // console.log("Error :", errors);
      return commonfun.sendError(req, res, errors)
      return "ERROR";
    } else {
      next();
    }
  });

}
module.exports = { validateDoctorInput };