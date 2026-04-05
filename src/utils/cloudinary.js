import {v2 as cloudinary} from "cloudinary"
import fs from"fs"
import { devNull } from "os";

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadCloudinary =async (localFilePath)=>{
    try {
        if (!localFilePath) return null
        //Upload the file on cloadnaery
        const responce = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })

        //file has been upodaed
        // console.log("file is uploaded on cloaudneary",responce.url);
        if(localFilePath){
        fs.unlinkSync(localFilePath)
        }
        return responce;
              
    } catch (error) {
        
        if(localFilePath){
            fs.unlinkSync(localFilePath) //remove the locally seaved file as the upload operatin got faild 
        }
        return  null;    
        
    }
}

// cloudinary.v2.uploader.upload("public/test.png.jpg",
//      {public_id: "olympic flag"}, (error, result)=>{
//   console.log(result);
// });








export {uploadCloudinary}