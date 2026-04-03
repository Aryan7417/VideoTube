//require ('dotenv').config({path:'./env'})

import dotenv from "dotenv"
import connectDB from "./db/index.js";
import app from "./app.js"
 dotenv.config({
    path:'./env'
})



 connectDB()

.then(()=>{
    app.listen(process.env.PORT || 8000 ,()=>{
        console.log(`server is running PORT : ${process.env.PORT}`)
    })
})


.catch((err)=>{
    console.log("MONGO db connection faild !!!",err);
})














// //this is the first approach

 /*
import express from "express";
import {DB_name} from "./constants.js" 

const app=express()


(async ()=>{
    try {
        await mongoose.connect(`{process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("Err:",error)
            throw error

        })
        app.listen(process.env.PORT,()=>{
            console.log(`APP is lising on PORT ${process.env.PORT}`)
        })
        
    } catch (error) {
        console.log.err("ERROR",error)
        throw err
        
    }

})()




connectDB()
*/


