const express=require('express')
const router=express.Router()
const userController=require('../Controllers/user')


router.post('/signup',userController.signup)

router.post('/login',userController.login)

router.get('/showParticipants/:groupId',userController.showParticipants)
router.post('/add-Participants',userController.addParticipants)
router.get('/usersList/:groupId',userController.getUserList)



module.exports=router