import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiRespone.js"
import jwt from "jsonwebtoken"
import { response } from "express";
import { match } from "assert";
import { lookup } from "dns";
import mongoose from "mongoose";


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        console.log("USER:", user);
        console.log("ACCESS SECRET:", process.env.ACCESS_TOKEN_SECRET);
        console.log("REFRESH SECRET:", process.env.REFRESH_TOKEN_SECRET);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await User.findByIdAndUpdate(
            user._id,
            { refreshToken },
            { new: true }
        );

        return { accessToken, refreshToken }

    } catch (error) {
        console.log("ACTUAL ERROR:", error);
        throw new ApiError(500, "Something went wrong while geneating refresh token")

    }
}




const registerUser = asyncHandler(async (req, res) => {
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

    const { fullName, email, username, password } = req.body
    // console.log("email: ",email);
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, " All fiels are required ")
    }

    const existeduser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existeduser) {
        throw new ApiError(409, "User with  email or username already exist")
    }

    //console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path

    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {

        coverImageLocalPath = req.files.coverImage[0].path

    }


    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar fies is required")
    }


    const avatar = await uploadCloudinary(avatarLocalPath)
    const coverImage = await uploadCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "avatar files is required")
    }






    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),

    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )


    if (!createdUser) {
        throw new ApiError(500, "Somithing went wrong while registring the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registed successful")
    )

    // if(fullname ===""){
    //     throw new ApiError(400,"fullname is  required")
    // }



})






const loginUser = asyncHandler(async (req, res) => {
    //request body->data
    //username  or  email
    //find the user
    //check password
    //access and refresh token
    //send cookie


    //rteq body->data
    const { email, username, password } = req.body

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(400, "user does not access")
    }

    const isPasswordVaild = await user.isPasswordCorrect(password)


    if (!isPasswordVaild) {
        throw new ApiError(401, "Invalids user Password :")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)


    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken")


    const option = {
        httpOnly: true,
        secure: true

    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshtoken", refreshToken, option)
        .json(
            new ApiResponse(200, {
                user: loggedInUser, accessToken, refreshToken
            }, "user loged in successfully "
            )
        )

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            },
        },
        {
            new: true
        }
    )
    const option = {
        httpOnly: true,
        secure: true

    }
    return res.status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshtoken", option)
        .json(new ApiResponse(200, {}, "user logged Out"))
})


const refreshAccessToken = asyncHandler(async(req,res) =>{

    const incomingRefreshtoken = req.cookie.refreshToken || req.body.refreshToken

    if(!incomingRefreshtoken){
        throw new ApiError(401,"unauthoruized request")
    }
 

   try {
     const decodedToken = jwt.verify(
         incomingRefreshtoken,
         process.env.REFRESH_TOKEN_SECRET,
     )
 
     const user =await User.findById(decodedToken?._id)
 
     if(!user){
         throw new ApiError(401,"invaldi refresh token")
     }
 
     if(incomingRefreshtoken !== user?.refreshToken){
         throw new ApiError(401,"Refersh token is expird used")
 
     }
     
     const options = {
         httpOnly:true,
         secure:true,
     }
     const {accessToken , newrefreshToken}=await
      generateAccessAndRefreshTokens(user._id)
 
     return res.
     status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",newrefreshToken,options)
     .json(
         new ApiResponse(
             200,
             {accessToken,refreshToken:newrefreshToken},
             "Access token refrshed"
         )
     )
 
   } catch (error) {
    throw new ApiError(401,error?.message || "Invald refresh token")
    
   }


})

const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const { oldPassword, newPassowrd } = req.body

    const user= await User.findById(req.user?._id) // 
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    
    if(!isPasswordCorrect) {
        throw new  ApiError(400, "invalid old password")
    }

    user.password = newPassowrd
    await user.save({validteBeforeSave: false  })

    return res
    .status(200)
    .json(new ApiResponse(200,{},"password chnage successfully"))
})



const getcurrentUser = asyncHandler(async(req, res)=>{
    return res
    .status(200)
    .json(200,res.user,"currenet userfetched successfully")
})


const updateAccountDetails = asyncHandler(async(req,res)=>{
    const {email,fullName} = req.body
    if (!fullName || email) {
        throw new Error(400,"All filds are required");
    }

    User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullyName:fullName,
                email:email, 
            }
        },
        {new:true},
    ).select("-password")


    return res
    .status(200)
    .json(new ApiResponse(200, res.user, "Accouhd details updater successfully"))
})

const updateUserAvatar = asyncHandler(async(req,res)=>{

    const avatarLocalPAth=req.file?.path

    if (!avatarLocalPAth) {
        throw new Error(400,"Avatar files is missing");
    }

    const avatar = await uploadCloudinary(avatarLocalPAth)

    if(!avatar.url){
        throw new ApiError(400,"error while loading on avatar")
    }


    await User.findByIdAndUpdate(
        req.user?._id,

        {
            $set:{
                avatar:avatar.url
            }
        },
        {new:true}
    ).select("-password")
     return res
    .status(200)
    .json(new ApiResponse(200,res.user,"cover image updateed"))

})

const updateUserCoverImage = asyncHandler(async(req,res)=>{

    const coverImageLocalPAth=req.file?.path

    if (!coverImageLocalPAth) {
        throw new Error(400,"Cover image files is missing");
    }

    
    const coverImage = await uploadCloudinary(avatarLocalPAth)

    if(!coverImage.url){
        throw new ApiError(400,"error while loading on avatar")
    }


    await User.findByIdAndUpdate(
        req.user?._id,

        {
            $set:{
                coverImage:coverImage.url
            }
        },
        {new:true}
    ).select("-password")
    return res
    .status(200)
    .json(new ApiResponse(200,res.user,"cover image updateed"))

})



const getUserChannelProfile= asyncHandler(async(req, res)=>{
    const {username} = req.params

     if(!username?.trim()){
        throw new ApiError(400,"username is missing")
     }
     const channel =await User.aggregate([
         {
        $match:{
            username:username?.toLowerCase()
        }  
     },
     {
        $lookup:{
            from:"subscriptions",
            localField:"_id",
            foreignField:"channel",
            as:"subscribers"

        }
     },
     {
        $lookup:{
            from:"subscriptions",
            localField:"_id",
            foreignField:"channel",
            as:"subscribersTo"
        }
     },
     {
        $addFields:{
            subscriberCount:{
                $size:"$subcriber"
            },
            channelSubscriberToCount:{
                $size:"$subscribersTo"
            },
            isSubscribed:{
                $condition:{
                    if:{$in:[req.user?._id,"$subscribers.subscriber"]},
                    then:true,
                    else:false

                }
            }
        }
     },
     {
        $project:{
            fullName:1,
            username:1,
            subscriberCount:1,
            channelSubscriberToCount:1,
            isSubscribed:1,
            avatar:1,
            coverImage:1,
            email:1,


        }
     }

     ])

     if (!channel?.length) {
        throw new ApiError(404,"channel does not exist")
        
     }
    
     return res
     .status(200)
     .json(
        new ApiResponse(200 ,channel[0],"USer channel fetched successfully")
     )
})

const getwatchHistory= asyncHandler(async(req,res)=>{
    const user= await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:{
                                $project:{
                                    fullName: 1,
                                    usermname:1,
                                    avatar:1
                                }
                            }
                                                
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first:"$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])


    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchHIstory,
            "watch history fatch successfully"
        )
    )
})





export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getcurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getwatchHistory
}