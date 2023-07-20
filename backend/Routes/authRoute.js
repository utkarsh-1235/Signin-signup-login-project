const express = require('express')
const jwtAuth = require('../Middleware/jwtAuth')
const {signup,
       signin, 
       getUser, 
       logout} = require('../Controllers/authController')
const authRoute = express.Router()

authRoute.post("/signup",signup)
authRoute.post("/signin",signin)
authRoute.get("/user",jwtAuth,getUser)
//authRoute.get("/logout",jwtAuth,logout)

module.exports = authRoute