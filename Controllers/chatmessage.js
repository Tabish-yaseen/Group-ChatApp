const ChatMessage=require('../Models/chatmessage')
const User=require('../Models/user')
// const sequelize=require('../utils/database')

exports.message=async(req,res)=>{
    try{
        const messageContent=req.body.messageContent

        const user=req.user
        const date=new Date()
       const message= await user.createChatMessage({ messageContent: messageContent,date:date,userName:user.name})

        res.status(200).json({userName:user.name,message:message.messageContent} )
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the message' })
    }
}
exports.getAllMessages=async(req,res)=>{
    try{
        const messages=await ChatMessage.findAll()
        // if(messages.length==0){
        //     return res.status(400).json({message:"no messages"})
        // }
        console.log(messages)
        res.status(200).json({sucess:true,messages:messages})

    }catch(err){
        res.status(500).json({error:err})

    }
}