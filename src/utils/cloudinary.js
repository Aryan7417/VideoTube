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
        if (!localFilePath) return Null
        //Upload the file on cloadnaery
        const responce = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })

        //file has been upodaed
        console.log("file is uploaded on cloaudneary",responce.url);
        return responce;
              
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally seaved file as the upload operatin got faild 
        return  null;    
        
    }
}

cloudinary.v2.uploader.upload("https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,h_150,w_150/r_20/e_sepia/l_cloudinary_icon/e_brightness:90/o_60/c_scale,w_50/fl_layer_apply,g_south_east,x_5,y_5/a_10/q_auto/front_face.png",
     {public_id: "olympic flag"}, (error, result)=>{
  console.log(result);
});








export {uploadCloudinary}