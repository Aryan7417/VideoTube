import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser=asyncHandler(async (req , res)=>{
     res.status(200).json({
        message:"this is the testing 202 is ok!!!"
    })
})


export { registerUser }