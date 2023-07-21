const express = require('express')
const app = express();

const authRouter = require('./Routes/authRoute')
const connectTodb = require('./Config/db')
const cookieParser = require('cookie-parser')
const cors = require('cors')


// Database connected
 connectTodb()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
   origin: [process.env.CLIENT_URL],
   credentials: true
}))

app.use("/api/auth/",authRouter)


app.use("/",(req,res)=>{
   res.status(200).json({
    data:"JWT auth server"
   })
})




module.exports = app