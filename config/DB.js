const mongoose=require('mongoose')
const connectDb=async()=>{
    try{
        mongoose.connect(process.env.MONGODB_URL)
        console.log('MongoDb connected')
    }
    catch(error){
        console.log(error.message)
    }
    
}

module.exports=connectDb;