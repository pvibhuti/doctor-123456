const Validator = require('validatorjs');
const admin = require("./admin/model/admin.js");
const doctor = require('./doctor/model/doctor.js');
const patient = require('./patient/model/patient.js');

const validator = async (body, rules, callback) => {
    const validation = new Validator(body, rules);
    console.log(validation);

    //emailAvailable
    Validator.registerAsync('emailAvailable', async (email, attribute, req, passes) => {
        try {
            const formattedEmail = email.toLowerCase();
            const emailadmin = await admin.findOne({ email: formattedEmail });
            if (!emailadmin) {
                passes(); // email is unique
            } else {
                passes(false, 'email has already been taken.');
            }
        } catch (error) {
            passes(false, 'Error checking email availability.');
        }
    });

    // --------------------------doctor validation-----------------------------------//
    //emailExist
    Validator.registerAsync('emailExist', async (email, attribute, req, passes) => {
        try {
            const formattedEmail = email.toLowerCase();
            const emaildoctor = await doctor.findOne({ email: formattedEmail });
            if (!emaildoctor) {
                passes(); // email is unique
            } else {
                passes(false, 'email has already been taken.');
            }
        } catch (error) {
            passes(false, 'Error checking email availability.');
        }
    });

    //uniqueNo
    Validator.registerAsync('uniqueNo', async (phone, attribute, req, passes) => {
        try {
            // const formattedEmail = email.toLowerCase();
            const phonedoctor = await doctor.findOne({ phone });
            if (!phonedoctor) {
                passes(); // email is unique
            } else {
                passes(false, 'phone has already been taken.');
            }
        } catch (error) {
            passes(false, 'Error checking phone availability.');
        }
    });


    //------------------Patient Validation ----------------------------------//
      //emailExist
      Validator.registerAsync('emailExisting', async (email, attribute, req, passes) => {
        try {
            const formattedEmail = email.toLowerCase();
            const emaildoctor = await patient.findOne({ email:formattedEmail });
            if (!emaildoctor) {
                passes(); // email is unique
            } else {
                passes(false, 'email has already been taken.');
            }
        } catch (error) {
            passes(false, 'Error checking email availability.');
        }
    });

    //uniqueNo
    Validator.registerAsync('uniqueNumber', async (phone, attribute, req, passes) => {
        try {
            // const formattedEmail = email.toLowerCase();
            const phonedoctor = await patient.findOne({phone });
            if (!phonedoctor) {
                passes(); // email is unique
            } else {
                passes(false, 'phone has already been taken.');
            }
        } catch (error) {
            passes(false, 'Error checking phone availability.');
        }
    });

    validation.passes(() => callback(null, true));
    validation.fails(() => callback(convert(validation), false));
};



function convert(errors) {
    var tmp = errors.errors.all();
    var obj = {};
    for (let key in tmp) {
        obj[key] = tmp[key].join(",");
    }

    return obj;
}


module.exports = validator;