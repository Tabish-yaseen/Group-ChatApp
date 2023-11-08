const express=require('express')
const router=express.Router()
const chatMessageController=require('../Controllers/chatmessage')
const userAuthentication=require('../middleware/auth')

router.post('/message',userAuthentication.authenticate,chatMessageController.message)

router.get('/all-messages',chatMessageController.getAllGroupMessages)

router.post('/createGroup',userAuthentication.authenticate,chatMessageController.createGroup)

router.get('/all-groups',userAuthentication.authenticate,chatMessageController.getAllGroups)

router.delete('/leaveGroup/:groupId',userAuthentication.authenticate,chatMessageController.leaveGroup)

module.exports=router

