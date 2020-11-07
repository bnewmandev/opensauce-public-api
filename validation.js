const Joi = require("@hapi/joi");

//Register validation
const registerValidation = (data) => {
    const schema = {
        username: Joi.string().min(6).max(16).required(),
        name: Joi.string().min(3).max(32).required(),
        email: Joi.string().email().min(6).max(32).required(),
        password: Joi.string().min(6).max(32).required()
    };
    return Joi.validate(data, schema)
}

//Login validation
const loginValidation = (data) => {
    const schema = {
        username: Joi.string().min(6).max(16).required(),
        password: Joi.string().min(6).max(32).required()
    };
    return Joi.validate(data, schema)
}

//Post validation
const postValidation = (data) => {
    const schema = {
        title: Joi.string().min(8).max(32).required(),
        body: Joi.string().min(8).max(4096).required(),
        image: Joi.string()
    };
    return Joi.validate(data, schema)
}

//Comment Validation
const commentValidation = (data) => {
    const schema = {
        title: Joi.string().max(32).min(8).required(),
        body: Joi.string().max(2048).min(8).required()
    };
    return Joi.validate(data, schema)
}

//Password change validation
const passwordValidation = (data) => {
    const schema = {
        newpassword: Joi.string().min(6).max(32).required()
    };
    return Joi.validate(data, schema)
}


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.postValidation = postValidation;
module.exports.commentValidation = commentValidation;
module.exports.passwordValidation = passwordValidation;