const express=require('express')
const router=express.Router()
const {viewCourses,viewCourseById}=require('../controllers/courseController')
const {auth,isAdmin,isStudent}=require('../middleware/authMiddleware')



//open routes accessible by admin and student both


//get all courses
router.get('/viewAllcourses',auth,viewCourses)

//get course by id
router.get('/viewCourse/:courseId',auth,viewCourseById)



module.exports=router;