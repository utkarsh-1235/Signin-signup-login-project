const mongoose = require("mongoose")
const JWT = require('jsonwebtoken')
require('dotenv').config()
//Defining userSchema on which database store the data
const userSchema = mongoose.Schema({
   name:{
        type:String,
        required:[true,"user name is required"],
        minLength:[5,"Name must be at least 5 characters"],
        maxLength:[50,"Name must be less than 50 characters"],
        trim:true
   },
   email:{
        type:String,
        required:[true,"user email is required"],
        unique:true,
        lowecase:true,
        unique:[true,"already registered"]
   },
   password:{
        type:String,
        //required:[true,"user password is required"],
        select:false
   },
   forgotPassword:{
        type:String
   },
   forgotPasswordExpiry:{
        type:Date
   }

},{
    timestamps:true
})

userSchema.methods = {
    jwtToken(){
        return JWT.sign({
            id: this._id, email: this.email},
            process.env.SECRET,
            { expiresIn: '24h'}
        )
    }
}
// console.log(process.env.SECRET)
const userModel = mongoose.model('user',userSchema)

module.exports = userModel