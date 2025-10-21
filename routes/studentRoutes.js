const express=require('express')
const router=express.Router()
const {auth,isAdmin,isStudent}=require('../middleware/authMiddleware')
const{getProfile,updateProfile,viewMyCourses,enrollCourse,dropCourse,replaceProfile}=require('../controllers/studentController')


//routes for student access 

//view profile
router.get('/myProfile',auth,isStudent,getProfile)

//update profile
router.patch('/myProfile',auth,isStudent,updateProfile)

//replace entire profile
router.put('/myProfile',auth,isStudent,replaceProfile)

//view registered courses for a student
router.get('/myCourses',auth,isStudent,viewMyCourses)

//enroll in course by courseId
router.post('/enroll/:courseId',auth,isStudent,enrollCourse)

//drop course by courseId
router.delete('/drop/:courseId',auth,isStudent,dropCourse)


module.exports=router;