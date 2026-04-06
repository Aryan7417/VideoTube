import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from  "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { uploadCloudinary } from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiRespone.js"


const generateAccessAndRefreshTokens= async(userId)=>{
    try {
        const user=-await User.findById(userId)
       const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBefourSave : false })

        return {accessToken ,refreshToken}
        
    } catch (error) {
        throw new ApiError(500, "Something went wrong while geneating refresh token")
        
    }
}




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

    const {fullName , email , username, password } =req.body
    // console.log("email: ",email);
    if (
        [fullName ,email,username,password].some((field)=>field?.trim() ==="")
    ) {
        throw new ApiError(400," All fiels are required ")
    }

    const existeduser =await User.findOne({
        $or:[{username } , {email }]
    })

    if(existeduser){
        throw new ApiError(409, "User with  email or username already exist")
    }
    
    //console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path
    
    let coverImageLocalPath;
    
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){

        coverImageLocalPath = req.files.coverImage[0].path

    }


    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar fies is required")
    }


    const avatar = await uploadCloudinary(avatarLocalPath)
    const coverImage = await uploadCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400 ,"avatar files is required")
    }






    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url ||"",
        email,
        password,
        username:username.toLowerCase()
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






const loginUser =asyncHandler(async(req , res)=>{
    //request body->data
    //username  or  email
    //find the user
    //check password
    //access and refresh token
    //send cookie


    //rteq body->data
    const {email,username,password} =req.bady

    if(!username || !email){
        throw new ApiError(400, "username or email is required")
    }

    const user =User.find({
        $or:[{username},{email}]
    })

    if(!user){
        throw ApiError(400,"user does not access")
    }

    const isPasswordVaild = await user.isPasswordCorrect(password)

    
    if(!isPasswordVaild){
        throw ApiError(401,"Invalidf user Password :")
    }

    const {accessToken , refreshToken}=await generateAccessAndRefreshTokens(user._id)


   const loogenInuse = await User.findById(user._id)
   select("-password -refreshToken")


   const option= {
    httpOnly:true,
    secure: true

   }

   return res
   .status(200)
   .cookie("accessToken",accessToken,option)
   .cookie("refreshtoken",refreshToken,option)
   .json(
    new ApiResponse(200,{
        user:loogenInuse,accessToken,refreshToken
    }, "user loged in successfully "
)
   )

})

const logoutUser = asyncHandler(async(req, res)=>{
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            },
        },
        {
                new:true
        }
    )
     const option= {
    httpOnly:true,
    secure: true

   }
   return res.status(200)
   .clearCookie("accessToken",option)
   .clearCookie("refreshtoken",option)
   .json(new ApiResponse(200,{},"user logged Out"))
})




export { registerUser,
    loginUser,
    logoutUser
 }

