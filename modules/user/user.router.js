const router = require('express').Router();
const { auth } = require('../../middlwear/auth');
const validation = require('../../middlwear/validation');
const { validateFileMethod, myMulter } = require('../../service/multer');
const Admin = require('./controller/admin');
const controller = require("./controller/profile");

const endpoint = require('./user.endPoint');
const validators = require("./user.validation")



router.get('/',controller.allUser)

router.get("/profile", validation(validators.profile),
   auth(endpoint.displayProfile), controller.displayProfile);
 
router.patch("/profile/password", validation(validators.updatePassword),
 auth(endpoint.profile),
 controller.updatePassword);

 
 
    //Admin send email for multiple users
 router.post('/admin/message/(:users)*',auth(endpoint.admin),
 validation(validators.messagesAdmin),Admin.messagesAdmin)   

router.patch('/profile/pic'
 ,validation(validators.profile),
 myMulter('users/profilePic',validateFileMethod.image).single('image')
 ,validation(validators.profile2)
,auth(endpoint.displayProfile),controller.updateProfilePic);

router.patch('/profile/pic',
auth(endpoint.displayProfile),
 myMulter('users/profilePic',validateFileMethod.image).array('image')
 ,controller.updateProfileCoverPic);

 router.patch('/admin/:id',validation(validators.profile),
auth(endpoint.admin),Admin.blockUser);

router.patch('/profile',validation(validators.profile),
auth(endpoint.displayProfile),controller.DeactivateUser);









module.exports = router