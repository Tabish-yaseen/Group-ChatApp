const User=require('../Models/user')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
require('dotenv').config()


function generateWebToken(id,name){
   return jwt.sign({userId:id,userName:name},process.env.SECRET_KEY)
}

function isStringInvalid(string){
    if(string==undefined && string.length==0){
        return true
    }
    else{
        return false
    }

}

exports.signup=async(req,res)=>{
    try{
        const{name,email,phoneno,password}=req.body    

        if(isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(phoneno) || isStringInvalid(password)){
            return res.status(400).json({error:"something is missing"})
        }
        const existingUser = await User.findOne({ where: { email: email } });

        if (existingUser) {
            return res.status(400).json({ error: "User with this email already exists.Please Login" });
        }
        const saltround=10
        const hash=await bcrypt.hash(password,saltround)
    
        const user=await User.create({name:name, email:email,password:hash,phoneno:phoneno})
    
        res.status(200).json({success:true,message:'User Signedup Successfully'})

    }catch(err){
        console.log("err",err)
        res.status(500).json({error:err})
    }
    
}

exports.login=async(req,res)=>{
    try{
        const{email,password}=req.body

        if(isStringInvalid(email) || isStringInvalid(password)){
            return res.status(400).json({error:"something is missing"})
        }
        const user=await User.findOne({where:{email:email}})
        if(user){
            const matchedPassword=await bcrypt.compare(password,user.password)
            if(matchedPassword){
                res.status(200).json({success:true,message:"User Logged In Successfully!",token:generateWebToken(user.id,user.name)})
            }
            else{
                res.status(400).json({error:"Invalid Password"})
            }
            

        }else{
            res.status(400).json({error:"User with This Email Doesn't Exist!"})
        }


    }catch(err){
        console.log(err)
        res.status(500).json({error:err})

    }

}