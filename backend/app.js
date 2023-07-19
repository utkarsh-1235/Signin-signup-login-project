const express = require('express')
const app = express();

const authRouter = require('./Routes/authRoute')
const connectTodb = require('./Config/db')

// Database connected
 connectTodb()
app.use(express.json())
app.use("/api/auth/",authRouter)
app.use("/",(req,res)=>{
   res.status(200).json({
    data:"JWT auth server"
   })
})




module.exports = app