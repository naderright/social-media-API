const jwt = require('jsonwebtoken')
const userModel = require('../DB/model/User')
const roles = {
    User: "User",
    Admin: "Admin",
    Hr: 'hr'
}

const auth = (accessRoles) => {

    return async (req, res, next) => {
        try {
            const headertoken = req.headers['authorization']
            if (!headertoken || headertoken == null ||
                headertoken == undefined || !headertoken.startsWith('Bearer ')) {
                res.json(403).json({ message: "in-valid header Token" })
            } else {
                const token = headertoken.split(" ")[1];
                const decoded = jwt.verify(token, process.env.TokenSecreat)
                if (!decoded || !decoded.isLoggedIn) {
                    res.status(403).json({ message: "in-valid token" })
                } else {
                    const findUser = await userModel.findById(decoded.id).select('userName email role')
                    if (!findUser) {
                        res.status(404).json({ message: "in-valid user account" })
                    } else {
                        if (!accessRoles.includes(findUser.role)) {
                            res.status(401).json({ message: "Not authorized" })
                        } else {
                            req.user = findUser
                            next()
                        }

                    }
                }
            }
        } catch (error) {
            res.status(500).json({ message: "catch error" , error })

        }

    }
}

    module.exports = {
        auth, roles
    }