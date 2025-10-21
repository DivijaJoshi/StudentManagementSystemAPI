const Course=require('../models/Course')

const mongoose=require('mongoose')


//function to get all courses
const viewCourses=async(req,res,next)=>{
    try{

    //get all courses
    const courses=await Course.find();

    //check if no course found
    if(!courses ||courses.length===0){
        const error=new Error('No courses found');
        error.status=400
        return next(error)  
    }
    res.json(courses);
}
catch(error){
    next(error)
}
}


//get course by courseId
const viewCourseById=async(req,res,next)=>{
    try{
    
    //find course by id
    const course=await Course.findById(req.params.courseId)
    
    
    if(!course){
        const error=new Error('No course found with this id');
        error.status=400
        return next(error)  

    }
    
    res.json(course)
}
catch(error){
    next(error)
}
}



module.exports={
    viewCourses,
    viewCourseById,
}