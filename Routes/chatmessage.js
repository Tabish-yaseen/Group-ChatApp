const express=require('express')
const router=express.Router()
const chatMessageController=require('../Controllers/chatmessage')
const userAuthentication=require('../middleware/auth')

router.post('/message',userAuthentication.authenticate,chatMessageController.postMessage)

router.get('/all-messages',chatMessageController.getAllGroupMessages)


module.exports=router

