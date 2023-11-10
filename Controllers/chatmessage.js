const ChatMessage=require('../Models/chatmessage')
const User=require('../Models/user')
const Group=require('../Models/group')
const user_Groups=require('../Models/usergroup')
const Sequelize = require('sequelize')

exports.postMessage=async(req,res)=>{
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
        console.log(err)
        res.status(500).json({ error: err })
    }
}
