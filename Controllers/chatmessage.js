// const ChatMessage=require('../Models/chatmessage')
// const User=require('../Models/user')
// const sequelize=require('../utils/database')

exports.message=async(req,res)=>{
    try{
        const messageContent=req.body.messageContent

        const user=req.user

        const date=new Date()
       const message= await user.createChatMessage({ messageContent: messageContent,date: date,})

        res.status(200).json({userName:user.name,message:message.messageContent} )
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the message' })
    }
}