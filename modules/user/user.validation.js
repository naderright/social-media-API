const Joi = require('Joi');



const profile = {
    headers: Joi.object().required().keys({
        authorization: Joi.string().required()
    }).options({ allowUnknown: true })
}

const profile2 = {
    body: Joi.object().required().keys({
        name: Joi.string().required()
    }).options({ allowUnknown: true })
};

const messagesAdmin = {
    params: Joi.object().required().keys({
        users: Joi.string().required().max(24).min(24)
    }).options({ allowUnknown: true })
}

const updatePassword = {

    body: Joi.object().required().keys({
   
        oldPassword: Joi.string().required().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
        newPassword: Joi.string().required().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
        cPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
    })
}

module.exports = { profile,profile2 ,messagesAdmin,updatePassword}