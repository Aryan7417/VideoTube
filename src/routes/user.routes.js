import { Router } from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken, changeCurrentPassword, getcurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getwatchHistory } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewere.js";
//import jwt, { verify } from "jsonwebtoken";
import { varifyJWT } from "../middlewares/auth.middlewere.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount: 1 ,
        },
        {
            name:"coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)
router.route("/login").post(loginUser)

//secured Routes\
router.route("/logout").post(varifyJWT ,logoutUser)
router.route("/refresh-Token").post(refreshAccessToken)
router.route("/change-password").post(varifyJWT,changeCurrentPassword)
router.route("/current-user").get(varifyJWT,getcurrentUser)
router.route("/update-account").patch(varifyJWT,updateAccountDetails)
router.route("/avatar").patch(varifyJWT,upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(varifyJWT,upload.single("/CoverImage"),updateUserCoverImage)
router.route("/c/:username").get(varifyJWT,getUserChannelProfile)
router.route("/history").get(varifyJWT , getwatchHistory)  


export default router
//export {varifyJWT}

