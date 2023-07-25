const mongoose = require("mongoose")
const JWT = require('jsonwebtoken')
require('dotenv').config()
const bcrypt = require('bcrypt')
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


userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    return next()
})
userSchema.methods = {
    jwtToken(){
        return JWT.sign({
            id: this._id, email: this.email},
            process.env.SECRET,
            { expiresIn: '24h'}
        )
    },



//userSchema method for generating and return forgotPassword token
getForgotPasswordToken() {
    const forgotToken = crypto.randomBytes(20).toString('hex')
    //step 1 - save to DB
    this.forgotPasswordToken = crypto
      .createHash('sha256')
      .update(forgotToken)
      .digest('hex');

    /// forgot password expiry date
    this.forgotPasswordExpiryDate = Date.now() + 20 * 60 * 1000 // 20min

    //step 2 - return values to user
    return forgotToken;
  }
}
// console.log(process.env.SECRET)
const userModel = mongoose.model('user',userSchema)

module.exports = userModel