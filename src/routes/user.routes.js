import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewere.js";
import jwt from "jsonwebtoken";
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


export default router
//export {varifyJWT}
