

const Joi = require('joi');


const signup = {
    body: Joi.object().required().keys({
        userName:Joi.string().required().pattern(new RegExp(/[A-Z][a-zA-Z][^#&<>\"~;$^%{}?]{1,20}$/)).messages({
            'any.required':"plz send u name"
        }),
        email:Joi.string().email().required(),
        password:Joi.string().required().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
        cPassword:Joi.string().valid(Joi.ref('password')).required(),
        age:Joi.number().min(18).required(),
        gender:Joi.string().required(),
    })
}


const forgetPassword = {

    body: Joi.object().required().keys({
        email: Joi.string().email().required(),
        newPassword: Joi.string().required().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
        cPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
        code: Joi.number().required(),
    })
}


const confirmEmail = {
    params: Joi.object().required().keys({
        token:Joi.string().required(),
    })
}


const logout = {
    headers: Joi.object().required().keys({
        authorization: Joi.string().required()
    }).options({ allowUnknown: true })
}




const login = {
    body: Joi.object().required().keys({
        email:Joi.string().email().required(),
        password:Joi.string().required().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
       
    })
}
module.exports =  {
    signup,
    confirmEmail,
    login,
    logout,
    forgetPassword
}