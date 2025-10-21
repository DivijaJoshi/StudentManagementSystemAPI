const express=require('express')
const app=express()
const dotenv=require('dotenv').config()
const connectDB=require('./config/DB')
const errorHandler=require('./middleware/errorHandler')

const authRoutes=require('./routes/authRoutes')
const adminRoutes=require('./routes/adminRoutes')
const studentRoutes=require('./routes/studentRoutes')
const courseRoutes=require('./routes/courseRoutes')

connectDB();

//parse json requests
app.use(express.json())

app.use('/api/auth',authRoutes) 
app.use('/api/students',studentRoutes) 
app.use('/api/admin',adminRoutes)
app.use('/api/courses',courseRoutes

)


//Middleware to check invalid route
app.use((req,res,next)=>{
    const error=new Error('Route not found');
    error.status=404
    next(error)
})

app.use(errorHandler)



app.listen(process.env.PORT,()=>{
    console.log("Server started on port 3000")
})