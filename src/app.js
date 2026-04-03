import cookieParser from 'cookie-parser'
import express from 'express'
import cors from "cors"
import userRouter from './routes/user.routes.js'

 const app = express() 


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}) )


 app.use(express.json({limit:"16KB"}))

 app.use(express.urlencoded({extended:true, limit:"16KB"}))

 app.use(express.static("public"))


 app.use(cookieParser())



 //app.use()

//routes import

//routes declaration 
app.use("/api/v1/users",userRouter)


//http://localhost:8000/api/v1/users/register

export default app;




// -X-X-X-X-X-X-X-X-X-X-X-   METHOD 2  X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X

// import express from 'express'
// import cors from "cors"
// import cookieParser from 'cookie-parser'
// import dotenv from "dotenv"
// import userRouter from './routes/user.routes.js'

// dotenv.config()

// const app = express() 

// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// }))

// app.use(express.json({ limit: "16KB" }))
// app.use(express.urlencoded({ extended: true, limit: "16KB" }))
// app.use(express.static("public"))
// app.use(cookieParser())

// // routes
// app.use("/api/v1/users", userRouter)

// // http://localhost:8000/api/v1/users/register

// export { app }