const { roles } = require("../../middlwaer/auth");


const endPoint  = {
    createPost : [roles.User , roles.Admin]
}


module.exports = endPoint