const ChatMessage=require('../Models/chatmessage')
const User=require('../Models/user')
const Group=require('../Models/group')
const user_Groups=require('../Models/usergroup')
const Sequelize = require('sequelize')
const s3Services=require('../services/s3services')

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
exports.uploadFile=async(req,res)=>{
    try{
        const user=req.user
        const file=req.file
        const groupId=req.body.groupId
        const fileName=`chat${user.id}/${new Date()}`
        const fileURL= await s3Services.uploadToS3 (file,fileName) 
        // console.log(fileURL)
        const date=new Date()
       const message=await user.createChatMessage({messageContent:fileURL,date:date,userName:user.name,groupId:groupId})
       res.status(200).json({userName:user.name,message:message.messageContent} )



    }catch(err){
        console.log(err)
    }
}