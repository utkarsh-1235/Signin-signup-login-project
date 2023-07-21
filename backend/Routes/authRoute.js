const express = require('express')
const authRoute = express.Router()


const jwtAuth = require('../Middleware/jwtAuth.js')
const {signup,
       signin, 
       forgotPassword,
       ResetPassword,
       getUser, 
       logout,
} = require('../Controllers/authController.js')


authRoute.post("/signup",signup)
authRoute.post("/signin",signin)
authRoute.post("/forgotPassword",forgotPassword)
authRoute.post("/ResetPassword/:token",ResetPassword)


authRoute.get("/user",jwtAuth,getUser)
authRoute.get("/logout",jwtAuth,logout)

module.exports = authRoute