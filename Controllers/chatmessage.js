const ChatMessage=require('../Models/chatmessage')
const User=require('../Models/user')
const Sequelize = require('sequelize')

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
exports.getAllMessages = async (req, res) => {
    try {
        const lastMessageId = req.params.lastMessageId
        // console.log(lastMessageId)
        const messages = await ChatMessage.findAll({
            where: {
                id: {
                    [Sequelize.Op.gt]: lastMessageId
                }
            }
        })

        
        res.status(200).json({ success: true, messages: messages })
    } catch (err) {
        res.status(500).json({ error: err })
    }
}
