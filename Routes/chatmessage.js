const express=require('express')
const router=express.Router()
const multer=require('multer')
const storage=multer.memoryStorage()
const upload = multer({ storage: storage }); 

const chatMessageController=require('../Controllers/chatmessage')
const userAuthentication=require('../middleware/auth')

router.post('/message',userAuthentication.authenticate,chatMessageController.postMessage)

router.get('/all-messages',chatMessageController.getAllGroupMessages)

router.post('/add-file',upload.single('file'),userAuthentication.authenticate,chatMessageController.uploadFile)


module.exports=router

