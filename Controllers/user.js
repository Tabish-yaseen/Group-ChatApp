const User=require('../Models/user')
const bcrypt=require('bcryptjs')

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