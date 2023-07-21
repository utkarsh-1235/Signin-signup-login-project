const userModel = require('../Models/userSchema')
const emailValidator = require('email-validator')
const crypto = require('crypto')
const bcrypt = require('bcrypt')


// sign up controller

 const signup = async(req,res,next)=>{
    const{name,email,password,confirmPassword} = req.body
    console.log(name,email,password,confirmPassword)
    //res.send({msg:"nothing"})
    // If anyone from name, email, password, confirmPassword not provide throw error

    if(!name || !email || !password || !confirmPassword){
        return res.status(400).json({
            success:false,
            messaage:"Every field is required"
        })
    }


    const validEmail = emailValidator.validate(email);

    // If email is not valid throw error
    if(!validEmail){
        return res.status(400).json({
            success:false,
            message:"Enter valid email"
        })
    }

    // If password and confirm password not matches throw error
    if(password !== confirmPassword){
        return res.status(400).json({
            success:false,
            message:"password and confirm password not match"
        })
    }
    try{
        const userInfo = userModel(req.body);
       
        // userSchema "pre" middleware functions for "save" will hash the password using bcrypt
    // before saving the data into the database

        const result = await userInfo.save()
    
       return res.status(200).json({
            success : true,
            data : {result}
        })
    }
    catch(err){
        if(err.code === 11000){
            return res.status(400).json({
                success:false,
                message:`account already exists with provided email ${email}`
            })
        }
        return res.status(400).json({
            message:e.message
        })
    }
    
     
 }



 //signin controller
 const signin = async(req,res) => {
       const { email, password } = req.body;

       if(!email || !password){
         return res.status(400).json({
            success:false,
            message:"Every field is mandatory"
         })
       }

       try{
        const user = await userModel
        .findOne({
         email
        })
        .select("+password")
         
     //  If user not exist and password not matches to actual password then show error
   
        if(!user || await bcrypt.compare(password, user.password )){
              return res.status(400).json({
                 success:false,
                 message:"invalid credentials"
              })
        }
 
 // Generate token
        const token = user.jwtToken()
        user.password = undefined
 
        const cookieOption = {
         maxAge: 24*60*60*1000,
         httpOnly: true
        }
        res.cookie("token", token, cookieOption);
        res.status(200).json({
         success : true,
         data : user
        })
  }
       catch(err){
            res.status(400).json({
                success : false,
                message : err.message
            })
       }
    }


    const forgotPassword = async(req,res,next)=>{
        const email = req.body.email


        // return response with error message If email is undefined
        if(!email){
            return res.status(400).json({
                success: false,
                message: "Email is required"
            })
        }

        try{
            const user = await userModel.findOne({
                email
            })

            // return response with error messgae user not found
            if(!user){
                return res.status(400).json({
                    success: false,
                    message: "user not found"
                })
            }

            // Generate the token with userSchema method getForgotpasswordToken().

            const forgotPasswordToken = user.getForgotPasswordToken()
            console.log(forgotPasswordToken)
            await user.save();

            return res.status(200).json({
                success: true,
                token: forgotPasswordToken
            })
            
        }
        catch(err){
            return res.status(400).json({
                success: false,
                message: err.message
            })
        }
    }


    //Reset Password
    const ResetPassword = async(req,res,next)=>{
          const {token} = req.params;
          const {password, confirmPassword } = req.body

          // return error message if password or confirmPassword is missing
          if(!password || !confirmPassword){
            return res.status(400).json({
                success: false,
                message: "password and confirmPassword required"
            })
          }

          //return error if password and confirmPassword are not same
          if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "password and confirmPassword are not match"
            })
          }
          const hashToken = crypto.createHash("sha256").update(token).digest("hex");

          try{
            const user = await userModel.findOne({
                forgotPasswordToken: hashToken,
                forgotPasswordExpiryDate: {
                    $gt: new Date()  // forgot passwordExpiryDate() less the current Date
                }
            })

            //return the message if user not found
            if(!user){
                return res.status(400).json({
                    success: false,
                    message: "Invalid Token or token is expired"
                })
            }
            user.password = password
            await user.save()
            return res.status(200).json({
                success: true,
                message: "successfully reset the password"
            })
          }
          catch(err){
            return res.status(400).json({
                success: false,
                message: err.message
            })
          }
    }

   // login user
    const getUser = async(req,res)=>{
        const userId = req.user.id

        try{
            const user = await userModel.findById(userId)
            return res.status(200).json({
                success : true,
                data : user
            })
        } catch(err){
            return res.status(400).json({
                success : false,
                message : err.message
            })
        }
    }


    // logout
    const logout = async(req,res)=>{
          try{
            const cookieOption = {
                expires : new Date(),
                httpOnly : true
            }
               res.cookie("token", null, cookieOption)
               res.status(200).json({
                success : true,
                message : "Loged Out"
               })
          }
          catch(err){
               res.status(400).json({
                  success : false,
                  message : err.message
          })
          }
    }



 module.exports = {
    signup, 
    signin, 
    forgotPassword,
    getUser,
    ResetPassword,
    logout,
   
 }