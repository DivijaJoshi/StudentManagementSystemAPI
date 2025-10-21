const Student=require('../models/Student')
const Course=require('../models/Course')
const Enrollment=require('../models/Enrollment')
const bcrypt=require('bcryptjs')


//view student profile
const getProfile=async(req,res,next)=>{
    try{
    res.json(req.user)
    }
    catch(error){
        next(error)
    }
}


//update student profile
const updateProfile=async(req,res,next)=>{
    try{
         //check if Request body is empty
        if (Object.keys(req.body).length === 0) {
            const error=new Error('Request body is empty');
            error.status=400
            return next(error)
        }
        //Valid fields for student schema
        const allowedFields=['name','email','password','role']
       
        //Logic to check invalid fields
        let invalidFields=false;
        
        Object.keys(req.body).forEach(a=>{
            if(!allowedFields.includes(a)){
                invalidFields=true
            }

        })

         //logic to prevent updating _id
        if(req.body._id){
            const error=new Error('_id cannot be updated');
            error.status=400
            return next(error)
        }
        
        if(req.body.role){
        const error=new Error('Role cannot be updated');
        error.status=400
        return next(error)
        

    }

        if(invalidFields){
        const error=new Error('Invalid fields. Cannot update student');
        error.status=400
        return next(error)

    }
        const updatedEmail=req.body.email;
        let password=req.body.password;


       

        //hash password if provided in body
        if(password){
            req.body.password=await bcrypt.hash(password,10)
        }

        if(updatedEmail){

        // find student if updated email already exists for another student
        const student=await Student.findOne({email:updatedEmail})
        if(student &&  student._id.toString()!== req.user._id.toString()){
            const error=new Error('Email already exists');
            error.status=400
            return next(error) 
        }
    }

    //find student by id and update
    const updatedStudent=await Student.findByIdAndUpdate(req.user._id,req.body,{
        new:true,
        runValidators:true

    })
    res.json({
        message:'Profile updated successfully',
        updatedStudent

    })

}
catch(error){
    next(error)
}
}


const replaceProfile=async(req,res,next)=>{
    try{

    //check if Request body is empty
        if (Object.keys(req.body).length === 0) {
            const error=new Error('Request body is empty');
            error.status=400
            return next(error)
        }

    //Valid fields for student schema
        const allowedFields=['name','email','password','role']

    //Logic to check invalid fields
        let invalidFields=false;
        
        Object.keys(req.body).forEach(a=>{
            if(!allowedFields.includes(a)){
                invalidFields=true
            }

        })
    

         //logic to prevent updating _id
        if(req.body._id){
            const error=new Error('_id cannot be updated');
            error.status=400
            return next(error)
        }
        
        if(invalidFields){
            const error=new Error('Invalid fields. Cannot update student');
            error.status=400
            return next(error)
    }

    if(req.body.role){
        const error=new Error('Role cannot be updated');
        error.status=400
        return next(error)

    }
    const {name,email,password}=req.body

    if(!name || !email || !password){
        const error=new Error('All fields(name,email,password) are required to replace data');
        error.status=400
        return next(error)
    }
    

    // find student if updated email already exists for another student
    const student=await Student.findOne({email:email})
        if(student &&  student._id.toString()!== req.user._id.toString()){
            const error=new Error('Email already exists');
            error.status=400
            return next(error)
        }

    req.body.password=await bcrypt.hash(password,10)

    //find student by id and replace data
    const updatedStudent=await Student.findByIdAndUpdate(req.user._id,req.body,{
        new:true,
        runValidators:true,
        overwrite:true

    })
    res.json({
        message:'Profile updated and replaced with new data successfully',
        updatedStudent

    })

    }catch(error){
        next(error)
    }
}
//enroll in course by courseId
const enrollCourse=async(req,res,next)=>{
    try{

    //check if courseid exists 
    const course=await Course.findById(req.params.courseId)
    
    //if course not found define error message
    if(!course){
        const error=new Error('No course found with this id');
        error.status=400
        return next(error)        
        }

    //check if course already full
    if(course.enrolledCount===course.capacity){
        const error=new Error('Course is already full');
        error.status=400
        return next(error)  
    
    }

    
    //check if student is already enrolled in course
    const enrollmentExists=await Enrollment.findOne({studentId:req.user._id,
                            courseId:req.params.courseId})

    if(enrollmentExists){
        const error=new Error('You are already enrolled in this course.');
        error.status=400
        return next(error)  
    }

    //create enrollment
    Enrollment.create({
        studentId:req.user._id,
        courseId:course._id
    })

    //increment count of enrolled in memory
    course.enrolledCount+=1 

    //save in db so it persists
    await course.save() //save in db so it persists


    res.json({
        message:'Enrolled successfully',
        enrollmentDate: Enrollment.enrollmentDate
    })
}catch(error){
    next(error)
}

}



//view registered courses for a student
const viewMyCourses=async(req,res,next)=>{
    try{

    //find enrollments in enrollment collection
    const enrollments=await Enrollment.find({studentId:req.user._id}).populate('courseId')
    

    //check if no enrollments found
    if(!enrollments ||enrollments.length===0){
        const error=new Error('You havent enrolled in any course yet');
        error.status=400
        return next(error)  
    }
    result=[]
    enrollments.forEach(a=>{
        let enrolledDate=a.enrollmentDate.toDateString()
        if (!a.courseId) return; 
        result.push({
            courseId:a.courseId._id,
            title: a.courseId.title,
            enrollmentDate:enrolledDate
        })
    })
    res.json(result)
}catch(error){
    next(error)
}
}


//drop a course by course_id
const dropCourse=async(req,res,next)=>{
    try{

    //find course by id
    const courseExists= await Course.findById(req.params.courseId)
   
    //check if no course found for given id
    if(!courseExists){
        const error=new Error('Unable to delete. Course not found with this id');
        error.status=400
        return next(error) 

    }


    //find enrollment for student and delete
    const enrollment=await Enrollment.findOneAndDelete({
        studentId: req.user._id,
        courseId:req.params.courseId
    })


    //check if student not enrolled in the course
    if(!enrollment){
        const error=new Error('Unable to delete. You are not enrolled in this course');
        error.status=400
        return next(error) 
    }

    //if enrollment found,decrement count by 1 and delete enrollment
    if(enrollment){
        const course=await Course.findById(req.params.courseId)
        course.enrolledCount-=1
        await course.save();

   
    }
    res.json({
        message:'Course dropped successfully'
    })
}
catch(error){
    next(error)
}
}

module.exports={getProfile,
    updateProfile,
    enrollCourse,
    viewMyCourses,
    dropCourse,
    replaceProfile

}