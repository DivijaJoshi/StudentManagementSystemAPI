const mongoose=require('mongoose')

const courseSchema=new mongoose.Schema({
    title: {
        type: String,
        required:true,
        trim:true

    },
    description:{
        type:String,
        trim:true,
        required:true
    },
    professor: {
        type:String,
        trim:true,
        match:[/^[a-zA-Z. ]+$/, 'Name can only have letters spaces or (.)']

    },
    capacity:{
        type: Number,
        required:true
    },
    enrolledCount:{
        type:Number,
        default:0
    }
})

module.exports=mongoose.model('Course',courseSchema)