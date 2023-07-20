const JWT = require('jsonwebtoken');
require('dotenv').config()

// In this middleware we find email password from token which is stored in cookies
const jwtAuth = (req, res, next)=>{
    const token = (req.cookies && req.cookies.token) || null
   
    // If token is not generated
    if(!token){
        return res.status(400).json({
            success : false,
            message : 'Not Authorized'
        })
    }


    try{
        const payload = JWT.verify(token, process.env.SECRET)
        req.user = { id : payload.id, email : payload.email};
    }
    catch(err){
        return  res.status(400).json({
            success : false,
            messsage : err.message
        })
    }
    next()
}

module.exports = jwtAuth