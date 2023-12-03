const router = require('express').Router();
const controller = require("./controller/registration")
const validators = require('./auth.validation');
const validation = require('../../middlwear/validation');
const { auth } = require('../../middlwear/auth');



//signup
router.post('/signup', validation(validators.signup), controller.signup)
//confirmEmail
router.get('/confirmEmail/:token', validation(validators.confirmEmail), controller.confirmEmail)


//login
router.post('/login', validation(validators.login), controller.login);
//recost forget code `
router.post('/sendCode' , controller.sendCode)
//forget password
router.patch("/forgetPassword" , validation(validators.forgetPassword),  
controller.forgetPassword)


//logout  
router.post('/logout',auth([ roles.Admin , roles.User , roles.Hr]), validation(validators.logout), controller.logout);

router.get('/redirect', function(req,res){
    res.sendFile(__dirname + '/views' + '/redirect.html');
  });






module.exports = router