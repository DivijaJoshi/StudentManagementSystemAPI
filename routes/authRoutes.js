const express=require('express')
const router=express.Router()

const {signup,login}=require('../controllers/authController')

//signup and login route for admin/student
router.post('/signup',signup)
router.post('/login',login)

module.exports=router;