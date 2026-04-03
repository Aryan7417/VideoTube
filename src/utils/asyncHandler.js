const asyncHandler= (requestHander) => {
    return (req , res ,next )=>{
        Promise.resolve(requestHander(req,res,next)).catch((err)=> next (err))



    }
}



export {asyncHandler}

// X-X-X-X-X-X-X-X-X    METHOD 2  -X-X-X-X-X-X-X-X-X-X-X-X-X-X-X


// const asyncHandler = (fn) => async(req ,res ,next) => {
//     try {

//         await fn(req,res,next)
        
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message:err.message
//         })
        
//     }
// }
