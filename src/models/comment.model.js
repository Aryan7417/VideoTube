import mongoose,{Schema}  from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const commnetSchema = new Schema(
    {
        content:{
            type:String,
            required:true
        },
        
            video:{
                type:Schema.Types.ObjectId,
                ref:"Video"
        },
          owner:{
                type:Schema.Types.ObjectId,
                ref:"owner"
        },



    },
    {
        timestamps:true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)



export const comment = mongoose.model("comment ", comment)