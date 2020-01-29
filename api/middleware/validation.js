const isEmail = email => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // return !!email.match(reqEx); // BELOW SAME
    if (email.match(regEx)) {
        return true;
    } else {
        return false;
    }
};

const isEmpty = string => {
    if (string.trim() === "") {
        return true;
    } else {
        return false;
    }
};

const isTen = phone => {
    if (phone.length === 10) {
        return true;
    } else {
        return false;
    }
};

exports.validateSignupData = data => {
    let errors = {};

    if (isEmpty(data.email)) {
        errors.email = "Must not be empty";
    } else if (!isEmail(data.email)) {
        errors.email = "Must be a valid email address";
    }

    if (isEmpty(data.password)) errors.password = "Must not be empty";
    if (data.password !== data.confirmPassword)
        errors.confirmPassword = "Passwords must match";

    // if(!isTen(data.phone)) errors.phone = 'Please input valid telephone number';

    return {
        errors,
        valid: Object.keys(errors).length === 0
    };
};

exports.validateLoginData = data => {
    let errors = {};

    if (isEmpty(data.email)) errors.email = "Must not be empty";
    if (isEmpty(data.password)) errors.password = "Must not be empty";

    return {
        errors,
        valid: Object.keys(errors).length === 0
    };
};
