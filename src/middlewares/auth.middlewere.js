import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const varifyJWT = asyncHandler(async(req,res,next)=>{
try {
       const token=  req.cookies?.accessToken || req.header("Autgorizatio")?.replace("Bearer " , "")
    
       if(!token){
        throw new ApiError(401,"unauthorized Request")
       }
    
      const decodedTokne = jwt.verify (token , proccess.env.ACCESS_TOKEN_SECRET)
    
    
      const user = await User.findById(decodedTokne?._id).select("-password -refreshToken" )
    
    
      if(!User){
        //TODO discuss about fromtend
        throw new ApiError(401,"Invalid Access Token")
      }
      req.user= user;
      next()
} catch (error) {
    throw new ApiError(401,error?.message || "Invalid access Token")
    
}





})

export default { varifyJWT }