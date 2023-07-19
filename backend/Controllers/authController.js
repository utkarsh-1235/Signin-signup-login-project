const userModel = require('../Models/userSchema')
const emailValidator = require('email-validator')



// sign up controller

 const signup = async(req,res,next)=>{
    const{name,email,password,confirmPassword} = req.body
    console.log(name,email,password,confirmPassword)

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
            message:"You enter wrong password"
        })
    }
    try{
        const userInfo = userModel(req.body);

        const result = await userInfo.save()
    
       return res.status(200).json({
            success:true,
            data:{result}
        })
    }
    catch(err){
        if(e.code === 11000){
            return res.status(400).json({
                success:false,
                message:'account already exists with provided email'
            })
        }
        return res.status(400).json({
            success:false,
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
 
        if(!user || user.password === password){
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
 module.exports = {
    signup, 
    signin, 
    getUser
 }