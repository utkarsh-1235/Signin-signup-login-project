const mongoose = require('mongoose')
require('dotenv').config()
//const MONGODB_URL = process.env.MON_URL


const connectTodb =()=>{mongoose
  .connect(process.env.MON_URL)
  .then((conn)=>{
  console.log(`Database connected successfully ${conn.connection.host}`)
})
  .catch((err)=>{
  console.log("ERROR",err.message)
})

}

module.exports = connectTodb