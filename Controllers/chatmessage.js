const ChatMessage=require('../Models/chatmessage')
const User=require('../Models/user')
const Group=require('../Models/group')
const user_Groups=require('../Models/usergroup')
const Sequelize = require('sequelize')

exports.message=async(req,res)=>{
    try{
        const messageContent=req.body.messageContent
        const groupId=req.body.groupId

        const user=req.user
        const date=new Date()
       const message= await user.createChatMessage({ messageContent: messageContent,date:date,userName:user.name,groupId:groupId})

        res.status(200).json({userName:user.name,message:message.messageContent} )
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the message' })
    }
}
exports.getAllGroupMessages = async (req, res) => {
    try {
        const lastMessageId = req.query.lastMessageId
        const groupId=req.query.groupId
        // console.log(lastMessageId)
        // console.log(groupId)
        const messages = await ChatMessage.findAll({
            where: {
                id: {
                    [Sequelize.Op.gt]: lastMessageId
                },
                groupId:groupId
            }
        })
        if (messages.length === 0) {
            
            return res.status(200).json({ success: true, messages: [] })
        }

    //    console.log(messages)

        
        res.status(200).json({ success: true, messages: messages })
    } catch (err) {
        res.status(500).json({ error: err })
    }
}
exports.createGroup=async(req,res)=>{
    try{
        const user=req.user
        
        const  groupName=req.body.groupName
        const group=await user.createGroup({groupName:groupName,createdBy:user.name})
        await group.addUser(user, { through: { isAdmin: true } })
        // console.log(group)
        res.status(200).json({status:true,message:`Group ${groupName} Created Successfully`,groupDetails:group})

    }catch(err){
        console.log(err)
        res.status(500).json({error:err})
    }

}
exports.getAllGroups=async(req,res)=>{
    try{
        const user=req.user
        const user_Groups=await user.getGroups()
        if(user_Groups.length===0){
           return res.status(200).json({user_Groups:[]})
        }
        res.status(200).json({success:true,user_Groups:user_Groups})


    }catch(err){
        // console.log(err)
        res.status(500).json({error:err})
    }

}
exports.leaveGroup=async(req,res)=>{
    try{
        const groupId=req.params.groupId
        const user=req.user
        const group=await Group.findByPk(groupId)
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        await group.removeUser(user)

        return res.status(200).json({ success: true, message: `User ${user.name} removed from the group` });
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err })
    }


    }
    exports.makeAdmin=async(req,res)=>{
        try{
            const{groupId,userId}=req.query
            await user_Groups.update({isAdmin:true},{where:{
                userId:userId,
                groupId:groupId 
            }} )
            res.status(200).json({success:true,message:"User is now group admin"})

        }catch(err){
        console.error(err)
        res.status(500).json({ error: err })

        }
    }

exports.removeAdmin=async(req,res)=>{
    try{
        const{groupId,userId}=req.query
        await user_Groups.update({isAdmin:false},{where:{
            userId:userId,
            groupId:groupId 
        }} )
        res.status(200).json({success:true,message:"User is not now an Admin"})

    }catch(err){
    console.error(err)
    res.status(500).json({ error: err })

    }
}
exports.checkAdmin=async(req,res)=>{
    try{
       const groupId=req.params.groupId
       const user=req.user
       const userGroup=await user_Groups.findOne({where:{userId:user.id, groupId:groupId}})
       if (userGroup && userGroup.isAdmin) {
        res.status(200).json({ isAdmin: true })
    } else {
        res.status(200).json({ isAdmin: false })
    }
} catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
}

    }

  exports.removeUser=async(req,res) =>{
    try{
        const groupId = req.query.groupId
        const userId = req.query.userId
        
        const group = await Group.findByPk(groupId)
        const user = await User.findByPk(userId)

        await group.removeUser(user)

        res.status(200).json({ success: true, message: 'User removed from the group successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err })
    }
  } 
