const Student=require('../models/Student')
const Course=require('../models/Course')
const Enrollment=require('../models/Enrollment')


//get all students
const viewAllStudents=async(req,res,next)=>{
    try{
    
    //find students by role
    const students=await Student.find({
        role:'student'
        
    }).select('-password')

    if(!students || students.length===0){
        const error=new Error('No students found');
        error.status=400
        return next(error) 
    }
    res.json(students)
}
catch(error){
    next(error)
}
}



//delete student by id
const deleteStudent=async(req,res,next)=>{
    try{
    
    //find student by id
    const student=await Student.findByIdAndDelete(req.params.id)

    //check if student not found
    if(!student ||student.length===0){
        const error=new Error('Invalid ID, No student found');
        error.status=400
        return next(error)
    }
    res.json({
        message: 'Student deleted successfully'
    })
}
catch(error){
    next(error)
}
}



// create new course
const createCourse=async(req,res,next)=>{
    try{

        const {title,description,professor,capacity,enrolledCount}=req.body
        
        //check if Request body is empty
        if (Object.keys(req.body).length === 0) {
            const error=new Error('Request body is empty');
            error.status=400
            return next(error)          
        }


        //Valid fields for course schema
        const allowedFields=['title','description','professor','capacity','enrolledCount']
       
        //Logic to check invalid fields
        let invalidFields=false;
        
        Object.keys(req.body).forEach(a=>{
            if(!allowedFields.includes(a)){
                invalidFields=true
            }

        })

        if(invalidFields){
            const error=new Error('Invalid fields. Cannot create course.');
            error.status=400
            return next(error)
            
    }

        //Validating Required fields (title description,capacity and enrolledCount)
        if(!title || typeof title!=='string'){
            const error=new Error('Title is required');
            error.status=400
            return next(error)
        }

        if(!description){
            const error=new Error('Description is required');
            error.status=400
            return next(error)
        }

        if(!capacity || typeof capacity!=='number' || capacity<=0){
            const error=new Error('Capacity is required and must be a number greater than 0.');
            error.status=400
            return next(error)
           

        }

        if(enrolledCount){
            if(enrolledCount>capacity|| enrolledCount<0 ||typeof enrolledCount!=='number'){
                const error=new Error('Enrolled Count must be less than capacity and be a positive number.');
                error.status=400
                return next(error)
                

        }
        }

        //check if course already exists by given name
        const courseAlreadyExists=await Course.findOne({title:title.trim()})
        if(courseAlreadyExists){
            const error=new Error('Course with this title already exists.');
            error.status=400
            return next(error)

    }
    
        //create new course
        const course=await Course.create(req.body)

        res.json({
        message:'Course created successfully',
        courseId:course._id
    })
}
    catch(error){
    next(error)
    }
    
}


//update already existing course
const updateCourse=async(req,res,next)=>{
    try{

    const {title,description,professor,capacity,enrolledCount}=req.body
    
    //check if Request body is empty
        if (Object.keys(req.body).length === 0) {
            const error=new Error('Request body is empty');
            error.status=400
            return next(error)
        }
        
        //Valid fields for course schema
        const allowedFields=['title','description','professor','capacity','enrolledCount']
       
        //Logic to check invalid fields
        let invalidFields=false;
        
        Object.keys(req.body).forEach(a=>{
            if(!allowedFields.includes(a)){
                invalidFields=true
            }

        })

        if(invalidFields){
            const error=new Error('Invalid fields. Cannot create course.');
            error.status=400
            return next(error)
        
    }


    //Validating Required fields (title description,capacity and enrolledCount)
        if(title && typeof title!=='string'){
            const error=new Error('Title must be a (String).');
            error.status=400
            return next(error)
           
        }

        if(capacity && ( typeof capacity!=='number' || capacity<=0)){
            const error=new Error('Capacity must be a number greater than 0.');
            error.status=400
            return next(error)
            

        }

        if(enrolledCount){
            if(enrolledCount>capacity|| enrolledCount<0 ||typeof enrolledCount!=='number'){
                const error=new Error('Enrolled Count must be less than capacity and be a positive number.');
                error.status=400
                return next(error)
                

        }
        }

    
    //find course by id nd update
    const course=await Course.findByIdAndUpdate(req.params.courseId,req.body)
    //check if course not found
    if(!course){
        const error=new Error('No course found with this id');
        error.status=400
        return next(error)    
        }
    res.json({
        message:'Course updated successfully'
    })
}
catch(error){
    next(error)
}
}



//delete exising course
const deleteCourse=async(req,res,next)=>{
    try{

    //find course by id and delete
    const course=await Course.findByIdAndDelete(req.params.courseId)
    
    //check if course not found
        if(!course){
            const error=new Error('No course found with this id');
            error.status=404
            return next(error)
    
        }
    
    res.json({
        message:'Course deleted successfully'
    })
}
catch(error){
    next(error)
}
}



//view registered students for a given courseId
const viewRegisteredStudents=async(req,res,next)=>{
    try{

    //check if course exists
    const course=await Course.findById(req.params.courseId)
        if(!course){
            return res.status(400).json({message:'No course found with this id'})

        }

    
    //find enrollments for a given course
    const enrollments=await Enrollment.find({
        courseId:req.params.courseId
    }).populate('studentId').populate('courseId')
    
    const result=[]
    enrollments.forEach((a)=>{
        let enrolledDate=a.enrollmentDate.toDateString() //2025-09-12T12:00:00Z convert this format to string date format

    
        result.push({
            studentId:a.studentId._id,
            name: a.studentId.name,
            email: a.studentId.email,
            courseDetails:[{
                courseName: a.courseId.title,
                professor: a.courseId.professor
            }],
            enrollmentDate:enrolledDate
        })
    })
    if(result.length===0){
    return res.status(400).json({message:'No registered students found for this courseId'})
    }
    res.json(result)
}
catch(error){
    next(error)
}
}

module.exports={
    viewAllStudents,deleteStudent,createCourse,updateCourse,deleteCourse,viewRegisteredStudents,
}