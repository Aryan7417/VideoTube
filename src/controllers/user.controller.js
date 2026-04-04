import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from  "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { uploadCloudinary } from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiRespone.js"

const registerUser=asyncHandler(async (req , res)=>{
    //  res.status(200).json({
    //     message:"this is the testing 202 is ok!!!"
    // })

    //  get user detail form frontend
    //  validation - not empty
    //  check if user already exist: username, email
    // check for images ,check for avatar
    // upload them to  cloudinary , avatar
    // create user object - create entry in db
    // remove password and refresh token field from responce
    // check for use creation 
    // reurn res  

    const {fullname , email , username, password } =req.body
    console.log("email: ",email);
    if (
        [fullname,email,username,password].some((field)=>field?.trim() ==="")
    ) {
        throw new ApiError(400," All fiels are required ")
    }

    const existeduser =User.findOne({
        $or:[{username } , {email }]
    })

    if(existeduser){
        throw new ApiError(409, "User with  email or username already exist")
    }
    

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar fies is required")
    }


    const avatar = await uploadCloudinary(avatarLocalPath)
    const coverImage = await uploadCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400 ,"avatar files is required")
    }

    const user = await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url ||"",
        email,
        password,
        username:username.tolowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )


    if(!createdUser){
        throw new ApiError(500,"Somithing went wrong while registring the user")
    }
    
    return res.status(201).json(
        new ApiResponse(200, createdUser , "User registed successful")
    )
    
    // if(fullname ===""){
    //     throw new ApiError(400,"fullname is  required")
    // }


 
})

export { registerUser }

