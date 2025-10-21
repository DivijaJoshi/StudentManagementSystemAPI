const jwt=require('jsonwebtoken')
const Student=require('../models/Student')

//auth middleware
const auth=async(req,res,next)=>{

    //extract token
    const token=req.headers.authorization?.split(' ')[1];

    //check if token not found
    if(!token) return res.status(401).json({
        message: "Unauthorized"
    })

    try{

        //verify token and store payload
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
        
        //find student by id and store user data, excluding password
        req.user=await Student.findById(decoded.id).select('-password')
        
        next()
    }
    catch(error){
        next(error)
}
}


//middleware to check if user is admin
const isAdmin=(req,res,next)=>{
    if(req.user.role!=='admin'){
        return res.status(403).json({
            message: "Access denied (Admin access only)"
        })
    }
    next()
}

//middleware to check if user is student
const isStudent=(req,res,next)=>{
    if(req.user.role!=='student'){
        return res.status(403).json({
            message: "Access denied (Student access only)"
        })
    }
    next()
}
module.exports={auth,isAdmin,isStudent}







