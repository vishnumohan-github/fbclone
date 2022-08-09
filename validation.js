const Joi = require('joi');

const registervalidation = (data)=> {

    const schema = {
        name: Joi.string()
        .min(6)
        .required(),
        email: Joi.string()
        .email()
        .required(),
        password: Joi.string()
        .min(6)
        .required()
    };
    return Joi.validate(data,schema);
};
const loginValidation = (data)=> {

    const schema = {
        email: Joi.string()
        .email()
        .required(),
        password: Joi.string()
        .min(6)  
        .required()
    };
    return Joi.validate(data,schema);
};

const resetPasswordValidation = (data) =>{
    const schema = {
        email: Joi.string()
        .required()
        .email()
    };
    return Joi.validate(data,schema);
};
const resetValidation = (data) =>{
    const schema = {
        password: Joi.string()
        .required()
    };
    return Joi.validate(data,schema);
}; 

module.exports.registervalidation = registervalidation;
module.exports.loginValidation = loginValidation;
module.exports.resetPasswordValidation = resetPasswordValidation;
module.exports.resetValidation = resetValidation;
