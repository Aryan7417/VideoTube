import mongoose from "mongoose"
import {DB_Name} from "../constants.js"


const connectDB=async ()=>{
    try{
        const connnectionInstance =await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`)
        console.log(`\n MongoDB connected !! DB HOSt: ${connnectionInstance.connection.host}`);
            
        } 
        
        catch (error){
        console.log("MONGOB connection Error!!!!!!!:",error);
        process.exit(1)
    }
}

export default connectDB