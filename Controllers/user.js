const User=require('../Models/user')
const Group=require('../Models/group')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Sequelize=require('sequelize')
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

exports.showParticipants = async (req, res) => {
    try {
        const groupId = req.params.groupId
        const group = await Group.findByPk(groupId)

        if (!group) {
            return res.status(404).json({ error: "Group not found" })
        }

        const usersInGroup = await group.getUsers()
        
        // Create an array of user IDs in the group
        const userIDsInGroup = usersInGroup.map((user )=>{
         return user.id})

        const usersNotInGroup = await User.findAll({
            attributes: ['id', 'name'],
            where: {
                id: {
                    [Sequelize.Op.notIn]: userIDsInGroup, // Use an array of user IDs
                },
            },
        });

        // console.log(usersNotInGroup)
        res.status(200).json({users:usersNotInGroup })
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }
}


exports.addParticipants = async (req, res) => {
    try {
        const { usersId, groupId } = req.body

        const group = await Group.findByPk(groupId);

        for (let id of usersId) {
            const user = await User.findByPk(id)
            await user.addGroup(group)
        }

        res.status(200).json({ success: true, message: 'Participants added successfully' })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err })
    }
}
exports.getUserList=async(req,res)=>{
    try{
        const groupId=req.params.groupId
        const group=await Group.findByPk(groupId)
        const users=await group.getUsers({
            attributes:['id','name']
        })
        // console.log(users)
        if(users.length===0){
            return res.status(200).json({success:true,userList:[]})
        }
        res.status(200).json({success:true,userList:users,groupName:group.groupName})
        


    }catch (err) {
        console.error(err);
        res.status(500).json({ error: err })
    }
}
