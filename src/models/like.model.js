import mongoose, { Schema } from "mongoose";
import { comment } from "./comment.model";



const likeSchema = new Schema({
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: "Tweet"
    },
    likeBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

})



export const Like = mongoose.model("Like", Like)