const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    // ***********  checking validations  ***********

    if (!Validator.isEmail(data.email)) {
        errors.email = 'Please enter valid email';
    }

    // ***********  checking validations  ***********

    // **********  Required fields ********************


    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = ' Password field is required';
    }

     // **********  Required fields ********************
     
    return {
        errors,
        isValid: isEmpty(errors)
    }
}