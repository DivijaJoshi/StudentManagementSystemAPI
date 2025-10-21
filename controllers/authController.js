const Student = require("../models/Student");
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

// Function to generate a token
const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET_KEY,{expiresIn:'24h'})
}

//signup function (admin/student)
const signup=async(req,res,next)=>{
    try{

     //check if Request body is empty
        if (Object.keys(req.body).length === 0) {
            const error=new Error('Request body is empty');
            error.status=400
            return next(error) 
        }    

    //set default role as student if adminkey is not provided
    let defaultRole="student"
    const{ name,email,password,role=defaultRole,adminKey}=req.body;


    //validate missing fields

        //validate name
        if(!name || typeof name!=='string'){
            const error=new Error('Name is required and must be a (String).');
            error.status=400
            return next(error)  
        }

        //validate if email field is missing
        if(!email){
            const error=new Error('Email is required.');
            error.status=400
            return next(error)  

        }

        //validate if password is missing
        if(!password){
            const error=new Error('Password is required.');
            error.status=400
            return next(error)  
     
    }


    //Validate allowed roles
    const roles=["student","admin"]

    if(!roles.includes(role)){
        const error=new Error('Invalid role (Role can only be student/admin)');
        error.status=400
        return next(error)  
       
    }


    //validate for role as admin
    if(role==="admin"){

        if(!adminKey || adminKey!==process.env.ADMIN_KEY){
            const error=new Error('Unauthorized to create admin (adminKey absent or invalid)');
            error.status=400
            return next(error)  
    
        }
        defaultRole="admin"
    }

    
    // check if email already exists
    const student=await Student.findOne({email:email})
    if(student){
        const error=new Error('Email already exists');
        error.status=400
        return next(error)  
       
    }
    
    //hash password
    const hashedPassword=await bcrypt.hash(password,10)
    
    //create user
    const user=await Student.create({
        name,email,
        password:hashedPassword,
        role:defaultRole
    })
    const token=generateToken(user._id);
    res.json({message:`${role} registered successfully`,token})

    }
    catch(error){
        next(error)
    }
}





//login function for admin/student
const login=async(req,res,next)=>{
    try{

     //check if Request body is empty
        if (Object.keys(req.body).length === 0) {
            const error=new Error('Request body is empty');
            error.status=400
            return next(error)  

        }

    
    const{email,password}=req.body

    //validate if email or password fields are missing
    if(!email ||!password){
        const error=new Error('Missing Fields(email or password)');
        error.status=400
        return next(error)  
    
    }

    //find if student/admin exists
    const user=await Student.findOne({email})
    if(!user ){
        const error=new Error('No user found with this email');
        error.status=400
        return next(error)  
    }
    console.log(user)
    //verify credentials
    const isValidPassword=await bcrypt.compare(password,user.password)
    console.log(isValidPassword)
    console.log(password)
    if(!isValidPassword){
        const error=new Error('Invalid credentials');
        error.status=400
        return next(error)  
  
    }


    const token=generateToken(user._id)
    res.json({message: 'Login Successful',token, role:user.role})
    }
    catch(error){
        next(error)
    }
}

module.exports={signup,login}