const express=require('express')
const router=express.Router()
const groupController=require('../Controllers/group')
const userAuthentication=require('../middleware/auth')

router.post('/createGroup',userAuthentication.authenticate,groupController.createGroup)

router.get('/all-groups',userAuthentication.authenticate,groupController.getAllGroups)

router.delete('/leaveGroup/:groupId',userAuthentication.authenticate,groupController.leaveGroup)

router.post('/makeAdmin',groupController.makeAdmin)

router.post('/removeAdmin',groupController.removeAdmin)

router.get('/isAdmin/:groupId',userAuthentication.authenticate,groupController.checkAdmin)

router.delete('/removeUser',groupController.removeUser)

module.exports=router
