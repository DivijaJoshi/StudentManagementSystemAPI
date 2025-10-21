const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const studentSchema=new mongoose.Schema({
    name: {
        type:String,
        required:true,
        trim:true,
        match:[/^[a-zA-Z ]+$/, 'Name should only have letters and spaces.']
    },
    email:{
        type: String,
        required:true,
        lowercase:true,
        unique:true,
        validate:[validator.isEmail,'Invalid email']  //validate email
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['student','admin'],  //allowed roles
        default:'student'
    }
    
})

module.exports=mongoose.model('Student',studentSchema)