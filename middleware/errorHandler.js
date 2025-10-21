const errorHandler=(err,req,res,next)=>{

//handle mongodb objectId errors
if(err.name==='CastError'){
    return res.status(400).json({
        message:"Invalid mongoose ID format"
    })
}

//handle mongoose validation errors
if(err.name==='ValidationError'){
    return res.status(400).json({
        message:err.message
    })
}

//handle jwt errors
if(err.name==='JsonWebTokenError'){
    return res.status(401).json({message: 'Invalid token'})
}


//default error handler 
res.status(err.status ||500).json({message:err.message||'Internal server error'})
}



module.exports=errorHandler;