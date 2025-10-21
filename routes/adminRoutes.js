const express=require('express')
const router=express.Router()
const {auth,isAdmin,isStudent}=require('../middleware/authMiddleware')
const{viewAllStudents,deleteStudent,createCourse,updateCourse,deleteCourse,viewRegisteredStudents}=require('../controllers/adminController')


//Routes for admin access

//view all students
router.get('/students',auth,isAdmin,viewAllStudents)

//delete student by id
router.delete('/students/:id',auth,isAdmin,deleteStudent)

//create new course
router.post('/courses',auth,isAdmin,createCourse)

//update course by id partially
router.patch('/courses/:courseId',auth,isAdmin,updateCourse)

//delete course by id
router.delete('/courses/:courseId',auth,isAdmin,deleteCourse)

//view registered students for a course
router.get('/courses/students/:courseId',auth,isAdmin,viewRegisteredStudents)
module.exports=router;